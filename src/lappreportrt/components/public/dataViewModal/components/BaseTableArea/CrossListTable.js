import React, { Component, Fragment } from "react";
import { base } from "nc-lightapp-front";
import FieldCheckbox from "../fieldCheckbox";
import {
    createColColumn,
    createRowColumn,
    createMeasureColumn,
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

const { langCheck } = Utils;
const { NCTable, NCRadio, NCTooltip } = base;
const NCRadioGroup = NCRadio.NCRadioGroup;

class CrossListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedColumnField: {},
            checkedRowField: {},
            checkedMeasureField: {},

            showColumnField: {},
            showRowField: {},
            showMeasureField: {},
            currentTableRowIndex: -1,
        };

        this.sequence = [];
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            // 设置默认选中状态
            checkedRowField: this.setDefaultVal(nextProps.rowFldNames),
            checkedColumnField: this.setDefaultVal(nextProps.columnFldNames),
            checkedMeasureField: this.setDefaultVal(nextProps.measureSet),

            showRowField: this.setShowDefaultVal(nextProps.rowFldNames),
            showColumnField: this.setShowDefaultVal(nextProps.columnFldNames),
            showMeasureField: this.setShowDefaultVal(nextProps.measureSet),
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
        let v = value === true ? 1 : 0;
        this.props.changeValue(code, v);
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

    deleteField = (checkedFieldKey, listKey, checkedFieldPool) => {
        let list = this.props[listKey];

        list = list.filter(
            (item, index) => checkedFieldPool[item.id] === undefined
        );

        this.setState({
            [checkedFieldKey]: {},
        });

        this.props.changeList(list, listKey);
    };

    doShiftdim = (checkedFieldKey, listKey, checkedFieldPool) => {
        this.setState(
            {
                checkedColumnField: this.state.checkedRowField,
                checkedRowField: this.state.checkedColumnField,
            },
            () => {
                let list = this.props[listKey];
                this.props.changeList(list, "shiftdim");
            }
        );
    };

    countTypeChange = (value, index) => {
        let list = this.props.measureSet;
        list[index].anaRepField.m_countType = value;
        this.props.changeList(list, "measureSet");
    };

    handleRowFldNamesDrop = () => {
        let { handleDrop } = this.props;
        handleDrop("rowFldNames", "add");
    };

    handleColumnFldNamesDrop = () => {
        let { handleDrop } = this.props;
        handleDrop("columnFldNames", "add");
    };

    handleMeasureSetDrop = () => {
        let { handleDrop } = this.props;
        handleDrop("measureSet", "add");
    };

    sumCheckboxChange = (value, key, index) => {
        let list = this.props[key];
        let item = list[index];

        item.m_isSum = item.m_isSum === undefined ? true : value;

        this.props.changeList(list, key);
    };

    measureDirectionChange = (value) => {
        this.props.changeValue("measureDirection", value);
    };

    deleteSingleRow = (record, index, checkedFieldKey, listKey) => {
        //TODO 此处record总是拿到第一个 需要看看咋回事
        const curTableRow = this.props[listKey][index];
        const curCheckedFieldPool = {
            [curTableRow.id]: curTableRow,
        };
        this.deleteField(checkedFieldKey, listKey, curCheckedFieldPool);
    };

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
    };

    onCellChange = (index, record, checkedFieldKey) => {
        return (value) => {
            const newRecord = JSON.parse(JSON.stringify(record));
            const newList = JSON.parse(
                JSON.stringify(this.props[checkedFieldKey])
            );
            // newRecord.anaRepField.m_titles = value.split("|");
            // if (LANG_MAP_DATA[getLangCode()] === '1') {
            //     newRecord.anaRepField.m_titles = value.split("|");
            // } else {
            //     newRecord.anaRepField[`m_titles${LANG_MAP_DATA[getLangCode()]}`] = value.split("|");
            // }
            newRecord.anaRepField.m_titles = value.dataViewMulti1.value.split("|");
            newRecord.anaRepField.m_titles2 = value.dataViewMulti2.value.split("|");
            newRecord.anaRepField.m_titles3 = value.dataViewMulti3.value.split("|");
            newList[index] = newRecord;

            this.props.changeList(newList, checkedFieldKey);
        };
    };

    render() {
        let {
            checkedColumnField,
            checkedRowField,
            checkedMeasureField,
            showColumnField,
            showRowField,
            showMeasureField,
        } = this.state;
        let { columnFldNames, rowFldNames, measureSet, handleDrop, nccTableConfig } =
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
                <div
                    className="base-table-container base"
                    onDrop={this.handleRowFldNamesDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }} // onDragOver与onDrop冲突 不加drop会不生效
                >
                    {/*行维度*/}
                    <div className="table-area">
                        <div className="table-head nc-theme-common-font-c">
                            {langCheck("reportMultiLang", "100301-000140")}
                            {/*小计在前*/}
                            <FieldCheckbox
                                handleChange={this.handleCheckBoxChange}
                                name={langCheck(
                                    "reportMultiLang",
                                    "100301-000146"
                                )}
                                value={this.props.rowSubType === 1}
                                code="rowSubType"
                            />
                        </div>
                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    rowColumnRowIndex: -1,
                                });
                            }}
                        >
                            <NCTable
                                data={rowFldNames}
                                onRowHover={index => {
                                    this.setState({
                                        rowColumnRowIndex: index,
                                    });
                                }}
                                columns={createRowColumn({
                                    checkedFieldsPool: checkedRowField,
                                    showFieldsPool: showRowField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: rowFldNames,
                                    onCellChange: this.onCellChange,
                                    onDropCb: handleDrop,
                                    sumCheckboxChange: this.sumCheckboxChange,
                                    colTitleTooltip,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    rowColumnRowIndex: this.state.rowColumnRowIndex,
                                })}
                                lazyload={false}
                                rowDraggAble
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "rowFldNames",
                                        index
                                    );
                                }}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>

                    </div>

                    <TableOprBtnList
                        showTransformRowAndCol={
                            this.props.showTransformRowAndCol
                        }
                        doShiftdim={this.doShiftdim}
                        checkedField={checkedRowField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedRowField"
                        listKey="rowFldNames"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedRowField,
                            rowFldNames
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedRowField,
                            rowFldNames
                        )}
                    />
                </div>

                {/*列维度*/}
                <div
                    className="base-table-container base"
                    onDrop={this.handleColumnFldNamesDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }} // onDragOver与onDrop冲突 不加drop会不生效
                >
                    <div className="table-area">
                        <div className="table-head nc-theme-common-font-c">
                            {/* 列维度 */}
                            {langCheck("reportMultiLang", "100301-000141")}

                            {/*小计在前*/}
                            <FieldCheckbox
                                handleChange={this.handleCheckBoxChange}
                                name={langCheck(
                                    "reportMultiLang",
                                    "100301-000146"
                                )}
                                value={this.props.columnSubType === 1}
                                code="columnSubType"
                            />
                        </div>

                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    colRowIndex: -1,
                                });
                            }}
                        >
                            <NCTable
                                data={columnFldNames}
                                onRowHover={index => {
                                    this.setState({
                                        colRowIndex: index,
                                    });
                                }}
                                columns={createColColumn({
                                    checkedFieldsPool: checkedColumnField,
                                    showFieldsPool: showColumnField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: columnFldNames,
                                    onCellChange: this.onCellChange,
                                    onDropCb: handleDrop,
                                    sumCheckboxChange: this.sumCheckboxChange,
                                    colTitleTooltip,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    colRowIndex: this.state.colRowIndex,
                                })}
                                rowDraggAble
                                lazyload={false}
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "columnFldNames",
                                        index
                                    );
                                }}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>
                    </div>

                    <TableOprBtnList
                        checkedField={checkedColumnField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedColumnField"
                        listKey="columnFldNames"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedColumnField,
                            columnFldNames
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedColumnField,
                            columnFldNames
                        )}
                    />
                </div>

                {/*交叉指标*/}
                <div
                    className="base-table-container base"
                    onDrop={this.handleMeasureSetDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }} // onDragOver与onDrop冲突 不加drop会不生效
                >
                    <div className="table-area">
                        <div className="table-head measure-head nc-theme-common-font-c">
                            {/* 交叉指标 */}
                            {langCheck("reportMultiLang", "100301-000144")}

                            <div className="measure-radio-container">
                                {/* 指标显示方向 */}
                                {langCheck("reportMultiLang", "100301-000145")}

                                <NCRadioGroup
                                    style={{ marginLeft: "10px" }}
                                    onChange={this.measureDirectionChange}
                                    selectedValue={this.props.measureDirection}
                                    className="mesasure-radio"
                                >
                                    <NCRadio value={0}>
                                        {/*行*/}
                                        {langCheck(
                                            "reportMultiLang",
                                            "100301-000142"
                                        )}
                                    </NCRadio>
                                    <NCRadio value={1}>
                                        {/*列*/}
                                        {langCheck(
                                            "reportMultiLang",
                                            "100301-000143"
                                        )}
                                    </NCRadio>
                                </NCRadioGroup>
                            </div>
                        </div>

                        <div
                            onMouseLeave={() => {
                                this.setState({
                                    measureIndex: -1,
                                });
                            }}
                        >
                            <NCTable
                                data={measureSet}
                                onRowHover={index => {
                                    this.setState({
                                        measureIndex: index,
                                    });
                                }}
                                columns={createMeasureColumn({
                                    checkedFieldsPool: checkedMeasureField,
                                    showFieldsPool: showMeasureField,
                                    checkDeleteFieldCb: this.checkDeleteFieldCb,
                                    list: measureSet,
                                    onDropCb: handleDrop,
                                    typeChangeCb: this.countTypeChange,
                                    deleteSingleRow: this.deleteSingleRow,
                                    nccTableConfig,
                                    measureIndex: this.state.measureIndex,
                                })}
                                rowDraggAble
                                lazyload={false}
                                onDropRow={(data, record, index) => {
                                    this.onDropRow(
                                        data,
                                        record,
                                        "measureSet",
                                        index
                                    );
                                }}
                                scroll={{ y: TableMinHeight }}
                                bodyStyle={{ minHeight: TableMinHeight }}
                            />
                        </div>

                    </div>

                    <TableOprBtnList
                        checkedField={checkedMeasureField}
                        deleteField={this.deleteField}
                        goUpstairs={this.goUpStairs}
                        goDownStairs={this.goDownStairs}
                        checkedFieldKey="checkedMeasureField"
                        listKey="measureSet"
                        moveTopBtnDis={judgeMoveToPBtnDisable(
                            checkedMeasureField,
                            measureSet
                        )}
                        moveBottomBtnDis={judgeMoveToBottomBtnDisable(
                            checkedMeasureField,
                            measureSet
                        )}
                    />
                </div>
            </Fragment>
        );
    }
}

export default CrossListTable;
