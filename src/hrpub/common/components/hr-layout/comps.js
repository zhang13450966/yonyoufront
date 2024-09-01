import React from 'react';
import PropTypes from 'prop-types'
import {base} from 'nc-lightapp-front';
const { NCAffix } = base;
export class HrHeader extends React.Component {
    static propTypes = {
        opt: PropTypes.any,
        btnApp: PropTypes.any.isRequired,
        extralRight: PropTypes.any,
        extralLeft: PropTypes.any,
        staticHeader: PropTypes.bool,
    }
    constructor(props) {
        super(props)
    }
    render() {
        let content = (
            <div className="nc-bill-header-area">
                <div className="header-title-search-area">
                    {this.props.opt}
                </div>
                <div className="header-button-area">
                    {this.props.extralLeft}
                    {this.props.btnApp}
                    {this.props.extralRight}
                </div>
            </div>
        )
        let result = !!this.props.staticHeader ? (
            <NCAffix>
                {
                    content
                }
            </NCAffix>
        ): (
            <React.Fragment>
                {
                    content
                }
            </React.Fragment>
        )
        return (
            <React.Fragment>
                {result}
            </React.Fragment>
        )
    }
}
export class HrTable extends React.Component {
    static propTypes = {
        table: PropTypes.any.isRequired
    }
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="flex-container" style={{height: '100%'}}>
                {this.props.table}
            </div>
        )
    }
}
export class HrForm extends React.Component {
    static propTypes = {
        form: PropTypes.any.isRequired
    }
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="nc-bill-card">
                {this.props.form}
            </div>
        )
    }
}

export class HrDragWidthCom extends React.Component {
    static propTypes = {
        dragWidthCom : PropTypes.any.isRequired
    }
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="tree-table">
                {this.props.dragWidthCom}
            </div>
        )
    }
}