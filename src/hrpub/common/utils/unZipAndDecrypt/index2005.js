/**
 * @resulet 传入的加密压缩后的数据，如果传入的数据存在，返回的为解密，解压后的数据，否则返回null
 *
 */

import {
    gzip as GZip,
    Cipher

} from 'nc-lightapp-front';

const gzip = new GZip();
const {decrypt, opaqueDecrypt} = Cipher
// 4fa8959db7b4423a99f056e299914128
const aeskey = '4fa8959db7b4423a99f056e299914128';
export default function unZipAndDecrypt(result, crux) {
    if (result) {
        let cckk = getCookie('cookiets') || Date.now();
        cckk = isNaN(cckk) ? cckk : Number(cckk);
        let cipherFlag = getGlobalStorage('localStorage', 'rockin');
        //判断是否加密
        if (cipherFlag === 'true') {
            Cipher.CipherFlag = cipherFlag === 'true'
            let cckks = String(crux);
            let aeskey = opaqueDecrypt(getGlobalStorage('localStorage', 'cowboy'));
            aeskey = cckks + aeskey.substring(0, aeskey.length - cckks.length);
            result = (typeof result === 'string') ? Cipher.decrypt(result, aeskey) : result;
        }
        let value = getGlobalStorage('localStorage', 'gzip')
        //判断数据是否启用压缩
        if (Number(value) === 1) {
            result = gzip.unzip(result);
        }
        return result
    } else {
        return null
    }
}

function getCookie(key) {
    let cookies = document.cookie;
    let allCookies = cookies.split('; ').reduce((o, item) => {
        let arr = item.split('=');
        let firstIndex = item.indexOf('=');
        o[item.substring(0, firstIndex)] = item.substring(firstIndex + 1);
        return o;
    }, {});
    if (key) return allCookies[key];
    return allCookies;
};

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            window.console.log(e);
            window.console.log(str + ':  不是JSON字符串');
            return false;
        }
    }
}

function getGlobalStore(key) {
    if (key) {
        let infosFromCookie = getCookie(key);
        let infosFromLocalStorage = localStorage.getItem(key);
        if (!infosFromCookie && !infosFromLocalStorage) {
            return null;
        } else if (infosFromCookie) {
            if (isJSON(infosFromCookie)) {
                return JSON.parse(infosFromCookie);
            } else {
                return infosFromCookie;
            }
        } else if (infosFromLocalStorage) {
            if (isJSON(infosFromLocalStorage)) {
                return JSON.parse(infosFromLocalStorage);
            } else {
                return infosFromLocalStorage;
            }
        }
    }
};

function getGlobalStorage(store, key) {
    let storage = getStorage(store);
    if (key) {
        if (!store) {
            return;
        }
        let value = storage.getItem(key),
            storeCipher = localStorage.getItem('storeCipher') != '0';
        if (storeCipher && value !== null) {
            value = decrypt(value, aeskey);
        }
        return value;
    }
};

function getStorage(store) {
    let storage = localStorage;
    if (store === 'sessionStorage') {
        storage = sessionStorage;
    }
    //resetStorage(storage);
    return storage;
}