import React, {
    useState,
    useEffect,
    useMemo,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Rnd } from "react-rnd";
import CreateSiderBar from "./CreateSiderBar";
import {
    getSideBarListData,
    getTargetAreaList,
    checkPosInArea,
    getAnalysisParams,
} from "./methods";
import DCTab from "../components/DCTab";
import { WEB_DRILL_TYPE } from "./constans";
import {
    refreshGraphic,
    refreshReport,
    getReportFormatQuery,
    turnPageRequest,
} from "@public/utils/requests";
import {
    checkTreeData,
    toggleGroup,
    toggleTree,
} from "@components/ReportTable/events/treeFun";
import Utils from "@public/utils";
const { getTimeOffset, langCheck } = Utils;
import "./index.less";

const REFRESH_LIST = ["search", "dim"];

export default forwardRef(function GraphicComponent(params, ref) {
    const {
        graphicParams,
        updateGraphicState,
        commonParams,
        realCoords,
        sendSearchParams,
        pointMap,
        coverRowData,
        preciseDisabled,
        currentSelectedCell,
    } = params;

    const [targetAreaSiderBarList, setTargetAreaSiderBarList] = useState([]); //当前拓展区侧边栏列表
    const [graphicWidth, setGraphicWidth] = useState(
        graphicParams.width || 800
    ); //侧边栏通用的参数
    const [graphicList, setGraphicList] = useState([]); //侧边栏列表，包含每个拓展区，为二维数组
    const [activeKey, setActiveKey] = useState(""); //当前选中的侧边栏项
    const [currentTabParams, setCurrentTabParams] = useState({}); //当前选中的侧边栏项
    const [reportData, setReportData] = useState({ refreshKey: 1, data: null }); //侧边栏报表数据
    const [currentPos, setCurrentPos] = useState();

    useImperativeHandle(ref, () => ({
        refreshGraphic: (type) => {
            const { needLoadWhenQuery } = currentTabParams || {};
            //type : init  search  dim(页维度刷新)
            if (
                (type === "search" && needLoadWhenQuery) ||
                type === "init" ||
                type === "dim"
            ) {
                //展开状态下，并且设置了查询加载数据，或者初始时
                changeEffect(type);
            }
        },
    }));

    //当前格子是否在拓展区内
    const isInArea = useMemo(() => {
        return checkPosInArea(realCoords, pointMap);
    }, [realCoords.row, realCoords.col]);

    useEffect(() => {
        //设置总数据
        const sideBarListData = getSideBarListData(graphicParams);
        setGraphicList(sideBarListData);

        //初始化渲染当前拓展区的侧边栏
        const targetArea = getTargetSiderBarData(sideBarListData);
        if (targetArea[0]) {
            //设置第一个tab选中
            const { code } = targetArea[0];
            setTargetAreaSiderBarList(targetArea);
            setActiveKey(code);
            setCurrentTabParams(targetArea[0]);
        }
    }, []);

    //获取当前拓展区侧拉数据
    function getTargetSiderBarData(sideBarListData) {
        if (!sideBarListData.length) {
            //如果没有，则去原始数据的，避免第一次打开时候找不到数据
            sideBarListData = getSideBarListData(graphicParams);
        }
        const targetArea = getTargetAreaList({
            pointMap,
            realCoords,
            graphicList: sideBarListData,
            currentSelectedCell,
        });
        if (targetArea && targetArea[0] && targetArea[0].code) {
            return targetArea;
        }
        return [];
    }

    //侧边栏tab点击事件,设置当前tab下的参数
    function tabOnClick(activeKey) {
        setActiveKey(activeKey);

        const target = (targetAreaSiderBarList || []).find(
            (item) => item.Key === activeKey
        );
        refreshRowData(target);
    }

    //切换单元格处理
    useEffect(() => {
        if (!isInArea) return setCurrentPos(realCoords);

        changeEffect();
    }, [realCoords.row, realCoords.col]);

    //切换单元格时;查询时需要处理的逻辑，需要传type
    function changeEffect(type) {
        const targetArea = getTargetSiderBarData(graphicList);
        const { code } = targetArea[0] || {};
        const { code: otherCode } =
            (targetAreaSiderBarList && targetAreaSiderBarList[0]) || {};

        if (!code) {
            setActiveKey("");
            setTargetAreaSiderBarList([]);
            return;
        }

        if (code !== otherCode) {
            //进入其他区域的侧边栏设置，需要重新设置
            setTargetAreaSiderBarList(targetArea);
            setActiveKey(code);
            refreshRowData(targetArea[0], type);
        } else {
            if (currentTabParams.needRefreshWhenClickRowData || type)
                refreshRowData(undefined, type);
        }
    }

    function getCoordParam() {
        if (!currentSelectedCell) {
            const firstArea = Object.keys(pointMap)[0];
            const [row, col] = (pointMap[currentTabParams.areaPK] || firstArea)
                .area;
            return { row, col, isSelectedCell: false };
        }
        return { ...realCoords, isSelectedCell: true };
    }

    async function refreshRowData(target, type) {
        const {
            analysis_params,
            targetcode,
            targetPage,
            aimReportPk,
            needRefreshWhenClickRowData,
            webDrillType,
            pk_storyboard: graphicPK,
            analysisParams,
            code,
        } = target || currentTabParams;
        const { row, col: column, isSelectedCell } = getCoordParam();

        //智能分析自己请求完成后再设值，避免两次设值刷新两次
        if (target) {
            if (
                target.webDrillType !== WEB_DRILL_TYPE.analysis ||
                !sendSearchParams.querycondition
            ) {
                setCurrentTabParams(target);
            }
        }

        if (
            WEB_DRILL_TYPE.report === webDrillType &&
            (!sendSearchParams.querycondition ||
                (preciseDisabled && currentSelectedCell))
        ) {
            //不查询或者没有在有效区域内，侧边栏报表只加载表头部分
            const data = await getReportFormatQuery({
                data: {
                    key_time_offset: getTimeOffset(),
                    pk_report: aimReportPk,
                },
            });
            return setReportData((prev) => {
                return {
                    ...prev,
                    refreshKey: prev.refreshKey + 1,
                    data,
                    pager: data.pager,
                };
            });
        }

        //1.选中行刷新并且此次选中单元格跟上次不一致 2.传入了target 要进行刷新
        const isSame =
            JSON.stringify(currentPos) === JSON.stringify(realCoords);

        if (
            (type === "init" && !needRefreshWhenClickRowData) ||
            REFRESH_LIST.includes(type) ||
            (needRefreshWhenClickRowData && !isSame) ||
            target
        ) {
            setCurrentPos(realCoords);
            if (!sendSearchParams.querycondition) return;

            switch (webDrillType) {
                case WEB_DRILL_TYPE.analysis:
                    handleGraphicParams();
                    break;
                case WEB_DRILL_TYPE.report:
                    handleReportParams();
                    break;
                default:
                    break;
            }
        }

        //修改报表数据
        async function handleReportParams() {
            const data = await refreshReport({
                ...commonParams,
                pageInfo: getPageInfo(),
                row,
                column,
                targetRepPk: aimReportPk,
                appcode: targetcode,
                pageCode: targetPage,
                webDrillType: "2",
                dirllcode: code,
                isSelectedCell,
                querycondition: sendSearchParams.querycondition,
                key_time_offset: getTimeOffset(),
                analysis_params: JSON.stringify(analysis_params),
                requireTotalData: reportData.isClickShowAllCount === undefined ? "false" : "true"
            });

            //处理树形
            checkTreeData(data);
            setReportData((prev) => {
                return {
                    ...prev,
                    refreshKey: prev.refreshKey + 1, 
                    data,
                    isClickShowAllCount: reportData.isClickShowAllCount === undefined ? true : false
                };
            });
        }

        //获取图形化点击单元格时的数据，然后刷新图表
        async function handleGraphicParams() {
            if (
                !currentSelectedCell ||
                (!needRefreshWhenClickRowData && !isInArea)
            ) {
                //兼容后端报错
                setCurrentTabParams((prev) => {
                    return {
                        ...prev,
                        ...(target || {}),
                        ts: Date.now(),
                        search_params: sendSearchParams,
                        analysis_params: getAnalysisParams(analysisParams),
                    };
                });
            } else {
                const data = await refreshGraphic({
                    clickPos: {
                        row,
                        column,
                    },
                    ...sendSearchParams,
                    transSaveObject: commonParams.transSaveObject,
                    operationQueue: commonParams.operationQueue,
                    sideBarSet: {
                        pk_storyboard: graphicPK,
                        sideBarParams: analysisParams,
                    },
                });

                let { reportRowData, pk_storyboard, analysis_params } = data;
                if (coverRowData) {
                    let doCoverRowData = coverRowData(reportRowData);
                    const result = await doCoverRowData();
                    reportRowData = result;
                }
                setCurrentTabParams((prev) => {
                    return {
                        ...prev,
                        ...(target || {}),
                        reportRowData,
                        pk_storyboard,
                        analysis_params,
                    };
                });
            }
        }
    }

    async function onPagerChange(params) {
        const data = await turnPageRequest({
            ...params,
            ...commonParams,
            querycondition: sendSearchParams.querycondition,
        });
        setReportData((prev) => {
            return {
                ...prev,
                refreshKey: prev.refreshKey + 1,
                data,
                pager: data.pager,
            };
        });
    }

    function getRealCount() {
        setReportData((prev) => {
            return {
                ...prev,
                isClickShowAllCount: false
            };
        });
        refreshRowData(undefined, "search");
    }

    function getPageInfo() {
        let pageInfo;
        if (reportData.pager) {
            const { pageSize } = reportData.pager;
            pageInfo = {
                pageSize,
                pageIndex: "1",
            };
        }
        return pageInfo;
    }

    //报表树形点击事件
    function toggleHandler(coord, type) {
        const { CellsModel = {} } = reportData.data;
        const { row, col } = coord;
        let { currentData, config, mergeCols } =
            CellsModel.DynamicModel[0].siderBarTreeParams;
        const { fieldNameCol, innercodeCol, parentcodeCol, levelAreaType } =
            config;
        const curCol = fieldNameCol || innercodeCol || parentcodeCol;

        // 分组
        if (levelAreaType === "groupFold") {
            toggleGroup({
                currentData: JSON.parse(JSON.stringify(currentData)),
                config,
                row,
                col,
                result: reportData.data,
                type,
            });
        }
        // 树
        else {
            toggleTree({
                currentData: JSON.parse(JSON.stringify(currentData)),
                mergeCols,
                row,
                col: curCol,
                result: reportData.data,
                type,
            });
        }

        setReportData((prev) => {
            return {
                ...prev,
                refreshKey: prev.refreshKey + 1,
                data: reportData.data,
            };
        });
    }

    const siderbarListLength =
        targetAreaSiderBarList && targetAreaSiderBarList.length;

    return (
        <div className="graphic-box" style={{ width: parseInt(graphicWidth) }}>
            <Rnd
                disableDragging={true}
                position={{ x: 0, y: 0 }}
                size={{
                    width: +graphicWidth,
                    height: "100%",
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    const w = parseInt(ref.style.width);
                    if (w < 100) return;
                    updateGraphicState({ width: w });
                    setGraphicWidth(w);
                    setReportData((prev) => {
                        return {
                            ...prev,
                            refreshKey: prev.refreshKey + 1,
                        };
                    });
                }}
            >
                {siderbarListLength ? (
                    <div className="graphic-tab-container nc-theme-area-split-bc">
                        <div
                            className={`siderbar-container ${
                                siderbarListLength === 1 ? "no-tab" : ""
                            }`}
                        >
                            <CreateSiderBar
                                params={{
                                    ...currentTabParams,
                                    activeKey,
                                    ...realCoords,
                                }}
                                reportData={reportData}
                                onPagerChange={onPagerChange}
                                toggleHandler={toggleHandler}
                                getRealCount={getRealCount}
                            />
                        </div>
                        {siderbarListLength > 1 ? (
                            <div className="tab-container nc-theme-area-bgc">
                                <DCTab
                                    tabOnClick={tabOnClick}
                                    defaultActive={activeKey}
                                    tab={targetAreaSiderBarList}
                                    showTool={true}
                                    toolOnClick={(e, item, data) =>
                                        tabOnClick(data.key)
                                    }
                                ></DCTab>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <p className="no-drill-area">
                        {langCheck("reportMultiLang", "100301-000272")}
                    </p>
                )}
            </Rnd>
        </div>
    );
});
