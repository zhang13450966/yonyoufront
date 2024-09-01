/**
 * Created by wanghongxiang on 2019/2/21.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast, getMultiLang} from 'nc-lightapp-front';
let {NCSelect, NCRow, NCCol} = base;

const SortSelect = ({metaSource=[], order=[], metaChange, sortTypeChange}) => (
    <NCRow className="SortSelect">
        <NCCol md={16} className="colPad">
            <NCSelect
                className='marginBot'
                data={metaSource}
                onChange={metaChange.bind(this)}
                defaultValue={metaSource && metaSource[0] && metaSource[0].value}
            />
        </NCCol>
        <NCCol md={8}>
            <NCSelect
                className='marginBot'
                data={order}
                defaultValue={order && order[0] && order[0].value}
                onChange={sortTypeChange}
            />
        </NCCol>
    </NCRow>
);

SortSelect.propTypes = {
    metaSource: PropTypes.array.isRequired,
    order: PropTypes.array.isRequired,
    metaChange: PropTypes.func.isRequired,
    sortTypeChange: PropTypes.func.isRequired,
}
export default SortSelect

