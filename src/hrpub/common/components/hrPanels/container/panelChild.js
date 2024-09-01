import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
import './index.less'
// 所有panel child 的基类
export default class BasePanelChild extends Component {
    static contextTypes = {
        ctx: PropTypes.object
    }
    constructor(props) {
        super(props)
        // this.state = {
        //     searchParam: this.context.ctx.state.searchParam
        // }
        this.getChildComponent = this.getChildComponent.bind(this)
        this.setModalValue = this.setModalValue.bind(this)
    }
    // 设置child Modal 值 ******这个在子类中必须调用*******
    setModalValue(val = {...this.state}) {
        // this.context.ctx.setState({
        //     childValue: {...this.state}
        // })
        this.context.ctx.childValue = {...this.state}
    }
    // 设置子组件模板******这个在子类中必须调用*******
    getChildComponent() {
    }
    render() {
        return (
            <div className={"hr-panel-child-component " + this.context.ctx.props.classNameChild}>
                {this.getChildComponent()}
            </div>
        )
    }
}