const { globSync } = require("glob");


/**
 * Slugify a string.
 *
 * @param {string|null|undefined} input The string to slugify.
 * @throws {Error} If the input is not a string.
 * @returns {string} The slugified string.
 */
function slugify(input) {
    if (input === null || input === undefined) {
        return '';
    }
    if (typeof input !== "string") {
        throw new Error("Input to slugify must be a string");
    }

    return input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/_+/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Given an array of patterns and an array of default patterns, returns an array of
 * filenames that match any of the patterns. If no filenames match any of the
 * patterns, then the function uses the default patterns. If no filenames match any
 * of the default patterns, then the function returns an empty array.
 *
 * @param {Array<string>|string} [patterns=[]] The patterns to search for.
 * @param {Array<Array<string>>} [defaultPatterns=[]] The default patterns to
 *     search for if no files match the given patterns.
 * @returns {Array<string>} The list of matching filenames.
 */
function findMatchingFiles(patterns = [], defaultPatterns = []) {
    if ((typeof patterns !== "string") && !Array.isArray(patterns)) {
        throw new Error("Patterns must be a string or an array of strings");
    }

    const getFiles = (p) => {
        if (!p) return [];
        const arr = Array.isArray(p) ? p : [p];
        return globSync(arr); // Pass the array of patterns directly to globSync
    };

    let files = getFiles(patterns);

    if (files.length > 0) {
        return files;
    }

    for (const dp of defaultPatterns) {
        files = getFiles(dp);
        if (files.length > 0) {
            return files;
        }
    }

    return [];
}

module.exports = {
    slugify,
    findMatchingFiles
};
