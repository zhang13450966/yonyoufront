import React, {Component} from 'react';

import './index.less';

import Input from 'antd-mobile/lib/input-item';

import {getMultiLang} from '../../actions/language';

let timer = null;

class VerifyCodeInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeCount: 0
        };

        this.renderTimeCount = this.renderTimeCount.bind(this);
        this.startTimeCount = this.startTimeCount.bind(this);
    }

    componentDidMount() {
        this.startTimeCount(60);
    }

    startTimeCount(timeCount) {
        if(timeCount > 0) {
            timer = setTimeout(() => {
                this.setState({
                    timeCount: timeCount - 1
                });
                this.startTimeCount(timeCount - 1);
            }, 1000);
        }
        else {
            clearTimeout(timer);
        }
    }

    renderTimeCount() {
        if(this.state.timeCount > 0) {
            return (
                <span className="repost-time-count">
                    {`| ${this.state.timeCount}${getMultiLang('00064', '秒后重新获取')}`}
                </span>
            );
        }
        else {
            return (
                <span 
                    className="repost-verify-code"
                    onClick={() => {
                        this.startTimeCount(60);
                        this.props.regetVerifyCode();
                    }}
                >
                    {getMultiLang('00065', '重新获取')}
                </span>
            );
        }
    }

    render() {
        const {
            value,
            onChange
        } = this.props;

        return (
            <Input
                value={value}
                onChange={onChange}
                placeholder="请输入验证码"
                extra={this.renderTimeCount()}
            >
                {getMultiLang('00027', '邮箱验证码')}
            </Input>
        );
    }
}


export default VerifyCodeInput;