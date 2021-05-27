/**
 * ASCII to Unicode (decode Base64 to original data)
 * @param {string} b64
 * @return {string}
 */
export const atou = (b64) => {
    return decodeURIComponent(escape(atob(b64)));
};

/**
* Unicode to ASCII (encode data to Base64)
* @param {string} data
* @return {string}
*/
export const utoa = (data) => {
    return btoa(unescape(encodeURIComponent(data)));
};
