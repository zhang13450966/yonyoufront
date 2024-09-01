import { ajax, toast } from "nc-lightapp-front";
import { tableRender, clearUsedColumn, refreshSiderBar } from "./methods";
import Utils from "@public/utils";
import { checkTreeData } from "./treeFun";
const { langCheck } = Utils;

// 发送页维度请求
export const sendRollingData = function (req) {
    let reqArray = [];
    let { pageInfo } = this.initParams.repCondition;
    const { pager } = this.state;
    const { condition } = this.pageParams;
    const { busiPageDim } = this.props;

    req.forEach((item) => {
        pageInfo.forEach((ele) => {
            if (item.id == ele.id) {
                reqArray.push({
                    disValue: item.disValue,
                    relValue: item.relValue,
                    disCode: ele.disCode,
                    relCode: ele.relCode,
                });
            }
        });
    });

    setPageInfoForDim.call(this, reqArray); //设置页维度信息

    let data = {
        pageInfo: {
            pageIndex: "0",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
        ...this.commonParams,
    };

    if (!data.pageInfoForDim.length) data.pageInfoForDim = reqArray;

    let url = "/nccloud/report/widget/lightreport_reportpageDim.do";
    if (busiPageDim) {
        url = busiPageDim.url;
        data = {
            reportId: busiPageDim.reportId,
            ...busiPageDim.AnaReportModelFront,
            innerPageDim: busiPageDim.innerPageDim,
            pageInfoForDim: reqArray,
        };
    }

    ajax({
        url,
        data,
        success: (res) => {
            clearUsedColumn.call(this);
            this.initParams.dataRowNum = res.data.dataRowNum;
            checkTreeData.call(this, res.data, true);
            tableRender(this, res.data);
            refreshSiderBar.call(this, "dim"); 
        },
    });
};

//设置页维度信息，如果是多个，则设置map，一个则设置[]
function setPageInfoForDim(reqArray) {
    const { pk_report } = this.commonParams;
    const keys = Object.keys(this.reportTabMap);
    if (keys.length > 1) {
        this.pageInfoForDimMap[pk_report] = reqArray; //设置多个页维度信息，切换时候放进commonParams参数中
    } else {
        this.commonParams.pageInfoForDim = reqArray;
    }
}

export const initRollingFilterData = function (dataArr, repCondition, way) {
    // 筛选模态框数据
    let arrayObj = dataArr[0];
    let newArray = [];
    if (!arrayObj) {
        for (let i = 0; i < repCondition.pageInfo.length; i++) {
            newArray.push({ perch: i }); //占位
            repCondition.pageInfo[i].selectedDisValue = " ";
        }
        return newArray;
    }
    if (way == "search" || !newArray[0]) {
        arrayObj &&
            arrayObj.map((item, index) => {
                newArray[index] = [];
                if (repCondition.pageInfo[index].isShowAll) {
                    newArray[index].push({
                        id: index + 1,
                        relValue: "%$S(*@#^)",
                        disValue: langCheck(
                            "reportMultiLang",
                            "100301-000018"
                        ) /* 国际化处理： 显示全部*/,
                        parentField: "xianshiquanbupid",
                        rootField: "xianshiquanbu",
                    });
                }
                const { userDefinedPageDimValues } =
                    repCondition.pageInfo[index];
                if (userDefinedPageDimValues) {
                    const arr = userDefinedPageDimValues.map((item) => {
                        return {
                            id: index + 1,
                            relValue: item.realValue,
                            disValue: item.disPlayValue,
                            parentField: item.realValue,
                            rootField: item.realValue,
                        };
                    });
                    newArray[index] = [...newArray[index], ...arr];
                }
            });
    }

    dataArr.map((itemArray, i) => {
        itemArray.map((itemObjec, index) => {
            const flag = newArray[index].some(
                (item) => item.relValue === itemObjec.relValue
            );
            if (!flag) {
                if (itemObjec.relValue == "null") {
                    newArray[index].push({
                        id: index + 1,
                        relValue: "null",
                        disValue: langCheck("reportMultiLang", "100301-000019"),
                    }); /* 国际化处理： 显示空行*/
                } else {
                    newArray[index].push(itemObjec);
                }
            }
        });
    });
    return newArray;
};

export const getRollingData = function (way) {
    // 上下页页维度数据
    const { repCondition, pagerData } = this.initParams;
    let { dataArr, pageInfo } = repCondition;
    let { count } = pagerData;
    let res;
    let upDownRollingArray = [];
    if (way == "search" && way != "init" && pageInfo[0].isShowAll) {
        const showAllArray = getDefaultArray(pageInfo);
        dataArr.unshift(showAllArray);
    }
    if (dataArr.length < 1) {
        dataArr.length = pageInfo.length;
        for (let i = 0; i < dataArr.length; i++) {
            upDownRollingArray.push({ perch: i });
        }
        this.initParams = {
            ...this.initParams,
            pagerData: {
                ...this.initParams.pagerData,
                upDownRollingArray,
                flag: false,
            },
        };
    } else {
        res = dataArr[count || 0];
        res &&
            res.forEach((item) => {
                upDownRollingArray.push(item);
            });
        this.initParams = {
            ...this.initParams,
            pagerData: {
                ...this.initParams.pagerData,
                upDownRollingArray,
                flag: true,
            },
        };
        if (way != "search" && way != "init") {
            sendRollingData.call(this, upDownRollingArray);
        }
    }
};

export const rollingFilterClick = function () {
    // 点击页维度筛选按钮
    const { rollingPagerDataMap } = this.state;
    const { pk_report } = this.commonParams;
    const { pagerData } = this.initParams;

    const rollingPagerData = rollingPagerDataMap[pk_report] || [];

    if (!rollingPagerData.length) {
        return;
    }
    for (let i = 0; i < rollingPagerData.length; i++) {
        if (rollingPagerData[i] == undefined || !rollingPagerData[i].relValue) {
            rollingPagerData[i] = pagerData.modalRollingArray[i][0];
        }
    }
    this.state.rollingPagerDataMap[pk_report] = rollingPagerData;
    sendRollingData.call(this, rollingPagerData);
};

export const showPagerClick = function (index, data, pageInfo) {
    // 点击页维度操作
    if (!data[0][0]) {
        toast({
            content: langCheck("reportMultiLang", "100301-000020"),
            color: "warning",
        }); /* 国际化处理： 请先进行查询。*/
        return;
    }
    this.setState({
        pagerModalData: {
            data,
            index,
            pageInfo,
            showPagerModal: true,
        },
    });
};

export const rollingUpDown = function (way, subscript) {
    // 点击上下页
    let { count = 0 } = this.initParams.pagerData;
    let { dataArr } = this.initParams.repCondition;
    if (way === "prev") {
        count--;
        if (count < 0) {
            count = dataArr.length - 1;
        }
    } else if (way === "next") {
        count++;
        if (count > dataArr.length - 1) {
            count = 0;
        }
    } else if (way === "first") {
        count = 0;
    } else if (way === "last") {
        count = dataArr.length - 1;
    } else if (way === "onlyUpDown") {
        count = subscript;
    }
    this.initParams.pagerData.count = count;
    this.state.pagerModalData.showPagerModal = false;
    getRollingData.call(this);
};

export const onRollingClear = function () {
    let { pageInfo } = this.initParams.repCondition;
    const { pk_report } = this.commonParams;

    const upDownRollingArray = getDefaultArray(pageInfo);
    this.initParams = {
        ...this.initParams,
        pagerData: {
            ...this.initParams.pagerData,
            upDownRollingArray,
            flag: true,
        },
    };
    this.setState({
      rollingPagerDataMap: {
        ...this.state.rollingPagerDataMap,
        [pk_report]: pageInfo.map(item => {
            return {
                relValue: item.selectedRelValue,
                disValue: item.selectedDisValue,
                id: item.id,
                key: item.selectedRelValue,
            }
        }),
      },
    });
};

const getDefaultArray = (pageInfo) => {
    let showAllArray = [];
    pageInfo.forEach((item, index) => {
        showAllArray[index] = {
            id: index + 1,
            relValue: "%$S(*@#^)",
            disValue: langCheck(
                "reportMultiLang",
                "100301-000018"
            ) /* 国际化处理： 显示全部*/,
            parentField: "xianshiquanbupid",
            rootField: "xianshiquanbu",
        };
    });
    return showAllArray;
};
