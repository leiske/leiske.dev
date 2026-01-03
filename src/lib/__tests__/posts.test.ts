import { calculateReadingTime } from '../posts.js';

describe('calculateReadingTime', () => {
  it('calculates 1 minute for 100 words', () => {
    const content = 'word '.repeat(99) + 'word';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('calculates 2 minutes for 300 words', () => {
    const content = 'word '.repeat(299) + 'word';
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('rounds up: 201 words = 2 minutes', () => {
    const content = 'word '.repeat(200) + 'word';
    expect(calculateReadingTime(content)).toBe(2);
  });
});
