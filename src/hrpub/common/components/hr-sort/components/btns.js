/**
 * Created by wanghongxiang on 2019/2/21.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast, getMultiLang} from 'nc-lightapp-front';
let {NCButton} = base;

const SortBtns = ({evts, json}) => (
    <React.Fragment>
        <NCButton shape="border" onClick={evts.bind(this, 'add')}>{json['hrpub-000076']}</NCButton>
        <NCButton shape="border" onClick={evts.bind(this, 'del')}>{json['hrpub-000077']}</NCButton>
        <NCButton shape="border" onClick={evts.bind(this, 'up')}>{json['hrpub-000074']}</NCButton>
        <NCButton shape="border" onClick={evts.bind(this, 'down')}>{json['hrpub-000075']}</NCButton>
        <NCButton shape="border" onClick={evts.bind(this, 'clear')}>{json['hrpub-000078']}</NCButton>
    </React.Fragment>
);
SortBtns.propTypes = {
    evts: PropTypes.func.isrequired
}
export default SortBtns