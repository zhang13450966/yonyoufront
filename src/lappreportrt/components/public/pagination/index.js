import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCPagination, NCSelect } = base;
import Utils from "@public/utils";
const { langCheck } = Utils;
const NCOption = NCSelect.NCOption;
require("./index.less");

const PAGEINFO = [200, 500, 1000, 2000, 5000, 10000];

export default class Pagintion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 是否隐藏分页select的下拉, 默认是false, 允许显示
            hideDropdown: false,
        };
    }

    renderPageSizeSelect() {
        const { pager, handleChange } = this.props;
        const { hideDropdown } = this.state;
        const dropdownStyle = hideDropdown
            ? { dropdownStyle: { display: "none" } }
            : {};

        return (
            <NCSelect
                fieldid="page-size"
                value={String(pager.pageSize)}
                style={{ width: 100 }}
                showClear={false}
                dropdownClassName="report-pager-options"
                className="fl simple-pagination-select"
                onSelect={(val) => handleChange(val)}
                onChange={(val) => {
                    if (Array.isArray(val)) {
                        val = val[0];
                        handleChange(val);
                    }
                }}
                onFocus={() => {
                    // select获取焦点后将下拉框显示出来

                    if (hideDropdown) {
                        this.setState({ hideDropdown: false });
                    }
                }}
                onSearch={() => {
                    // 在select的input录入过程中的回调
                    if (!hideDropdown) {
                        this.setState({ hideDropdown: true });
                    }
                }}
                onKeyDown={(e) => {
                    // 回车键应用自定义值
                    if (e.keyCode == 13) {
                        document
                            .querySelector(
                                ".simple-pagination-select .wui-select-selection-search-input"
                            )
                            .blur();
                    }
                }}
                // 给select下拉框设置显示隐藏
                {...dropdownStyle}
                // 设置select可以input输入自定义项
                supportSearch={true}
                showSearch={true}
                supportWrite={true}
            >
                {PAGEINFO.map((item) => (
                    <NCOption value={item}>
                        {`${item} ${langCheck(
                            "reportMultiLang",
                            "100301-000004"
                        )}/${langCheck("reportMultiLang", "100301-000109")}`}
                    </NCOption>
                ))}
            </NCSelect>
        );
    }

    render() {
        let {
            pager = {},
            preloadMaxRow,
            isClickShowAllCount,
            dataRowNum,
            isConnection,
            reportType,
            getRealCount,
            pageClick,
            handleChange,
        } = this.props;
        const { pageSize, allRowCount, pageIndex } = pager;
        let allCount =
            (isClickShowAllCount &&
                preloadMaxRow != -1 &&
                +preloadMaxRow <= +allRowCount) ||
            (isConnection &&
                preloadMaxRow != -1 &&
                +preloadMaxRow <= +allRowCount)
                ? preloadMaxRow + "+"
                : reportType == "0"
                ? dataRowNum
                : allRowCount;
        if (dataRowNum == 0) allCount = 0;
        const isAll = isClickShowAllCount && (preloadMaxRow != -1) && (+preloadMaxRow <= +allRowCount)
        return (
            <div className="pagintion nc-theme-area-bgc nc-theme-area-split-bc nc-theme-common-font-c" fieldid="pagination-div">
                <div className="page-left">
                    <div className="pager-select">
                        {isAll && (
                                <span className="ensure" onClick={getRealCount}>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000066"
                                    )}
                                    {/* 国际化处理： 显示全部*/}
                                </span>
                            )}
                    </div>
                    <div
                        id="calcContent"
                        style={{ marginLeft: 30, display: "none" }}
                    >
                        <span>
                            {langCheck("reportMultiLang", "100301-000067")}
                            <span className="totle" id="totalSumNum" />
                        </span>
                        {/* 国际化处理： 求和:*/}
                        <span style={{ marginLeft: "30px" }}>
                            {langCheck("reportMultiLang", "100301-000068")}
                            <span className="totle" id="totalCountNum" />
                        </span>
                        {/* 国际化处理： 计数:*/}
                    </div>
                </div>
                <div className="page-right">
                    <NCPagination
                        disabled={isAll}
                        prev
                        next
                        boundaryLinks
                        pageSize={pageSize}
                        total={allCount}
                        maxButtons={5}
                        current={+pageIndex}
                        showSizeChanger={true}
                        pageSizeOptions={PAGEINFO}
                        onPageSizeChange={(index, pageSize) => {
                            if (pageSize == pager.pageSize) return;
                            handleChange(pageSize);
                        }}
                        pageSizeInput={10000}
                        onChange={pageClick}
                    />
                </div>
            </div>
        );
    }
}
