/**
 * 文字加图片水印效果
 * id 要加水印的区域
 * watermarkImg 水印为图片的图片url
 * watermarkText 水印文字
 */

const watermark = (settings = {}) => {
    //默认设置
    let defaultSettings = {
        watermarl_element: "body",
        watermark_txt: "",
        watermark_x: 20,//水印起始位置x轴坐标
        watermark_y: 30,//水印起始位置Y轴坐标
        watermark_rows: 2000,//水印行数
        watermark_cols: 2000,//水印列数
        watermark_x_space: 30,//水印x轴间隔
        watermark_y_space: 50,//水印y轴间隔
        watermark_color: '#aaa',//水印字体颜色
        watermark_alpha: 0.3,//水印透明度
        watermark_fontsize: '15px',//水印字体大小
        watermark_font: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,"sans-serif"',//水印字体
        watermark_width: 100,//水印宽度
        watermark_height: 40,//水印长度
        watermark_angle: 15//水印倾斜度数
    };

    defaultSettings = {
        ...defaultSettings,
        ...settings
    };

    if (document.querySelector('.mask_container')) {
        document.querySelector('.mask_container').remove()
    }

    let oTemp = document.createDocumentFragment();

    let maskElement = document.getElementById(defaultSettings.watermarl_element) || document.body;

    //获取页面最大宽度
    let page_width = Math.max(maskElement.scrollWidth, maskElement.clientWidth);

    //获取页面最大高度
    let page_height = Math.max(maskElement.scrollHeight, maskElement.clientHeight);
    //水印数量自适应元素区域尺寸
    defaultSettings.watermark_cols = Math.ceil(page_width / (defaultSettings.watermark_x_space + defaultSettings.watermark_width));
    defaultSettings.watermark_rows = Math.ceil(page_height / (defaultSettings.watermark_y_space + defaultSettings.watermark_height));
    let x;
    let y;
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (let j = 0; j < defaultSettings.watermark_cols; j++) {
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            let mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            //mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            mask_div.innerHTML = (defaultSettings.watermark_txt);
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "9999";
            mask_div.style.pointerEvents = 'none';//pointer-events:none  让水印不遮挡页面的点击事件
            //mask_div.style.border="solid #eee 1px";
            //兼容IE9以下的透明度设置
            mask_div.style.filter = "alpha(opacity=50)";
            mask_div.style.opacity = defaultSettings.watermark_alpha;
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
            mask_div.style.fontFamily = defaultSettings.watermark_font;
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = defaultSettings.watermark_width + 'px';
            mask_div.style.height = defaultSettings.watermark_height + 'px';
            mask_div.style.lineHeight = "1.5";
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        }
    }
    const container = document.createElement('div');
    container.className = 'mask_container';
    container.style.width = page_width + 'px';
    container.style.height = page_height + 'px';
    container.style.left = 0 + 'px';
    container.style.top = 0 + 'px';
    container.style.overflow = "hidden";
    container.style.position = "absolute";
    container.style.pointerEvents = 'none';
    container.append(oTemp);
    maskElement.appendChild(container);
};

export default watermark;