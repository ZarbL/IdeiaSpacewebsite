'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as satellite from 'satellite.js';
import { useTranslations } from 'next-intl';

// Importar Globe dinamicamente para evitar problemas de SSR
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface SatelliteData {
  lat: number;
  lng: number;
  alt: number;
  name: string;
  color: string;
  category: string;
  size?: number; // Tamanho para objetos 3D
}

interface OrbitPath {
  coords: [number, number, number][];  // [lat, lng, timestamp]
  color: string;
  name: string;
}

interface SatelliteTrackerProps {
  title?: string;
  description?: string;
}

type SatelliteCategory = 'stations' | 'ideiaspace';

export default function SatelliteTracker({ title, description }: SatelliteTrackerProps) {
  const t = useTranslations('missions.tracker');
  const [allSatellites, setAllSatellites] = useState<SatelliteData[]>([]);
  const [filteredSatellites, setFilteredSatellites] = useState<SatelliteData[]>([]);
  const [allOrbits, setAllOrbits] = useState<OrbitPath[]>([]);
  const [filteredOrbits, setFilteredOrbits] = useState<OrbitPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<SatelliteCategory>>(new Set(['stations', 'ideiaspace']));
  const [showOrbits, setShowOrbits] = useState(true);
  const globeEl = useRef<any>(null);

  const calculateOrbitPath = (satrec: any, name: string, color: string, now: Date): OrbitPath => {
    const coords: [number, number, number][] = [];
    const seenCoords = new Set<string>();
    
    // Calcular trajeto para as próximas 24 horas
    const hoursToShow = 24;
    const numPoints = 144; // Um ponto a cada 10 minutos (24h * 6)
    const minutesPerPoint = (hoursToShow * 60) / numPoints;
    
    // Limites do Brasil para detectar passagens
    const brazilBounds = {
      latMin: -34,
      latMax: 5,
      lngMin: -74,
      lngMax: -35
    };
    
    let passagensBrasil = 0;
    
    // Calcular pontos ao longo das próximas 24 horas
    for (let i = 0; i < numPoints; i++) {
      const minutesAhead = i * minutesPerPoint;
      const orbitTime = new Date(now.getTime() + minutesAhead * 60 * 1000);
      
      try {
        const positionAndVelocity = satellite.propagate(satrec, orbitTime);
        
        if (positionAndVelocity && positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
          const positionEci = positionAndVelocity.position;
          const gmst = satellite.gstime(orbitTime);
          const positionGd = satellite.eciToGeodetic(positionEci, gmst);
          
          const lat = (positionGd.latitude * 180) / Math.PI;
          const lng = (positionGd.longitude * 180) / Math.PI;
          
          if (!isNaN(lat) && !isNaN(lng) && 
              Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
              isFinite(lat) && isFinite(lng)) {
            
            // Adicionar ponto (sem deduplicar para manter trajeto contínuo)
            coords.push([lat, lng, orbitTime.getTime()]);
            
            // Detectar passagem sobre o Brasil
            if (lat >= brazilBounds.latMin && lat <= brazilBounds.latMax &&
                lng >= brazilBounds.lngMin && lng <= brazilBounds.lngMax) {
              passagensBrasil++;
              const timeStr = orbitTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
              });
              console.log(`🇧🇷 ${name} passará sobre Brasil às ${timeStr} - Lat: ${lat.toFixed(2)}°, Lng: ${lng.toFixed(2)}°`);
            }
          }
        }
      } catch (err) {
        // Ignorar erros de pontos individuais
      }
    }
    
    if (passagensBrasil > 0) {
      console.log(`🛰️ ${name}: ${passagensBrasil} passagens detectadas sobre o Brasil nas próximas 24h`);
    }
    
    return { coords, color, name };
  };

  const processTLEData = (data: string, category: SatelliteCategory, now: Date): { satellites: SatelliteData[], orbits: OrbitPath[] } => {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const sats: SatelliteData[] = [];
    const orbits: OrbitPath[] = [];
    const processedSatellites = new Map<string, boolean>(); // Garantir único processamento
    
    // Mapeamento de NORAD ID para nomes customizados dos satélites IdeiaSpace
    const satelliteNameMap: Record<string, string> = {
      '66668': 'SARI-1',
      '66669': 'SARI-2', 
      '66670': 'ANISC'
    };
    
    // Processar cada satélite (TLE vem em grupos de 3 linhas: nome, linha1, linha2)
    for (let i = 0; i < lines.length; i += 3) {
      if (lines[i] && lines[i + 1] && lines[i + 2]) {
        try {
          let name = lines[i].trim();
          const tleLine1 = lines[i + 1].trim();
          const tleLine2 = lines[i + 2].trim();
          
          // Extrair NORAD ID da linha 1 do TLE (posições 3-7)
          const noradId = tleLine1.substring(2, 7).trim();
          
          // Se for satélite IdeiaSpace, usar nome customizado
          if (category === 'ideiaspace' && satelliteNameMap[noradId]) {
            name = satelliteNameMap[noradId];
          }
          
          // Verificar se já foi processado
          if (processedSatellites.has(name)) {
            console.warn(`⚠️ Satélite duplicado ignorado: ${name}`);
            continue;
          }
          
          // Validar formato TLE
          if (!tleLine1.startsWith('1 ') || !tleLine2.startsWith('2 ')) {
            console.warn(`⚠️ TLE inválido para ${name}`);
            continue;
          }
          
          // Criar registro de satélite
          const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
          const positionAndVelocity = satellite.propagate(satrec, now);
          
          if (positionAndVelocity && positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
            const positionEci = positionAndVelocity.position;
            const gmst = satellite.gstime(now);
            const positionGd = satellite.eciToGeodetic(positionEci, gmst);
            
            // Determinar cor e tamanho
            const color = category === 'ideiaspace' ? '#e80074' : '#00ff00';
            const size = category === 'ideiaspace' ? 8 : 5; // Cubos maiores para IdeiaSpace
            
            // Adicionar satélite
            sats.push({
              lat: (positionGd.latitude * 180) / Math.PI,
              lng: (positionGd.longitude * 180) / Math.PI,
              alt: 0.01,
              name: name,
              color: color,
              category: category,
              size: size
            });
            
            // Calcular órbita (apenas uma vez por satélite)
            const orbit = calculateOrbitPath(satrec, name, color, now);
            if (orbit.coords.length >= 10) {
              orbits.push(orbit);
              processedSatellites.set(name, true);
              console.log(`✅ ${name}: ${orbit.coords.length} pontos orbitais`);
            } else {
              console.warn(`⚠️ ${name}: órbita com poucos pontos (${orbit.coords.length})`);
            }
          }
        } catch (err) {
          console.error('❌ Erro ao processar satélite:', err);
        }
      }
    }
    
    console.log(`📊 Categoria ${category}: ${sats.length} satélites, ${orbits.length} órbitas`);
    return { satellites: sats, orbits };
  };

  const fetchAndUpdateSatellites = async () => {
    try {
      setLoading(true);
      // Usar um único timestamp para TODOS os satélites e órbitas
      const syncTime = new Date();
      
      // Buscar apenas Estações Espaciais e satélites IdeiaSpace
      const categoryMap: Array<{category: SatelliteCategory, group: string}> = [
        { category: 'stations', group: 'stations' },
        { category: 'ideiaspace', group: 'ideiaspace' },
      ];
      
      const allSats: SatelliteData[] = [];
      const allOrbs: OrbitPath[] = [];
      
      // Buscar dados de cada categoria
      for (const { category, group } of categoryMap) {
        try {
          const response = await fetch(`/api/satellites?groups=${group}`);
          
          if (response.ok) {
            const data = await response.text();
            const { satellites, orbits } = processTLEData(data, category, syncTime);
            allSats.push(...satellites);
            allOrbs.push(...orbits);
          }
        } catch (err) {
          console.warn(`Erro ao buscar categoria ${category}:`, err);
        }
      }
      
      if (allSats.length > 0) {
        // Log detalhado por categoria
        const satsByCategory = allSats.reduce((acc, sat) => {
          acc[sat.category] = (acc[sat.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const orbsByCategory = allOrbs.reduce((acc, orb) => {
          const sat = allSats.find(s => s.name === orb.name);
          if (sat) {
            acc[sat.category] = (acc[sat.category] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        
        console.log(`✅ Total: ${allSats.length} satélites, ${allOrbs.length} órbitas`);
        console.log('📊 Satélites por categoria:', satsByCategory);
        console.log('🛰️ Órbitas por categoria:', orbsByCategory);
        
        setAllSatellites(allSats);
        setAllOrbits(allOrbs);
        setError(null);
      } else {
        setError('Não foi possível carregar os dados dos satélites.');
      }
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar satélites:', err);
      setError('Não foi possível carregar os dados dos satélites.');
      setLoading(false);
    }
  };

  // Filtrar satélites e órbitas quando os filtros mudarem
  useEffect(() => {
    const filtered = allSatellites.filter(sat => 
      activeFilters.has(sat.category as SatelliteCategory)
    );
    setFilteredSatellites(filtered);
    
    // Filtrar órbitas baseado nos satélites filtrados e no estado showOrbits
    if (showOrbits) {
      const filteredSatNames = new Set(filtered.map(s => s.name));
      const filteredOrbs = allOrbits.filter(orbit => filteredSatNames.has(orbit.name));
      setFilteredOrbits(filteredOrbs);
    } else {
      setFilteredOrbits([]);
    }
  }, [allSatellites, allOrbits, activeFilters, showOrbits]);

  const toggleFilter = (category: SatelliteCategory) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(category)) {
        newFilters.delete(category);
      } else {
        newFilters.add(category);
      }
      return newFilters;
    });
  };

  useEffect(() => {
    // Buscar dados iniciais
    fetchAndUpdateSatellites();
    
    // Atualizar a cada 8 horas (cache do servidor)
    const interval = setInterval(() => {
      fetchAndUpdateSatellites();
    }, 28800000); // 8 horas
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-rotação do globo
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {title && (
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
          {description}
        </p>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e80074] mx-auto mb-4"></div>
            <p className="text-gray-300">Carregando satélites...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            {/* Filtro de Trajetos */}
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                showOrbits
                  ? 'bg-[#e80074] text-white shadow-[#e80074]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showOrbits ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  )}
                </svg>
                <span>{showOrbits ? 'Ocultar Trajetos' : 'Trajetos'}</span>
              </div>
            </button>
            
            <button
              onClick={() => toggleFilter('stations')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                activeFilters.has('stations')
                  ? 'bg-[#00ff00] text-black shadow-[#00ff00]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00ff00] shadow-sm shadow-[#00ff00]/50"></div>
                <span>Estações Espaciais</span>
              </div>
            </button>

            <button
              onClick={() => toggleFilter('ideiaspace')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                activeFilters.has('ideiaspace')
                  ? 'bg-[#e80074] text-white shadow-[#e80074]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#e80074] shadow-sm shadow-[#e80074]/50"></div>
                <span>Satélites IdeiaSpace</span>
              </div>
            </button>
          </div>

          {error ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="text-center text-red-400">
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full max-w-6xl" style={{ height: '600px', position: 'relative' }}>
                <Globe
                  ref={globeEl}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                  
                  atmosphereColor="lightskyblue"
                  atmosphereAltitude={0.25}
                  
                  pointsData={filteredSatellites}
                  pointLat="lat"
                  pointLng="lng"
                  pointAltitude="alt"
                  pointColor="color"
                  pointRadius={(d: any) => d.category === 'ideiaspace' ? 3.5 : 2.0}
                  pointResolution={32}
                  pointsMerge={false}
                  onPointHover={(point: any) => {
                    if (globeEl.current) {
                      const container = globeEl.current.renderer().domElement;
                      container.style.cursor = point ? 'pointer' : 'grab';
                    }
                  }}
                  pointLabel={(d: any) => {
                    return `<div style="background: black; padding: 8px 12px; color: white; font-family: Arial;">
                      <strong>${d.name}</strong><br/>
                      <span>Lat: ${d.lat.toFixed(2)}° | Lng: ${d.lng.toFixed(2)}°</span>
                    </div>`;
                  }}
                  
                  pathsData={filteredOrbits}
                  pathPoints="coords"
                  pathPointLat={(p: any) => p[0]}
                  pathPointLng={(p: any) => p[1]}
                  pathColor="color"
                  pathStroke={2}
                  pathDashLength={0.4}
                  pathDashGap={0.2}
                  pathDashAnimateTime={0}
                  pathTransitionDuration={0}
                  pathLabel={(d: any) => {
                    return `<div style="background: black; padding: 8px; color: white; font-family: Arial;">
                      <strong>${d.name}</strong><br/>
                      <span>Trajeto próximas 24h</span>
                    </div>`;
                  }}
                  
                  animateIn={true}
                />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                  {filteredSatellites.length} {t('count')}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
