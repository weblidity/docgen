const { slugify } = require('../lib/utils');
describe('slugify', () => {
  it('converts null to empty string', () => {
    expect(slugify(null)).toBe('');
  });

  it('converts undefined to empty string', () => {
    expect(slugify(undefined)).toBe('');
  });

  it('converts string to slug', () => {
    expect(slugify('   Hello World   ')).toBe('hello-world');
  });

  it('converts string with special characters to slug', () => {
    expect(slugify('!@#$%^&*()_+-=[]{};:,.<>/?')).toBe('');
  });

  it('converts string with numbers to slug', () => {
    expect(slugify('1234567890')).toBe('1234567890');
  });

  it('converts string with space and numbers to slug', () => {
    expect(slugify('   Hello 123 World   ')).toBe('hello-123-world');
  });

  it('throws error if input is not a string', () => {
    expect(() => slugify(123)).toThrowError('Input to slugify must be a string');
  });

//   it('throws error if input is null or undefined', () => {
//     expect(() => slugify(null)).toThrowError('Input to slugify cannot be null or undefined');
//     expect(() => slugify(undefined)).toThrowError('Input to slugify cannot be null or undefined');
//   });
});
