import React, { Component } from "react";
import { base, tableTotal } from "nc-lightapp-front";
const { NCModal, NCTable, NCButton, NCTree, NCCheckbox } = base;
const TreeNode = NCTree.NCTreeNode;
import Utils from "@public/utils";
const { buildTree, langCheck } = Utils;

const { multiSelect } = tableTotal;
const ComplexTable = multiSelect(NCTable, NCCheckbox);
require("./index.less");

export default class PagerModal extends Component {
    constructor(props) {
        super(props);
        this.selectData = {};
        this.state = {
            treeData: [],
            tableData: [],
            defaultTableData: [],
            filterParams: {},
            multiObj: { type: "checkbox" }, //是否多选
        };
    }

    componentWillReceiveProps = newProps => {
        if (
            newProps.pagerModalData.data !== null &&
            newProps.pagerModalData.showPagerModal
        ) {
            //处理数据
            let result = JSON.parse(JSON.stringify(newProps));
            const { treeData, tableData, defaultTableData } =
                this.buildData(result);
            this.setState({
                treeData,
                tableData,
                defaultTableData,
            });
        }
    };

    //处理生成表格与树形数据
    buildData = result => {
        const { pagerModalData, rollingPagerData = [] } = result;
        const { data, index, pageInfo } = pagerModalData;
        let ret = [...data[index]].filter(item => item.relValue).map(item => ({ ...item, key: item.relValue })),
            treeData = [],
            tableData = [],
            defaultTableData = [];
        if (pageInfo[index].treeStyle == 1 || pageInfo[index].treeStyle == 2) {
            treeData = buildTree(ret, "rootField", "parentField");
        } else {
            let obj = {};
            let result = ret.reduce(function (prev, cur) {
                if (!obj[`${cur.relValue}&${cur.disValue}`]) {
                    obj[`${cur.relValue}&${cur.disValue}`] = true;
                    prev.push(cur);
                }
                return prev;
            }, []);
            let checkedArray =
                (rollingPagerData[index] &&
                    rollingPagerData[index].relValue &&
                    rollingPagerData[index].relValue.split("@@")) ||
                [];
            if (checkedArray.length > 0) {
                result.forEach(item => {
                    if (checkedArray.includes(item.relValue))
                        item._checked = true;
                });
            }
            // 过滤关系result
            if (pageInfo[index].relationCondition) {
                pageInfo[index].relationCondition.forEach((key, index) => {
                    let checkedArray =
                        (rollingPagerData[index] &&
                            rollingPagerData[index].relValue &&
                            rollingPagerData[index].relValue.split("@@")) ||
                        [];
                    if (checkedArray.length > 1) {
                        // 参照多选
                        result = result.filter(item =>
                            checkedArray.includes(item[key]),
                        );
                    } else {
                        // 参照单选
                        result = result.filter(item => {
                            if (
                                !rollingPagerData[index] ||
                                !rollingPagerData[index].relValue
                            ) {
                                return true;
                            } else {
                                return (
                                    item[key] ==
                                    rollingPagerData[index].relValue
                                );
                            }
                        });
                    }
                });
            }

            tableData = defaultTableData = result;
        }
        return {
            treeData,
            tableData,
            defaultTableData,
        };
    };

    //树节点点击事件
    onSelectTree = (index, selectedKeys, e) => {
        let obj = {
            id: index + 1,
            relValue: selectedKeys[0],
            disValue: e.node.props.title,
        };
        this.checkPaper(obj, index, "noSelect", e.node.props["data-order"]);
    };

    //选中并确定后设值
    checkPaper = (item, index, type, i, can) => {
        if (item.relValue === "%$S(*@#^)" && !item.disValue)
            item.disValue = langCheck("reportMultiLang", "100301-000018");
        if (item.relValue === "null" && !item.disValue)
            item.disValue = langCheck("reportMultiLang", "100301-000019");
        this.props.checkPaper(item, index, type, i, can);
    };

    //处理表格列
    columnFun = () => {
        const { pageInfo, index } = this.props.pagerModalData;
        const cur = [
            {
                title: (
                    <div fieldid="disValue">
                        {langCheck("reportMultiLang", "100301-000060")}
                    </div>
                ) /* 国际化处理： 显示值*/,
                dataIndex: "disValue",
                key: "disValue",
                filterType: "text",
                filterDropdown: "hide",
                filterDropdownIncludeKeys: ["LIKE"],
                render(text, record) {
                    let inner = text;
                    if (record.relValue === "%$S(*@#^)")
                        inner = langCheck("reportMultiLang", "100301-000018");
                    if (record.relValue === "null")
                        inner = langCheck("reportMultiLang", "100301-000019");
                    return <div fieldid="disValue">{inner}</div>;
                },
            },
        ];
        if (pageInfo && pageInfo[index] && pageInfo[index].extFlds) {
            pageInfo[index].extFlds.forEach(item => {
                cur.push({
                    title: <div fieldid="item">{item}</div>,
                    dataIndex: item,
                    key: item,
                    filterType: "text",
                    filterDropdown: "hide",
                    filterDropdownIncludeKeys: ["LIKE"],
                    render(text, record) {
                        return <div fieldid={item}>{text}</div>;
                    },
                });
            });
        } else {
            cur.push({
                title: (
                    <div fieldid="relValue">
                        {langCheck("reportMultiLang", "100301-000108")}
                    </div>
                ) /* 国际化处理： 实际值*/,
                dataIndex: "relValue",
                key: "relValue",
                filterType: "text",
                filterDropdown: "hide",
                filterDropdownIncludeKeys: ["LIKE"],
                render(text, record, index) {
                    let inner = text;
                    if (record.relValue === "%$S(*@#^)")
                        inner = langCheck("reportMultiLang", "100301-000018");
                    if (record.relValue === "null")
                        inner = langCheck("reportMultiLang", "100301-000019");
                    return <div fieldid="relValue">{inner}</div>;
                },
            });
        }
        return cur;
    };

    //表格的筛选
    handlerFilterChange = (key, val, condition) => {
        const { filterParams } = this.state;
        filterParams[key] = { value: val, condition };

        const tableData = this.filterFun(filterParams);

        this.setState({
            tableData,
            filterParams,
        });
    };

    //清空筛选值
    handlerFilterClear = key => {
        const { filterParams } = this.state;
        delete filterParams[key];

        const tableData = this.filterFun(filterParams);

        this.setState({
            tableData,
            filterParams,
        });
    };

    //筛选
    filterFun = filterParams => {
        const { defaultTableData } = this.state;
        let ret = [],
            flag = true,
            filterData = [];
        if (JSON.stringify(filterParams) == "{}") return defaultTableData;
        Object.keys(filterParams).forEach(key => {
            if (filterParams[key].value) {
                filterData = flag ? defaultTableData : ret;
                ret = filterData.filter(
                    item =>
                        item[key] &&
                        item[key].indexOf(filterParams[key].value) > -1,
                );
                // if (filterParams[key].condition === 'LIKE') {

                // } else {
                // 	ret = filterData.filter((item) => item[key] === filterParams[key].value);
                // }
                flag = false;
            } else {
                if (ret.length < 1)
                    ret = filterData.length > 0 ? filterData : defaultTableData;
            }
        });
        return ret;
    };

    //获取表格选中数据
    getSelectedDataFunc = data => {
        if (data.length > 0) {
            let record = { ...data[0] },
                dis = "",
                rel = "";
            data.forEach((item, index) => {
                if (item.relValue === "%$S(*@#^)" && !item.disValue)
                    item.disValue = langCheck(
                        "reportMultiLang",
                        "100301-000018",
                    );
                if (item.relValue === "null" && !item.disValue)
                    item.disValue = langCheck(
                        "reportMultiLang",
                        "100301-000019",
                    );
                if (index == data.length - 1) {
                    dis += item.disValue;
                    rel += item.relValue;
                } else {
                    dis += `${item.disValue}@@`;
                    rel += `${item.relValue}@@`;
                }
            });
            record.disValue = dis;
            record.relValue = rel;
            this.selectData = {
                record,
                index: this.props.pagerModalData.index,
                i: undefined,
            };
        } else {
            this.selectData = {};
        }
    };

    render() {
        const { treeData, tableData, multiObj } = this.state;
        const { index, pageInfo, showPagerModal } = this.props.pagerModalData;
        if (!showPagerModal) return null;
        let canClick = false;
        if (pageInfo && pageInfo.length > 1) {
            canClick = true;
        }
        const columns = this.columnFun();
        const loop = treeData =>
            treeData.map(item => {
                if (item.children) {
                    return (
                        <TreeNode
                            key={item.relValue}
                            title={item.disValue}
                            data-index={index}
                            data-order={item.orderIndex}
                            fieldid={item.relValue}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        fieldid={item.relValue}
                        key={item.relValue}
                        title={item.disValue}
                        data-order={item.orderIndex}
                    />
                );
            });
        return (
            <NCModal
                fieldid="pager"
                show={showPagerModal}
                id="pagerModal"
                className="report-modal-class"
            >
                <NCModal.Header className="report-modal-header">
                    <NCModal.Title
                        fieldid={langCheck("reportMultiLang", "100301-000061")}
                    >
                        {langCheck("reportMultiLang", "100301-000061")}
                    </NCModal.Title>
                    {/* 国际化处理： 页维度筛选*/}
                </NCModal.Header>
                {/*
					treeStyle: 0 => 表格形式显示
					treeStyle: 1 => 自定义格式显示，例 2-2-2
					treeStyle: 2 => 父子关系显示
 				*/}
                <NCModal.Body className="report-modal-body">
                    {pageInfo !== undefined &&
                        pageInfo[index].treeStyle == 0 &&
                        pageInfo[index].choiceStyle == "1" && (
                        <ComplexTable
                            onRowDoubleClick={(record, i, indent) => {
                                this.checkPaper(
                                    record,
                                    index,
                                    "noSelect",
                                    i,
                                    canClick,
                                );
                            }}
                            rowClassName={(record, index, indent) => {
                                if (this.state.selectedRowIndex == index) {
                                    return "table-selected-item nc-theme-area-bgc";
                                } else {
                                    return "";
                                }
                            }}
                            onRowClick={(record, i, indent) => {
                                this.selectData = {
                                    record,
                                    index,
                                    i,
                                };
                                this.setState({ selectedRowIndex: i });
                            }}
                            getSelectedDataFunc={this.getSelectedDataFunc}
                            multiSelect={multiObj}
                            columns={columns}
                            data={tableData}
                            scroll={{ y: 255 }}
                            onFilterChange={this.handlerFilterChange} //下拉条件的回调(key,val)=>()
                            onFilterClear={this.handlerFilterClear} //触发输入操作以及其他的回调(key,val)=>()
                            filterable={true} //是否开启过滤数据功能
                        />
                    )}
                    {pageInfo !== undefined &&
                        pageInfo[index].treeStyle == 0 &&
                        pageInfo[index].choiceStyle != "1" && (
                        <NCTable
                            onRowDoubleClick={(record, i, indent) => {
                                this.checkPaper(
                                    record,
                                    index,
                                    "noSelect",
                                    i,
                                    canClick,
                                );
                            }}
                            rowClassName={(record, index, indent) => {
                                if (this.state.selectedRowIndex == index) {
                                    return "table-selected-item nc-theme-area-bgc";
                                } else {
                                    return "";
                                }
                            }}
                            onRowClick={(record, i, indent) => {
                                this.selectData = {
                                    record,
                                    index,
                                    i,
                                };
                                this.setState({ selectedRowIndex: i });
                            }}
                            columns={columns}
                            data={tableData}
                            scroll={{ y: 255 }}
                            onFilterChange={this.handlerFilterChange} //下拉条件的回调(key,val)=>()
                            onFilterClear={this.handlerFilterClear} //触发输入操作以及其他的回调(key,val)=>()
                            filterable={true} //是否开启过滤数据功能
                        />
                    )}
                    {pageInfo !== undefined &&
                        (pageInfo[index].treeStyle == 2 ||
                            pageInfo[index].treeStyle == 1) && (
                        <div>
                            <NCTree
                                showLine={true}
                                onSelect={this.onSelectTree.bind(
                                    this,
                                    index,
                                )}
                            >
                                {loop(treeData)}
                            </NCTree>
                        </div>
                    )}
                </NCModal.Body>
                <NCModal.Footer className="report-modal-footer">
                    <NCButton
                        fieldid="sure"
                        colors="primary"
                        className="sure-button"
                        onClick={() => {
                            if (this.selectData.record) {
                                this.checkPaper(
                                    this.selectData.record,
                                    this.selectData.index,
                                    "noSelect",
                                    this.selectData.i,
                                    canClick,
                                );
                            } else {
                                this.checkPaper(
                                    {},
                                    index,
                                    "noSelect",
                                    undefined,
                                    canClick,
                                );
                            }
                        }}
                    >
                        {langCheck("reportMultiLang", "100301-000059")}
                        {/* 国际化处理： 确定*/}
                    </NCButton>
                    <NCButton
                        fieldid="cancel"
                        className="cancel-button"
                        onClick={this.props.closePagerModal}
                        shape="border"
                    >
                        {langCheck("reportMultiLang", "100301-000048")}
                        {/* 国际化处理： 取消*/}
                    </NCButton>
                </NCModal.Footer>
            </NCModal>
        );
    }
}
