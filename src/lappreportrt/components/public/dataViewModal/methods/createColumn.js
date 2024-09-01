import React from "react";
import { base } from "nc-lightapp-front";
import { getAreaTableCellName, getCellDisName, getCellName } from "./util";
import { getCalculateOptions, getTitlesValue } from "../methods/util";
import StringEditCell from "../components/stringEditCell";
import Utils from "@public/utils";

const { NCCheckbox, NCIcon, NCSelect, NCButton } = base;
const NCOption = NCSelect.NCOption;
const { langCheck } = Utils;

/*分组列表*/
export function createGroupColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    onDropCb,
    sumCheckboxChange,
    showFieldsPool,
    onCellChange,
    colTitleTooltip,
    deleteSingleRow,
    nccTableConfig,
    groupRowIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);
    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedGroupField",
                            "groupFldNames",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            key: "isChecked",
            dataIndex: "isChecked",
            width: "45",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        // checked={checkedFieldsPool[record.id] !== undefined}
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedGroupField",
                                "groupFldNames",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 170,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getCellName(record);
                return (
                    <div
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("groupFldNames", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000152"),
            width: 170,
            key: "showName",
            dataIndex: "showName",
            render(text, record, index) {
                let showName = getCellDisName(record);
                return (
                    <div
                        className="drop-cell"
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("groupFldNames", "change", index);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }} // onDragOver与onDrop冲突 不加drop会不生效
                    >
                        {showName}
                    </div>
                );
            },
        },
        {
            title: colTitleTooltip,
            width: 113,
            key: "m_titles",
            dataIndex: "m_titles",
            notRowDrag: true,
            render(text, record, index) {
                let m_titles_values = getTitlesValue(record);

                return (
                    <div>
                        <StringEditCell
                            colName={langCheck(
                                "reportMultiLang",
                                "dataView-100301-000276"
                            )}
                            required
                            value={
                                m_titles_values
                            }
                            onChange={onCellChange(
                                index,
                                record,
                                "groupFldNames"
                            )}
                            enableLangMaps={nccTableConfig.enableLangMaps}
                        />
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000153"),
            width: 50,
            key: "m_isSum",
            dataIndex: "m_isSum",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        checked={record.m_isSum}
                        style={{ position: "relative", marginLeft: 15 }}
                        onChange={(value) => {
                            sumCheckboxChange(value, "groupFldNames", index);
                        }}
                    />
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showGroupField",
                            "groupFldNames"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isShow",
            dataIndex: "isShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showGroupField",
                                    "groupFldNames",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 125,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === groupRowIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedGroupField",
                                "groupFldNames",
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                             ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}

/*明细列表*/
export function createDetailColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    onDropCb,
    showFieldsPool,
    onCellChange,
    colTitleTooltip,
    deleteSingleRow,
    nccTableConfig,
    detailRowIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);
    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedDetailField",
                            "detailFldNames",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            key: "isChecked",
            dataIndex: "isChecked",
            width: "45",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedDetailField",
                                "detailFldNames",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 170,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getCellName(record);
                return (
                    <div
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("detailFldNames", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000152"),
            width: 170,
            key: "showName",
            dataIndex: "showName",
            render(text, record, index) {
                let showName = getCellDisName(record);
                return (
                    <div
                        className="drop-cell"
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("detailFldNames", "change", index);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }} // onDragOver与onDrop冲突 不加drop会不生效
                    >
                        {showName}
                    </div>
                );
            },
        },
        {
            title: colTitleTooltip,
            width: 110,
            key: "m_titles",
            dataIndex: "m_titles",
            notRowDrag: true,
            render(text, record, index) {
                let m_titles_values = getTitlesValue(record);
                return (
                    <div>
                        <StringEditCell
                            colName={langCheck(
                                "reportMultiLang",
                                "dataView-100301-000276"
                            )}
                            required
                            value={m_titles_values}
                            onChange={onCellChange(
                                index,
                                record,
                                "detailFldNames"
                            )}
                            enableLangMaps={nccTableConfig.enableLangMaps}
                        />
                    </div>
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showDetailField",
                            "detailFldNames"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isShow",
            dataIndex: "isShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showDetailField",
                                    "detailFldNames",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 170,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === detailRowIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedDetailField",
                                "detailFldNames",
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                            ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}

/*统计列表*/
export function createAreaColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    typeChangeCb,
    onDropCb,
    showFieldsPool,
    deleteSingleRow,
    nccTableConfig,
    areaRowIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);

    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedAreaField",
                            "areaFieldSet",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            width: "45",
            key: "isChecked",
            dataIndex: "isChecked",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        // checked={checkedFieldsPool[record.id] !== undefined}
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedAreaField",
                                "areaFieldSet",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 230,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getAreaTableCellName(record);
                return (
                    <div
                        onDrop={e => {
                            e.stopPropagation();
                            onDropCb("areaFieldSet", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000154"),
            width: 230,
            key: "m_countType",
            dataIndex: "m_countType",
            className: "special-data-view-table-td",
            render(text, record, index) {
                return (
                    <NCSelect
                        value={record.anaRepField.m_countType}
                        onChange={value => {
                            typeChangeCb(value, index);
                        }}
                        className='special-data-view-table-select'
                    >
                        {getCalculateOptions(
                            record.anaRepField.m_field.dataType,
                        ).map(item => (
                            <NCOption
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                            >
                                {item.name}
                            </NCOption>
                        ))}
                    </NCSelect>
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showAreaField",
                            "areaFieldSet"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isCalcShow",
            dataIndex: "isCalcShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isCalcShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showAreaField",
                                    "areaFieldSet",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 160,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === areaRowIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedAreaField",
                                "areaFieldSet"
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                            ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}

export function createRowColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    onDropCb,
    sumCheckboxChange,
    showFieldsPool,
    onCellChange,
    colTitleTooltip,
    deleteSingleRow,
    nccTableConfig,
    rowColumnRowIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);

    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedRowField",
                            "rowFldNames",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            key: "isChecked",
            dataIndex: "isChecked",
            width: "45",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        // checked={checkedFieldsPool[record.id] !== undefined}
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedRowField",
                                "rowFldNames",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 170,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getCellName(record);
                return (
                    <div
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("rowFldNames", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000152"),
            width: 170,
            key: "showName",
            dataIndex: "showName",
            render(text, record, index) {
                let showName = getCellDisName(record);
                return (
                    <div
                        className="drop-cell"
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("rowFldNames", "change", index);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }} // onDragOver与onDrop冲突 不加drop会不生效
                    >
                        {showName}
                    </div>
                );
            },
        },
        {
            title: colTitleTooltip,
            width: 110,
            key: "m_titles",
            dataIndex: "m_titles",
            notRowDrag: true,
            render(text, record, index) {
                let m_titles_values = getTitlesValue(record);

                return (
                    <div>
                        <StringEditCell
                            colName={langCheck(
                                "reportMultiLang",
                                "dataView-100301-000276"
                            )}
                            required
                            value={m_titles_values}
                            onChange={onCellChange(
                                index,
                                record,
                                "rowFldNames"
                            )}
                            enableLangMaps={nccTableConfig.enableLangMaps}
                        />
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000153"),
            width: 50,
            key: "m_isSum",
            dataIndex: "m_isSum",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        checked={record.m_isSum}
                        style={{ position: "relative", marginLeft: 15 }}
                        onChange={(value) => {
                            sumCheckboxChange(value, "rowFldNames", index);
                        }}
                    />
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showRowField",
                            "rowFldNames"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isShow",
            dataIndex: "isShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showRowField",
                                    "rowFldNames",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 110,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === rowColumnRowIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedRowField",
                                "rowFldNames"
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                            ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}

export function createColColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    onDropCb,
    sumCheckboxChange,
    showFieldsPool,
    onCellChange,
    colTitleTooltip,
    deleteSingleRow,
    nccTableConfig,
    colRowIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);

    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedColumnField",
                            "columnFldNames",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            width: "45",
            key: "isChecked",
            dataIndex: "isChecked",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        // checked={checkedFieldsPool[record.id] !== undefined}
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedColumnField",
                                "columnFldNames",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 170,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getCellName(record);
                return (
                    <div
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("columnFldNames", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000152"),
            width: 170,
            key: "showName",
            dataIndex: "showName",
            render(text, record, index) {
                let showName = getCellDisName(record);
                return (
                    <div
                        className="drop-cell"
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("columnFldNames", "change", index);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }} // onDragOver与onDrop冲突 不加drop会不生效
                    >
                        {showName}
                    </div>
                );
            },
        },
        {
            title: colTitleTooltip,
            width: 110,
            key: "m_titles",
            dataIndex: "m_titles",
            notRowDrag: true,
            render(text, record, index) {
                let m_titles_values = getTitlesValue(record);

                return (
                    <div>
                        <StringEditCell
                            colName={langCheck(
                                "reportMultiLang",
                                "dataView-100301-000276"
                            )}
                            required
                            value={m_titles_values}
                            onChange={onCellChange(
                                index,
                                record,
                                "columnFldNames"
                            )}
                            enableLangMaps={nccTableConfig.enableLangMaps}
                        />
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000153"),
            width: 50,
            key: "m_isSum",
            dataIndex: "m_isSum",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        checked={record.m_isSum}
                        style={{ position: "relative", marginLeft: 15 }}
                        onChange={(value) => {
                            sumCheckboxChange(value, "columnFldNames", index);
                        }}
                    />
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showColumnField",
                            "columnFldNames"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isShow",
            dataIndex: "isShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showColumnField",
                                    "columnFldNames",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 113,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === colRowIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedColumnField",
                                "columnFldNames"
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                            ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}

export function createMeasureColumn({
    checkedFieldsPool,
    checkDeleteFieldCb,
    list,
    typeChangeCb,
    onDropCb,
    showFieldsPool,
    deleteSingleRow,
    nccTableConfig,
    measureIndex,
}) {
    let deleteFieldsList = Object.keys(checkedFieldsPool);
    let deleteShowFieldsList = Object.keys(showFieldsPool);

    return [
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length !== list.length
                    }
                    checked={
                        deleteFieldsList.length > 0 &&
                        deleteFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "checkedMeasureField",
                            "measureSet",
                            0,
                            "isChecked"
                        );
                    }}
                />
            ),
            width: "45",
            key: "isChecked",
            dataIndex: "isChecked",
            render(text, record, index) {
                return (
                    <NCCheckbox
                        // checked={checkedFieldsPool[record.id] !== undefined}
                        checked={record.anaRepField.isChecked}
                        onChange={(value) => {
                            checkDeleteFieldCb(
                                record,
                                value,
                                list,
                                "checkedMeasureField",
                                "measureSet",
                                index,
                                "isChecked"
                            );
                        }}
                    />
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000151"),
            width: 230,
            key: "name",
            dataIndex: "name",
            render(text, record, index) {
                let name = getCellName(record);
                return (
                    <div
                        onDrop={(e) => {
                            e.stopPropagation();
                            onDropCb("measureSet", "add", index);
                        }}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: langCheck("reportMultiLang", "100301-000154"),
            width: 230,
            key: "m_countType",
            dataIndex: "m_countType",
            className: "special-data-view-table-td",
            render(text, record, index) {
                return (
                    <NCSelect
                        value={record.anaRepField.m_countType}
                        onChange={(value) => {
                            typeChangeCb(value, index);
                        }}
                        className='special-data-view-table-select'
                    >
                        {getCalculateOptions(
                            record.anaRepField.m_field.dataType
                        ).map((item) => (
                            <NCOption
                                key={item.value}
                                value={item.value}
                                disabled={item.disabled}
                            >
                                {item.name}
                            </NCOption>
                        ))}
                    </NCSelect>
                );
            },
        },
        {
            title: (
                <NCCheckbox
                    indeterminate={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length !== list.length
                    }
                    checked={
                        deleteShowFieldsList.length > 0 &&
                        deleteShowFieldsList.length === list.length
                    }
                    onChange={(value) => {
                        checkDeleteFieldCb(
                            "all",
                            value,
                            list,
                            "showMeasureField",
                            "measureSet"
                        );
                    }}
                >
                    <span style={{ marginLeft: 6 }}>
                        {langCheck("reportMultiLang", "dataView-100301-000274")}
                    </span>
                </NCCheckbox>
            ),
            width: 75,
            key: "isCalcShow",
            dataIndex: "isCalcShow",
            render(text, record, index) {
                return (
                    <div>
                        <NCCheckbox
                            checked={record.anaRepField.isCalcShow}
                            onChange={(value) => {
                                checkDeleteFieldCb(
                                    record,
                                    value,
                                    list,
                                    "showMeasureField",
                                    "measureSet",
                                    index
                                );
                            }}
                        >
                            <span style={{ marginLeft: 6 }}>
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000274"
                                )}
                            </span>
                        </NCCheckbox>
                    </div>
                );
            },
        },
        {
            title: '',
            width: 160,
            key: "operate",
            dataIndex: "operate",
            render: (text, record, index) => {
                const isSuspension = nccTableConfig.rowcheckedButton === 'suspension';
                let showDeleteFlag = index === measureIndex;
                return (
                    <div
                        className={showDeleteFlag ? "data-view-delete-single-row" : ''}
                        style={{ textAlign: 'center', display: isSuspension ? 'none' : 'block' }}
                        onClick={() => {
                            deleteSingleRow(
                                record,
                                index,
                                "checkedMeasureField",
                                "measureSet"
                            );
                        }}
                    >
                        {
                            isSuspension ? (
                                <NCButton
                                    colors='info'
                                    className='data-view-tips-custom-button'
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </NCButton>
                            ) : (
                                <a>
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000157",
                                    )}
                                </a>
                            )
                        }
                    </div>
                );
            },
        },
    ];
}
