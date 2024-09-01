import React from "react";
import Handsontable from "@public/office";
import defaultSettings from "@common/defaultSettings";
import Pagintion from "@public/pagination";
import { renderTD } from "../../ReportTable/events/myRender";
import {
    getReportSettings,
    getMergeCells,
    sliceData,
} from "../../ReportTable/events/methods";
let targetEventDOM = null;

function CreateReport(props) {
    //根据props.params.webDrillType 渲染不同的
    const { reportData, onPagerChange, toggleHandler, getRealCount } = props;
    const { data, isClickShowAllCount } = JSON.parse(JSON.stringify(reportData));

    const {
        CellsModel,
        ReportDataStartPostion = {},
        pager,
        reportType,
        is_no_pagination,
        reportId,
        dataRowNum,
        preloadMaxRow
    } = data || {};

    const reportDataStartPostion = ReportDataStartPostion.row || 0;

    if (reportDataStartPostion) sliceData(data, reportDataStartPostion);

    const {
        tdStyle,
        cellsWidth,
        tableData = [[]],
        rowHeights,
        levelAreaType,
    } = getReportSettings(CellsModel);

    const { mergeCells } = getMergeCells(data, 0, 0, cellsWidth);

    const settings = {
        ...defaultSettings,
        data: tableData,
        colWidths: cellsWidth,
        rowHeights,
        mergeCells,
        cells: function (row, col, prop) {
            this.renderer = myRender;
        },
    };

    function myRender(nstance, td, row, col, prop, value, cellProperties) {
        renderTD({
            td,
            col,
            value,
            row,
            tdStyle,
            isChange: true,
            isFromPreview: true,
            reportDataStartPostion,
            levelAreaType,
        });
    }

    function getPagerParams(params = {}) {
        const { pageSize, pageIndex, allRowCount } = pager;
        return {
            allRowCount,
            pageInfo: {
                pageSize,
                pageIndex,
                ...params,
            },
            pk_report: reportId,
            reportId,
        };
    }

    function pageClick(pageIndex) {
        //分页 todo
        const params = getPagerParams({ pageIndex });
        onPagerChange(params);
    }

    function handleChange(pageSize) {
        const params = getPagerParams({ pageIndex: "1", pageSize });
        onPagerChange(params);
    }

    function afterOnCellMouseDown(e) {
        targetEventDOM = e;
    }

    function afterSelection(obj, r, c, r2, c2) {
        const { which, target = {} } = targetEventDOM || {};
        const { className } = target;

        if (which === 3) return;

        const row = target.getAttribute("data_row");
        const col = target.getAttribute("data_col");

        const result = reportData.data;

        const { isCollapse } =
            (result.CellsModel.DynamicModel[0].cellsArray &&
                result.CellsModel.DynamicModel[0].cellsArray[row] &&
                result.CellsModel.DynamicModel[0].cellsArray[row][col] &&
                result.CellsModel.DynamicModel[0].cellsArray[row][col][3]) ||
            {};
        //  展开
        if (isCollapse === true && className === "iconfont icon-shushouqi") {
            toggleHandler({ row, col }, "open");
        } else if (
            isCollapse === false &&
            className === "iconfont icon-shu_zk"
        ) {
            toggleHandler({ row, col }, "close");
        }
    }

    return (
        <div className="tab-container-report">
            <Handsontable
                settings={settings}
                afterOnCellMouseDown={afterOnCellMouseDown}
                afterSelection={afterSelection}
            />
            {reportType != "2" && !is_no_pagination ? (
                <Pagintion
                    pager={pager}
                    dataRowNum={dataRowNum}
                    preloadMaxRow={preloadMaxRow}
                    pageClick={pageClick}
                    handleChange={handleChange}
                    reportType={reportType}
                    isClickShowAllCount={isClickShowAllCount}
                    getRealCount={getRealCount}
                />
            ) : null}
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    const prevReportData = prevProps.reportData;
    const nextReportData = nextProps.reportData;
    if (prevReportData.refreshKey === nextReportData.refreshKey) {
        console.log("不刷新");
        return true;
    } else {
        console.log("刷新");
        return false;
    }
}

export default React.memo(CreateReport, areEqual);
