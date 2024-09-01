import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast, high} from 'nc-lightapp-front';
const {Refer} = high
const BaseRefer = Refer.ReferWithUnit
class HrReferUnit extends BaseRefer {
    constructor(props) {
        super(props);

    }
    showModal() {
        this.show()
    }
    setProps(val) {
        this.props.isShowUnit = true
        this.props = Object.assign(this.props, val)
    }
    resetProps(val) {

        // this.props = Object.assign({}, val)
        this.props = val
    }
}
export default HrReferUnit