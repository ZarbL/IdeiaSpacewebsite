import { NextResponse } from 'next/server';

const N2YO_API_KEY = process.env.N2YO_API_KEY;

// Cache em memória para dados TLE
interface CacheEntry {
  data: string;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas

// Mapeamento de categorias para NORAD IDs específicos
const SATELLITE_IDS: Record<string, number[]> = {
  stations: [
    25544, // ISS (ZARYA)
    48274, // Tiangong (CSS)
    20580, // Hubble Space Telescope
  ],
  starlink: [
    // Starlink Gen1 - Satélites confirmados em órbitas diferentes
    44713, 44714, 44715, 44718, 44721, 44722, 44723, 44724, 44725, 44726,
    44927, 44928, 44929, 44930, 44931, 44932, 44933, 44934, 44935, 44936,
    45044, 45045, 45046, 45047, 45048, 45049, 45050, 45051, 45052, 45053,
  ],
  weather: [
    // NOAA Satellites
    28654, // NOAA 18
    33591, // NOAA 19
    43013, // NOAA 20 (JPSS-1)
    54234, // NOAA 21 (JPSS-2)
    
    // NASA Earth Observation
    27424, // Aqua
    25994, // Terra
    37849, // Suomi NPP
    
    // EUMETSAT
    38771, // METOP-B
    43689, // METOP-C
    29499, // METOP-A
    
    // Geostationary Weather
    41866, // GOES 16 (GOES-R)
    43226, // GOES 17 (GOES-S)
    51850, // GOES 18 (GOES-T)
    
    // Sentinel Program
    40069, // Sentinel-3A
    43437, // Sentinel-3B
    42063, // Sentinel-5P
    
    // Landsat Program
    39084, // Landsat 8
    49260, // Landsat 9
    
    // Chinese Weather
    40367, // Fengyun-3D
    43010, // Fengyun-4A
    48808, // Fengyun-3E
  ],
};

// Dados de fallback com mais satélites para melhor visualização
const FALLBACK_DATA: Record<string, string> = {
  stations: `ISS (ZARYA)
1 25544U 98067A   24020.53241898  .00012796  00000+0  22948-3 0  9997
2 25544  51.6416 339.8041 0001086  61.8339  64.2352 15.49861416435025
TIANGONG
1 48274U 21035A   24020.51479167  .00004821  00000+0  87654-4 0  9991
2 48274  41.4687 195.8273 0006234 157.6743 202.4791 15.59347821155342
HUBBLE SPACE TELESCOPE
1 20580U 90037B   24020.52689234  .00002234  00000+0  12645-3 0  9992
2 20580  28.4687 156.7891 0002567  89.1234 270.9876 15.09234567456789`,
  
  starlink: `STARLINK-1007
1 44713U 19074A   24020.50000000  .00001234  00000+0  87654-4 0  9990
2 44713  53.0000 100.0000 0001234  90.0000 270.0000 15.06000000123456
STARLINK-1008
1 44714U 19074B   24020.50000000  .00001234  00000+0  87654-4 0  9991
2 44714  53.0000 105.0000 0001234  95.0000 265.0000 15.06000000123457
STARLINK-1009
1 44715U 19074C   24020.50000000  .00001234  00000+0  87654-4 0  9992
2 44715  53.0000 110.0000 0001234 100.0000 260.0000 15.06000000123458
STARLINK-1010
1 44716U 19074D   24020.50000000  .00001234  00000+0  87654-4 0  9993
2 44716  53.0000 115.0000 0001234 105.0000 255.0000 15.06000000123459
STARLINK-1011
1 44717U 19074E   24020.50000000  .00001234  00000+0  87654-4 0  9994
2 44717  53.0000 120.0000 0001234 110.0000 250.0000 15.06000000123460
STARLINK-1012
1 44718U 19074F   24020.50000000  .00001234  00000+0  87654-4 0  9995
2 44718  53.0000 125.0000 0001234 115.0000 245.0000 15.06000000123461
STARLINK-1013
1 44719U 19074G   24020.50000000  .00001234  00000+0  87654-4 0  9996
2 44719  53.0000 130.0000 0001234 120.0000 240.0000 15.06000000123462
STARLINK-1014
1 44720U 19074H   24020.50000000  .00001234  00000+0  87654-4 0  9997
2 44720  53.0000 135.0000 0001234 125.0000 235.0000 15.06000000123463
STARLINK-1015
1 44721U 19074J   24020.50000000  .00001234  00000+0  87654-4 0  9998
2 44721  53.0000 140.0000 0001234 130.0000 230.0000 15.06000000123464
STARLINK-1016
1 44722U 19074K   24020.50000000  .00001234  00000+0  87654-4 0  9999
2 44722  53.0000 145.0000 0001234 135.0000 225.0000 15.06000000123465`,
  
  weather: `NOAA 18
1 28654U 05018A   24020.50000000  .00000234  00000+0  14567-3 0  9993
2 28654  99.0000  50.0000 0014567  45.0000 315.0000 14.12345678987654
NOAA 19
1 33591U 09005A   24020.50000000  .00000245  00000+0  15678-3 0  9994
2 33591  99.1000  55.0000 0014678  50.0000 310.0000 14.12456789876543
NOAA 20
1 43013U 17073A   24020.50000000  .00000256  00000+0  16789-3 0  9995
2 43013  98.7000  60.0000 0014789  55.0000 305.0000 14.19567890765432
AQUA
1 27424U 02022A   24020.50000000  .00000345  00000+0  23456-3 0  9996
2 27424  98.2000  65.0000 0001234  60.0000 300.0000 14.57123456876543
TERRA
1 25994U 99068A   24020.50000000  .00000456  00000+0  34567-3 0  9997
2 25994  98.3000  70.0000 0001345  65.0000 295.0000 14.57234567765432
METOP-B
1 38771U 12049A   24020.50000000  .00000567  00000+0  45678-3 0  9998
2 38771  98.7000  75.0000 0001456  70.0000 290.0000 14.21345678654321
METOP-C
1 43689U 18087A   24020.50000000  .00000678  00000+0  56789-3 0  9999
2 43689  98.7000  80.0000 0001567  75.0000 285.0000 14.21456789543210
SUOMI NPP
1 37849U 11061A   24020.50000000  .00000789  00000+0  67890-3 0  9990
2 37849  98.7000  85.0000 0001678  80.0000 280.0000 14.19567890432109
GOES 16
1 41866U 16071A   24020.50000000  .00000012  00000+0  00000+0 0  9991
2 41866   0.0500 270.0000 0001789  90.0000 270.0000  1.00271234321098
GOES 17
1 43226U 18022A   24020.50000000  .00000013  00000+0  00000+0 0  9992
2 43226   0.0500 225.0000 0001890  95.0000 265.0000  1.00272345210987`
};

// Validar se dados são TLE válidos
function isValidTLE(data: string): boolean {
  if (!data || data.trim().length === 0) return false;
  if (data.includes('<!DOCTYPE') || data.includes('<html')) return false;
  
  const lines = data.split('\n').filter(line => line.trim().length > 0);
  // TLE deve ter múltiplos de 3 linhas (nome + linha1 + linha2)
  if (lines.length < 3 || lines.length % 3 !== 0) return false;
  
  // Verificar padrão básico de TLE nas linhas 1 e 2
  for (let i = 1; i < lines.length; i += 3) {
    if (!lines[i].startsWith('1 ') || !lines[i + 1]?.startsWith('2 ')) {
      return false;
    }
  }
  
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groups = searchParams.get('groups') || 'stations';

  // Verificar se API key está configurada
  if (!N2YO_API_KEY) {
    console.error('❌ N2YO_API_KEY não configurada');
    return new NextResponse(FALLBACK_DATA[groups] || FALLBACK_DATA.stations, {
      headers: {
        'Content-Type': 'text/plain',
        'X-Cache-Status': 'FALLBACK',
        'X-Data-Source': 'fallback-no-key',
      },
    });
  }

  try {
    // Verificar cache em memória
    const cached = cache[groups];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache HIT para ${groups} (${Math.round((Date.now() - cached.timestamp) / 1000 / 60)} minutos atrás)`);
      return new NextResponse(cached.data, {
        headers: {
          'Content-Type': 'text/plain',
          'X-Cache-Status': 'HIT',
          'X-Data-Source': 'n2yo',
        },
      });
    }

    console.log(`🌐 Buscando dados TLE de ${groups} do N2YO...`);

    const satelliteIds = SATELLITE_IDS[groups] || SATELLITE_IDS.stations;
    const tleLines: string[] = [];

    // Buscar TLE de cada satélite
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 segundos

    try {
      for (const satId of satelliteIds) {
        try {
          const response = await fetch(
            `https://api.n2yo.com/rest/v1/satellite/tle/${satId}&apiKey=${N2YO_API_KEY}`,
            {
              headers: {
                'Accept': 'application/json',
              },
              signal: controller.signal,
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.tle) {
              // Adicionar nome + TLE linha 1 + TLE linha 2
              tleLines.push(data.info?.satname || `SAT-${satId}`);
              tleLines.push(data.tle.split('\r\n')[0]);
              tleLines.push(data.tle.split('\r\n')[1]);
            }
          }
          
          // Pequeno delay para não sobrecarregar API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.warn(`⚠️ Erro ao buscar satélite ${satId}:`, err);
        }
      }

      clearTimeout(timeoutId);

      if (tleLines.length === 0) {
        throw new Error('Nenhum TLE recebido');
      }

      const tleData = tleLines.join('\n');

      // Validar TLE
      if (!isValidTLE(tleData)) {
        console.error(`❌ Dados TLE inválidos recebidos de ${groups}`);
        
        if (cached) {
          console.log(`📦 Usando cache expirado (dados inválidos recebidos)`);
          return new NextResponse(cached.data, {
            headers: {
              'Content-Type': 'text/plain',
              'X-Cache-Status': 'STALE',
              'X-Data-Source': 'n2yo-stale',
            },
          });
        }

        throw new Error('Invalid TLE data');
      }

      // Sucesso! Atualizar cache
      cache[groups] = {
        data: tleData,
        timestamp: Date.now(),
      };

      const tleCount = tleData.split('\n').filter(line => line.startsWith('1 ')).length;
      console.log(`✅ ${tleCount} satélites TLE de ${groups} recebidos do N2YO e armazenados em cache`);

      return new NextResponse(tleData, {
        headers: {
          'Content-Type': 'text/plain',
          'X-Cache-Status': 'MISS',
          'X-Data-Source': 'n2yo',
        },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Se temos cache antigo (mesmo expirado), usar ele
      if (cached) {
        console.log(`📦 Usando cache expirado de ${groups} (erro na API)`);
        return new NextResponse(cached.data, {
          headers: {
            'Content-Type': 'text/plain',
            'X-Cache-Status': 'STALE',
            'X-Data-Source': 'n2yo-stale',
          },
        });
      }

      throw error;
    }
  } catch (err) {
    console.error(`❌ Erro ao buscar satélites de ${groups}:`, err);
    
    // Fallback para dados estáticos
    console.log(`📦 Usando dados de fallback para ${groups}`);
    return new NextResponse(FALLBACK_DATA[groups] || FALLBACK_DATA.stations, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'X-Cache-Status': 'FALLBACK',
        'X-Data-Source': 'fallback-error',
      },
    });
  }
}
