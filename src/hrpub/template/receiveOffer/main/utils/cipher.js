/**
 * crypto-js 方式实现的加密解密
 */
import CryptoJS from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import Hex from "crypto-js/enc-hex";

/**
 * 增强加密
 */
const KEY_ENHANCE = Base64.parse("ZGIyMTM5NTYxYzlmZTA2OA==");
/**
 * 关键字
 */
const PRIVATE_KEY = generateKey(uuidv4());
/**
 * 是否进行加密解密
 * 可变数据
 */
let CipherFlag = false;

/**
 * 采用hex方式处理
 */
const isHex = false;

/**
 * 加密解密参数
 */
const cfg = {
    iv: KEY_ENHANCE,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
};
/**
 * 生成唯一标识
 */
function uuidv4() {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (+('0.'+(+new Date()+'').split('').reverse().join('')) * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * 生成 秘钥的方法
 * @param {*} text
 * @param {*} bytes
 */
function generateKey(text = "") {
    return Base64.stringify(Utf8.parse(text)) || "ZGIyMTM5NTYxYzlmZTA2OA==";
}
/**
 * 加密
 * @param {*} message  明文信息
 * @param {*} key 秘钥
 * @param {*} standard 标准
 */
function encrypt(message = "", key = PRIVATE_KEY, standard = "AES") {
    let keyDigest = Base64.parse(key);
    let encrypted = CryptoJS[standard].encrypt(message, keyDigest, cfg);
    // 这里需要注意  先拿结果  然后再做base64 加密  encrypted.ciphertext 是个16进制字符串
    let ciphertext = Base64.stringify(
        (isHex ? Hex : Utf8).parse(encrypted.ciphertext.toString())
    );
    // let ciphertext = Base64.stringify(Hex.parse(encrypted.ciphertext.toString()));
    return ciphertext;
}
/**
 * 解密
 * @param {*} message  密文信息
 * @param {*} key 秘钥
 * @param {*} standard 标准
 */
function decrypt(message = "", key = PRIVATE_KEY, standard = "AES") {
    let keyDigest = Base64.parse(key);
    //  base64 解密  plaintext 只能是Hex编码的base64字节数组
    let plaintext = isHex
        ? message
        : Base64.stringify(Hex.parse(Base64.parse(message).toString(Utf8)));
    let decrypted = CryptoJS[standard].decrypt(plaintext, keyDigest, cfg);
    return decrypted.toString(Utf8);
}

// JSON 工具类二次封装
const Json = {
    toJSON: function(o) {
        return JSON.stringify(o);
    },
    parseJSON: function(s) {
        return JSON.parse(s);
    }
};
/**
 * 对json进行加密
 * @param {*} json
 * @param {*} decryptOpt
 */
function jsonToEncrypt(json, decryptOpt = {}) {
    let ciphertext;
    try {
        ciphertext = encrypt(Json.toJSON(json), ...decryptOpt);
    } catch (error) {
        ciphertext = json;
        console.log("encrypt error: %s", error);
    }
    return ciphertext;
}

let methods = {
    encrypt,
    decrypt,
    jsonToEncrypt
};

const Cipher = {
    Json,
    PRIVATE_KEY,
    CipherFlag,
    ...(function() {
        // 对当前组件中的方法进行处理  主要是到处添加 开关太麻烦
        let defaultFunction = data => data;
        for (let k in methods) {
            //methods[k] = !CipherFlag ? defaultFunction : methods[k];
            let f = methods[k];
            methods[k] = function() {
                console.time(`${k}`);
                // 包装一次传递参数
                let res = (!Cipher.CipherFlag ? defaultFunction : f).apply(
                    this,
                    arguments
                );
                console.timeEnd(`${k}`);
                return res;
            };
        }
        return methods;
    })()
};

// console.log(Cipher);

export default Cipher;

/**
 * 不透明的加密
 * @param {*} msg 
 */
const opaqueEncrypt = msg => {
    if (!msg) {
        console.log('加密没有原文');
        return '';
    }
    return encrypt(msg, '4fa8959db7b4423a99f056e299914128');
};
/**
 * 不透明的解密
 * @param {*} msg 
 */
const opaqueDecrypt = msg => {
    if (!msg) {
        console.log('解密没有原文');
        return '';
    }
    return decrypt(msg, '4fa8959db7b4423a99f056e299914128');
};

// 抛出一系列方法
export { encrypt, decrypt, jsonToEncrypt, opaqueEncrypt, opaqueDecrypt };
