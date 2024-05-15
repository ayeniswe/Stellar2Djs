import { capitalize } from '../text';

describe('capitalize', () => {
  test('capitalizes the first letter of a lowercase string', () => {
    const result = capitalize('hello');
    expect(result).toBe('Hello');
  });

  test('does not change an uppercase string', () => {
    const result = capitalize('WORLD');
    expect(result).toBe('WORLD');
  });

  test('returns an empty string for an empty input', () => {
    const result = capitalize('');
    expect(result).toBe('');
  });

  test('capitalizes a single character string', () => {
    const result = capitalize('a');
    expect(result).toBe('A');
  });
});
