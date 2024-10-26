const { findMatchingFiles } = require('../lib/utils');

describe('findMatchingFiles', () => {
    it('should return an empty array if no patterns are given', () => {
        expect(findMatchingFiles()).toEqual([]);
    });

    it('should return an empty array if patterns is not an array', () => {
        expect(findMatchingFiles('pattern')).toEqual([]);
    });

    it('should return an array of filenames matching the pattern', () => {
        expect(findMatchingFiles(['index.js'])).toEqual(expect.arrayContaining(['index.js']));
    });

    it('should return an array of filenames matching the pattern with default patterns if no patterns are given', () => {
        expect(findMatchingFiles()).toEqual([]);
    });

    it('should throw an error if the patterns is neither a string nor an array of strings', () => {
        expect(() => findMatchingFiles(123)).toThrowError('Patterns must be a string or an array of strings');
    });

});
