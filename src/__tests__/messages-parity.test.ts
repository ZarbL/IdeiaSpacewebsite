import { describe, it, expect } from 'vitest';
import en from '../../messages/en.json';
import pt from '../../messages/pt.json';
import es from '../../messages/es.json';

type Json = Record<string, unknown>;

function flatKeys(obj: Json, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? flatKeys(v as Json, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );
}

const enKeys = new Set(flatKeys(en as Json));
const ptKeys = new Set(flatKeys(pt as Json));
const esKeys = new Set(flatKeys(es as Json));

const diff = (a: Set<string>, b: Set<string>) => [...a].filter((k) => !b.has(k)).sort();

describe('paridade dos arquivos de tradução', () => {
  it('pt.json tem todas as chaves de en.json', () => {
    expect(diff(enKeys, ptKeys)).toEqual([]);
  });

  it('es.json tem todas as chaves de en.json', () => {
    expect(diff(enKeys, esKeys)).toEqual([]);
  });

  it('en.json tem todas as chaves de pt.json (nenhuma chave órfã só em pt)', () => {
    expect(diff(ptKeys, enKeys)).toEqual([]);
  });

  it('es.json e pt.json têm o mesmo conjunto de chaves', () => {
    expect(diff(esKeys, ptKeys)).toEqual([]);
    expect(diff(ptKeys, esKeys)).toEqual([]);
  });

  // Valores vazios pré-existentes (hero.subtitle, services.spaceChallenge.*)
  // são rastreados numa issue — não bloqueiam o CI por enquanto.
});
