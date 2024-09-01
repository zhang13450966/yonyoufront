import defaultFonts from './defaultFonts'
let c = document.createElement("canvas");
let b = c.getContext("2d");
const isSupportFontFamily = (f) => {
    //  f是要检测的字体
    if (typeof f != "string") {
        return false
    }
    //  h是基础字体
    let h = "Arial";
    if (f.toLowerCase() == h.toLowerCase()) {
        return true
    }
    //  设置一个检测的字符A,看他是否支持f字体
    let e = "a";
    let d = 13;
    let a = 20,
        i = 20;
    c.width = a;
    c.height = i;
    b.textAlign = "center";
    b.fillStyle = "black";
    b.textBaseline = "middle";
    let g = (j) => {
        b.clearRect(0, 0, a, i);
        // 字体是传入的j,或者是默认的h
        b.font = d + "px " + j + ", " + h;
        b.fillText(e, a / 2, i / 2);
        // 获取所有的canvas图片信息
        let k = b.getImageData(0, 0, a, i).data;
        // k调用数组的 filter方法,筛选符合条件的。改变原数组。
        return [].slice.call(k).filter(l => l != 0);
    };
    // 返回结果,如果h默认字体和输入待检测字体f.通过g函数检测得到的字符串不一致,说明自提生效
    return g(h).join("") !== g(f).join("");
}
const getEnableFonts = (arr = defaultFonts) => {
    let result = []
    if (Array.isArray(arr)) {
        result = arr.filter(f => isSupportFontFamily(f))
    }
    return result
}
export {
    getEnableFonts
}