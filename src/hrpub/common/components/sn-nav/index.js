/**
 * Created by wanghongxiang on 2018/7/12.
 */
import React, {Component} from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types';
import {base} from 'nc-lightapp-front';
import '../../static/style/common.less'
import '../../static/fonts/iconfont.css'
import './index.less'
const propTypes = {
    index: PropTypes.number,
    data: PropTypes.array,
    callback: PropTypes.function,
    show: PropTypes.boolean,
    propsData: PropTypes.any,
    _this: PropTypes.any
};
const defaultProps = {
    index: 6,
    data: [1,2,3,4,5,6],
    show: false
};
class SnNavArrow extends Component {
    constructor (props) {
        super(props)
        this.step = 1
        this.flag = false // 是否为点击触发
    }
    componentDidMount () {
    }
    componentWillReceiveProps (nextProps) {
        if (!this.flag && nextProps.data.length != this.props.data.length) {
            if (this.props.propsData.form.snData && this.props.propsData.form.snData.isUpdate) {
                this.props.callback(this.props.index, this.props.propsData, this.props._this)
            }
        }
    }
    handler (type) {
        this.flag = true
        if (/before/g.test(type)) {
            this.step = -1
        } else {
            this.step = 1
        }
        switch (type) {
            case 'before-page':
                this.setState({
                    index: 0
                }, () => {
                    this.props.callback(0, this.props.propsData, this.props._this)
                })
                break;
            case 'before-one':
                if (this.props.index === 0) {
                    this.setState({
                        index: 0
                    }, () => {
                        this.props.callback(this.state.index, this.props.propsData, this.props._this)
                    })
                    return
                }
                break;
            case 'after-one':
                if (this.props.data.length) {
                    if (this.props.index  === this.props.data.length - 1) {
                        this.setState({
                            index: this.props.index
                        }, () => {
                            this.props.callback(this.state.index, this.props.propsData, this.props._this)
                        })
                        return
                    }
                }
                break;
            case 'after-page':
                this.setState({
                    index: this.props.data.length - 1
                }, () => {
                    this.props.callback(this.props.data.length - 1, this.props.propsData, this.props._this)
                })
                return
        }

        this.setState({
            index: this.props.index + this.step
        }, () => {
            this.props.callback(this.state.index, this.props.propsData, this.props._this)
        })
        this.flag = false
    }
    render () {
        let noDropBefore = classnames({
            'no-drop': this.props.index <= 0
        })
        let noDropAfter = classnames({
            'no-drop': this.props.index >= (this.props.data && this.props.data.length && this.props.data.length - 1)
        })
        let show = classnames({
            "sn-nav-arrow": true,
            "sn-nav-hidden": !this.props.show
        })
        return (
            <div className={show}>
                <i className={"icon iconfont wui-zhidi sn-before-page " + noDropBefore} onClick={this.handler.bind(this, 'before-page')}></i>
                <i className={"icon iconfont wui-sanjiaoxing-xia sn-before-one " + noDropBefore} onClick={this.handler.bind(this, 'before-one')}></i>
                <i className={"icon iconfont wui-sanjiaoxing-xia sn-after-one " + noDropAfter} onClick={this.handler.bind(this, 'after-one')}></i>
                <i className={"icon iconfont wui-zhidi sn-after-page "  + noDropAfter} onClick={this.handler.bind(this, 'after-page')}></i>
            </div>
        )
    }
}
SnNavArrow.propTypes = propTypes;
SnNavArrow.defaultProps = defaultProps;
export default SnNavArrow
