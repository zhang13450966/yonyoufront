/**
 * Gzip流量压缩，使用pako.js实现
 */
import { gzip, inflate, deflate } from "pako";

import { Buffer } from "./buffer-js/buffer";
import * as Snappy from "./snappyjs/index";

// 信息日志
const MessageLog = {
	arithmetic: (name) => {
		window.console.log("压缩算法：%s", name);
	}
};
// 错误日志
const ErrorLog = {
	capture: (e, mode, origin, result, type) => {
		window.console.log(e);
		window.console.log('%s,%s,报错', type, mode);
		window.console.log('原始数据: %s', origin);
		window.console.log('结果数据: %s', result);
	}
};
// 用时打印
const timeLog = function(target, name, descriptor) {
	var oldValue = descriptor.value;
	descriptor.value = function() {
		console.time(`${name}`);
		let res = oldValue.apply(this, arguments);
		console.timeEnd(`${name}`);
		return  res;
	};
	return descriptor;
};

class Gzip {
    constructor() {
		this.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		this.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    }

    /**
     * Gzip压缩
     * @param str json字符串
     * @return 经过gzip压缩后转码为Base64的json字符串
     */
    zip(str) {
        let output = "";
        output = this.gzipCompress(str);
        return output;
    }

    /**
     * Gzip解压
     * @param str json字符串
     * @return js对象
     */
    unzip(str) {
        let output = "";
        output = this.gzipDecompress(str);
        return output;
    }
    /**
     * Gzip压缩
     * @param str json字符串
     * @return 经过gzip压缩后转码为Base64的json字符串
     */
    gzipCompress(str) {
		MessageLog.arithmetic('gzip');
        if (str == undefined) {
            return null;
        }
        var gstr;
        try {
            // level  代表压缩级别 越大压缩级别越高
            // memLevel 代表内存级别 越大占用越多内存
			// gstr = gzip(str, { level: 1, memLevel: 9 });
			gstr = gzip(str);
        } catch (e) {
			ErrorLog.capture(e, "gzip", str, gstr, '压缩');
        }
        return this.encodeBase64(gstr);
    }

    /**
     * Gzip解压
     * @param str json字符串
     * @return js对象
     */
    gzipDecompress(str) {
        if (str == undefined) {
            return null;
        }
        var gstr = this.decodeBase64(str);
        var out;
        try {
            out = inflate(gstr, { to: "string" });
        } catch (e) {
			ErrorLog.capture(e, "gzip", gstr, out, '解压');
        }
        var strData = JSON.parse(out);
        return strData;
    }

    /**
     * deflate压缩
     * @param str json字符串
     * @return 经过gzip压缩后转码为Base64的json字符串
     */
    deflate(str) {
		MessageLog.arithmetic('deflate');
        if (str == undefined) {
            return null;
        }
        var gstr;
        try {
            gstr = deflate(str);
        } catch (e) {
			ErrorLog.capture(e, "deflate", str, gstr, '压缩');
        }
        return this.encodeBase64(gstr);
    }

    /**
     * inflate解压
     * @param str json字符串
     * @return js对象
     */
    inflate(str) {
        if (str == undefined) {
            return null;
        }
        var gstr = this.decodeBase64(str);
        var out;
        try {
            out = inflate(gstr, { to: "string" });
        } catch (e) {
			ErrorLog.capture(e, "deflate", gstr, out, '解压');
        }
        var strData = JSON.parse(out);
        return strData;
    }

    /**
     * snappy压缩
     * @param str json字符串
     * @return 经过snappy压缩后转码为Base64的json字符串
     */
    snappyCompress(str) {
		MessageLog.arithmetic('snappy');
        if (str == undefined) {
            return null;
        }
        var compressed;
        try {
            // 这里要利用lz4中的buffer类  返回unit8array
            var buffer = new Buffer(str);
            // fill data in buffer
            compressed = Snappy.compress(buffer);
        } catch (e) {
			ErrorLog.capture(e, "snappy", str, compressed, '压缩');
        }
        return Buffer.from(compressed).toString("base64");
    }

    /**
     * snappy解压
     * @param str json字符串
     * @return js对象
     */
    snappyDecompress(str) {
        if (str == undefined) {
            return null;
        }
        var compressed = Buffer.from(str, "base64");
        var uncompressed;
        try {
            // 这里要利用lz4中的buffer类  返回unit8array
            var buffer = new Buffer(compressed);
            // fill data in buffer
            uncompressed = Snappy.uncompress(buffer);
        } catch (e) {
			ErrorLog.capture(e, "snappy", str, uncompressed, '解压');
        }
        return JSON.parse(Buffer.from(uncompressed).toString("utf8"));
    }

    /**
     * 将二进制转为字符串
     * @param bytes 二进制字节流
     */
    encodeBase64(bytes) {
        var out, i, len;
        var c1, c2, c3;
        len = bytes.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = bytes[i++] & 0xff;
            if (i == len) {
                out += this.base64EncodeChars.charAt(c1 >> 2);
                out += this.base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = bytes[i++];
            if (i == len) {
                out += this.base64EncodeChars.charAt(c1 >> 2);
                out += this.base64EncodeChars.charAt(
                    ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
                );
                out += this.base64EncodeChars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = bytes[i++];
            out += this.base64EncodeChars.charAt(c1 >> 2);
            out += this.base64EncodeChars.charAt(
                ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
            );
            out += this.base64EncodeChars.charAt(
                ((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)
            );
            out += this.base64EncodeChars.charAt(c3 & 0x3f);
        }
        return out;
    }

    /**
     * 将字符串转为二进制
     * @param str 字符串
     */
    decodeBase64(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            /* c2 */
            do {
                c2 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = this.base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = this.base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }
}
export default Gzip;
