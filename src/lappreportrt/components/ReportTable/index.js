import React, { Component } from "react";
import {
    createPage,
    base,
    ajax,
    toast,
    getMultiLang,
    createPageIcon,
    getBusinessInfo,
} from "nc-lightapp-front";
import {
    clickSearchBtn,
    initTemplate,
    tableRender,
    sendSearchFun,
    myRender,
    afterSelection,
    relationSearch,
    shareReport,
    commomPrint,
    templatePrint,
    getFilterData,
    cancelFilter,
    closeFilterModal,
    getPagerData,
    rollingFilterClick,
    showPagerClick,
    rollingUpDown,
    getFilterInfo,
    shareMenuClick,
    filterMenuClick,
    getInitData,
    sortFun,
    changeSortAndFilterIconPosition,
    onRollingClear,
    onTabClick,
} from "./events";
import defaultSettings from "@common/defaultSettings";
import Rolling from "@public/rolling";
const { NCSidebox } = base;
import FilterModal from "@public/filterModal";
import PagerModal from "@public/pagerModal";
import ShareModal from "@public/shareModal";
import OutputModal from "@public/outputModal";
import ConfirmModal from "@public/confirmModal";
import TimeModal from "@public/timeModal";
import DataViewSetting from "@public/dataViewSetting";
import PrintPageSetting from "@public/printPageSetting";
import { loopRequest } from "./events/loopRequest";

import Utils from "@public/utils";
import { freezeCell } from "./events/freeze";
import { matchRowAndCol } from "./events/shiftdim";

const {
    isFunction,
    langCheck,
    getGlobalStorage,
    removeGlobalStorage,
    requestFullScreen,
    exitFullscreen,
    getIframeParams,
    getTimeOffset,
    setGlobalStorage,
    waterMark,
} = Utils;

import { isSearchRender } from "./events/isSearchRender";
import ButtonConfig from "./components/ButtonConfig";
//import ColumnMenu from "./components/ColumnMenu";
import createContextMenu from "./components/ContextMenu";
import { contextGenerator } from "./events/contextGenerator";
import { buttonList, moreList, SEARCHID, getShareSideboxTitle } from "./config";
import {
    fetchAllDataView,
    fetchDisplayDataViewInfo,
} from "@public/dataViewModal/ajaxMethod.js";
import {
    getMaxWidth,
    getColSettingsObj,
    getRelCoords,
    getSendCoord,
    resetDisabled,
    getSortType,
    changeColWidth,
    buildRowData,
    changeTableBorderOnFreeze,
    getSortAndFilterColumn,
    refreshSiderBar,
} from "./events/methods";
import {
    viewModelRequest,
    resetWidthRequest,
    saveGraphicSliderWidth,
    toggleCoordinate,
    getInitParams,
    getSubScribHistory,
} from "@public/utils/requests";
import { onContextTreeClick } from "./events/treeFun";
import CreateSearchContent from "./components/CreateSearchContent";
import {
    createDrillListDOM,
    createPrintListDOM,
    createHighButtonDOM,
    createDetailSelectDOM,
    createSiderBarDOM,
    createHandsontableDOM,
    CreateShareBodyDOM,
    createFullScreenDOM,
    createHistoryInfoDOM,
} from "./events/domBuild";
import ReportTab from "./components/ReportTab";
require("./index.less");

class SimpleReport extends Component {
    constructor(props) {
        super(props);
        const _this = this;
        const {
            ownReportParams = {},
            getUrlParam,
            getSearchParam,
            use,
        } = props; //自定义传参
        use && use.search(SEARCHID);

        this.isConnection = false; //联查标记
        this.isClickSearchBtn = false;
        this.sendSearchParams = {
            pageInfo: {
                pageIndex: "1",
                pageSize: "200",
            },
        }; //查询参数暂存
        this.isClickCoords = {}; //记录当前点击的坐标
        this.pageInfoForDimMap = {}; //多个页签时，保存的页维度信息
        this.inSearchArea = false;
        //this.toggleSearchArea = false; //显示隐藏查询区
        this.preloadMaxRow = "-1"; //是否显示分页中的真实分页信息
        this.isClickShowAllCount = false; //是否点击了分页中的显示行数
        this.colinfo = {}; //列设置数据，在初始化及查询或者联查时需要更新
        this.colSettingsObj = {}; //列设置对象，用来排序筛选等对比传参
        this.tdSelectedArea = null; //默认选中单元格
        this.onlySearchArea = getUrlParam("onlySearch");
        this.hideButtonArea =
            getUrlParam("hideButtonArea") || ownReportParams.hideButtonArea;
        this.pointMap = {}; //各个区域数据的信息
        this.reportTabMap = {}; //多页签报表数据
        this.commonParams = {
            pk_report: "",
            reportId: "",
            queryAreaCode: "",
            oid: "",
            opents: "", //报表时间戳
            appcode:
                getUrlParam("appcode") ||
                ownReportParams.appcode ||
                getSearchParam("c"),
            pageCode:
                getUrlParam("pagecode") ||
                ownReportParams.pagecode ||
                getUrlParam("pageCode") ||
                getSearchParam("p"),
            querytype: "tree",
            isAdvanced: false, //判断是高级查询还是普通查询
            pageInfoForDim: [], //页维度的参数
            transSaveObject: "",
            operationQueue: "", //查询 筛选 排序 分页 区分字段
            treeType: true,
            keyIsExecDrill: false, // false为正常打开报表，true为联查的报表，在联查时设为true，不点查询为ture,点查询为false
        }; //相同参数存放处
        this.oldButtonKeys = []; //注册按钮的所有key值
        this.initParams = {
            //初始化数据参数
            dataRowNum: "", //分页中如果为0则显示条数0
            noDropdownPrint: true, //打印，打印菜单可用性
            excelPrintMaxRow: "", //excel最大导出量
            pdfPrintMaxRow: "", //pdf最大导出量
            key_CUR_USER_ID: "", //打印超出时分享给的用户
            isShowZero: true, //当返回为false时，表格区字段是0不显示
            drillConditions: [], // 联查带过来的查询条件
            printmenu: [], //打印菜单
            drillRulesList: [], //联查下拉菜单
            repCondition: {}, //初始页维度数据
            pagerData: {
                // 页维度数据
                count: 0, //上下页的索引
                upDownRollingArray: null, //上下页后台发送参数
                pageInfo: null,
                flag: true, //是否显示上下页
                type: -1, //显示哪种交互方式
                modalRollingArray: null, //筛选模态框数据
            },
            controlByLicense: false, //鉴权
        };
        this.pageParams = {
            //页面参数
            FreeReport_QueryTreeVo: "", // 打印需要的序列化参数
            reportType: "2", //判断是什么表
            condition: { logic: "and", conditions: [] }, // 查询参数
            nodekey: "", //打印参数
            maxrow: "-1",
        };

        this.SORT_COLUMNS = {}; //排序后图标显示状态
        this.FILTER_COLUMNS = {}; //筛选后图标显示

        this.WOTER_MARK_IMAGE = null; //!后续需要水印，解开就行 waterMark(getBusinessInfo().userName);

        this.prevSearchParams = {}; //如果是历史状态，再点击查询按钮，需要留存一份
        this.isReportDrillParams = {}; //保存一份联查接口参数，用于联查过来后直接点显示合计按钮的请求参数
        this.state = {
            reportBoxHeight: "calc(100% - 32px)", //表格部分的高度
            isHideCoordinate: false, //显示隐藏行号列标
            is_no_pagination: false, //是否显示分页
            findSelectCells: {}, //查找的数据，要进行背景色修改
            isReviewHistory: false, //查询历史标记
            preciseDisabled: true, //联查可点击性
            sortAndFilterArea: true, //排序筛选可点击性
            showTimeModal: false, //定时分享模态框
            dataViewVisible: false, // 数据视图模态框
            graphicParams: {
                isDefaultExpand: false, //是否显示侧拉组件模态框
                sideBarList: [], //侧边栏列表
                search_params: {}, //查询区参数
                analysis_params: {}, //侧边栏分析参数
                hideTopBar: true,
                hideChangeGraph: props.hideChangeGraph || false,
                hideAllChange: props.hideAllChange || false,
                width: 800,
            }, //图形化侧拉参数
            hideTextWhenFreeze: [], //合并单元格且冻结时不显示文字的格子
            fileName: getUrlParam("n") || getSearchParam("n"),
            sideboxData: [], //订阅历史，实时分享状态数据
            fldAreaArray: [], //每一列的有效区域
            outputModalData: null, //打印弹出框数据
            pagerModalData: {
                data: null, //页维度模态框数据
                index: "", //页维度模态框索引
            },
            rollingPagerDataMap: {}, //可点击页维度展示数据
            area: [], //表格数据拥有的范围
            result: null, //总表格数据
            tdStyle: null, //格式化后的样式
            exportShow: false, //是否显示导出item
            pager: {
                allRowCount: 0,
                pageCount: 1,
                pageIndex: 1,
                pageRowCount: 0,
                pageSize: 200,
            },
            settings: {
                ...defaultSettings,
                cells: function (row, col, prop) {
                    this.renderer = myRender.bind(_this);
                },
            },
            showDataViewFlag: false,
            dataViewMenuArr: [],
            currentSelectDataViewIndex: -1, // 对勾的index
            isAddNewDataView: false,
        };
        this.areaDataInfo = [];
        this.shiftdimData = {};
        this.relationAreaPkList = []; //
        this.dataViewMiddleCacheData = {};
        this.treeParams = {
            currentData: [],
            config: {},
        };
        this.META_SET_ON_SEARCH = "0"; //是否设置 0:初始状态 1:查询区已渲染  2:查询区已渲染且已赋值
        this.isShowSearchArea =
            (!this.props.ownReportParams ||
                ownReportParams.showSearchArea !== "2") &&
            this.props.getUrlParam("webDrillType") !== "2" &&
            this.props.getSearchParam("webDrillType") !== "2";
    }

    componentWillMount() {
        //组合订阅时，不走下面逻辑
        if (this.onlySearchArea) return;

        this.fetchDataViewAndInitTemplate();
    }

    componentDidMount() {
        const { gridInstance } = this.props;
        if (this.onlySearchArea) {
            document.body.style.backgroundColor = "transparent";
            window.addEventListener("message", this.receiveMessage, false);
            return;
        }

        let sessionFlag =
            getGlobalStorage("localStorage", "LinkReport") ||
            getGlobalStorage("sessionStorage", "LinkReport");
        if (!sessionFlag) {
            this.getData();
        }

        document.addEventListener("fullscreenchange", this.exitHandler);

        window.addEventListener("resize", this.onResize);

        const $grid = document.getElementById("handsontable");
        if ($grid) {
            $grid.oncontextmenu = function () {
                return false;
            };
        }

        if (gridInstance) {
            gridInstance(this, this.updateSettings);
        }
    }

    componentWillUnmount() {
        removeGlobalStorage("localStorage", "LinkReport");
        removeGlobalStorage("sessionStorage", "LinkReport");
        window.removeEventListener("resize", this.onResize);
        document.removeEventListener("fullscreenchange", this.exitHandler);
    }

    onResize = () => {
        this.forceUpdate();
    };

    updateReportData = (data) => {
        getInitData.call(this, data, false, true, false);
    };

    exitHandler = () => {
        if (
            !document.fullscreenElement &&
            !document.webkitIsFullScreen &&
            !document.mozFullScreen &&
            !document.msFullscreenElement
        ) {
            this.setState({ isFullScreen: false });
        }
    };

    //接收组合订阅传进来的查询区数据，然后渲染相应数据
    receiveMessage = (event) => {
        const str = event.data;
        if (str) {
            const { currentMeta } = JSON.parse(str);
            this.subscribeMetaData = currentMeta;
            this.fetchDataViewAndInitTemplate();
            // initTemplate.call(this, this.props);
        }
    };

    compareDataViewArea = (property) => {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        };
    };

    fetchDataViewAndInitTemplate = () => {
        let callback = (json) => {
            window.reportMultiLang = json;
            // onlySearchArea 判断是否是在 组合订阅 节点打开，如果是，则只显示高级查询，其他都不显示
            if (this.isShowSearchArea) {
                const appcode =
                    (this.props.isSearchFromDesign &&
                        this.props.isSearchFromDesign.appcode) ||
                    this.commonParams.appcode;
                const params = { appcode };
                this.asyncCheckDataView(params).then((res) => {
                    if (res && res.isResetArea) {
                        toast({
                            content: langCheck(
                                "reportMultiLang",
                                "dataView-100301-000273"
                            ),
                            color: "warning",
                        }); // /* 国际化处理： 报表格式设计发生变化，对应的数据视图已失效*/
                    }
                    if (res && !res.isHideButton) {
                        // 显示按钮后才调数据视图接口
                        const fetchDVParams = {
                            appcode,
                            isCacheValid: res.isCacheValid,
                            isResetArea: res.isResetArea,
                            checkRes: res,
                        };
                        this.asyncFetchDataView(fetchDVParams).then(
                            (resData) => {
                                initTemplate.call(this, {
                                    ...this.props,
                                    showDataViewTemplate: true,
                                    initialvalue: resData,
                                });
                            }
                        );
                    } else {
                        initTemplate.call(this, this.props);
                    }
                });
            }
        };
        getMultiLang({
            moduleId: 100301,
            currentLocale: "zh-CN",
            domainName: "lappreportrt",
            callback,
        });
    };

    formatDataView = (record) => {
        let data = JSON.parse(JSON.stringify(record));
        if (data && data.length > 0) {
            // 加areaType字段 为了点保存的时候做拆分处理
            data.forEach((item) => {
                if (item.areacontentsets && item.areacontentsets.length > 0) {
                    item.areacontentsets.forEach((defaultAreaItem) => {
                        defaultAreaItem.areaType = "rowCol";
                        defaultAreaItem.isSyncData = true;
                    });
                }
                if (
                    item.crossareacontentsets &&
                    item.crossareacontentsets.length > 0
                ) {
                    item.crossareacontentsets.forEach((crossAreaItem) => {
                        crossAreaItem.areaType = "cross";
                    });
                }
                item.areacontentsets = [
                    ...item.areacontentsets,
                    ...item.crossareacontentsets,
                ];
                item.areacontentsets = item.areacontentsets.sort(
                    this.compareDataViewArea("areaOrder")
                ); // 根据areaOrder排序显示
            });
        }
        return data;
    };

    getData = async () => {
        const {
            isBusiRender,
            isRenderFromDesign,
            linkParams = {},
            ownReportParams = {},
        } = this.props;

        const { renderOnOuter } = ownReportParams;

        if (renderOnOuter) return;

        if (isBusiRender) {
            //如果走业务组自定义渲染
            let doBusiSearch = isBusiRender();
            doBusiSearch.then((result) => {
                getInitData.call(this, result.data.data, false, true, false);
            });
            return;
        }
        if (isRenderFromDesign) {
            //如果走自助分析设计
            let doBusiSearch = isRenderFromDesign();
            doBusiSearch.then((result) => {
                getInitData.call(this, result.data, false, true, false);
            });
            return;
        }
        // 初始数据
        const { appcode, treeType } = this.commonParams;

        const iframeParams = getIframeParams.call(this);
        const { row, column } = iframeParams;

        let data,
            url,
            flag = false,
            noDropdownPrint = true;

        if ((row && column) || linkParams.reportId) {
            //走联查,打开新页签，当前页面打开用linkParams
            flag = true;
            noDropdownPrint = false;

            data = iframeParams;
            this.isReportDrillParams = data;
            url = "/nccloud/report/widget/lightreport_reportdrill.do";
        } else {
            data = { appcode, key_time_offset: getTimeOffset() };
            url = "/nccloud/report/widget/lightreport_query.do";
        }
        const result = await getInitParams({ url, data });
        //当时联查过来时，如不点查询直接点显示合计，则走联查的接口，如点查询后，则按正常逻辑走
        if (flag) {
            this.isClickShowAllCount = true;
            this.isClickSearchBtn = true;
            this.commonParams.keyIsExecDrill = true;
            this.commonParams.isListTreeWhenSearch = !treeType ? true : false; //判断当前树形表是列表态还是树形
        }
        getInitData.call(this, result, flag, noDropdownPrint, row);

        loopRequest.call(this); //循环刷新数据
    };

    asyncFetchDataView = async function (params) {
        const storgeKey = `${params.appcode}-dataViewScheme`;
        const curStorgeDVScheme = getGlobalStorage("localStorage", storgeKey);
        let curDvIndex = -1;
        if (curStorgeDVScheme && params.isCacheValid && !params.isResetArea) {
            const curStorgeDVSchemeRes = await new Promise((resolve) => {
                resolve(JSON.parse(curStorgeDVScheme));
            });
            let initialvalue = {};
            curStorgeDVSchemeRes.map((item, index) => {
                // 设置 '对勾' 的index到isdefault的上
                if (item.isdefault) {
                    initialvalue = {
                        display: item.name,
                        value: item.code,
                    };
                    curDvIndex = index;
                }
                return item;
            });
            if (curStorgeDVSchemeRes && curStorgeDVSchemeRes.length > 0) {
                this.setState({
                    dataViewMenuArr: this.formatDataView(curStorgeDVSchemeRes),
                    showDataViewFlag: !params.checkRes.isHideButton,
                    currentSelectDataViewIndex: curDvIndex,
                });
            }
            return initialvalue;
        }

        let dataViewRes = await fetchAllDataView(params);
        let initialvalue = {};
        setGlobalStorage(
            "localStorage",
            storgeKey,
            JSON.stringify(dataViewRes)
        );

        if (dataViewRes && dataViewRes.length > 0) {
            dataViewRes.map((item, index) => {
                // 设置 '对勾' 的index到isdefault的上
                if (item.isdefault) {
                    initialvalue = {
                        display: item.name,
                        value: item.code,
                    };
                    curDvIndex = index;
                }
                return item;
            });
            this.setState({
                dataViewMenuArr: this.formatDataView(dataViewRes),
                showDataViewFlag: !params.checkRes.isHideButton,
                currentSelectDataViewIndex: curDvIndex,
            });
        }
        return initialvalue;
    };

    asyncCheckDataView = async function (checkDataViewparams) {
        let res = await fetchDisplayDataViewInfo(checkDataViewparams);

        this.relationAreaPkList = res && res.relationAreaPkList;

        return res;
    };

    handleClick(way) {
        // 表格几个使用方法
        const {
            pager,
            settings,
            afterChangeData,
            isFullScreen,
            graphicParams,
        } = this.state;
        const { condition } = this.pageParams;

        switch (way) {
            case "maxBox":
                if (!isFullScreen) {
                    requestFullScreen.call(this);
                } else {
                    exitFullscreen.call(this);
                }
                break;
            case "onTreeShow":
                this.onContextMenuClick("onTreeShow");
                break;
            case "historyInfo":
                shareMenuClick.call(this, "historyInfo");
                break;
            case "find":
                this.refs.hansontable.onContextMenuClick("find");
                break;
            case "sideBox":
                this.setState(
                    {
                        graphicParams: {
                            ...graphicParams,
                            isDefaultExpand: !graphicParams.isDefaultExpand,
                        },
                    },
                    () => {
                        if (this.state.graphicParams.isDefaultExpand) {
                            refreshSiderBar.call(this, "init");
                        }
                        this.updateSettings();
                    }
                );
                break;
            case "row_resize":
                const colWidths = this.getColumnWidths();
                this.rowResize(colWidths);
                break;
            case "auto":
                const oldWidths = settings.colWidths;
                const newWidths = getMaxWidth.call(
                    this,
                    afterChangeData,
                    oldWidths,
                    this.tdSelectedArea
                );

                this.rowResize(newWidths);
                break;
            case "reset":
                this.resetWidth();
                break;
            case "highBtn":
                if (this.props.isNoSearchItem) {
                    // 只显示高级查询按钮，点击是否显示高级查询及是否直接走查询
                    clickSearchBtn.call(
                        this,
                        this.props,
                        this.props,
                        null,
                        "simple",
                        {}
                    );
                } else {
                    this.props.search.openAdvSearch(SEARCHID, true);
                }
                break;
            default:
                const { row, col } = getSendCoord.call(this);
                let sortType = getSortType(way);
                let param = {
                    row,
                    column: col,
                    pageInfo: {
                        pageIndex:
                            (pager.pageIndex && pager.pageIndex.toString()) ||
                            "",
                        pageSize:
                            (pager.pageSize && pager.pageSize.toString()) || "",
                    },
                    querycondition: condition,
                    ...this.commonParams,
                };
                let data = {};
                if (way == "asc" || way == "desc" || way == "cancel_sort") {
                    data = Object.assign({}, param, { sortType });
                } else if (way.indexOf("filter") > -1) {
                    data = Object.assign({}, param, { filterValues: [] });
                }
                if (way == "cancel_filter") {
                    data.removeitem = "remove";
                }

                if (way == "filter") {
                    getFilterInfo.call(this, data);
                } else if (way == "cancel_filter") {
                    cancelFilter.call(this, data);
                } else {
                    sortFun.call(this, data);
                }
                break;
        }
    }

    resetWidth = async () => {
        const data = await resetWidthRequest({
            pk_report: this.commonParams.pk_report,
        });
        toast({
            content: langCheck("reportMultiLang", "100301-000121"),
            color: "success",
        }); /* 国际化处理： 重置成功*/
        this.refreshWidth(data);
    };

    refreshWidth = (width) => {
        const { result, settings } = this.state;
        result.CellsModel.columnHeader.headerArray = width;
        settings.colWidths = width;
        this.getReportInstance().updateSettings({
            manualColumnResize: false,
            colWidths: width,
        });
        this.getReportInstance().updateSettings({ manualColumnResize: true });
        tableRender(this, result, "saveWidth");
    };

    shareFun() {
        // 分享模态框
        this.refs.shareModal.showShareModal();
    }

    updateSettings = (newSettings = {}) => {
        this.getReportInstance().updateSettings({
            ...this.state.settings,
            ...newSettings,
        });
    };

    getReportInstance = () => {
        return this.refs.hansontable.getHotInstance();
    };

    rowResize(colWidths, way) {
        //更改单元格宽度
        const { pk_report, opents } = this.commonParams;
        changeColWidth(colWidths, way);

        let data = {
            pk_report,
            width: colWidths,
            isBusinessSet: "false",
            opents,
        };
        ajax({
            url: "/nccloud/report/widget/lightreport_savewidth.do",
            data: data,
            success: () => {
                if (way !== "column")
                    toast({
                        content: langCheck("reportMultiLang", "100301-000013"),
                        color: "success",
                    }); /* 国际化处理： 保存成功*/
                this.refreshWidth(colWidths);
            },
        });
    }

    showConfirm = () => {
        this.refs.confirmModal.setState({ showConfirmModal: true });
    };

    sureConfirmModal = () => {
        shareReport.call(this, "print");
    };

    pageClick = (val) => {
        //分页
        this.state.pager.pageIndex = val;
        getPagerData.call(this, "pager");
    };

    handleChange = (val) => {
        this.state.pager.pageSize = val;
        getPagerData.call(this);
    };

    getRealCount = () => {
        //显示真实数据条数
        const { getUrlParam } = this.props;
        const { currentSelectDataViewIndex, dataViewMenuArr } = this.state;

        const row = getUrlParam("row") || ""; //动态url传参
        this.isClickShowAllCount = false;
        // const key_formScheme =
        if (row) {
            //如果是联查直接点显示合计则走此逻辑，在点查询时会把 this.isClickShowAllCount = true
            this.fetchTableData(
                dataViewMenuArr[currentSelectDataViewIndex],
                true
            );
        } else {
            this.fetchTableData(dataViewMenuArr[currentSelectDataViewIndex]);
        }
    };

    afterOnCellMouseDown = (e, coords, td) => {
        //header内排序筛选图标点击事件
        let classes = e.realTarget.className;
        if (coords.col < 0) coords.col = 0;
        if (coords.row < 0) coords.row = 0;
        //因为afterOnCellMouseDown先执行，这里先赋一下值，要不然排序，联查坐标会不对
        this.isClickCoords = {
            row: coords.row + "",
            col: coords.col + "",
        };

        this.targetEventDOM = e; //点击事件event，用于监听是否点击的展开收起符号

        const { row, col } = getRelCoords.call(this);

        if (classes.indexOf("sort-or-filter") > -1 && e.button < 2) {
            let type = "";
            if (classes.indexOf("desc") > -1) {
                type = "asc";
            } else if (classes.indexOf("asc") > -1) {
                type = "desc";
            } else {
                type = "filter";
            }
            this.handleClick(type);
        }

        //单元格内点击文字进行联查
        let data_drillcode = e.target.getAttribute("data_drillcode");
        if (data_drillcode && data_drillcode != null && e.which !== 3) {
            if (
                this.onDrillItemClick &&
                Date.now() - this.onDrillItemClick < 800
            ) {
                return;
            }
            this.onDrillItemClick = Date.now();
            setTimeout(() => {
                relationSearch.call(this, data_drillcode);
            }, 200);
        }

        //获取行数据
        if (this.props.getRowData) {
            const { fieldExpCaptionMap, result } = this.state;
            const data = buildRowData({
                fieldExpCaptionMap,
                result,
                coord: { row, col },
            });

            this.props.getRowData(data, { row, col });
        }
    };

    /**
     * record: 传参参数
     * index: 哪一个页维度
     * type: 是否为下拉页维度
     * subscript: 参照或者树结构选择的item索引，可传可不传
     * canClick: 一个页维度为true,多个为false
     */
    checkPaper(record, index, type, subscript, canClick) {
        const { pk_report } = this.commonParams;
        const { rollingPagerDataMap } = this.state;
        const { pagerData, repCondition } = this.initParams;

        if (
            subscript > -1 &&
            !canClick &&
            (pagerData.type == 1 || pagerData.type == 2)
        ) {
            rollingUpDown.call(this, "onlyUpDown", subscript);
            return;
        }
        // 选择页维度操作
        if (!rollingPagerDataMap[pk_report]) {
            rollingPagerDataMap[pk_report] = [];
        }

        rollingPagerDataMap[pk_report][index] = record;
        rollingPagerDataMap[pk_report].length = repCondition.pageNum;

        if (type !== "select") {
            this.setState({
                rollingPagerDataMap,
                pagerModalData: {
                    ...this.state.pagerModalData,
                    showPagerModal: false,
                },
            });
        } else {
            this.setState({ rollingPagerDataMap });
        }
    }

    closePagerModal = () => {
        this.setState({
            pagerModalData: {
                ...this.state.pagerModalData,
                showPagerModal: false,
            },
        });
    };

    onTimeModalHide = () => {
        this.setState({ showTimeModal: false });
    };

    opneBtnClick = () => {
        this.updateSettings();
    };

    //冻结
    freezeFun = (key, blockIndex = 0) => {
        changeTableBorderOnFreeze();
        if (key === "cancel_block") {
            this.state.settings.fixedColumnsLeft = 0;
            this.state.settings.fixedRowsTop = 0;
            return tableRender(this, this.state.result, "block");
        } else {
            freezeCell.call(this, key, blockIndex);
        }
    };

    setDataViewCacheData = (value) => {
        this.dataViewMiddleCacheData = value;
    };

    //前端写死的按钮点击事件
    onButtonListClick = (way, key) => {
        const { result, settings } = this.state;
        const type = key.key || key;
        switch (way) {
            case "freeze":
                this.freezeFun(type);
                break;
            case "more":
                switch (type) {
                    case "common":
                        viewModelRequest(this)("normalView").then((res) => {
                            if (!this.IS_CLICK_BLOCK)
                                this.state.settings.fixedRowsTop = null; //使用原始状态下的冻结行
                            this.viewModelChange = false;
                            resetDisabled.call(this, "normalView");
                            tableRender(this, result);
                        });
                        break;
                    case "data":
                        viewModelRequest(this)("dataView").then((res) => {
                            let { seperateRow } =
                                result.CellsModel.tableSetting.lockSet;
                            if (seperateRow && +seperateRow > 0) {
                                //如果有默认冻结，并且隐藏表头，把设置的默认冻结上移
                                this.state.settings.fixedRowsTop =
                                    result.CellsModel.tableSetting.lockSet
                                        .seperateRow -
                                    this.reportDataStartPostion;
                            }
                            this.viewModelChange = true;
                            resetDisabled.call(this, "dataView");
                            tableRender(this, result);
                        });
                        break;
                    case "column":
                        this.checkShowDrawer();
                        break;
                    case "toggleRowColHeaders":
                        this.setState(
                            {
                                settings: {
                                    ...settings,
                                    colHeaders: !settings.colHeaders,
                                    rowHeaders: !settings.rowHeaders,
                                },
                            },
                            () =>
                                toggleCoordinate({
                                    pk_report: this.commonParams.pk_report,
                                    isHideCoordinate: settings.colHeaders,
                                })
                        );
                        break;
                    default:
                        this.handleClick(type);
                }
                break;
            default:
                this.handleClick(type);
        }
    };

    checkShowDrawer = () => {
        const { unSupported } = this.colinfo;
        if (unSupported) {
            toast({
                content: langCheck("reportMultiLang", "100301-000138"),
                color: "warning",
            }); /* 国际化处理： 请选择数据单元格*/
        } else {
            this.setState({ showDrawer: true });
        }
    };

    //右键点击事件
    onContextMenuClick = (key, num) => {
        if (key.indexOf(":") > -1) {
            let pid = key.split(":")[0];
            if (pid === "search") {
                relationSearch.call(this, key.split(":")[1]);
            } else if (pid === "freeze") {
                this.freezeFun(key.split(":")[1]);
            }
        } else if (key === "column") {
            this.checkShowDrawer();
        } else if (key.indexOf("tree") > -1) {
            onContextTreeClick.call(this, key, num);
        } else if (key === "hideColumn" || key === "unHide") {
            this.onChangeColumn(key);
        } else if (key === "shiftdim") {
            this.handleShiftDim(this.isClickCoords.row, this.isClickCoords.col);
        } else if (key === "onTreeShow") {
            this.commonParams.treeType = !this.commonParams.treeType;
            this.forceUpdate();
        } else {
            this.handleClick(key);
        }
    };

    handleShiftDim = (targetRow, targetCol) => {
        const { dataViewMenuArr, currentSelectDataViewIndex } = this.state;
        const { appcode } = this.commonParams;
        const { row } = getIframeParams.call(this);
        let resultAreaId = "";
        const curAreaData = this.pageParams.CellsModel.AreaDatas;
        curAreaData.map((item) => {
            if (
                matchRowAndCol(
                    item.area[0],
                    item.area[1],
                    item.area[2],
                    item.area[3],
                    targetRow,
                    targetCol
                )
            ) {
                resultAreaId = item.exId;
            }
            return item;
        });
        if (resultAreaId) {
            const resultParams =
                Object.keys(this.shiftdimData).length > 0
                    ? JSON.parse(JSON.stringify(this.shiftdimData))
                    : JSON.parse(
                          JSON.stringify(
                              dataViewMenuArr[currentSelectDataViewIndex]
                          )
                      );
            let needShiftDimAndSearchFlag = false; // 是否匹配到了正确的areaPk

            resultParams.crossareacontentsets =
                resultParams.crossareacontentsets.length > 0
                    ? resultParams.crossareacontentsets.map((item) => {
                          // 交叉表里面的areapk === 右键匹配到的areaPk
                          if (item.areaPk === resultAreaId) {
                              needShiftDimAndSearchFlag = true;
                              const newItem = {
                                  ...item,
                                  columnFldNames: item.rowFldNames, // 行列转换
                                  rowFldNames: item.columnFldNames, // 行列转换
                                  measureDirection:
                                      item.measureDirection === 1 ? 0 : 1,
                              };
                              return newItem;
                          }
                          return item;
                      })
                    : [];
            if (needShiftDimAndSearchFlag) {
                const res = JSON.parse(JSON.stringify(resultParams));
                if (res.code == "default") {
                    res.isviewbypreset = true;
                }
                this.shiftdimData = res;

                if (this.areaDataInfo.length > 0) {
                    this.fetchTableData(res, false, true);
                } else {
                    let data = {
                        appcode,
                        key_time_offset: getTimeOffset(),
                        key_formScheme: resultParams,
                    };
                    let url = "/nccloud/report/widget/lightreport_query.do";
                    ajax({
                        url,
                        data,
                        success: (res) => {
                            getInitData.call(this, res.data, false, true, row);
                        },
                    });
                }
            }
        }
    };

    getColumnWidths = () => {
        const instance = this.getReportInstance();
        const cols = instance.countCols();
        let colWidths = new Array(cols)
            .fill(null)
            .map((item, index) => instance.getColWidth(index));
        return colWidths;
    };

    onChangeColumn = (type) => {
        const { col, col2 } = this.selectCells;
        const colWidths = this.getColumnWidths();
        if (type === "hideColumn") {
            colWidths.forEach((item, index) => {
                if (index >= +col && index <= +col2) {
                    colWidths[index] = "0";
                }
            });
        } else {
            colWidths.forEach((item, index) => {
                if (index >= +col && index <= +col2 && item < 2) {
                    colWidths[index] = "120";
                }
            });
        }

        this.refreshWidth(colWidths);
    };

    onDataViewRef = (ref) => {
        this.dataViewChild = ref;
    };

    getAllViewData = (needInitDefault, noneCurrnt) => {
        const { appcode, pk_report } = this.commonParams;

        const dataViewParams = {
            appcode,
            pk_report,
        };
        fetchAllDataView(dataViewParams).then((dataViewRes) => {
            setGlobalStorage(
                "localStorage",
                `${appcode}-dataViewScheme`,
                JSON.stringify(dataViewRes)
            );
            if (noneCurrnt) {
                this.setCurSelectDataViewIndex(-1);
            } else {
                if (this.state.isAddNewDataView) {
                    this.setCurSelectDataViewIndex(dataViewRes.length - 1);
                }
                if (needInitDefault) {
                    dataViewRes.map((item, index) => {
                        // 设置 '对勾' 的index到isdefault的上
                        if (item.isdefault) {
                            this.setCurSelectDataViewIndex(index);
                        }
                        return item;
                    });
                }
            }

            if (dataViewRes && dataViewRes.length > 0) {
                this.setState({
                    dataViewMenuArr: this.formatDataView(dataViewRes),
                });
            }
        });
    };

    fetchTableData = (key_formScheme, rowFlag, dataViewFlag) => {
        let condition = { logic: "and", conditions: [] };
        if (!this.isShowSearchArea) {
            //如果没有查询区，则取联查过来时候的查询条件
            condition.conditions = this.initParams.drillConditions || [];
        } else {
            condition = this.props.search.getAllSearchData(SEARCHID, true);
            if (!condition) return;
            // 查询区校验必填项 如果为false说明有未填写的必填项
        }
        sendSearchFun(
            this,
            this.props,
            this.props,
            condition,
            "simple",
            {},
            this.commonParams.custcondition,
            "showAllCount",
            rowFlag ? true : false,
            key_formScheme,
            dataViewFlag
        );
    };

    setCurSelectDataViewIndex = (index) => {
        this.setState({ currentSelectDataViewIndex: index });
        this.shiftdimData = {}; // 切换视图要重置 交叉转置的副本数据
    };

    //关闭列设置
    toCloseDrawer = () => {
        this.setState({ showDrawer: false });
    };

    //注册按钮点击事件
    onRegBtnClick = (props, id) => {
        if (["shareNow", "time", "status", "history"].includes(id)) {
            shareMenuClick.call(this, id);
        } else if (this.regKeys.print && this.regKeys.print.includes(id)) {
            // if(){
            //     pluginPrint.call(this);
            // }else{

            // }
            commomPrint.call(this, id);
        } else {
            this.props.onRegButtonClick && this.props.onRegButtonClick(id);
        }
    };

    //订阅历史查看
    onSliderItemClick = async (item) => {
        const { condition, data } = await getSubScribHistory(
            item.pk_task_instance
        );
        this.state.isReviewHistory = true;
        this.props.search.setSearchValue(SEARCHID, condition.querycondition);
        isSearchRender.call(this, data, condition.querycondition, condition);
    };

    //由历史状态到正常状态
    onPromptClick = () => {
        this.setState({ isReviewHistory: false }, () => {
            const { expandProps, props, items, type, queryInfo } =
                this.prevSearchParams;
            clickSearchBtn.call(
                this,
                expandProps,
                props,
                items,
                type,
                queryInfo
            );
        });
    };

    onVisibleChange = (key, visible) => {
        this.setState({ [key + "Visible"]: visible });
    };

    //设置列设置
    onSetColumn = (data, blockIndex) => {
        this.colinfo = { ...this.colinfo, ...data };
        this.changeWidthAfterSetColumn(data[data.mark]);
        this.colSettingsObj = getColSettingsObj(this.colinfo);
        if (blockIndex > 0)
            this.state.settings.fixedColumnsLeft = blockIndex + 1;
        if (blockIndex == -1) this.state.settings.fixedColumnsLeft = 0;
        changeSortAndFilterIconPosition.call(this);
        tableRender(this, this.state.result);
    };

    changeWidthAfterSetColumn = (data) => {
        //如果设置了列设置 且隐藏之前显示的某一列或者显示了之前隐藏的列，则重新保存列宽
        const { settings } = this.state;
        const oldWidths = settings.colWidths;
        let flag = false;
        data.forEach((item, index) => {
            if (item.isHidden == "true" && oldWidths[item.order] > 2) {
                oldWidths[item.order] = 1;
                flag = true;
            }
            if (item.isHidden == "false" && oldWidths[item.order] < 2) {
                oldWidths[item.order] = 100;
                flag = true;
            }
        });
        if (flag) this.rowResize(oldWidths, "column");
    };

    onFindSelectCells = (findSelectCells = {}) => {
        this.setState({ findSelectCells });
    };

    changeDataViewRef = (key, data) => {
        const { dataViewMenuArr } = this.state;
        let resIndex = dataViewMenuArr.findIndex(
            (item) => item.name === data.refname
        );
        const defaultIndex = dataViewMenuArr.findIndex(
            (item) => item.isdefault
        );
        resIndex = resIndex === -1 ? defaultIndex : resIndex;
        this.setState({ currentSelectDataViewIndex: resIndex });
    };

    clickAllReport = () => {
        if (
            this.state.showDataViewFlag &&
            this.dataViewChild.state.dataViewDropDownVisible
        ) {
            this.dataViewChild.setDropDownDataViewVisibile(false);
        }
    };
    setIsAddNewDataView = (value) => {
        this.setState({ isAddNewDataView: value });
    };

    updateGraphicState = (params) => {
        const { width } = params;
        this.setState(
            {
                graphicParams: {
                    ...this.state.graphicParams,
                    ...params,
                },
            },
            () => {
                setTimeout(() => {
                    this.updateSettings();
                }, 200);
                if (width) {
                    saveGraphicSliderWidth.call(this, width);
                }
            }
        );
    };

    render() {
        if (this.onlySearchArea)
            return (
                <div className="report-only-search-area">
                    {CreateSearchContent.call(this, {
                        parentProps: this.props,
                        changeDataViewRef: this.changeDataViewRef,
                    })}
                </div>
            );
        const coords = this.isClickCoords;
        const realCoords = getRelCoords.call(this);
        let {
            getUrlParam,
            getSearchParam,
            showSortAndFilter,
            showHighSearchBtn,
            ownReportParams = {},
            button,
            printOther = [],
            disabledDrillColArray, //外部传入来联查按钮是否可点击
            isShowDetailSelect,
            printType,
        } = this.props;
        showSortAndFilter =
            showSortAndFilter === undefined ? true : showSortAndFilter;
        showHighSearchBtn =
            showHighSearchBtn === undefined ? false : showHighSearchBtn;

        const { createButtonApp } = button;
        const drillType =
            ownReportParams.showSearchArea ||
            getUrlParam("webDrillType") ||
            getSearchParam("webDrillType") ||
            "0"; //动态url传参

        const { pk_report } = this.commonParams;

        let {
            settings,
            pagerModalData,
            rollingPagerDataMap,
            outputModalData,
            sideboxData,
            fileName,
            graphicParams,
            preciseDisabled,
            showDrawer,
            showSidebox,
            sideboxStatus,
            isReviewHistory,
            showTimeModal,
            sortAndFilterArea,
            dataViewMenuArr,
            showDataViewFlag,
            dayinVisible,
        } = this.state;

        let {
            noDropdownPrint,
            drillRulesList,
            repCondition,
            pagerData,
            printmenu,
        } = this.initParams;

        let searchStyle = {},
            printSelectClass = "";

        const CONFIGBUTTONS = buttonList.call(this);
        const MOREBUTTONS = moreList.call(this);
        pagerData && pagerData.type != -1
            ? (searchStyle = { borderBottom: "1px solid #ccc" })
            : (searchStyle = { borderBottom: "none" });

        if (drillType == "2") {
            noDropdownPrint = false;
            printSelectClass = "print-position";
        }

        const TABLE_AREA_DOM = createHandsontableDOM({
            app: this,
            afterSelection: afterSelection.bind(this),
            realCoords,
        });

        createContextMenu({
            contentId: "reportTable",
            menus: contextGenerator(this),
            visible: true,
            hidden: this.hideButtonArea,
        });

        return (
            <div
                className="simple-report"
                id="simpleReport"
                onClick={this.clickAllReport}
            >
                {/* <ColumnMenu
                    params={{ ...this.commonParams }}
                    showDrawer={showDrawer}
                    toCloseDrawer={this.toCloseDrawer}
                    data={this.state.result}
                    onSetColumn={this.onSetColumn}
                    colinfo={this.colinfo}
                /> */}
                <ReportTab
                    tabMap={this.reportTabMap}
                    onTabClick={onTabClick.bind(this)}
                />
                <div
                    className={`search-item nc-theme-common-header-bgc nc-theme-area-split-bc ${
                        this.hideButtonArea ? "hide-button-area" : ""
                    }`}
                    style={
                        drillType == "2" || showHighSearchBtn
                            ? { borderBottom: "none" }
                            : { borderBottom: "1px solid #d0d0d0" }
                    }
                    fieldid="header-area"
                >
                    <div
                        style={{
                            paddingLeft: "20px",
                            display: "flex",
                            alignItems: "center",
                            width: "30%",
                        }}
                    >
                        <div>
                            {(createPageIcon && createPageIcon()) || null}
                        </div>
                        <h2
                            fieldid={`${
                                ownReportParams.reportName || fileName
                            }_title`}
                            className="nc-theme-title-font-c"
                            style={{
                                marginLeft: "8px",
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}
                        >
                            {ownReportParams.reportName || fileName}
                        </h2>
                    </div>
                    <div className="button-content">
                        {/* 高级按钮 */}
                        {createHighButtonDOM({
                            showHighSearchBtn,
                            drillType,
                            handleClick: this.handleClick.bind(this, "highBtn"),
                        })}

                        {/* 按钮组 */}
                        {drillType !== "2" && (
                            <ButtonConfig
                                showSortAndFilter={showSortAndFilter}
                                onButtonListClick={this.onButtonListClick}
                                sortAndFilterArea={sortAndFilterArea}
                                buttons={CONFIGBUTTONS}
                                usedColumMap={getSortAndFilterColumn.call(this)}
                                cancelDisabled={{ coords }}
                            />
                        )}

                        {/* 构建联查 */}
                        {createDrillListDOM({
                            drillRulesList,
                            disabledDrillColArray,
                            preciseDisabled,
                            coord: realCoords,
                            relationSearch: relationSearch.bind(this),
                        })}

                        {drillType !== "2" &&
                            createButtonApp({
                                area: "button_area",
                                onButtonClick: this.onRegBtnClick,
                            })}

                        {/* 打印dom */}
                        {createPrintListDOM({
                            printmenu,
                            printOther,
                            noDropdownPrint,
                            drillType,
                            onVisibleChange: this.onVisibleChange,
                            onHandlePrint: () =>
                                commomPrint.call(this, "print"),
                            dayinVisible,
                            printSelectClass,
                            printType,
                            onPrintMenuClick: (key) => {
                                this.setState({ dayinVisible: false });
                                commomPrint.call(this, key);
                            },
                        })}

                        {showDataViewFlag && (
                            <DataViewSetting
                                {...this.props}
                                reportId={this.commonParams.pk_report}
                                onRef={this.onDataViewRef}
                                relationAreaPkList={this.relationAreaPkList}
                                dataViewSourceData={dataViewMenuArr}
                                getAllViewData={this.getAllViewData}
                                fetchTableData={this.fetchTableData}
                                setCurSelectDataViewIndex={
                                    this.setCurSelectDataViewIndex
                                }
                                dataViewMiddleCacheData={
                                    this.dataViewMiddleCacheData
                                }
                                setDataViewCacheData={this.setDataViewCacheData}
                                setIsAddNewDataView={this.setIsAddNewDataView}
                                currentSelectDataViewIndex={
                                    this.state.currentSelectDataViewIndex
                                }
                            />
                        )}

                        {/* 汇总明细 */}
                        {createDetailSelectDOM({
                            isShowDetailSelect,
                            filterMenuClick: filterMenuClick.bind(this),
                            commonParams: this.commonParams,
                            isClickSearchBtn: this.isClickSearchBtn,
                        })}

                        {isFunction(this.props.CreateNewSearchArea) ? (
                            <div className="btn-box">
                                {(isFunction(this.props.CreateNewSearchArea) &&
                                    this.props.CreateNewSearchArea(
                                        preciseDisabled,
                                        settings.data,
                                        coords
                                    )) ||
                                    null}
                            </div>
                        ) : null}
                        {drillType !== "2" && (
                            <ButtonConfig
                                onButtonListClick={this.onButtonListClick}
                                buttons={MOREBUTTONS}
                            />
                        )}

                        {/* 侧边栏 */}
                        {createSiderBarDOM({
                            graphicParams,
                            handleClick: this.handleClick.bind(this, "sideBox"),
                        })}
                        {/* 全屏显示按钮 */}
                        {createFullScreenDOM.call(this)}
                        {drillType !== "2"
                            ? createHistoryInfoDOM.call(this)
                            : null}
                    </div>
                </div>
                <div
                    className={`${
                        drillType == "2" || showHighSearchBtn
                            ? "hide"
                            : "show nc-theme-gray-area-bgc nc-theme-area-split-bc"
                    } ${isReviewHistory ? "is-history" : ""}`}
                    id="reportSearchArea"
                    style={searchStyle}
                >
                    {drillType !== "2"
                        ? CreateSearchContent.call(this, {
                              parentProps: this.props,
                              changeDataViewRef: this.changeDataViewRef,
                          })
                        : null}
                </div>
                {pagerData && pagerData.pageInfo && (
                    <div
                        className="nc-theme-gray-area-bgc nc-theme-area-split-bc"
                        style={{
                            display: "flex",
                            borderTop: "1px solid #d0d0d0",
                        }}
                    >
                        <Rolling
                            ref="rolling"
                            rollingPagerData={rollingPagerDataMap[pk_report]}
                            pagerData={pagerData}
                            allData={repCondition}
                            showPagerClick={showPagerClick.bind(this)}
                            rollingUpDown={rollingUpDown.bind(this)}
                            rollingFilterClick={rollingFilterClick.bind(this)}
                            onRollingClear={onRollingClear.bind(this)}
                            checkPaper={this.checkPaper.bind(this)}
                        />
                    </div>
                )}

                {/* 表格部分 */}
                {TABLE_AREA_DOM}

                <FilterModal
                    ref="filterModal"
                    handleClose={closeFilterModal.bind(this)}
                    handleSubmmit={getFilterData.bind(this)}
                />
                <PagerModal
                    ref="pagerModal"
                    pagerModalData={pagerModalData}
                    checkPaper={this.checkPaper.bind(this)}
                    closePagerModal={this.closePagerModal}
                    rollingPagerData={rollingPagerDataMap[pk_report]}
                />
                <ShareModal
                    ref="shareModal"
                    shareReport={shareReport.bind(this)}
                    data={this.props}
                />
                <OutputModal
                    ref="outputModal"
                    outputReport={templatePrint.bind(this)}
                    outputModalData={outputModalData}
                />
                <ConfirmModal
                    ref="confirmModal"
                    sureConfirmModal={this.sureConfirmModal}
                />
                {showTimeModal && (
                    <TimeModal
                        show={showTimeModal}
                        parentProps={this.props}
                        commonParams={this.commonParams}
                        maxrow={this.pageParams.maxrow}
                        pageParams={this.pageParams}
                        onTimeModalHide={this.onTimeModalHide}
                        ownReportParams={this.props.ownReportParams}
                    />
                )}

                <PrintPageSetting
                    ref={(ref) => {
                        if (ref) this.printPageSettingRef = ref;
                    }}
                    reportId={this.commonParams.pk_report}
                    isClickSearchBtn={this.isClickSearchBtn}
                />
                {/* <NCButton onClick={() => {
          this.printPageSettingRef.triggered()
        }}>打印输出设置</NCButton> */}
                {showSidebox && (
                    <NCSidebox
                        show={showSidebox}
                        propContainer={document.getElementById("reportTable")}
                        onClose={() => this.setState({ showSidebox: false })}
                        title={getShareSideboxTitle(sideboxStatus)}
                        width="350px"
                    >
                        <CreateShareBodyDOM
                            type={sideboxStatus}
                            data={sideboxData}
                            onSliderItemClick={this.onSliderItemClick}
                            isReviewHistory={isReviewHistory}
                            changeNotReadCount={() =>
                                this.setState({ notReadCount: 0 })
                            }
                        />
                    </NCSidebox>
                )}
            </div>
        );
    }
}

SimpleReport = createPage({})(SimpleReport);
export default SimpleReport;
