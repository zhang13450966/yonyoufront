import Utils from "@public/utils";
const { getGlobalStorage, langCheck } = Utils;
import {
    getKeys,
    createRegButton,
    getRegButtonDisplay,
    fillChild,
    setSearchValueByDrill,
} from "./methods";
import { DATE_VIEW_REFER_CONFIG } from "@public/dataViewModal/constants";
import { SEARCHID, USABLE_BUTTONS } from "../config";

export default function (props) {
    let _this = this;
    const { createUIDom, isSearchFromDesign } = props;
    if (isSearchFromDesign) {
        const { templetid, appcode, pagecode } = isSearchFromDesign;
        const reqDataQuerypage = {
            rqUrl: "/platform/templet/querypage.do",
            rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\",\n  \"templetid\": \"${templetid}\"\n}`,
            rqCode: "template",
        };
        const reqDataQueryallbtns = {
            rqUrl: "/platform/appregister/queryallbtns.do",
            rqJson: `{\n  \"pagecode\": \"${pagecode}\",\n  \"appcode\": \"${appcode}\",\n  \"templetid\": \"${templetid}\"\n}`,
            rqCode: "button",
        };
        createUIDom(
            {
                reqDataQuerypage,
                reqDataQueryallbtns,
            },
            (templedata) => {
                disposeSearch.call(_this, templedata, props);
            },
            false
        );
    } else {
        const { appcode, pageCode } = this.commonParams;
        createUIDom(
            {
                appcode,
                pagecode: pageCode,
            },
            (templedata) => {
                disposeSearch.call(_this, templedata, props);
            }
        );
    }
}

function modifierMeta(props, meta) {
    const row = props.getUrlParam("row");
    //联查时候去掉模板中的默认值
    if (row && meta[SEARCHID]) {
        meta[SEARCHID].items.forEach((ele) => {
            delete ele.initialvalue;
        });
    }
    // 修改列渲染样式
    return meta;
}

export async function disposeSearch(templedata, props) {
    let meta = templedata.template || templedata.data;
    let regButtons = handleLanguage(templedata.button);
    const { appcode, pk_report } = this.commonParams;
    const {
        ownReportParams = {},
        button,
        disposeSearch,
        setDefaultVal,
        search,
    } = this.props;

    if (!regButtons || !regButtons.length) {
        //判断是否有权限显示打印分享按钮，如果有权限，要加上默认的按钮
        const isShowRegButton = await getRegButtonDisplay();
        if (!isShowRegButton) {
            regButtons = getButtons();
        }
    }

    if (regButtons) {
        //处理注册的按钮
        const cur = regButtons.find((btn) => btn.key == "print");

        let printMenuArray = [];
        if (this.initParams.printmenu.length) {
            printMenuArray = fillChild(this.initParams.printmenu);
        }

        if (cur) {
            cur.children[0].children = [
                // {
                //     id: "1001Z01000000001A28",
                //     type: "general_btn",
                //     key: "print_plugin",
                //     title: langCheck("reportMultiLang", "100301-0002721"),
                //     area: "button_area",
                //     iskeyfunc: false,
                //     btncolor: "button_secondary",
                //     isenable: true,
                //     order: "8",
                //     parentCode: "print_drop_down",
                //     children: [],
                //     className: "print_plugin",
                // },
                ...cur.children[0].children,
                {
                    id: "1001Z01000000001A27",
                    type: "general_btn",
                    key: "print_setting",
                    title: langCheck("reportMultiLang", "formatDesign-000226"),
                    area: "button_area",
                    iskeyfunc: false,
                    btncolor: "button_secondary",
                    isenable: true,
                    order: "8",
                    parentCode: "print_drop_down",
                    children: [],
                    className: "print_setting",
                },
                ...printMenuArray,
            ];
        }

        this.regButton = regButtons;
        const ret = createRegButton.call(this, regButtons);

        button.setButtons(ret);

        let obj = {},
            array = [];

        ret.forEach((item) => (obj[item.key] = []));
        this.regKeys = getKeys(ret, obj);

        Object.keys(this.regKeys).forEach(
            (item) => (array = array.concat(this.regKeys[item]))
        );
        this.oldButtonKeys = array.filter(
            (item) => !USABLE_BUTTONS.includes(item)
        ); //记录下，在查询时候直接用

        if (this.initParams.noDropdownPrint) {
            button.setButtonDisabled(this.oldButtonKeys, true);
        }
    }

    let sessionFlag =
        getGlobalStorage("localStorage", "LinkReport") ||
        getGlobalStorage("sessionStorage", "LinkReport");
    if (meta) {
        //一些操作
        meta = modifierMeta(this.props, meta);

        //根据模板参数进行模板修改
        meta = checkFilterConditon(this)(meta);

        if (disposeSearch) {
            //领域对查询模板进行修改
            meta = disposeSearch(meta, this.props);
        }
        if (props.showDataViewTemplate && meta.light_report.items.length > 0) {
            meta.light_report.items.push({
                ...DATE_VIEW_REFER_CONFIG,
                appcode,
                pk_report,
                label: langCheck("reportMultiLang", "dataView-100301-000243"),
                placeholder: langCheck(
                    "reportMultiLang",
                    "dataView-100301-000243"
                ),
                initialvalue: props.initialvalue,
            });
        }

        this.props.meta.setMeta(meta, () => {
            this.META_SET_ON_SEARCH = "1";
            if (setDefaultVal) {
                if (sessionFlag) {
                    //单据联查报表是否走自己的设默认值
                    setDefaultVal(SEARCHID, this.props, true, templedata);
                } else {
                    setDefaultVal(SEARCHID, this.props, false, templedata);
                }
            }
            if (this.onlySearchArea) {
                if (this.subscribeMetaData) {
                    search.setSearchSnap(
                        "light_report",
                        this.subscribeMetaData
                    );
                }
                search.openAdvSearch(SEARCHID, true);
            }

            const { drillConditions = [] } = this.initParams;
            if (
                !ownReportParams.notSetSearchOnInitDrill &&
                drillConditions.length
            ) {
                this.META_SET_ON_SEARCH = "2";
                //联查赋默认值
                setSearchValueByDrill({ drillConditions, search });
            }
        });

        this.commonParams = {
            ...this.commonParams,
            oid: meta[SEARCHID].oid || "",
            queryAreaCode: meta[SEARCHID].code || "",
        };
    }

    if (sessionFlag) {
        // const values = createCondition(sessionFlag);
        // if (values.length) {
        //     this.props.search.setSearchValue(SEARCHID, values);
        // }
        this.getData();
    }
}

function createCondition(data) {
    let result = [];
    const { conditions } = JSON.parse(data);
    conditions.forEach((item) => {
        result.push({
            field: item.field,
            oprtype: item.oprtype,
            value: item.value,
            display: item.display,
        });
    });
    return result;
}

const checkFilterConditon = (app) => (meta) => {
    let conditions = meta[SEARCHID].items;
    conditions.forEach((item) => {
        if (item.itemtype === "refer") {
            item.queryCondition = () => {
                return { isDataPowerEnable: true };
            };
        }
        if (item.orgrights || item.refcondition) {
            item.queryCondition = () => {
                let other = {};
                if (item.refcondition) {
                    const refcondition = JSON.parse(item.refcondition);
                    refcondition.forEach((item) => {
                        setRefCondition(app)(item, other);
                    });
                }
                return {
                    AppCode: app.commonParams.appcode, //appcode获取
                    TreeRefActionExt: DEFINES[item.orgrights],
                    GridRefActionExt: DEFINES[item.orgrights],
                    isDataPowerEnable: true,
                    ...other,
                };
            };
        }
    });
    return meta; // 处理后的过滤参照返回给查询区模板
};

//吸值
const setRefCondition = (app) => (item, obj) => {
    const { type, value, key } = item;
    const { props } = app;
    switch (type) {
        case "item":
            let data = props.search.getSearchValByField(SEARCHID, value); // 获取前面选中参照的值
            data = (data && data.value && data.value.firstvalue) || ""; // 获取value
            obj[key] = data;
            break;
        case "constant":
            obj[key] = value;
            break;

        default:
            break;
    }
};

//为了兼容领域多语，把他们的改成统一的显示值
function handleLanguage(data = []) {
    const langMap = {
        status: langCheck("reportMultiLang", "100301-000280"),
        history: langCheck("reportMultiLang", "100301-000122"),
    };
    for (let i = 0; i < data.length; i++) {
        const { key, children = [] } = data[i];
        if (key === "share") {
            const buttons = (children[0] && children[0].children) || [];
            buttons.forEach((item) => {
                if (langMap[item.key]) {
                    item.title = langMap[item.key];
                }
            });
            break;
        }
    }
    return data;
}

const DEFINES = {
    PermOrg: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder",
    PermOrgWithGroup:
        "nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder",
    PermOrgWithGLobal:
        "nccloud.web.refer.sqlbuilder.PrimaryOrgWithGlobalSqlBuilder",
};

function getButtons() {
    return [
        {
            id: "1001Z01000000001A26Y",
            type: "divider",
            key: "print",
            title: langCheck("reportMultiLang", "100301-000038"),
            area: "button_area",
            iskeyfunc: false,
            keyboard: "Ctrl + P",
            btncolor: "button_secondary",
            isenable: true,
            order: "0",
            children: [
                {
                    id: "1001Z01000000001A26Z",
                    type: "general_btn",
                    key: "print_drop_down",
                    area: "button_area",
                    iskeyfunc: false,
                    btncolor: "button_secondary",
                    isenable: true,
                    order: "1",
                    parentCode: "print",
                    children: [
                        {
                            id: "1001Z01000000001A271",
                            type: "general_btn",
                            key: "xlsx",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000025"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "3",
                            parentCode: "print_drop_down",
                            children: [],
                        },
                        {
                            id: "1001Z01000000001A272",
                            type: "general_btn",
                            key: "pdf",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000027"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "4",
                            parentCode: "print_drop_down",
                            children: [],
                        },
                        {
                            id: "1001Z01000000001A275",
                            type: "general_btn",
                            key: "csv",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000026"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "7",
                            parentCode: "print_drop_down",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            id: "1001Z01000000001A278",
            type: "dropdown",
            key: "share",
            title: langCheck("reportMultiLang", "100301-000039"),
            area: "button_area",
            iskeyfunc: false,
            btncolor: "button_secondary",
            isenable: true,
            order: "10",
            children: [
                {
                    id: "1001Z01000000001A270",
                    type: "general_btn",
                    key: "share_drop_down",
                    area: "button_area",
                    iskeyfunc: false,
                    btncolor: "button_secondary",
                    isenable: true,
                    order: "2",
                    parentCode: "share",
                    children: [
                        {
                            id: "1001Z01000000001A273",
                            type: "general_btn",
                            key: "shareNow",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000107"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "5",
                            parentCode: "share_drop_down",
                            children: [],
                        },
                        {
                            id: "1001Z01000000001A274",
                            type: "general_btn",
                            key: "status",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000280"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "6",
                            parentCode: "share_drop_down",
                            children: [],
                        },
                        {
                            id: "1001Z01000000001A276",
                            type: "general_btn",
                            key: "history",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000122"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "8",
                            parentCode: "share_drop_down",
                            children: [],
                        },
                        {
                            id: "1001Z01000000001A277",
                            type: "general_btn",
                            key: "time",
                            title: langCheck(
                                "reportMultiLang",
                                "100301-000100"
                            ),
                            area: "button_area",
                            iskeyfunc: false,
                            btncolor: "button_secondary",
                            isenable: true,
                            order: "9",
                            parentCode: "share_drop_down",
                            children: [],
                        },
                    ],
                },
            ],
        },
    ];
}
