const { globSync } = require("glob");

/**
 * Given an array of patterns, returns an array of filenames matching the patterns.
 * If no patterns are given, the function uses the default patterns defined in the
 * module.
 *
 * @param {Array<string>} patterns - Array of glob patterns to search for.
 * @param {Object} config - Configuration object.
 * @param {Object} options - Options to globSync.
 * @throws {Error} If the patterns array is not an array.
 * @returns {Array<string>} Array of filenames.
 */
function getFiles(patterns = [], config = { patterns: [] }, options) {
    // try {
    let filenames = [];
    if (!patterns || !Array.isArray(patterns)) {
        return [];
    }

    if (patterns.length === 0) return [];

    // let {patterns = [[],[]]} = config;
    // let [local, subfolders] = patterns;
    // if (local) {
    //     filenames = (local.length > 0) ? globSync(local, options) : [];
    // }
    // if (filenames.length === 0) {
    //     filenames = (subfolders.length > 0) ? globSync(subfolders, options) : [];
    // }

    // return filenames;

    filenames = (patterns.length > 0) ? globSync(patterns, options) : ((!config.patterns[0] || !Array.isArray(config.patterns[0])) ? globSync(config.patterns[0], options) : []);
    if (filenames.length === 0) {
        filenames = (!config.patterns[1] || !Array.isArray(config.patterns[1])) ? globSync(config.patterns[1], options) : [];
    }
    return filenames;

    // } catch (error) {
    //     console.error("Error getting files:", error.message);
    //     return [];
    // }
}

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
    let files = [];
    function findFilesForPatterns(parameters) {

        if ((typeof parameters !== "string") && !Array.isArray(parameters)) {
            throw new Error("Patterns must be a string or an array of strings");
        }
        let files = [];
        if (patterns && (typeof patterns === "string") && patterns.length > 0) {
            patterns = [patterns];
        }

        if (patterns && Array.isArray(patterns) && patterns.length > 0) {
            files = patterns.flatMap(pattern => globSync(pattern));
        }
        return files;

    }

    files = findFilesForPatterns(patterns);

    if (files.length > 0) {
        return files;
    }
    defaultPatterns.forEach(patterns => {

        files = findFilesForPatterns(patterns);
        if (files.length > 0) {
            return files;
        }
    });

    return files.length > 0 ? files : [];
}

module.exports = {
    getFiles,
    slugify,
    findMatchingFiles
};
