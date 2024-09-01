import { ajax } from "nc-lightapp-front";
import Utils from "@public/utils";
const { langCheck } = Utils;
const now = new Date();
now.setTime(now.getTime());

//找出有效文字
export function isValid(s) {
    let obj = {},
        start = "",
        end = "";
    let len = s.length;
    for (let i = 0; i < len; i++) {
        let letter = s[i];
        if (letter === "[") start = i;
        if (letter === "]") end = i;
        if (end && end > start) obj[start] = end;
    }
    return obj;
}

//根据instance_type值获取显示值跟真实值
export function getInstanceText(instance_type) {
    let text = "";
    if (instance_type) {
        const list = createInstance();
        instance_type = instance_type.split(",");
        instance_type.forEach((item) => {
            list.forEach((ele) => {
                if (item === ele.value) text += `[${ele.display}]`;
            });
        });
    }
    return text;
}

//根据显示值 获取命名示例跟真实值
export function getExampleText(modalText) {
    const text = modalText;
    const data = createInstance();
    let obj = isValid(text);
    let arr = [],
        ret = {
            text: "",
            real: "",
        };
    for (let key in obj) {
        let str = text.slice(Number(key) + 1, obj[key]);
        arr.push(str);
    }

    const MSGVARS = createVars();

    arr.forEach((item) => {
        data.forEach((ele) => {
            if (item === ele.display) {
                ret.text += `${MSGVARS[ele.value]},`;
                ret.real += `${ele.value},`;
            }
        });
    });

    return ret;
}

export function createVars() {
    return {
        0: `${langCheck("reportTimeMultiLang", "100303-000012")}${
            now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
        }` /* 国际化处理： 系统日期*/,
        1: `${now.getFullYear()}${langCheck(
            "reportTimeMultiLang",
            "100303-000016"
        )}` /* 国际化处理： 年*/,
        2: `${now.getMonth() + 1}${langCheck(
            "reportTimeMultiLang",
            "100303-000015"
        )}` /* 国际化处理： 月*/,
        3: `${now.getDate()}${langCheck(
            "reportTimeMultiLang",
            "100303-000014"
        )}` /* 国际化处理： 日*/,
        4: `${langCheck("reportTimeMultiLang", "100303-000017")}${
            now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
        }` /* 国际化处理： 时间*/,
        5: langCheck(
            "reportTimeMultiLang",
            "100303-000047"
        ) /* 国际化处理： 示例报表名称*/,
        6: langCheck(
            "reportTimeMultiLang",
            "100303-000048"
        ) /* 国际化处理： 示例菜单名称*/,
        7: langCheck(
            "reportTimeMultiLang",
            "100303-000049"
        ) /* 国际化处理： 示例接收人*/,
    };
}

export function createInstance() {
    return [
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000013"
            ) /* 国际化处理： 菜单名称*/,
            value: "6",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000018"
            ) /* 国际化处理： 报表名称*/,
            value: "5",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000017"
            ) /* 国际化处理： 时间*/,
            value: "4",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000016"
            ) /* 国际化处理： 年*/,
            value: "1",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000015"
            ) /* 国际化处理： 月*/,
            value: "2",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000014"
            ) /* 国际化处理： 日*/,
            value: "3",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000004"
            ) /* 国际化处理： 接收人*/,
            value: "7",
        },
        {
            display: langCheck(
                "reportTimeMultiLang",
                "100303-000080"
            ) /* 国际化处理： 系统日期*/,
            value: "0",
        },
    ];
}

export function getCurrentTime() {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/uapbd/ref/TimezoneDefaultGridRef.do",
            data: {
                pageInfo: {
                    pageSize: 100,
                    pageIndex: 0,
                },
                queryCondition: {
                    isShowUnit: false,
                    refpath: "uapbd/refer/pubinfo/TimezoneDefaultGridRef/index",
                },
            },
            success: (res) => {
                const { rows = [] } = res.data;
                const code = getTimeCode();
                const target = rows.find((item) => item.refcode === code);
                resolve(target);
            },
        });
    });
}

function getTimeCode() {
    const str = new Date().toString();
    const time = str.split("GMT")[1].slice(0, 5);
    if (time[0] === "+") {
        return time.replace("+", "P");
    }
    return time.replace("-", "M");
}
