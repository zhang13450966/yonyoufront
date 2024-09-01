let lock = false;
import React, { forwardRef } from "react";

const InputLive = (props, ref) => {
    const { onChange, value } = props;

    function toUpperCase(str) {
        // ASCII 编码大写小写相差32
        let arr = str.split("");
        let AscCode;
        let maxCode = "z".charCodeAt();
        let minCode = "a".charCodeAt();
        for (let i = 0; i < arr.length; i++) {
            // 转换为ASCII码
            AscCode = arr[i].charCodeAt();
            // 大写字母，转大写
            if (maxCode >= AscCode && minCode <= AscCode) {
                arr[i] = String.fromCharCode(AscCode - 32);
            }
        }
        return arr.join("");
    }

    function handleChange(e) {
        if (e.type === "compositionstart") {
            lock = true;
            return;
        }
        let { value } = e.target;
        // 中文情况下
        if (lock && e.type === "change") {
            // 不符合格式
            //单个字母 小写直接转换为大写
            //!转大写后在微软中文输入法会输入4个字符
            value = value.replace(/[^A-Z]/g, "");
            onChange(value);
        }

        if (e.type === "compositionend") {
            lock = false;
        }
        if (!lock) {
            // 不符合格式
            //单个字母 小1写直接转换为大写
            value = value.replace(/[^A-Z]/g, "");
            onChange(value);
        }
    }

    return (
        <input
            style={{ width: "90px" }}
            className="nc-input u-form-control"
            value={value}
            onChange={handleChange}
            onCompositionStart={handleChange}
            onCompositionEnd={handleChange}
        />
    );
};
export default forwardRef(InputLive);
