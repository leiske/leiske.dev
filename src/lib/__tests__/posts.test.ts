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

  it('returns 1 for empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('returns 1 for single word', () => {
    expect(calculateReadingTime('one')).toBe(1);
  });

  it('handles various whitespace characters', () => {
    expect(calculateReadingTime('word\nword\tword')).toBe(1);
  });
});
