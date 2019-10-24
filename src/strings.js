/**
 * Check whether the lowercase of `haystack` includes the lowercase of `needle`.
 * @param {string} haystack
 * @param {string} needle
 * @returns {boolean}
 */
export const includesLowerCase = (haystack, needle) => {
    return haystack.toLowerCase().includes(needle.toLowerCase());
};