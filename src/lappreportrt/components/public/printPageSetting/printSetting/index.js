import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { base, toast, promptBox } from "nc-lightapp-front";

import { Pcontext } from "../pstore";
import {
    savePlan,
    changePlanCode,
    changeOpenSetting,
    getPlanDetail,
    getPlans,
    changePlanLists,
    editPlan,
    deletePlan,
    getLang,
    printAction,
    changeDefaultPlanCode,
} from "../paction";
const {
    NCModal,
    NCButton,
    NCSelect,
    NCRadio,
    NCInputNumber,
    NCCheckbox,
    NCNumber,
    NCFormControl,
    NCTooltip,
    NCHotKeys,
} = base;
import "./index.less";

import CodeAndName from "./codeAndName";
import Utils from "@public/utils";
const { langCheck } = Utils;

const NCOption = NCSelect.NCOption;
const NCRadioGroup = NCRadio.NCRadioGroup;

//纸张类型列表
let pageType = [
    {
        name: "信函",
        value: "40",
        width: 215.9,
        height: 279.4,
    },
    {
        name: "小号信纸",
        value: "948",
        width: 215.9,
        height: 279.4,
    },
    {
        name: "小报",
        value: "44",
        width: 279.4,
        height: 431.8,
    },
    {
        name: "帐目",
        value: "43",
        width: 279.4,
        height: 431.8,
    },
    {
        name: "法律文书",
        value: "41",
        width: 215.9,
        height: 355.6,
    },
    {
        name: "发票",
        value: "45",
        width: 139.7,
        height: 215.9,
    },
    {
        name: "执行程序",
        value: "42",
        width: 184.15,
        height: 266.7,
    },
    {
        name: "A3 ",
        value: "3",
        width: 297.0,
        height: 420.0,
    },
    {
        name: "A4 ",
        value: "4",
        width: 210.0,
        height: 297.0,
    },
    {
        name: "A4 小号" /* 国际化处理： A4 小号*/,
        value: "949",
        width: 210.0,
        height: 297.0,
    },
    {
        name: "A5 ",
        value: "5",
        width: 148.0,
        height: 210.0,
    },
    {
        name: "B4 (JIS)",
        value: "26",
        width: 257.0,
        height: 364.0,
    },
    {
        name: "B5 (JIS)",
        value: "27",
        width: 182.0,
        height: 257.0,
    },
    {
        name: "对开页",
        value: "46",
        width: 215.9,
        height: 330.2,
    },
    {
        name: "四开页",
        value: "47",
        width: 215.9,
        height: 275.082,
    },
    {
        name: "信封",
        value: "69",
        width: 254.0,
        height: 355.6,
    },
    {
        name: "工程 B",
        value: "51",
        width: 279.4,
        height: 431.8,
    },
    {
        name: "便笺",
        value: "950",
        width: 215.9,
        height: 279.4,
    },
    {
        name: "9 号信封",
        value: "59",
        width: 98.425,
        height: 225.425,
    },
    {
        name: "10 号信封",
        value: "60",
        width: 104.775,
        height: 241.3,
    },
    {
        name: "11 号信封",
        value: "61",
        width: 114.3,
        height: 263.525,
    },
    {
        name: "12 号信封",
        value: "62",
        width: 120.65,
        height: 279.4,
    },
    {
        name: "14 号信封",
        value: "63",
        width: 127.0,
        height: 292.1,
    },
    {
        name: "工程 C",
        value: "52",
        width: 431.8,
        height: 558.8,
    },
    {
        name: "工程 D",
        value: "53",
        width: 558.8,
        height: 863.6,
    },
    {
        name: "工程 E",
        value: "54",
        width: 863.6,
        height: 1117.6,
    },
    {
        name: "ISO 指定长度",
        value: "55",
        width: 110.0,
        height: 220.0,
    },
    {
        name: "C5 ",
        value: "38",
        width: 162.0,
        height: 229.0,
    },
    {
        name: "C3 ",
        value: "36",
        width: 324.0,
        height: 458.0,
    },
    {
        name: "C4 ",
        value: "37",
        width: 229.0,
        height: 324.0,
    },
    {
        name: "C6 ",
        value: "39",
        width: 114.0,
        height: 162.0,
    },
    {
        name: "用户自定义纸张",
        value: "999",
        width: 210.0,
        height: 297.0,
    },
];

//将A1格式转成{ row: 0, col: 0 }格式
export function transferCell(str) {
    if (typeof str !== "string") return {};
    const datas = str.split("");
    const sep = datas.findIndex((item) => !isNaN(item)); //第一个数字的位置
    const rowVal = str.substr(sep, str.length);
    let colVal = 0;
    for (let i = 0; i < sep; i++) {
        colVal += char2Num(datas[i]) * Math.pow(26, sep - i - 1);
    }

    return { row: parseInt(rowVal) - 1, col: colVal - 1 };
}

//字母转数字 A->1
function char2Num(c) {
    if (typeof c === "string") {
        return c.toLocaleLowerCase().charCodeAt(0) - 96;
    } else {
        return 0;
    }
}

function state2Detail({
    currentPaperTypeIndex,
    direction,
    paperMargin,
    ColPriorityPrinted,
    isVCenter,
    isHCenter,
    scale,
    isPageToOne,
    isColsToOne,
    isRowsToOne,
    printArea,
    m_MainTitleSettings,
    rowHeadRang,
    colHeadRang,
    pageType,
    paperSize,
}) {
    const newPrintSet = {
        paper: {
            direction,
            paperMargin,
        },
        ColPriorityPrinted, //打印顺序,先列后行 为true，否则为false
        isVCenter, //对齐方式：水平 false 否则为true
        isHCenter, //对齐方式：垂直 true 否则为false
        scale, // 缩放比例
        isPageToOne: isPageToOne || true, //行列调整是否都为true；isRowsToOne && isColsToOne
        isColsToOne, //列调整到单页 是为true
        isRowsToOne, //行调整到单页 是为true
        printArea, //打印区域-->行列依次设置范围   row：1  2  col：2  3
        m_MainTitleSettings, //设置主标题
        rowHeadRang, //打印标题-->行设置范围
        colHeadRang, //打印标题-->列设置范围
    };

    // 自定义项
    if (pageType.length - 1 == currentPaperTypeIndex) {
        newPrintSet.paper.mediadef = {
            x: paperSize.width + "",
            y: paperSize.height + "",
            value: "999",
        };
    } else {
        newPrintSet.paper.media = {
            value: pageType[currentPaperTypeIndex].value,
        };
    }

    return newPrintSet;
}

function PrintSetting(props) {
    const {
        store: {
            reportId,
            openSetting,
            planLists,
            planCode,
            langseq,
            langinfo,
            printParams,
        },
        dispatch,
    } = useContext(Pcontext);

    const saveInstance = useRef(null);

    const renameInstance = useRef(null);

    const currentDetail = useRef({});

    const originalDetail = useRef({});

    // 纸张大小角标
    const [currentPaperTypeIndex, setCurrentPaperTypeIndex] = useState("4");

    // 方向 paper内属性
    const [direction, setDirection] = useState(true);

    // 页边距 paper内属性
    const [paperMargin, setPaperMargin] = useState(() => {
        return {
            //页边距
            top: {
                mmLength: 25.0, //转化为mm的长度
                initLength: 25.0, //原始长度
                initUnit: 1, //长度单位：1(mm),2(cm)，3(m)等
            },
            bottom: {
                mmLength: 25.0,
                initLength: 25.0,
                initUnit: 1,
            },
            left: {
                mmLength: 19.0,
                initLength: 19.0,
                initUnit: 1,
            },
            right: {
                mmLength: 19.0,
                initLength: 19.0,
                initUnit: 1,
            },
        };
    });
    // 打印顺序
    const [ColPriorityPrinted, setColPriorityPrinted] = useState(true);

    // 对齐方式 水平
    const [isVCenter, setIsVCenter] = useState(false);

    // 对齐方式 垂直
    const [isHCenter, setIsHCenter] = useState(false);

    // 缩放比例
    const [scale, setScale] = useState(1.0);

    // 列调整到单页
    const [isColsToOne, setIsColsToOne] = useState(false);

    // 行调整到单页
    const [isRowsToOne, setIsRowsToOne] = useState(false);

    // 打印区域
    const [printArea, setPrintArea] = useState(["", "", "", ""]);

    // 打印标题
    const [m_MainTitleSettings, setM_MainTitleSettings] = useState("");

    // 行
    const [rowHeadRang, setRowHeadRang] = useState(["", ""]);

    // 列
    const [colHeadRang, setColHeadRang] = useState(["", ""]);

    /***************非后台数据相关state******************/

    const [paperSize, setPaperSize] = useState({});

    const [visibleToolTip, setVisibleToolTip] = useState(false);

    const [enterIndex, setEnterIndex] = useState(0);

    let pageType = [
        {
            name: langCheck("reportMultiLang", "formatDesign-000131"),
            value: "40",
            width: 215.9,
            height: 279.4,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000132"),
            value: "948",
            width: 215.9,
            height: 279.4,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000133"),
            value: "44",
            width: 279.4,
            height: 431.8,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000134"),
            value: "43",
            width: 279.4,
            height: 431.8,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000135"),
            value: "41",
            width: 215.9,
            height: 355.6,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000136"),
            value: "45",
            width: 139.7,
            height: 215.9,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000137"),
            value: "42",
            width: 184.15,
            height: 266.7,
        },
        {
            name: "A3 ",
            value: "3",
            width: 297.0,
            height: 420.0,
        },
        {
            name: "A4 ",
            value: "4",
            width: 210.0,
            height: 297.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000138"),
            value: "949",
            width: 210.0,
            height: 297.0,
        },
        {
            name: "A5 ",
            value: "5",
            width: 148.0,
            height: 210.0,
        },
        {
            name: "B4 (JIS)",
            value: "26",
            width: 257.0,
            height: 364.0,
        },
        {
            name: "B5 (JIS)",
            value: "27",
            width: 182.0,
            height: 257.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000139"),
            value: "46",
            width: 215.9,
            height: 330.2,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000140"),
            value: "47",
            width: 215.9,
            height: 275.082,
        },
        {
            name: `10x15 ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )}`,
            value: "69",
            width: 254.0,
            height: 355.6,
        },
        {
            name: `${langCheck("reportMultiLang", "formatDesign-000142")} B`,
            value: "51",
            width: 279.4,
            height: 431.8,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000143"),
            value: "950",
            width: 215.9,
            height: 279.4,
        },
        {
            name: `9 ${langCheck("reportMultiLang", "formatDesign-000144")}`,
            value: "59",
            width: 98.425,
            height: 225.425,
        },
        {
            name: `10 ${langCheck("reportMultiLang", "formatDesign-000144")}`,
            value: "60",
            width: 104.775,
            height: 241.3,
        },
        {
            name: `11 ${langCheck("reportMultiLang", "formatDesign-000144")}`,
            value: "61",
            width: 114.3,
            height: 263.525,
        },
        {
            name: `12 ${langCheck("reportMultiLang", "formatDesign-000144")}`,
            value: "62",
            width: 120.65,
            height: 279.4,
        },
        {
            name: `14 ${langCheck("reportMultiLang", "formatDesign-000144")}`,
            value: "63",
            width: 127.0,
            height: 292.1,
        },
        {
            name: `${langCheck("reportMultiLang", "formatDesign-000142")} C`,
            value: "52",
            width: 431.8,
            height: 558.8,
        },
        {
            name: `${langCheck("reportMultiLang", "formatDesign-000142")} D`,
            value: "53",
            width: 558.8,
            height: 863.6,
        },
        {
            name: `${langCheck("reportMultiLang", "formatDesign-000142")} E`,
            value: "54",
            width: 863.6,
            height: 1117.6,
        },
        {
            name: `ISO ${langCheck("reportMultiLang", "formatDesign-000142")}`,
            value: "55",
            width: 110.0,
            height: 220.0,
        },
        {
            name: "C5 ",
            value: "38",
            width: 162.0,
            height: 229.0,
        },
        {
            name: "C3 ",
            value: "36",
            width: 324.0,
            height: 458.0,
        },
        {
            name: "C4 ",
            value: "37",
            width: 229.0,
            height: 324.0,
        },
        {
            name: "C6 ",
            value: "39",
            width: 114.0,
            height: 162.0,
        },
        {
            name: `${langCheck("reportMultiLang", "formatDesign-000141")} C65`,
            value: "900",
            width: 114.0,
            height: 229.0,
        },
        {
            name: "B4 ",
            value: "15",
            width: 250.0,
            height: 353.0,
        },
        {
            name: "B5 ",
            value: "16",
            width: 176.0,
            height: 250.0,
        },
        {
            name: "B6 ",
            value: "17",
            width: 125.0,
            height: 176.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000146"),
            value: "56",
            width: 110.0,
            height: 230.0,
        },
        {
            name: `Monarch ${langCheck(
                "reportMultiLang",
                "formatDesign-000142"
            )}`,
            value: "57",
            width: 98.298,
            height: 190.5,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000147"),
            value: "58",
            width: 92.075,
            height: 165.1,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000148"
            )} Fanfold`,
            value: "902",
            width: 215.9,
            height: 304.8,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000149"
            )} Fanfold`,
            value: "951",
            width: 215.9,
            height: 330.2,
        },
        {
            name: "B4 (ISO)",
            value: "952",
            width: 250.0,
            height: 353.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000150"
            )} (JIS)`,
            value: "48",
            width: 100.0,
            height: 148.0,
        },
        {
            name: `9x11 ${langCheck("reportMultiLang", "formatDesign-000141")}`,
            value: "66",
            width: 228.6,
            height: 279.4,
        },
        {
            name: "10x11",
            value: "903",
            width: 254.0,
            height: 279.4,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000151"),
            value: "905",
            width: 220.0,
            height: 220.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000152"),
            value: "906",
            width: 241.3,
            height: 304.8,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000153"),
            value: "907",
            width: 241.3,
            height: 381.0,
        },
        {
            name: `A4 ${langCheck("reportMultiLang", "formatDesign-000154")}`,
            value: "909",
            width: 235.4,
            height: 322.3,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000155"),
            value: "953",
            width: 215.9,
            height: 279.4,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000156"),
            value: "954",
            width: 210.0,
            height: 297.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000157"),
            value: "910",
            width: 241.3,
            height: 304.8,
        },
        {
            name: "Super A",
            value: "911",
            width: 227.0,
            height: 356.0,
        },
        {
            name: "Super B",
            value: "912",
            width: 305.0,
            height: 487.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000158"),
            value: "913",
            width: 215.9,
            height: 322.3,
        },
        {
            name: `A4 ${langCheck("reportMultiLang", "formatDesign-000159")}`,
            value: "914",
            width: 210.0,
            height: 330.0,
        },
        {
            name: `A5 ${langCheck("reportMultiLang", "formatDesign-000160")}`,
            value: "955",
            width: 148.0,
            height: 210.0,
        },
        {
            name: `B5 (JIS) ${langCheck(
                "reportMultiLang",
                "formatDesign-000160"
            )}`,
            value: "956",
            width: 182.0,
            height: 257.0,
        },
        {
            name: `A3 ${langCheck("reportMultiLang", "formatDesign-000154")}`,
            value: "915",
            width: 322.0,
            height: 445.0,
        },
        {
            name: `A5 ${langCheck("reportMultiLang", "formatDesign-000154")}`,
            value: "916",
            width: 174.0,
            height: 235.0,
        },
        {
            name: `B5 (ISO) ${langCheck(
                "reportMultiLang",
                "formatDesign-000154"
            )}`,
            value: "917",
            width: 201.0,
            height: 276.0,
        },
        {
            name: "A2 ",
            value: "2",
            width: 420.0,
            height: 594.0,
        },
        {
            name: `A3 ${langCheck("reportMultiLang", "formatDesign-000160")}`,
            value: "957",
            width: 297.0,
            height: 420.0,
        },
        {
            name: `A3 ${langCheck("reportMultiLang", "formatDesign-000161")}`,
            value: "918",
            width: 322.0,
            height: 445.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000162"
            )} (JIS)`,
            value: "49",
            width: 148.0,
            height: 200.0,
        },
        {
            name: "A6 ",
            value: "6",
            width: 105.0,
            height: 148.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000163"
            )} Kaku #2`,
            value: "919",
            width: 240.0,
            height: 332.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000163"
            )} Kaku #3`,
            value: "920",
            width: 216.0,
            height: 277.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000163"
            )} Chou #3`,
            value: "921",
            width: 120.0,
            height: 235.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000163"
            )} Chou #4`,
            value: "922",
            width: 90.0,
            height: 205.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000164"),
            value: "959",
            width: 215.9,
            height: 279.4,
        },
        {
            name: `A3 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "960",
            width: 297.0,
            height: 420.0,
        },
        {
            name: `A4 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "961",
            width: 210.0,
            height: 297.0,
        },
        {
            name: `A5 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "962",
            width: 148.0,
            height: 210.0,
        },
        {
            name: `B4 (JIS) ${langCheck(
                "reportMultiLang",
                "formatDesign-000165"
            )}`,
            value: "963",
            width: 257.0,
            height: 364.0,
        },
        {
            name: `B5 (JIS) ${langCheck(
                "reportMultiLang",
                "formatDesign-000165"
            )}`,
            value: "964",
            width: 182.0,
            height: 257.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000166"),
            value: "965",
            width: 100.0,
            height: 148.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000167"),
            value: "966",
            width: 148.0,
            height: 200.0,
        },
        {
            name: `A6 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "967",
            width: 105.0,
            height: 148.0,
        },
        {
            name: "B6 (JIS)",
            value: "28",
            width: 128.0,
            height: 182.0,
        },
        {
            name: `B6 (JIS) ${langCheck(
                "reportMultiLang",
                "formatDesign-000165"
            )}`,
            value: "968",
            width: 128.0,
            height: 182.0,
        },
        {
            name: `${langCheck(
                "reportMultiLang",
                "formatDesign-000163"
            )} You #4"`,
            value: "928",
            width: 105.0,
            height: 235.0,
        },
        {
            name: `PRC 16K`,
            value: "930",
            width: 188.0,
            height: 260.0,
        },
        {
            name: `PRC 32K`,
            value: "931",
            width: 130.0,
            height: 184.0,
        },
        {
            name: `PRC 32K(Big)`,
            value: "932",
            width: 140.0,
            height: 203.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #1`,
            value: "933",
            width: 102.0,
            height: 165.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #2`,
            value: "934",
            width: 102.0,
            height: 176.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #3`,
            value: "969",
            width: 125.0,
            height: 176.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #4`,
            value: "935",
            width: 110.0,
            height: 208.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #5`,
            value: "970",
            width: 110.0,
            height: 208.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #6`,
            value: "936",
            width: 110.0,
            height: 220.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #7`,
            value: "937",
            width: 160.0,
            height: 230.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #8`,
            value: "938",
            width: 120.0,
            height: 309.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #9`,
            value: "971",
            width: 229.0,
            height: 324.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #10`,
            value: "972",
            width: 324.0,
            height: 458.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #3 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "973",
            width: 125.0,
            height: 176.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #5 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "974",
            width: 110.0,
            height: 220.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #9 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "975",
            width: 229.0,
            height: 324.0,
        },
        {
            name: `PRC ${langCheck(
                "reportMultiLang",
                "formatDesign-000141"
            )} #10 ${langCheck("reportMultiLang", "formatDesign-000165")}`,
            value: "976",
            width: 324.0,
            height: 458.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000168"),
            value: "958",
            width: 148.0,
            height: 200.0,
        },
        {
            name: langCheck("reportMultiLang", "formatDesign-000169"),
            value: "999",
            width: 210.0,
            height: 297.0,
        },
    ];

    pageType = pageType.map((item) => {
        return {
            ...item,
            name: (
                <span className="page-type-option">
                    <span>{item.name}</span>
                    <i>
                        {item.value != "999" && item.width + "x" + item.height}
                    </i>
                </span>
            ),
        };
    });

    useEffect(() => {
        if (openSetting) {
            getPlanDetail(reportId, planCode).then((detail) => {
                if (detail) {
                    currentDetail.current = detail;
                    const { printSet } = detail;
                    const {
                        paper: { direction, media, mediadef, paperMargin },
                        ColPriorityPrinted, //打印顺序,先列后行 为true，否则为false
                        isVCenter, //对齐方式：水平 false 否则为true
                        isHCenter, //对齐方式：垂直 true 否则为false
                        scale, // 缩放比例
                        isPageToOne, //行列调整是否都为true；isRowsToOne && isColsToOne
                        isColsToOne, //列调整到单页 是为true
                        isRowsToOne, //行调整到单页 是为true
                        printArea = ["", "", "", ""], //打印区域-->行列依次设置范围   row：1  2  col：2  3
                        m_MainTitleSettings = "", //设置主标题
                        rowHeadRang = ["", ""], //打印标题-->行设置范围
                        colHeadRang = ["", ""], //打印标题-->列设置范围
                    } = printSet;

                    let paperTypeValue = "4";
                    if (media || mediadef) {
                        paperTypeValue = media ? media.value : mediadef.value;
                    }

                    const paperTypeIndex = pageType.findIndex(
                        (page) => page.value == paperTypeValue
                    );
                    const paperSize = pageType[paperTypeIndex];

                    if (mediadef) {
                        paperSize.width = mediadef.x;
                        paperSize.height = mediadef.y;
                    }

                    setDirection(direction);
                    setCurrentPaperTypeIndex(paperTypeIndex);
                    setPaperSize(paperSize);
                    setPaperMargin(paperMargin);
                    setColPriorityPrinted(ColPriorityPrinted);
                    setIsVCenter(isVCenter);
                    setIsHCenter(isHCenter);
                    setScale(scale);
                    setIsColsToOne(isColsToOne);
                    setIsRowsToOne(isRowsToOne);
                    setPrintArea(printArea);
                    setM_MainTitleSettings(m_MainTitleSettings);
                    setRowHeadRang(rowHeadRang);
                    setColHeadRang(colHeadRang);

                    const original = state2Detail({
                        currentPaperTypeIndex: paperTypeIndex,
                        direction,
                        paperMargin,
                        ColPriorityPrinted,
                        isVCenter,
                        isHCenter,
                        scale,
                        isPageToOne,
                        isColsToOne,
                        isRowsToOne,
                        printArea,
                        m_MainTitleSettings,
                        rowHeadRang,
                        colHeadRang,
                        pageType,
                        paperSize,
                    });

                    originalDetail.current = JSON.stringify(original);
                }
            });
        }
    }, [openSetting, planCode, planLists]);

    function checkResult() {
        let content = "";
        function transferStringToNumber(str) {
            return Number(transferCell(str + "0").col);
        }
        if (
            colHeadRang[0] &&
            colHeadRang[1] &&
            transferStringToNumber(colHeadRang[0]) >
                transferStringToNumber(colHeadRang[1])
        ) {
            content =
                langCheck("reportMultiLang", "formatDesign-000936") ||
                "行头信息设置错误，列结束位置小于起始位置";
        } else if (
            rowHeadRang[0] &&
            rowHeadRang[1] &&
            Number(rowHeadRang[0]) > Number(rowHeadRang[1])
        ) {
            content =
                langCheck("reportMultiLang", "formatDesign-000937") ||
                "行头信息设置错误，行结束位置小于起始位置";
        } else if (
            printArea[1] &&
            printArea[3] &&
            transferStringToNumber(printArea[1]) >
                transferStringToNumber(printArea[3])
        ) {
            content =
                langCheck("reportMultiLang", "formatDesign-000934") ||
                "打印区域设置错误，列结束位置小于起始位置";
        } else if (
            printArea[0] &&
            printArea[2] &&
            Number(printArea[0]) > Number(printArea[2])
        ) {
            content =
                langCheck("reportMultiLang", "formatDesign-000935") ||
                "打印区域设置错误，行结束位置小于起始位置";
        }
        content && toast({ content, color: "warning" });
        return !content;
    }

    /**
     *关闭弹窗
     *
     */
    function closeModal() {
        dispatch(changeOpenSetting(false));
    }

    /**
     *点击提交弹窗
     *
     */
    function sureModal() {
        if (!scale) {
            const content = "打印缩放方式缩放比例不能为空";
            toast({ content, color: "warning" });
            return;
        }
        if (props.isClickSearchBtn) return false;
        handlePreview();
        closeModal();
    }

    /**
     * 处理预览逻辑
     */
    function handlePreview() {
        if (!scale) {
            const content = "打印缩放方式缩放比例不能为空";
            toast({ content, color: "warning" });
            return;
        }
        if (props.isClickSearchBtn) return false;
        if (!checkResult()) return false;

        let params = { ...printParams };

        const printSet = state2Detail({
            currentPaperTypeIndex,
            direction,
            paperMargin,
            ColPriorityPrinted,
            isVCenter,
            isHCenter,
            scale,
            isPageToOne: true,
            isColsToOne,
            isRowsToOne,
            printArea,
            m_MainTitleSettings,
            rowHeadRang,
            colHeadRang,
            pageType,
            paperSize,
        });

        const isEdited = originalDetail.current != JSON.stringify(printSet);

        if (isEdited) {
            params.printSet = printSet;
        } else {
            params.printSet = {};
        }

        printAction(reportId, planCode, params, (code) =>
            dispatch(changeDefaultPlanCode(code))
        );
    }

    /**
     * 纸张类型选择
     * @param {*} index
     */
    function PaperTypeChange(index) {
        let selectedItem = pageType[index];
        if (selectedItem) {
            setCurrentPaperTypeIndex(index);
            setPaperSize(selectedItem);
        }
    }

    /**
     * 修改自定义纸张宽高
     * @param {*} type
     * @param {*} val
     * @returns
     */
    function paperSizeChange(type, val) {
        if (val.length < 50 && !/^[(\d+)\.\d]+$/.test(val)) {
            return "";
        }

        if (val.split(".").length > 2) return;

        const size = {};

        if (type === "width") {
            size.width = val;
        }
        if (type === "height") {
            size.height = val;
        }
        setPaperSize({ ...paperSize, ...size });
    }

    /**
     * 纸张打印方向选择
     * @param {*} value
     */
    function paperDirectionChange(value) {
        value === "x" ? setDirection(true) : setDirection(false);
    }

    /**
     * 纸张边距设置
     * @param {*} type
     * @param {*} value
     */
    function paperMarginChange(type, value) {
        const margin = {};
        margin[type] = {
            ...paperMargin[type],
            ...{
                mmLength: Number(value),
                initLength: Number(value),
            },
        };
        setPaperMargin({ ...paperMargin, ...margin });
    }

    /**
     * 打印顺序设置
     * @param {*} value
     */
    function ColPriorityChange(value) {
        value === "y"
            ? setColPriorityPrinted(true)
            : setColPriorityPrinted(false);
    }

    /**
     * 对齐方式设置
     * @param {*} type
     * @param {*} checked
     */
    function alignmentChange(type, checked) {
        type == "V" ? setIsVCenter(checked) : setIsHCenter(checked);
    }

    /**
     * 缩放比例设置
     * @param {*} value
     */
    function scaleChange(value) {
        setScale(value);
    }
    function scaleBlur() {
        if (!scale) {
            const content = "打印缩放方式缩放比例不能为空";
            toast({ content, color: "warning" });
        }
    }
    /**
     * 列、行调整到首页设置
     * @param {*} type
     * @param {*} checked
     */
    function isRowColToOneChange(type, checked) {
        type == "Col" ? setIsColsToOne(checked) : setIsRowsToOne(checked);
    }

    /**
     * 打印区域
     * @param {*} index
     * @param {*} value
     * @returns
     */
    function printAreaChange(index, value) {
        if (index == 0 || index == 2) {
            // 行输入为数字，范围是1-总行数
            // 不符合格式
            //整数
            if (value != "" && !/^\d+$/.test(value)) return;
            // value = Number(value);
        } else {
            // 列输入为英文字母，范围是A-总列数
            // value = value.toUpperCase();
            // 不符合格式
            //单个字母 小写直接转换为大写
            if (value != '' && !/^[A-Z]+$/.test(value)) return;
        }
        printArea[index] = value;
        setPrintArea([...printArea]);
    }

    /**
     * 设置主标题单元
     * @param {*} val
     * @returns
     */
    function mainTitleSetting(val) {
        //设置的是表格的单元格
        //A6
        //AC12
        if (val) {
            //val = val.toUpperCase();
            if (!/^[A-Z\d]+$/.test(val)) return;
            setColHeadRang(["", ""]);
        }
        //若设置了主标题 则将列标题清空
        setM_MainTitleSettings(val);
    }

    /**
     * 对主题单元进行校验
     * @param {*} val
     */
    function mainTitleSettingOnBlur(val) {
        if (val) {
            if (val.length < 50 && !/^[A-Z]+[\d]+$/.test(val)) {
                const content = '主题单元格式错误，请重新输入，如"A1"';
                toast({ content, color: "warning" });
                setM_MainTitleSettings("");
            }
        }
    }

    /**
     * 行打印标题设置
     * @param {*} index
     * @param {*} value
     * @returns
     */
    function rowHeadRangChange(index, value) {
        // 行输入为数字，范围是1-总行数
        if (value != "" && !/^\d+$/.test(value)) return;
        rowHeadRang[index] = value;

        setRowHeadRang([...rowHeadRang]);
    }

    /**
     * 列打印标题设置
     * @param {*} index
     * @param {*} value
     * @returns
     */
    function colHeadRangChange(index, value) {
        //若存在主标题，列标题不运行设置
        if (m_MainTitleSettings) return;
        // value = value.toUpperCase();
        // // 列输入为大写字母 A-总列数
        if (value != '' && !/^[A-Z]+$/.test(value)) return;
        colHeadRang[index] = value;

        setColHeadRang([...colHeadRang]);
    }

    /**
     * 处理保存方案逻辑
     */
    function handleSavePlan(args) {
        if (!checkResult()) return false;

        let others = {};
        if (args) {
            others = { ...args };
        } else {
            // 按钮禁用状态时 不执行保存逻辑
            if (planCode == "defaultCode") return false;
            others = JSON.parse(JSON.stringify(currentDetail.current));
            delete others.printSet;
        }

        const newPrintSet = state2Detail({
            currentPaperTypeIndex,
            direction,
            paperMargin,
            ColPriorityPrinted,
            isVCenter,
            isHCenter,
            scale,
            isPageToOne: true,
            isColsToOne,
            isRowsToOne,
            printArea,
            m_MainTitleSettings,
            rowHeadRang,
            colHeadRang,
            pageType,
            paperSize,
        });
        const params = {
            ...others,
            printSet: newPrintSet,
        };
        return savePlan(reportId, params).then(() => {
            toast({ content: "保存成功", color: "success" });
            return true;
        });
    }

    /**
     * 处理另存为
     * @param {*} printName
     */
    async function handleSaveAsNew(printName) {
        const printCode = Date.now().toString();
        const isSuccess = await handleSavePlan({ printCode, ...printName });

        if (isSuccess) {
            updatePlanLists("add", printCode, planCode);
        }
    }

    async function handleRename(printName) {
        const isSuccess = await editPlan(reportId, planCode, printName);
        if (isSuccess) {
            updatePlanLists("edit", planCode, planCode);
        }
    }

    /**
     * 处理删除方案
     * @param {*} printCode
     */
    function handleDeletePlan(printCode) {
        promptBox({
            color: "warning",
            title: "删除",
            content: "确定要删除吗？",
            beSureBtnClick: async () => {
                const isSuccess = await deletePlan(reportId, printCode);
                if (isSuccess) {
                    updatePlanLists("delete", printCode, planCode);
                }
            },
        });
    }

    /**
     * 更新方案列表，并且更新选中逻辑
     * @param {*} type
     * @param {*} printCode
     */
    async function updatePlanLists(type, printCode, planCode) {
        const { schemeinfo } = await getPlans(reportId);
        let selectedCode = printCode;
        dispatch(changePlanLists(schemeinfo));
        if (type == "delete") {
            const exist = !!schemeinfo.find((p) => p.printCode == planCode);
            selectedCode = planCode;
            if (!exist) selectedCode = "defaultCode";
        }
        dispatch(changePlanCode(selectedCode));
    }

    function handleTooltip(plans, index, e) {
        if (e.target.scrollWidth > e.target.clientWidth) {
            setVisibleToolTip(true);
            setEnterIndex(index);
        }
    }

    function handleTooltipLeave() {
        setVisibleToolTip(false);
    }
    /**
     * 生成左侧方案列表
     * @returns
     */
    function generatorPlanArea() {
        if (planLists.length == 0) return null;

        const plans = planLists.map((plan, index) => {
            const { printCode, ...others } = plan;
            let iconBox = null;
            if (printCode != "defaultCode") {
                iconBox = (
                    <span className="icon-box">
                        <i
                            className="icon iconfont icon-bianji edit-icon"
                            onClick={() => {
                                renameInstance.current.open(others, index);
                            }}
                        />
                        <i
                            className="icon iconfont icon-shanchu delete-icon"
                            onClick={() => {
                                handleDeletePlan(printCode);
                            }}
                        />
                    </span>
                );
            }
            return (
                <NCTooltip
                    placement="top"
                    inverse
                    overlay={getLang(langseq, plan)}
                    className="model-helper-overlay"
                    visible={enterIndex == index && visibleToolTip}
                >
                    <div
                        onMouseOver={(e) => handleTooltip(plans, index, e)}
                        onMouseLeave={() => handleTooltipLeave()}
                        className={`item ${
                            planCode == printCode ? "active" : ""
                        } nc-theme-xrow-bgc`}
                        plan-code={printCode}
                        onClick={() => {
                            dispatch(changePlanCode(printCode));
                        }}
                    >
                        <span className="title">{getLang(langseq, plan)}</span>
                        {iconBox}
                    </div>
                </NCTooltip>
            );
        });

        return plans;
    }

    const optimize_generatorPlanArea = useMemo(generatorPlanArea, [
        planLists,
        planCode,
        langseq,
        visibleToolTip,
    ]);

    function genratorPaperItem() {
        return pageType.length - 1 == currentPaperTypeIndex ? (
            <div>
                <label className="nc-theme-title-font-c">
                    {/* 宽度 */}
                    {langCheck("reportMultiLang", "formatDesign-000180")}
                </label>
                <span className="control">
                    <NCFormControl
                        value={paperSize.width}
                        disabled={
                            currentPaperTypeIndex &&
                            pageType[currentPaperTypeIndex].value == "999"
                                ? false
                                : true
                        }
                        onChange={(val) => {
                            paperSizeChange("width", val);
                        }}
                        className="print-form-wrapper"
                    />
                </span>
                <label className="height nc-theme-title-font-c">
                    {langCheck("reportMultiLang", "formatDesign-000181")}
                </label>
                <span className="control">
                    <NCFormControl
                        value={paperSize.height}
                        disabled={
                            currentPaperTypeIndex &&
                            pageType[currentPaperTypeIndex].value == "999"
                                ? false
                                : true
                        }
                        onChange={(val) => {
                            paperSizeChange("height", val);
                        }}
                    />
                </span>
            </div>
        ) : (
            <div className="paper-item-placeholder" />
        );
    }

    /**
     * 弹窗内容
     */
    function generatorModalBody() {
        const { top = {}, left = {}, right = {}, bottom = {} } = paperMargin;

        return (
            <div className="plugin-print-setting-wrapper nc-theme-title-font-c">
                <div className="plan-area nc-theme-area-split-bc">
                    <header className="nc-theme-title-font-c nc-theme-pop-header-bgc nc-theme-area-split-bc common-setting-header print-setting-header">
                        {langCheck("reportMultiLang", "formatDesign-000221")}
                    </header>
                    <div className="plan-container">
                        {optimize_generatorPlanArea}
                    </div>
                </div>
                <div className="plugin-print-setting">
                    <div className="plugin-print-setting-content">
                        <div className="common-print-setting print-setting">
                            <header className="nc-theme-title-font-c nc-theme-pop-header-bgc nc-theme-area-split-bc common-setting-header print-setting-header">
                                {langCheck(
                                    "reportMultiLang",
                                    "formatDesign-000177"
                                )}
                            </header>
                            <div className="common-setting-content print-setting-content">
                                <section className="common-setting-item setting-item">
                                    {/* 纸张选择 */}
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 纸张（毫米） */}
                                        {`${langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000178"
                                        )}(${langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000179"
                                        )})`}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="item page-type-setting">
                                            {/* 纸张大小类型选择 */}
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000222"
                                                )}
                                            </label>
                                            <span className="control">
                                                <NCSelect
                                                    value={
                                                        currentPaperTypeIndex
                                                    }
                                                    onChange={PaperTypeChange}
                                                    className="print-choose-paper-select"
                                                >
                                                    {pageType.map(
                                                        (item, index) => (
                                                            <NCOption
                                                                key={index}
                                                                value={index}
                                                                title={
                                                                    item.name
                                                                }
                                                            >
                                                                {item.name}
                                                            </NCOption>
                                                        )
                                                    )}
                                                </NCSelect>
                                            </span>
                                        </div>
                                        <div className="item page-size-setting">
                                            {/* 自定义纸张宽高 */}
                                            {genratorPaperItem()}
                                        </div>
                                        {/* 方向 */}
                                        <div className="item page-direction-setting">
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000182"
                                                )}
                                            </label>
                                            <span className="control">
                                                <NCRadioGroup
                                                    value={
                                                        direction ? "x" : "y"
                                                    }
                                                    onChange={
                                                        paperDirectionChange
                                                    }
                                                    className="print-radio-group"
                                                >
                                                    <NCRadio
                                                        className={
                                                            direction
                                                                ? "is-checked"
                                                                : "direction-item"
                                                        }
                                                        value="x"
                                                    >
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000183"
                                                        )}
                                                    </NCRadio>
                                                    <NCRadio
                                                        className={
                                                            direction
                                                                ? "direction-item"
                                                                : "is-checked"
                                                        }
                                                        value="y"
                                                    >
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000160"
                                                        )}
                                                    </NCRadio>
                                                </NCRadioGroup>
                                            </span>
                                        </div>
                                    </div>
                                </section>
                                <section className="common-setting-item setting-item">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 页边距毫米 */}
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000223"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="item edge">
                                            <div className="top page-margin page-margin-top">
                                                <div className="top-margin page-margin-item">
                                                    <label className="nc-theme-title-font-c">
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000185"
                                                        )}
                                                    </label>
                                                    <NCInputNumber
                                                        className="page-margin-input"
                                                        iconStyle="one"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        onChange={(value) => {
                                                            paperMarginChange(
                                                                "top",
                                                                value
                                                            );
                                                        }}
                                                        value={top.mmLength}
                                                    />
                                                </div>
                                            </div>
                                            <div className="center page-margin">
                                                <div className="left-margin page-margin-item">
                                                    <label className="nc-theme-title-font-c">
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000120"
                                                        )}
                                                    </label>
                                                    <NCInputNumber
                                                        className="page-margin-input"
                                                        iconStyle="one"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        onChange={(value) => {
                                                            paperMarginChange(
                                                                "left",
                                                                value
                                                            );
                                                        }}
                                                        value={left.mmLength}
                                                    />
                                                </div>
                                                <div className="right-margin page-margin-item">
                                                    <label className="nc-theme-title-font-c">
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000122"
                                                        )}
                                                    </label>
                                                    <NCInputNumber
                                                        className="page-margin-input"
                                                        iconStyle="one"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        onChange={(value) => {
                                                            paperMarginChange(
                                                                "right",
                                                                value
                                                            );
                                                        }}
                                                        value={right.mmLength}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bottom page-margin page-margin-bottom">
                                                <div className="bottom-margin page-margin-item">
                                                    <label className="nc-theme-title-font-c">
                                                        {langCheck(
                                                            "reportMultiLang",
                                                            "formatDesign-000186"
                                                        )}
                                                    </label>
                                                    <NCInputNumber
                                                        className="page-margin-input"
                                                        iconStyle="one"
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        onChange={(value) => {
                                                            paperMarginChange(
                                                                "bottom",
                                                                value
                                                            );
                                                        }}
                                                        value={bottom.mmLength}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className="common-setting-item setting-item">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 打印顺序 */}
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000187"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper single">
                                        <NCRadioGroup
                                            value={
                                                ColPriorityPrinted ? "y" : "x"
                                            }
                                            onChange={ColPriorityChange}
                                            className="print-radio-group"
                                        >
                                            <NCRadio
                                                className={
                                                    ColPriorityPrinted
                                                        ? "is-checked"
                                                        : "direction-item"
                                                }
                                                value="y"
                                            >
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000188"
                                                )}
                                            </NCRadio>
                                            <NCRadio
                                                className={
                                                    ColPriorityPrinted
                                                        ? "direction-item"
                                                        : "is-checked"
                                                }
                                                value="x"
                                            >
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000189"
                                                )}
                                            </NCRadio>
                                        </NCRadioGroup>
                                    </div>
                                </section>
                                <section className="common-setting-item setting-item">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 对齐方式 */}
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000190"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="page-print-setting-type item-wrapper single">
                                        <NCCheckbox
                                            checked={isVCenter}
                                            onChange={(checked) => {
                                                alignmentChange("V", checked);
                                            }}
                                            className="print-checkbox"
                                        >
                                            {langCheck(
                                                "reportMultiLang",
                                                "formatDesign-000191"
                                            )}
                                        </NCCheckbox>
                                        <NCCheckbox
                                            checked={isHCenter}
                                            onChange={(checked) => {
                                                alignmentChange("H", checked);
                                            }}
                                            className="print-checkbox"
                                        >
                                            {langCheck(
                                                "reportMultiLang",
                                                "formatDesign-000192"
                                            )}
                                        </NCCheckbox>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="page-print-setting print-setting">
                            <header className="nc-theme-title-font-c nc-theme-pop-header-bgc nc-theme-area-split-bc page-setting-header print-setting-header">
                                {langCheck(
                                    "reportMultiLang",
                                    "formatDesign-000193"
                                )}
                            </header>
                            <div className="page-setting-content print-setting-content">
                                <section className="page-setting-item setting-item">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 打印缩放方式 */}
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000194"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="scale item">
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000195"
                                                )}
                                            </label>
                                            <NCNumber
                                                value={scale}
                                                min={0.3}
                                                max={3}
                                                scale={1}
                                                onChange={scaleChange}
                                                onBlur={scaleBlur}
                                                noDataFormat={true}
                                            />
                                            <span className="scale-range">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000196"
                                                )}
                                                {"(0.3~3)"}
                                            </span>
                                        </div>
                                        <div className="row-col-set">
                                            <div className="col-set item">
                                                <NCCheckbox
                                                    checked={isColsToOne}
                                                    onChange={(checked) => {
                                                        isRowColToOneChange(
                                                            "Col",
                                                            checked
                                                        );
                                                    }}
                                                    className="print-checkbox"
                                                >
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000197"
                                                    )}
                                                </NCCheckbox>
                                            </div>
                                            <div className="row-set item">
                                                <NCCheckbox
                                                    checked={isRowsToOne}
                                                    onChange={(checked) => {
                                                        isRowColToOneChange(
                                                            "Row",
                                                            checked
                                                        );
                                                    }}
                                                    className="print-checkbox"
                                                >
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000198"
                                                    )}
                                                </NCCheckbox>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className="page-setting-item setting-item print-area-setting">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000199"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="row-sel item">
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000233"
                                                )}
                                            </label>
                                            <span className="control">
                                                <span className="area-start">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000200"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={printArea[0] || ""}
                                                    onChange={(value) => {
                                                        printAreaChange(
                                                            0,
                                                            value
                                                        );
                                                    }}
                                                />
                                                <span className="area-end">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000201"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={printArea[2] || ""}
                                                    onChange={(value) => {
                                                        printAreaChange(
                                                            2,
                                                            value
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                        <div className="col-sel item">
                                            <label  className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000234"
                                                )}
                                            </label>
                                            <span className="control">
                                                <span className="area-start">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000200"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={printArea[1] || ""}
                                                    onChange={(value) => {
                                                        printAreaChange(
                                                            1,
                                                            value
                                                        );
                                                    }}
                                                />
                                                <span className="area-end">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000201"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={printArea[3] || ""}
                                                    onChange={(value) => {
                                                        printAreaChange(
                                                            3,
                                                            value
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </section>
                                <section className="page-setting-item setting-item print-title-setting">
                                    <div className="title nc-theme-title-font-c">
                                        <i className="point"></i>
                                        {/* 打印标题 */}
                                        {langCheck(
                                            "reportMultiLang",
                                            "formatDesign-000202"
                                        )}
                                        <span className="line-wrap">
                                            <span className="line"></span>
                                        </span>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="unit-sel item">
                                            <label  className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000224"
                                                )}
                                            </label>
                                            {/*w*/}
                                            <span className="control main-area-sel">
                                                <NCFormControl
                                                    className="area-main-input print-form-wrapper"
                                                    placeholder={
                                                        "示例" + '"A1"'
                                                    }
                                                    value={m_MainTitleSettings}
                                                    onChange={mainTitleSetting}
                                                    onBlur={
                                                        mainTitleSettingOnBlur
                                                    }
                                                />
                                            </span>
                                        </div>
                                        <div className="row-sel item">
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000233"
                                                )}
                                            </label>
                                            <span className="control">
                                                <span className="area-start">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000200"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={rowHeadRang[0] || ""}
                                                    onChange={(value) => {
                                                        rowHeadRangChange(
                                                            0,
                                                            value
                                                        );
                                                    }}
                                                />
                                                <span className="area-end">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000201"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={rowHeadRang[1] || ""}
                                                    onChange={(value) => {
                                                        rowHeadRangChange(
                                                            1,
                                                            value
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                        <div className="col-sel item">
                                            <label className="nc-theme-title-font-c">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "formatDesign-000234"
                                                )}
                                            </label>
                                            <span className="control">
                                                <span className="area-start">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000200"
                                                    )}
                                                </span>

                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={colHeadRang[0] || ""}
                                                    onChange={(value) => {
                                                        colHeadRangChange(
                                                            0,
                                                            value
                                                        );
                                                    }}
                                                />

                                                <span className="area-end">
                                                    {langCheck(
                                                        "reportMultiLang",
                                                        "formatDesign-000201"
                                                    )}
                                                </span>
                                                <NCFormControl
                                                    className="area-input print-form-wrapper"
                                                    value={colHeadRang[1] || ""}
                                                    onChange={(value) => {
                                                        colHeadRangChange(
                                                            1,
                                                            value
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function generatorSaveButton() {
        return planCode == "defaultCode" ? (
            <NCTooltip
                placement="top"
                inverse
                overlay={langCheck("reportMultiLang", "formatDesign-000229")}
                trigger={["focus", "hover"]}
                className="model-helper-overlay"
            >
                <NCButton
                    fieldid=""
                    colors=""
                    className="print-setting-button"
                    disabled={true}
                    onClick={() => {
                        handleSavePlan();
                    }}
                >
                    {langCheck("reportMultiLang", "formatDesign-000225")}
                </NCButton>
            </NCTooltip>
        ) : (
            <NCButton
                fieldid=""
                colors=""
                className="print-setting-button"
                onClick={() => {
                    handleSavePlan();
                }}
            >
                {langCheck("reportMultiLang", "formatDesign-000225")}
            </NCButton>
        );
    }
    return (
        <div>
            <NCModal
                fieldid=""
                show={openSetting}
                className="report-plugin-print-setting"
                width={1100}
                height={600}
                minWidth={680}
                // size="lg"
                onHide={closeModal}
            >
                <NCHotKeys
                    keyMap={{
                        cancelBtn: ["Alt+N"],
                    }}
                    handlers={{
                        cancelBtn: () => {
                            closeModal();
                        },
                    }}
                    focused={true}
                    attach={document.body}
                />
                <NCModal.Header closeButton className="print-modal-header">
                    <NCModal.Title fieldid="">
                        {langCheck("reportMultiLang", "formatDesign-000226")}
                    </NCModal.Title>
                    {/* 国际化处理： 打印*/}
                </NCModal.Header>
                <NCModal.Body className="print-modal-body">
                    {generatorModalBody()}
                </NCModal.Body>
                <NCModal.Footer className="print-modal-footer">
                    {/* 保存方案 */}
                    {generatorSaveButton()}
                    <NCButton
                        fieldid=""
                        colors=""
                        className="print-setting-button"
                        onClick={() => {
                            if (!checkResult()) return false;
                            saveInstance.current.open();
                        }}
                    >
                        {/* 另存新方案 */}
                        {langCheck("reportMultiLang", "formatDesign-000227")}
                    </NCButton>
                    {!!props.isClickSearchBtn ? (
                        <React.Fragment>
                            <NCTooltip
                                placement="top"
                                trigger={["focus", "hover"]}
                                inverse
                                overlay={langCheck(
                                    "reportMultiLang",
                                    "formatDesign-000939"
                                )}
                            >
                                <NCButton
                                    fieldid=""
                                    className="cancel-button"
                                    disabled={true}
                                    onClick={handlePreview}
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "formatDesign-000123"
                                    )}
                                </NCButton>
                            </NCTooltip>
                            <NCTooltip
                                placement="top"
                                trigger={["focus", "hover"]}
                                inverse
                                overlay={langCheck(
                                    "reportMultiLang",
                                    "formatDesign-000938"
                                )}
                            >
                                <NCButton
                                    fieldid=""
                                    colors="primary"
                                    className="sure-button"
                                    disabled={true}
                                    onClick={sureModal}
                                >
                                    {/* 打印 */}
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000038"
                                    )}
                                </NCButton>
                            </NCTooltip>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <NCButton
                                fieldid=""
                                className="cancel-button"
                                onClick={handlePreview}
                            >
                                {langCheck(
                                    "reportMultiLang",
                                    "formatDesign-000123"
                                )}
                            </NCButton>
                            <NCButton
                                fieldid=""
                                colors="primary"
                                className="sure-button"
                                onClick={sureModal}
                            >
                                {/* 打印 */}
                                {langCheck("reportMultiLang", "100301-000038")}
                            </NCButton>
                        </React.Fragment>
                    )}
                    <NCTooltip
                        placement="top"
                        inverse
                        overlay="取消(Alt+N)"
                        trigger={["hover", "focus"]}
                        className="model-helper-overlay"
                    >
                        <NCButton
                            fieldid=""
                            className="cancel-button"
                            onClick={closeModal}
                        >
                            {/* 取消 */}
                            {langCheck("reportMultiLang", "100301-000048")}(
                            <span className="underline">N</span>)
                        </NCButton>
                    </NCTooltip>
                </NCModal.Footer>
            </NCModal>
            {/* 另存新方案弹框 */}
            <CodeAndName
                ref={saveInstance}
                title={langCheck("reportMultiLang", "formatDesign-000227")}
                key="save"
                planLists={planLists}
                langinfo={langinfo}
                langseq={langseq}
                submit={handleSaveAsNew}
            />
            {/* 重命名弹框 */}
            <CodeAndName
                ref={renameInstance}
                title={langCheck("reportMultiLang", "formatDesign-000228")}
                key="rename"
                planLists={planLists}
                langinfo={langinfo}
                langseq={langseq}
                submit={handleRename}
            />
        </div>
    );
}

export default PrintSetting;
