import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
let {NCDatePicker, NCTable, NCButton, NCModal, NCStep} = base;
const propTypes = {
    header: PropTypes.string,
    classNameChild: PropTypes.string
};
const defaultProps = {
    header: '',
    classNameChild: ''
};
class HrPanelContainer extends Component {
    static childContextTypes = {
        ctx: PropTypes.object,
        getModalValue: PropTypes.func
    }
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            childValue: null,
            extralData: null,   // 预急留一个参数备用
            ifromflag: null,
            classType: null,
            json: null,
            defaultCom: null
            // searchParam: {}
        }
        this.childValue = null
        this.requireValue = []  // 用于标识必输项
        this.cancel = this.cancel.bind(this)
        this.getModalValue = this.getModalValue.bind(this)
    }
    getChildContext() {
        return {
            ctx: this,
            getModalValue: this.getModalValue
        }
    }
    cancel() {
        this.setState({
            show: false
        })
    }
    show(...arg) {

        this.setState({
            show: true,
            extralData: arg,
            ifromflag: arg&&arg[0]&&arg[0]['type']['ifromflag'] || '',
            classType: arg&&arg[0]&&arg[0].itemtype || '',
            initialValue: arg&&arg[0]&&arg[0].initialValue || '',
            displayName: arg&arg[0]&&arg[0].displayName || arg&&arg[0]&&arg[0].initialValue&&arg[0].initialValue['vformula']&&arg[0].initialValue['vformula'].match(/(.*)\(./)[1] || ''
            // classType:
            // searchParam: searchParam
        })
    }
    getModalValue() {
        // 回调返加值
        let val
        if (!this.state.childValue) {
            val = this.childValue
        } else {
            val = this.state.childValue
        }
        let callback = this.props.callback(val)
        if ( callback && callback.then) {
            callback.then(res => {

                if (res && res == 'close') {
                    this.cancel()
                } else {
                    toast({color: 'danger', content: this.props.hrpubJson['hrpub-000054']})
                }
            })
        } else {
            this.cancel()
        }
    }
    render() {
        let size = this.props.size || 'md'
        return (
            <div>
                <NCModal size={size} ref="hr-container-modal" visible={this.state.show} onCancel={this.cancel.bind(this)}  mask='static'>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>
                            {this.props.header}
                        </NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        {
                            this.props.children
                        }
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={ this.getModalValue.bind(this) }>{this.props.hrpubJson['hrpub-000055']}</NCButton>
                        <NCButton onClick={ this.cancel.bind(this) }>{this.props.hrpubJson['hrpub-000056']}</NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        )
    }
}

export default HrPanelContainer