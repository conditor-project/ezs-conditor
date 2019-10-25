import unidecode from 'unidecode';
import { compose, includes, toLower } from 'ramda';

const removeAccents = (str) => unidecode(str);
/**
 * Deplete string from accents and upper case.
 * @param {string} str
 * @returns {string}
 */
export const depleteString = compose(toLower, removeAccents, String);

/**
 * Check whether the lowercase of `haystack` includes the lowercase of `needle`.
 * @param {string} haystack
 * @param {string} needle
 * @returns {boolean}
 */
export const includesDepleted = (haystack, needle) => includes(depleteString(needle), depleteString(haystack));

/**
 * Check whether the `haystack` array lowercase elements includes the lowercase of `needle`.
 * @param {string[]} haystack
 * @param {string} needle
 * @returns {boolean}
 */
export const includesDepletedArray = (haystack, needle) => (
    haystack
        .map(depleteString)
        .includes(depleteString(needle))
);
