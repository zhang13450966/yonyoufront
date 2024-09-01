import React, { Component, Fragment } from "react";
import { base } from "nc-lightapp-front";

import FieldCheckbox from "../fieldCheckbox";
import {
    createDetailColumn,
    createGroupColumn,
    createAreaColumn,
} from "../../methods/createColumn";
import Utils from "@public/utils";
import TableOprBtnList from "../TableOprBtnList";
import {
    judgeMoveToBottomBtnDisable,
    judgeMoveToPBtnDisable,
    goDownstairs,
    goUpstairs,
} from "../../methods";
import { TableMinHeight } from "../../constants";
import "../index.less";

const { NCTable, NCTooltip, NCCheckbox } = base;
const { langCheck } = Utils;

class ListBaseTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedGroupField: {},
            checkedDetailField: {},
            checkedAreaField: {},

            showGroupField: {},
            showDetailField: {},
            showAreaField: {},
            isSyncData: true,
        };

        this.sequence = [];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            // 设置默认选中状态
            checkedGroupField: this.setDefaultVal(nextProps.groupFldNames),
            checkedDetailField: this.setDefaultVal(nextProps.detailFldNames),
            checkedAreaField: this.setDefaultVal(nextProps.areaFieldSet),

            showGroupField: this.setShowDefaultVal(nextProps.groupFldNames),
            showDetailField: this.setShowDefaultVal(nextProps.detailFldNames),
            showAreaField: this.setShowDefaultVal(nextProps.areaFieldSet),
        });
    }

    setDefaultVal = (data) => {
        let result = {};
        if (Array.isArray(data) && data.length > 0) {
            data.map((item) => {
                if (item.anaRepField.isChecked) {
                    result[item.id] = item;
                }
                return item;
            });
        }
        return result;
    };

    setShowDefaultVal = (data) => {
        let result = {};
        if (Array.isArray(data) && data.length > 0) {
            data.map((item) => {
                if (item.anaRepField.isShow || item.anaRepField.isCalcShow) {
                    result[item.id] = item;
                }
                return item;
            });
        }
        return result;
    };

    handleCheckBoxChange = (value, code) => {
        let { changeValue } = this.props;
        changeValue(code, value);
    };

    checkDeleteFieldCb = (
        field,
        value,
        list,
        checkedKey,
        tableKey,
        index,
        isChecked
    ) => {
        let checkedFieldPool = this.state[checkedKey];
        if (field === "all") {
            // 全选
            value
                ? list &&
                  list.map(
                      (item, index) => (checkedFieldPool[item.id] = item.id)
                  )
                : (checkedFieldPool = {});
        } else {
            if (checkedFieldPool[field.id]) {
                delete checkedFieldPool[field.id];
                this.sequence[index] = undefined;
            } else {
                checkedFieldPool[field.id] = field.id;
                this.sequence[index] = field;
            }
        }
        this.props.checkDeleteFieldCb(
            field,
            value,
            list,
            checkedKey,
            tableKey,
            index,
            isChecked
        );

        this.setState({
            [checkedKey]: checkedFieldPool,
        });
    };

    deleteField = (checkedFieldKey, listKey, checkedFieldPool) => {
        let list = this.props[listKey];

        list = list.filter(
            (item, index) => checkedFieldPool[item.id] === undefined
        );

        this.setState({
            [checkedFieldKey]: {},
        });
        this.props.changeList(list, listKey, "delete", checkedFieldPool);
    };

    goUpStairs = (checkedFieldKey, listKey, checkedFieldPool) => {
        let list = this.props[listKey];
        list = goUpstairs(list, checkedFieldPool, this.sequence);
        this.props.changeList(list, listKey);
    };

    goDownStairs = (checkedFieldKey, listKey, checkedFieldPool) => {
        let list = this.props[listKey];
        list = goDownstairs(list, checkedFieldPool, this.sequence);

        this.props.changeList(list, listKey);
    };

    countTypeChange = (value, index) => {
        let list = this.props.areaFieldSet;
        list[index].anaRepField.m_countType = value;
        this.props.changeList(list, "areaFieldSet");
    };

    handleGroupListDrop = (event) => {
        let { handleDrop } = this.props;
        handleDrop("groupFldNames", "add");
    };

    handleDetailListDrop = () => {
        let { handleDrop } = this.props;
        handleDrop("detailFldNames", "add");
    };

    handleAreaListDrop = () => {
        let { handleDrop } = this.props;
        handleDrop("areaFieldSet", "add");
    };

    sumCheckboxChange = (value, key, index) => {
        let list = this.props[key];
        let item = list[index];

        item.m_isSum = item.m_isSum === undefined ? true : value;

        this.props.changeList(list, key);
    };

    deleteSingleRow = (record, index, checkedFieldKey, listKey) => {
        //TODO 此处record总是拿到第一个 需要看看咋回事
        const curTableRow = this.props[listKey][index];
        const curCheckedFieldPool = {
            [curTableRow.id]: curTableRow,
        };
        this.deleteField(checkedFieldKey, listKey, curCheckedFieldPool);
    };

    // onDragRowStart = (record, index) => {
    // 	console.log('拖拽的行数据：', record);
    // 	console.log('拖拽的行序号：', index);
    // }

    /**
     * 行拖拽结束时触发
     * @param data 拖拽改变顺序后的新data数组
     * @param record 拖拽行的数据
     */
    onDropRow = (data, record, key, index) => {
        if (record) {
            // 拖拽改变顺序
            this.props.sortRowCb(data, record, key);
        } else {
            this.props.handleDrop(key, "add", index);
        }
        // this.props.sortRowCb(data, record, key);
    };

    onCellChange = (index, record, checkedFieldKey) => {
        return (value) => {
            const newRecord = JSON.parse(JSON.stringify(record));
            const newList = JSON.parse(
                JSON.stringify(this.props[checkedFieldKey])
            );

            newRecord.anaRepField.m_titles = value.dataViewMulti1.value.split("|");
            newRecord.anaRepField.m_titles2 = value.dataViewMulti2.value.split("|");
            newRecord.anaRepField.m_titles3 = value.dataViewMulti3.value.split("|");

            newList[index] = newRecord;

            this.props.changeList(newList, checkedFieldKey);
        };
    };

    render() {
        let {
            checkedGroupField,
            checkedDetailField,
            checkedAreaField,
            showGroupField,
            showDetailField,
            showAreaField,
        } = this.state;
        let { groupFldNames, detailFldNames, handleDrop, areaFieldSet, nccTableConfig } =
            this.props;
        const colTitleTooltip = (
            <NCTooltip
                overlay={langCheck("reportMultiLang", "dataView-100301-000279")}
                placement="right"
                delay={500}
            >
                <span>
                    {langCheck("reportMultiLang", "dataView-100301-000276")}
                </span>
            </NCTooltip>
        );
        return (
            <Fragment>
                <div className="base-table-container base">
                    {/*分组列表*/}
                    <div
                        className="table-area"
                        onDrop={this.handleGroupListDrop}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }} // onDragOver与onDrop冲突 不加drop会不生效
                    >
                        <div className="table-head nc-theme-common-font-c">
                            {langCheck("reportMultiLang", "100301-000147")}
                            {/*小计在前*/}
                            <FieldCheckbox
                                handleChange={this.handleCheckBoxChange}
                                name={langCheck(
                                    "reportMultiLang",
                                    "100301-000146"
                                )}
                                value={this.props.showType === 1}
                                code="showType"
                            />
                        </div>


                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    groupRowIndex: -1,
                                });
                            }}
                        >
                            <NCTable

                                data={groupFldNames}
                                rowDraggAble
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "groupFldNames",
                                        index
                                    );
                                }}
                                onRowHover={index => {
                                    this.setState({
                                        groupRowIndex: index,
                                    });
                                }}
                                columns={createGroupColumn({
                                    checkedFieldsPool: checkedGroupField,
                                    showFieldsPool: showGroupField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: groupFldNames,
                                    onCellChange: this.onCellChange,
                                    onDropCb: handleDrop,
                                    sumCheckboxChange: this.sumCheckboxChange,
                                    colTitleTooltip,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    groupRowIndex: this.state.groupRowIndex,
                                })}
                                lazyload={false}
                                // hoverContent={(record, index) => {
                                //     return (
                                //         <a
                                //             className="hover-content-one"
                                //             onClick={() =>
                                //                 this.deleteSingleRow(
                                //                     record,
                                //                     index,
                                //                     "checkedGroupField",
                                //                     "groupFldNames"
                                //                 )
                                //             }
                                //         >
                                //             {langCheck(
                                //                 "reportMultiLang",
                                //                 "100301-000157"
                                //             )}
                                //         </a>
                                //     );
                                // }}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>

                    </div>

                    <TableOprBtnList
                        checkedField={checkedGroupField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedGroupField"
                        listKey="groupFldNames"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedGroupField,
                            groupFldNames
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedGroupField,
                            groupFldNames
                        )}
                    />
                </div>

                {/*明细列表*/}
                <div
                    className="base-table-container base"
                    onDrop={this.handleDetailListDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }} // onDragOver与onDrop冲突 不加drop会不生效
                >
                    <div className="table-area">
                        <div className="table-head data-view-detail-contaier nc-theme-common-font-c">
                            {langCheck("reportMultiLang", "100301-000148")}
                            {/*小计在前*/}

                            <NCTooltip
                                overlay={langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000271"
                                )}
                                placement="right"
                                delay={500}
                            >
                                <NCCheckbox
                                    onChange={(v) => {
                                        this.handleCheckBoxChange(
                                            v,
                                            "isSyncData"
                                        );
                                    }}
                                    className="data-view-table-top-checkbox"
                                    checked={this.props.isSyncData}
                                >
                                    <span
                                        style={{
                                            float: "right",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {langCheck(
                                            "reportMultiLang",
                                            "dataView-100301-000270"
                                        )}
                                    </span>
                                </NCCheckbox>
                            </NCTooltip>
                        </div>
                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    detailRowIndex: -1,
                                });
                            }}
                        >
                            <NCTable
                                data={detailFldNames}

                                rowDraggAble
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "detailFldNames",
                                        index
                                    );
                                }}
                                onRowHover={index => {
                                    this.setState({
                                        detailRowIndex: index,
                                    });
                                }}
                                columns={createDetailColumn({
                                    checkedFieldsPool: checkedDetailField,
                                    showFieldsPool: showDetailField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: detailFldNames,
                                    onCellChange: this.onCellChange,
                                    onDropCb: handleDrop,
                                    colTitleTooltip,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    detailRowIndex: this.state.detailRowIndex,
                                })}
                                lazyload={false}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>

                    </div>

                    <TableOprBtnList
                        checkedField={checkedDetailField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedDetailField"
                        listKey="detailFldNames"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedDetailField,
                            detailFldNames
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedDetailField,
                            detailFldNames
                        )}
                    />
                </div>

                {/*统计列表*/}
                <div
                    className="base-table-container base"
                    onDrop={this.handleAreaListDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }} // onDragOver与onDrop冲突 不加drop会不生效
                >
                    <div className="table-area">
                        <div className="table-head nc-theme-common-font-c">
                            {langCheck("reportMultiLang", "100301-000149")}
                            <FieldCheckbox
                                handleChange={this.handleCheckBoxChange}
                                name={langCheck(
                                    "reportMultiLang",
                                    "100301-000150"
                                )}
                                value={this.props.isShowCount === true}
                                code="isShowCount"
                            />
                        </div>
                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    areaRowIndex: -1,
                                });
                            }}
                        >
                            <NCTable
                                data={areaFieldSet}
                                onRowHover={index => {
                                    this.setState({
                                        areaRowIndex: index,
                                    });
                                }}
                                columns={createAreaColumn({
                                    checkedFieldsPool: checkedAreaField,
                                    showFieldsPool: showAreaField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: areaFieldSet,
                                    onDropCb: handleDrop,
                                    typeChangeCb: this.countTypeChange,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    areaRowIndex: this.state.areaRowIndex,
                                })}
                                lazyload={false}
                                rowDraggAble
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "areaFieldSet",
                                        index
                                    );
                                }}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>
                    </div>

                    <TableOprBtnList
                        checkedField={checkedAreaField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedAreaField"
                        listKey="areaFieldSet"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedAreaField,
                            areaFieldSet
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedAreaField,
                            areaFieldSet
                        )}
                    />
                </div>
            </Fragment>
        );
    }
}

export default ListBaseTable;
