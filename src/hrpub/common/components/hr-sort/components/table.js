/**
 * Created by wanghongxiang on 2019/2/21.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast, getMultiLang} from 'nc-lightapp-front';

let {NCTable} = base;

const SortTable = ({columns, sortTableData = [], selectedRow, rowClick, rowDoubleClick}) => (
    <NCTable
        className='filedTable'
        columns={columns}
        data={sortTableData}
        rowClassName={(record, index, indent) => {
            if (selectedRow && selectedRow[index]) {
                return 'record-selected';
            } else {
                return '';
            }
        }}
        onRowClick={(record, index, indent) => {
            rowClick(record, index, indent);
        }}
        onRowDoubleClick={(record, index, indent) => {
            rowDoubleClick(record, index, indent);
        }}
    >
    </NCTable>
);
SortTable.propTypes = {
    columns: PropTypes.array.isRequired,
    sortTableData: PropTypes.array.isRequired,
    selectedRow: PropTypes.any.isRequired,
    rowClick: PropTypes.func.isRequired
}
export default SortTable



