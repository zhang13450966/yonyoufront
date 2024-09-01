import { toast, viewModel, formatNumber } from "nc-lightapp-front";
import BigNumber from "bignumber.js";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;

// setGlobalStorage = () => { }
// getGlobalStorage = () => { }
// removeGlobalStorage = () => { }
const mountArray = ["$", "￥", "€"];
function isNumber(value) {
    if (value.length < 128) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(value) == null || value == "") {
            return false;
        } else {
            return true;
        }
    }
    return false;
}

// 获取url参数
function GetQueryString(name) {
    let href = window.parent.location.href;
    href = href.split("?")[1];
    if (!href) {
        return;
    }
    href = href.split("&");
    for (let i = 0; i < href.length; i++) {
        let hrefv = href[i].split("=");
        if (hrefv[0].indexOf(name) >= 0) {
            return hrefv[1];
        }
    }
}

/* 检测类型是否为数组 */
function isFunction(param) {
    return Object.prototype.toString.call(param).slice(8, -1) === "Function";
}

const isArrayFn = value => {
    if (typeof Array.isArray === "function") {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
};

const splitURI = url => {
    if (!url) return false;
    let flag1 = url.indexOf("nccloud/resources") >= 0, flag2 = url.indexOf("yonbip/resources") >= 0;
    if (flag1 || flag2) {
        if (flag1) {
            url = url.split("nccloud/resources")[1];
        } else{
            url = url.split("yonbip/resources")[1];
        }
        
        if (url.indexOf("#") >= 0) {
            url = url.split("#")[0];
        } else if (url.indexOf("?") >= 0) {
            url = url.split("?")[0];
        } else {
            url = url.split("?")[0];
        }
    } else {
        url = url.split("?")[0];
    }
    return url;
};

const deWeight = array => {
    // 去重
    return [...new Set(array)];
};

const getThousandNum = num => {
    // 数字转千分位
    return (num || 0).toString().replace(/\d+/, function (n) {
        var len = n.length;
        if (len % 3 === 0) {
            return n.replace(/(\d{3})/g, ",$1").slice(1);
        } else {
            return (
                n.slice(0, len % 3) +
                n.slice(len % 3).replace(/(\d{3})/g, ",$1")
            );
        }
    });
};

const delcommafy = num => {
    // 千分位转数字
    num = num.replace(/,/gi, "");
    return num;
};

const getPercentNum = num => {
    // 百分数转数字
    if (num.indexOf("%") >= 0) {
        num = num.split("%")[0];
    }
    return num;
};

const getFixedNum = data => {
    // 获取小数最大位数
    let delPercentArray = [];
    data.forEach(item => {
        if (item) {
            if (item.indexOf("%") >= 0 && isNumber(item.split("%")[0])) {
                if (item.indexOf(".") >= 0) {
                    delPercentArray.push(item.split("%")[0].split(".")[1].length);
                } else {
                    item = getPercentNum(item);
                }
            }
            if (
                item.indexOf(".") > -1 &&
                (isNumber(item) || isNumber(item.replace(/,/g, "")))
            )
                delPercentArray.push(item.split(".")[1].length);
        }
    });
    if (delPercentArray.length < 1) return 0;
    return Math.max.apply(null, delPercentArray); //找到数组内最大值
};

const outPutTotalNum = sumArr => {
    let fixedNumArray = [];
    // 输出合计计算
    if (sumArr[0] && sumArr[0].length == 1 && sumArr.length == 1) return "";
    let sumNum = 0;

    sumArr.forEach(items => {
        items &&
            items[0] &&
            items.forEach(ele => {
                let cell = ele ? ele[4] : null;
                if (cell) {
                    if (typeof cell === "number") cell = cell.toString();
                    let currentNum = delcommafy(ele[0]);
                    if (!isNaN(currentNum)) {
                        fixedNumArray.push(currentNum);
                    } else {
                        fixedNumArray.push(ele[4] || ele[0]);
                    }
                    
                    for (let i = 0; i < mountArray.length; i++) {
                        if (cell.indexOf(mountArray[i]) >= 0) {
                            let moneyNum = cell.split(mountArray[i])[1];
                            sumNum = BigNumber(sumNum).plus(BigNumber(moneyNum));
                            break;
                        }
                    }
                    if (isNumber(delcommafy(cell))) {
                        sumNum = BigNumber(sumNum).plus(BigNumber(delcommafy(cell)));
                    } else if (
                        cell.indexOf("%") >= 0 &&
                        isNumber(cell.split("%")[0])
                    ) {
                        sumNum = BigNumber(sumNum).plus(BigNumber(cell.split("%")[0] / 100));
                    } else if (isNumber(cell)) {
                        sumNum = BigNumber(sumNum).plus(BigNumber(cell));
                    }
                }
            });
    });

    return formatNumber(sumNum.toFixed(getFixedNum(fixedNumArray))).props
        .children;
};

const arraySum = arr => {
    // 数组求和
    let arr1 = [];
    arr.map(item => arr1.push(Number(item)));
    return arr1.reduce(function (prev, curr, idx, arr) {
        return prev + curr;
    });
};

const isIE = () => {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    }
    return false;
};

const addClassName = ele => {
    ele.classList.add("buttons-add-disabled");
    ele.disabled = true;
};

const removeClassName = ele => {
    ele.classList.remove("buttons-add-disabled");
    ele.disabled = false;
};

const disposeSearch = data => {
    // 处理查询区数据
    let result = data;
    let val = "";
    let obj = {};
    if (result == false) {
        return false;
    }
    if (result == true) return true;

    if (result === null || typeof data === "string") {
        obj = { condition: { logic: "and", conditions: [] } };
        return obj;
    }
    if (
        result.conditions === null ||
        result.conditions.length < 1 ||
        !result.conditions
    ) {
        obj = { condition: { logic: "and", conditions: [] } };
        return obj;
    }
    result.conditions.forEach(item => {
        if (
            item.field == "dyngroup_report" ||
            item.notSearch ||
            item.field == "pk_org_v.pk_data_view_org"
        ) {
            val += item.field + ",";
        }
        if (item.conditions) {
            val += loop(item.conditions, val);
        }
    });

    val = deWeight(val.split(",")).join(",");
    result.conditions.push({
        field: "not_search",
        value: { firstvalue: val, secondvalue: null },
    });

    obj = { condition: result };
    return obj;
};

function loop(data, str) {
    data.forEach(item => {
        if (item.field == "dyngroup_report" || item.notSearch) {
            str += item.field + ",";
        }
        if (item.conditions) {
            str += loop(item.conditions, str);
        }
    });
    return str;
}

const buildTree = (data, id, pid) => {
    let result = [];
    if (!Array.isArray(data)) {
        return result;
    }
    let map = {};
    data.forEach(item => {
        delete item.children;
        if (item.relValue === "%$S(*@#^)")
            item.disValue = langCheck("reportMultiLang", "100301-000018");
        if (item.relValue === null)
            item.disValue = langCheck("reportMultiLang", "100301-000019");
        if (item[id]) map[item[id]] = item;
    });
    data.forEach(item => {
        let parent = map[item[pid]];
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
};

const treeToPath = (tree, paths, currentPath) => {
    //树转平铺数组
    var currentPath = currentPath || [];
    var paths = paths || [];

    for (let i = 0; i < tree.length; i++) {
        if (i !== 0) {
            currentPath.pop();
        }

        currentPath.push({
            disValue: tree[i].disValue,
            relValue: tree[i].relValue,
            id: tree[i].id,
        });

        if (tree[i].children && tree[i].children.length) {
            treeToPath(tree[i].children, paths, currentPath);
        } else {
            paths.push(currentPath.slice(0));
        }
    }

    currentPath.pop();

    return paths;
};

const getSiblings = elm => {
    //获取所有兄弟元素
    var a = [];
    var p = elm.parentNode.children;
    for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== elm) a.push(p[i]);
    }
    return a;
};

const langCheck = (way, code) => {
    return window[way] ? (window[way][code] ? window[way][code] : "") : "";
};

const showSearchToast = (data, that) => {
    setTimeout(() => {
        if (data.collapseShowMaxRow) {
            toast({
                content: langCheck("reportMultiLang", "100301-000257"),
                color: "warning",
            });
        } else if (data.hintForRowLimit) {
            const msg =
                data.reportType == "1"
                    ? langCheck("reportMultiLang", "100301-000002")
                    : `${langCheck(
                        "reportMultiLang",
                        "100301-000002",
                    )},${langCheck("reportMultiLang", "100301-000003")}${
                        data.hintForRowLimit
                    }${langCheck("reportMultiLang", "100301-000004")}`;
            toast({
                content: msg,
                color: "warning",
            }); /* 国际化处理： 查询数据超出范围,本次最多显示,条*/
        } else {
            let innerHtml = "";
            if (data.pager && data.pager.allRowCount) {
                if (
                    that.isClickShowAllCount &&
                    +data.preloadMaxRow > -1 &&
                    +data.preloadMaxRow <= +data.pager.allRowCount
                ) {
                    innerHtml = `${langCheck(
                        "reportMultiLang",
                        "100301-000005",
                    )}，${langCheck("reportMultiLang", "100301-000006")} ${
                        Math.max(+data.preloadMaxRow, +data.pager.pageSize)
                    }+ ${langCheck(
                        "reportMultiLang",
                        "100301-000004",
                    )}`; /* 国际化处理： 查询成功,共,条*/
                } else {
                    innerHtml = `${langCheck(
                        "reportMultiLang",
                        "100301-000005",
                    )}，${langCheck("reportMultiLang", "100301-000006")} ${
                        +data.pager.allRowCount > -1
                            ? data.pager.allRowCount
                            : data.dataRowNum
                    } ${langCheck(
                        "reportMultiLang",
                        "100301-000004",
                    )}`; /* 国际化处理： 查询成功,共,条*/
                }
            } else {
                innerHtml = "";
            }

            if (data.reportType == "2") {
                //组合表不加提示
                innerHtml = "";
            }

            if (data.reportType != "2") {
                if (
                    data.dataRowNum == 0 ||
                    (data.pager && data.pager.allRowCount == 0)
                ) {
                    that.emptyDataFlag = true; //没有数据的标记
                    innerHtml = langCheck(
                        "reportMultiLang",
                        "100301-000092",
                    ); /* 国际化处理： 未查询出符合条件的数据*/
                    toast({ content: innerHtml, color: "warning" });
                } else {
                    if (data.reportType == "0") {
                        //分组表
                        that.emptyDataFlag = false; //没有数据的标记
                        innerHtml = `${langCheck(
                            "reportMultiLang",
                            "100301-000005",
                        )}，${langCheck("reportMultiLang", "100301-000006")} ${
                            data.dataRowNum
                        } ${langCheck(
                            "reportMultiLang",
                            "100301-000004",
                        )}`; /* 国际化处理： 查询成功,共,条*/
                        toast({ content: innerHtml, color: "success" });
                    } else {
                        that.emptyDataFlag = false; //没有数据的标记
                        toast({ content: innerHtml, color: "success" });
                    }
                }
            } else {
                toast({
                    content: langCheck("reportMultiLang", "100301-000005"),
                    color: "success",
                });
            }
        }
    }, 20);
};

const changeConditionWhenSearch = (
    //业务干预非查询条件 => userdefObj
    queryConditionList, // 原本的查询条件 从expandSearchVal函数得来
    specialCondition, // 自定义需要扩展的查询条件集合 可以是String（一个）  也可以是Array（多个）
) => {
    let conditions = queryConditionList.conditions.slice(),
        //  LinkReportUserDefObj结构是需要传给后台一个固定的对象格式
        LinkReportUserDefObj = { keyReportParamWeb: {} },
        specialConditionIsArray = Array.isArray(specialCondition); // 判断specialCondition是否是对象类型

    // 初始化LinkReportUserDefObj，将specialCondition中的键遍历放在LinkReportUserDefObj的keyReportParamWeb中
    if (specialConditionIsArray) {
        specialCondition.forEach(item => {
            LinkReportUserDefObj.keyReportParamWeb[item] = "";
        });
    } else {
        LinkReportUserDefObj[specialCondition] = "";
    }

    // 从conditions中取keyReportParamWeb对应的值后，需要将自定义的查询条件从原来的查询条件中过滤掉
    conditions = conditions.filter(item => {
        let bool = specialConditionIsArray
            ? specialCondition.includes(item.field)
            : item.field === specialCondition;
        if (bool) {
            LinkReportUserDefObj.keyReportParamWeb = {
                ...LinkReportUserDefObj.keyReportParamWeb,
                [item.field]: item.value.firstvalue,
            };
        }
        return !bool;
    });
    // 将LinkReportUserDefObj存于sessionStorage中， LinkReportUserDefObj发送给后台后sessionStorage就将其销毁
    sessionStorage.setItem(
        "LinkReportUserDefObj",
        JSON.stringify(LinkReportUserDefObj),
    );

    // 将处理过的queryConditionList return出去
    return {
        conditions,
        logic: queryConditionList.logic,
    };
};

const Xreplace = (str, length, reversed, sym) => {
    let re = new RegExp("\\d{1," + length + "}", "g");
    let ma = str.match(re);
    if (reversed) ma.reverse();
    return ma.join(sym);
};

const sortNumber = (a, b) => {
    //升序
    return a - b;
};

const isFloat = n => {
    return parseInt(n) < parseFloat(n);
};

const repeatArray = (json, key1, key2) => {
    let newJson = [];
    for (let item1 of json) {
        let flag = true;
        for (let item2 of newJson) {
            if (key2) {
                if (
                    (item1[key2] || item1[key2] == 0) &&
                    item1[key2] == item2[key2] &&
                    item1[key1] == item2[key1]
                ) {
                    flag = false;
                }
            } else {
                if (item1[key1] == item2[key1]) {
                    flag = false;
                }
            }
        }
        if (flag) {
            newJson.push(item1);
        }
    }
    return newJson;
};

const chkstrlen = function (str, cn = 3, en = 1) {
    var strlen = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) strlen += cn;
        else strlen += en;
    }
    return strlen;
};

//进入全屏
function requestFullScreen() {
    this.setState({ isFullScreen: true });
    const de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
//退出全屏
function exitFullscreen() {
    const de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}

function getIframeParams() {
    const { getUrlParam, linkParams = {} } = this.props;
    const row = getUrlParam("row") || ""; //动态url传参
    const column = getUrlParam("column") || ""; //动态url传参
    const targetRepPk = getUrlParam("targetRepPk") || ""; //动态url传参
    const dirllcode = getUrlParam("drillCode") || ""; //动态url传参
    const reportId = getUrlParam("reportId") || ""; //动态url传参
    const opents = getUrlParam("opents") || ""; //动态url传参
    const operationQueue = getUrlParam("operationQueue") || ""; //动态url传参
    const oid = getUrlParam("oid") || ""; //动态url传参
    const pageIndex = getUrlParam("pageIndex") || ""; //动态url传参
    const pageSize = getUrlParam("pageSize") || ""; //动态url传参
    const webDrillType = getUrlParam("webDrillType") || ""; //动态url传参'

    const { appcode, pageCode } = this.commonParams;

    let condition = getGlobalStorage(
        "sessionStorage",
        `condition${linkParams.reportId || reportId}*${
            linkParams.dirllcode || dirllcode
        }`,
    );
    let transSaveObject = getGlobalStorage(
        "sessionStorage",
        `trans${linkParams.opents || opents}${linkParams.reportId || reportId}`,
    );
    let custcondition = getGlobalStorage(
        "sessionStorage",
        `custcondition${opents}${reportId}`,
    );

    return {
        row: linkParams.row || row,
        column: linkParams.column || column,
        reportId: linkParams.reportId || reportId,
        targetRepPk: linkParams.targetRepPk || targetRepPk,
        dirllcode: linkParams.dirllcode || dirllcode,
        transSaveObject: linkParams.transSaveObject || transSaveObject,
        opents: linkParams.opents || opents,
        appcode: linkParams.appcode || appcode,
        pageCode: linkParams.pageCode || pageCode,
        querytype: "tree",
        pageInfo: {
            pageIndex: linkParams.pageIndex || pageIndex,
            pageSize: linkParams.pageSize || pageSize,
        },
        querycondition: linkParams.condition || JSON.parse(condition),
        oid: linkParams.oid || oid,
        operationQueue: linkParams.operationQueue || operationQueue,
        webDrillType: linkParams.webDrillType || webDrillType.toString(),
        custcondition: JSON.parse(custcondition),
        key_time_offset: getTimeOffset(),
    };
}

//获取隐藏行列
function getHiddenColumns() {
    const { colWidths } = this.state.settings;
    const hiddenColumns =
        colWidths
            .map((item, index) => ({ size: item, index }))
            .filter(item => +item.size < 2) || [];
    return hiddenColumns;
}

//检查选中范围内是否包含隐藏行/列
function checkHiddenRowCol2() {
    let isSelectRow= this.getReportInstance().selection.isSelectedByRowHeader();
    const { col, col2 } = this.selectCells;
    const startColumn = Math.min(col, col2);
    const endColumn = Math.max(col, col2);
    const hiddenColumns = getHiddenColumns.call(this);
    if (startColumn == endColumn) {
        return false;
    }
    const includeHidden = hiddenColumns.find(
        item => +startColumn <= +item.index && +item.index <= +endColumn,
    ); //选中范围包含隐藏列
    const hideCols = hiddenColumns
        .filter(a => a.index < col)
        .map(item => item.index);
    const firstColumn = hiddenColumns.find(item => {
        if (
            col === col2 &&
            hideCols.length > 0 &&
            +hideCols[0] < 2 &&
            hideCols[hideCols.length - 1] == col - 1 &&
            isContinuity(hideCols)
        ) {
            return true;
        }
        return false;
    });
    return !isSelectRow && (!!includeHidden || !!firstColumn);
}

function checkHiddenRowCol() {
    let isSelectRow= this.getReportInstance().selection.isSelectedByRowHeader();
    const { col, col2 } = this.selectCells;
    const startColumn = Math.min(col, col2);
    const endColumn = Math.max(col, col2);
    const { colWidths } = this.state.settings;
    let isHidden = true;
    for (let i = +startColumn; i <= +endColumn; i++) {
        if (colWidths[i] > 2) {
            isHidden = false;
            break;
        }
    }
    return isSelectRow || isHidden;
}

function getAllCoordsByRange(range, map) {
    const { row, col, endRow, endCol } = range;

    for (let r = +row; r <= +endRow; r++) {
        for (let c = +col; c <= +endCol; c++) {
            if (row === r && col === c) {
                map[`${row}_${col}`] = { row, col };
            } else if (endRow === r && endCol === c) {
                map[`${endRow}_${endCol}`] = { row, col };
            } else {
                map[`${r}_${c}`] = { row, col };
            }
        }
    }
}

function getTimeOffset() {
    const time = -new Date().getTimezoneOffset();
    return time;
    //return time < 0 && time > -599 ? time - 60 : time;
}

//制作水印
const waterMark = text => {
    let _wm = document.createElement("canvas");

    _wm.setAttribute("width", 180);

    _wm.setAttribute("height", 180);

    let ctx = _wm.getContext("2d");

    ctx.fillStyle = "#d2d2d2";

    ctx.font = "15px 宋体";

    ctx.translate(60, 50);

    ctx.rotate(-0.5); //ctx.fillRect()

    ctx.fillText(text, 0, 10);

    return _wm.toDataURL();
};

function setMaxRow() {
    const { pager } = this.state;
    const { reportType } = this.pageParams;
    const { allRowCount } = pager;
    let maxrow =
        this.preloadMaxRow != -1 && +this.preloadMaxRow <= +allRowCount
            ? "-1"
            : allRowCount + "";
    this.pageParams.maxrow = reportType === "2" ? "-1" : maxrow;
}

//获取字符串长度，区分中英文
function checkStrLen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            len += 1; //中文
        } else {
            len += 0.6;
        }
    }
    return len;
}

const Utils = {
    isNumber,
    GetQueryString,
    isFunction,
    splitURI,
    deWeight,
    getThousandNum,
    getPercentNum,
    outPutTotalNum,
    arraySum,
    isIE,
    addClassName,
    removeClassName,
    disposeSearch,
    buildTree,
    getSiblings,
    treeToPath,
    langCheck,
    showSearchToast,
    changeConditionWhenSearch,
    isArrayFn,
    setGlobalStorage,
    getGlobalStorage,
    removeGlobalStorage,
    Xreplace,
    sortNumber,
    isFloat,
    repeatArray,
    chkstrlen,
    requestFullScreen,
    exitFullscreen,
    getIframeParams,
    checkHiddenRowCol2,
    checkHiddenRowCol,
    getAllCoordsByRange,
    delcommafy,
    getTimeOffset,
    waterMark,
    setMaxRow,
    checkStrLen,
};

export default Utils;
