import { clipX, clipY, inBoundsX, inBoundsY } from '../utils/placement';
// Finish tests
describe('texture renderer', () => {
  test('renderer should not clip texture if clipping is turned off', () => {
    expect(scaling(300, 300, 50, 50, 20, 20, false)).toStrictEqual<Array<number>>([50, 50]);
  });
  test('renderer should clip texture if clipping is turned on', () => {
    expect(scaling(300, 300, 320, 350, 20, 15, true)).toStrictEqual<Array<number>>([280, 285]);
  });
});
