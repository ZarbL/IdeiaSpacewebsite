import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  getCloudinaryVideoUrl,
  getCloudinaryImageUrl,
  getVideoUrl,
  getImageUrl,
} from '../cloudinary';

const RUNS = Number(process.env.FUZZ_RUNS || 300);

describe('cloudinary helpers — fuzzing', () => {
  it('getCloudinary*Url: nunca lança e sempre retorna URL absoluta do Cloudinary', () => {
    fc.assert(
      fc.property(fc.string(), (publicId) => {
        for (const fn of [getCloudinaryVideoUrl, getCloudinaryImageUrl]) {
          const url = fn(publicId);
          expect(typeof url).toBe('string');
          expect(url.startsWith('https://res.cloudinary.com/')).toBe(true);
        }
      }),
      { numRuns: RUNS }
    );
  });

  it('getVideoUrl / getImageUrl: sempre string, sem lançar', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        expect(typeof getVideoUrl(name)).toBe('string');
        expect(typeof getImageUrl(name)).toBe('string');
      }),
      { numRuns: RUNS }
    );
  });

  it('opções arbitrárias de transformação não quebram a montagem', () => {
    fc.assert(
      fc.property(
        fc.record(
          {
            width: fc.oneof(fc.integer(), fc.constant(undefined)),
            height: fc.oneof(fc.integer(), fc.constant(undefined)),
          },
          { requiredKeys: [] }
        ),
        (opts) => {
          expect(() => getCloudinaryImageUrl('a/b', opts)).not.toThrow();
        }
      ),
      { numRuns: RUNS }
    );
  });
});
