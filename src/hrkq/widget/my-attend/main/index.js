/**
 * @desc: 我的考勤
 */
import React, {Component} from 'react';
import { createPage } from 'nc-lightapp-front';
import Axios from "axios";
// import style, {sticker,title,hrfont,} from './index.less';
import './index.less'

class Container extends Component {
    constructor() {
        super();
        this.state = {
            errCount: 0,
            abnormalAttendance: {
                zh_CN: '异常考勤',
                zh_TW: '異常考勤',
                en_US: 'Abnormal Attnd'
            },
            json: {}
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.reRreshPage = this.reRreshPage.bind(this);
        this.getErrCount = this.getErrCount.bind(this);
    }
    componentDidMount(){
        this.getLanguage();
        this.getErrCount();
    }
    getErrCount () {
        Axios({
            url: '/ncchr/webservice/abnormalAttendCnt',
            method: 'GET'
        }).then(res => {
            if(res.data) {
                this.setState({
                    errCount: res.data.data
                })
            }
        }).catch(err => {
            console.error(err)
        })
    }
    clickHandler(e) {
        e.preventDefault();
	    window.top.openNew({appcode: '60656030'});
    }
    reRreshPage (e) {
        e.preventDefault();
        e.stopPropagation();
        this.getErrCount();
    }
    // 获取多语
	getLanguage = async () => {
		const { MultiInit } = this.props;

		await MultiInit.getMultiLang({
            moduleId: 'hr-widget',
            domainName: 'hrkq',
            callback: (json, status, init) => {
                this.setState({
                    json:json
                })
            }
        });
	};
    render() {
        return (
            <div className={'sticker'} onClick={this.clickHandler}>
                <div className={'title'}>
                    {this.state.json['widget-00001']}{/* 我的考勤 */}
                </div>
                <div className={'box'}>
                    <div className={'my-count'}>
                        {this.state.errCount}
                    </div>
                    <div className={'my-err-count'}>
                        <span className={this.state.errCount !=0 ? 'is-error' : 'isnt-error'}>
                            {this.state.json['widget-00002']}{/* 异常考勤 */}
                        </span>
                    </div>
                </div>
                <i className={'hrfont'} onClick={this.reRreshPage}>&#xe7d1;</i>
            </div>
        )
    }

}
let MyAttend = createPage({appAutoFocus: false})(Container);
ReactDOM.render(<MyAttend />, document.querySelector('#app'));