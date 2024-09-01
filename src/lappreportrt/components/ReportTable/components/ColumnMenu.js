import React, { Component } from "react";
import { base, ajax, toast } from "nc-lightapp-front";
const { NCButton, NCDnd, NCButtonGroup, NCTooltip, NCSidebox } = base;
import Utils from "@public/utils";
const { langCheck, arraySum } = Utils;
import "./column.less";

//!2111版本有了数据视图后，此功能已删除

class ColumnMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnData: [], //全部列数据
            sortData: [], //已添加
            mark: "",
            blockIndex: 0,
            headerArray: [], //列宽
        };
        this.lockTotal = 0; //被锁定不能拖拽的列个数
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showDrawer === true) {
            this.lockTotal = 0;
            const { colinfo, data } = nextProps;
            if (colinfo && JSON.stringify(colinfo) !== "{}") {
                const headerArray = data.CellsModel.columnHeader.headerArray;
                const pageColInfo = JSON.parse(JSON.stringify(colinfo));
                const columnData = pageColInfo[pageColInfo.mark].sort(
                    (a, b) => {
                        return a.originLoc - b.originLoc;
                    }
                ); //暂时只处理一个拓展区
                columnData.forEach((item) => {
                    if (item.isHidden == "false" && headerArray[item.order] < 2)
                        item.isHidden = "true";
                });

                const showData = columnData
                    .filter((item) => item.isHidden === "false")
                    .sort((a, b) => {
                        return a.order - b.order;
                    });
                const lockData = showData.filter(
                    (item) => item.isLock === "true"
                );
                const unLockData = showData.filter(
                    (item) => item.isLock === "false"
                );
                this.lockTotal = lockData.length;

                this.setState({
                    sortData: [...lockData, ...unLockData],
                    columnData,
                    mark: pageColInfo.mark,
                    headerArray,
                    blockIndex:
                        lockData.length > 0
                            ? Number(lockData[lockData.length - 1].order) + 1
                            : 0,
                });
            }
        }
    }

    //拖拽排序列表
    sortColumnList = () => {
        const { sortData } = this.state;
        const alreadShowColumns = sortData.filter(
            (val) => val.isLock !== "true"
        );
        let orderIndex = this.lockTotal;

        return alreadShowColumns.map((val, index) => {
            return (
                <div
                    key={val.fieldCode}
                    className={`show-column ${
                        val.isLock === "false" ? "toLock" : "lockedCol"
                    }`}
                >
                    <span className="order">{orderIndex + index + 1}</span>
                    <span className="label">{val.headline}</span>
                    {val.isLock === "false" && (
                        <i
                            className={"icon iconfont icon-shanchu4 close"}
                            onClick={() =>
                                this.ToHideOneCol(val, orderIndex + index)
                            }
                        />
                    )}
                    <i
                        className={`icon iconfont icon-weisuoding ${
                            val.isLock === "false" ? "toLock" : "unLock"
                        }`}
                        onClick={this.ToLockCols.bind(
                            this,
                            val,
                            orderIndex - 1
                        )}
                    />
                    {val.isLock === "false" && (
                        <i className={"icon iconfont icon-tuozhuai handle"} />
                    )}
                </div>
            );
        });
    };

    //侧拉的头部结构
    DrawerHeader = () => {
        const LIST = [
            {
                title: langCheck("reportMultiLang", "100301-000059"),
                colors: "primary",
                key: "confirm",
                onClick: this.onColsSetting,
                className: "button-primary",
            },
            {
                title: langCheck("reportMultiLang", "100301-000125"),
                key: "reset",
                colors: "secondary",
                onClick: this.onColReset,
            },
        ];
        const tip = (
            <div>
                <p>{langCheck("reportMultiLang", "100301-000128")}:</p>
                <p>
                    1.{" "}
                    {langCheck("reportMultiLang", "100301-000129") +
                        `"${langCheck("reportMultiLang", "100301-000126")}"` +
                        langCheck("reportMultiLang", "100301-000130") +
                        langCheck("reportMultiLang", "100301-000131")}
                    <i className="iconfont icon-shanchu4" />，
                    {langCheck("reportMultiLang", "100301-000132")}
                </p>
                <p>
                    2.{" "}
                    {langCheck("reportMultiLang", "100301-000133") +
                        `"${langCheck("reportMultiLang", "100301-000127")}"` +
                        langCheck("reportMultiLang", "100301-000130") +
                        langCheck("reportMultiLang", "100301-000134")}
                    <i className="iconfont icon-tuozhuai" />，
                    {langCheck("reportMultiLang", "100301-000135")}
                </p>
                <p>
                    3. {langCheck("reportMultiLang", "100301-000129")}
                    <i className="iconfont icon-weisuoding" />
                    {langCheck("reportMultiLang", "100301-000136")}
                </p>
            </div>
        );
        return (
            <div className="setTableColumnDrawer-header">
                <h3 className="title nc-theme-common-font-c">
                    {langCheck("reportMultiLang", "100301-000118")}
                    <NCTooltip
                        placement="right"
                        className="col-setting-tips"
                        overlay={tip}
                    >
                        <i className="icon iconfont icon-bangzhutishi" />
                    </NCTooltip>
                </h3>
                <div className="headerBtns">
                    <NCButtonGroup list={LIST} />
                    <NCButton
                        className="cancel-btn"
                        onClick={this.toCloseDrawer}
                    >
                        {langCheck("reportMultiLang", "100301-000048")}
                    </NCButton>
                </div>
            </div>
        );
    };

    //确定保存
    onColsSetting = () => {
        const { sortData, columnData, mark, blockIndex } = this.state;
        let result = columnData.filter(function (v) {
            return sortData.every((n) => v.fieldCode !== n.fieldCode);
        });

        const columnSettingArrays = [...sortData, ...result];
        columnSettingArrays.forEach(
            (item, index) => (item.order = columnData[index].originLoc)
        );
        ajax({
            url: "/nccloud/report/widget/columnsettingsave.do",
            data: {
                pk_report: this.props.params.pk_report,
                [mark]: columnSettingArrays,
                mark,
            },
            success: (res) => {
                toast({
                    content: langCheck("reportMultiLang", "100301-000013"),
                    color: "success",
                });
                this.onSetColumn(
                    { [mark]: columnSettingArrays, configOrNot: "true", mark },
                    Number(blockIndex)
                );
            },
        });
    };

    //确定或者重置要更新父组件的colinfo
    onSetColumn = (data, blockIndex = -1) => {
        this.toCloseDrawer();
        this.props.onSetColumn && this.props.onSetColumn(data, blockIndex);
    };

    //重置
    onColReset = () => {
        ajax({
            url: "/nccloud/report/widget/columnsettingreset.do",
            data: {
                pk_report: this.props.params.pk_report,
                mark: this.state.mark,
                appcode: this.props.params.appcode,
                originColinfo: this.props.colinfo,
            },
            success: (res) => {
                toast({
                    content: langCheck("reportMultiLang", "100301-000121"),
                    color: "success",
                });
                const data = res.data;
                data[data.mark].forEach(
                    (item) => (item.order = item.originLoc)
                );
                this.onSetColumn(data);
            },
        });
    };

    //关闭侧拉框
    toCloseDrawer = () => {
        this.props.toCloseDrawer();
    };

    //添加至已添加内
    chooseColumn = (item, index) => {
        const { sortData, columnData } = this.state;
        for (let i = 0; i < columnData.length; i++) {
            if (columnData[i].fieldCode === item.fieldCode)
                columnData[i].isHidden = "false";
        }
        this.setState({
            sortData: [...sortData, item],
            columnData,
        });
    };

    //点击锁锁定该列之前的列 锁定之后该列以及之前的列不参与排序
    ToLockCols = (ele, index) => {
        let { sortData, headerArray } = this.state;
        let blockIndex = 0;

        let toLock = true;
        if (ele.isLock === "false") {
            //加锁
            blockIndex = ele.order;
            const tableWidth =
                document.getElementsByClassName("hot-table")[0].offsetWidth;
            let overFlowWidth = arraySum(
                headerArray.slice(0, ele.order > 0 ? ele.order : 1)
            );
            if (overFlowWidth > tableWidth)
                return toast({
                    content: langCheck("reportMultiLang", "100301-000001"),
                    color: "warning",
                }); /* 国际化处理： 当前位置超出一屏,暂不支持冻结。*/

            sortData = sortData.map((val) => {
                if (toLock === true && val.isLock === "false") {
                    val.isLock = "true";
                    this.lockTotal++;
                }
                if (val.fieldCode === ele.fieldCode) {
                    toLock = false;
                }
                return val;
            });
        } else {
            //解锁
            blockIndex = -1;
            sortData = sortData.map((val) => {
                if (val.isLock === "true") {
                    val.isLock = "false";
                    this.lockTotal--;
                }
                return val;
            });
        }

        this.setState({
            sortData,
            blockIndex,
        });
    };

    //拖拽结束
    onDragEnd = (result) => {
        const { sortData } = this.state;
        let unlockSortData = sortData.filter((val) => val.isLock !== "true");
        let lockSortData = sortData.filter((val) => val.isLock === "true");
        const { source, destination } = result;
        const startIndex = source.index;
        const endIndex = destination.index;

        let data1 = unlockSortData.splice(startIndex, 1);
        unlockSortData.splice(endIndex, 0, data1[0]);
        let newSortData = lockSortData.concat(unlockSortData);

        this.setState({
            sortData: newSortData,
        });
    };

    //点击X按钮让某一列隐藏
    ToHideOneCol = (ele, index) => {
        let { sortData, columnData } = this.state;
        for (let i = 0; i < columnData.length; i++) {
            if (columnData[i].fieldCode === ele.fieldCode)
                columnData[i].isHidden = "true";
        }
        sortData.splice(index, 1);
        this.setState({
            sortData,
            columnData,
        });
    };

    render() {
        const { showDrawer } = this.props;
        if (!showDrawer) return null;
        const { columnData, sortData } = this.state;
        const lockedData = sortData.filter((val) => val.isLock === "true");
        const rightList = sortData.map((item) => item.fieldCode); //右侧列表数据
        return (
            <NCSidebox
                title={this.DrawerHeader()}
                show={showDrawer}
                //placement="right"
                mask={true}
                maskClose={this.toCloseDrawer}
                width={1000}
                //maskClosable={false}
                onClose={this.toCloseDrawer}
                //destroyOnClose={true} //关闭时候是否销毁抽屉的内容
                className="setTableColumnDrawer report-column-drawer"
            >
                <div className="TableColumnContent">
                    <div className="TableColumnContent-left-box">
                        <h3 className="TableColumnContent-title">
                            {langCheck("reportMultiLang", "100301-000126")}
                        </h3>
                        <ul className="TableColumnContent-left">
                            {columnData.map((item, i) => {
                                let isRowEndItem = false;
                                if ((i + 1) % 4 === 0) isRowEndItem = true;
                                return (
                                    <li
                                        key={item.fieldCode}
                                        className={`${
                                            item.isHidden === "true"
                                                ? ""
                                                : "is-hidden"
                                        } per-column ${
                                            isRowEndItem ? "row-end-item" : ""
                                        } ${
                                            rightList.includes(item.fieldCode)
                                                ? "unselectedColumn"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            onClick={() => {
                                                if (item.isHidden === "false")
                                                    return;
                                                this.chooseColumn(item, i);
                                            }}
                                        >
                                            <span className="plusBtn">+</span>
                                            <span className="Column-label">
                                                {item.headline}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="TableColumnContent-right-box">
                        <h3 className="TableColumnContent-title">
                            {langCheck("reportMultiLang", "100301-000127")}
                        </h3>
                        <div className="TableColumnContent-right">
                            <ul className="lockedCol">
                                {lockedData.map((val, index) => {
                                    return (
                                        <li
                                            key={val.fieldCode}
                                            className={`${
                                                val.isHidden === "false"
                                                    ? "show-column"
                                                    : "hide-column"
                                            }`}
                                        >
                                            <span className="order">
                                                {index + 1}
                                            </span>
                                            <span className="label">
                                                {val.headline}
                                            </span>
                                            {lockedData.length - 1 === index ? (
                                                <i
                                                    className="icon iconfont icon-suoding unLock"
                                                    onClick={this.ToLockCols.bind(
                                                        this,
                                                        val,
                                                        index
                                                    )}
                                                />
                                            ) : null}
                                        </li>
                                    );
                                })}
                            </ul>
                            {this.sortColumnList() &&
                            this.sortColumnList().length ? (
                                <NCDnd
                                    list={this.sortColumnList()}
                                    onStop={this.onDragEnd}
                                    dragClass="alreadyShow-column"
                                    bounds=".TableColumnContent-right"
                                    type="vertical"
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </NCSidebox>
        );
    }
}

export default ColumnMenu;
