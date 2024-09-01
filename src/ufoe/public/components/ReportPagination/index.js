/**
 * Created by wangzqf on 2018/11/19.
 */
import React, { Component } from 'react';

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}};

import { base, getMultiLang, promptBox } from 'nc-lightapp-front';
import './index.less';
const { NCDiv } = base;

export default class ReportPagination extends Component {
    static defaultProps = {
        // 页数改变事件
        onPageChange: () => {

        },
        // 获取重置input函数
        getReset: () => {

        },
        // total总共的页数
        total: 1,
        current: 1,
        show: true

    }
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            // 多语json处理
            json: {}
        }
    }

    componentWillMount() {
        if(_.isEmpty($appRoot.state.json)){
            // 初始化调用getPlatformLang方法获取多语
            let callback = (json, bool, LangData) => {
                $appRoot.state.json = json;
            }
            $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
        }
    }

    componentDidMount() {
        this.props.getReset(this.reset);
        // document.addEventListener("keydown",this.handleEnterKey);
    }

    // 处理页面跳转的逻辑
    handlePageInfo = (type) =>{
        if (this.state.current === '') {
            this.setState({
                current: 1
            }, () => {
                this.props.onPageChange();
            })
            return
        }
        let page = '';
        // 前一页
        if(type === 'previous'){
            page = this.state.current - 1;
        }
        if(type === 'next'){
            page = this.state.current + 1;
        }
        if(type === 'jump'){
            page = this.state.current;
        }
        this.setState({
            current: page
        }, () => {
            this.props.onPageChange();
        })
    }

    handleCheckDataEditStatus = (type) =>{
        if(this.props.checkDataEditStatus && typeof this.props.checkDataEditStatus === 'function'){
            let status = this.props.checkDataEditStatus();
            if(status){
                promptBox({
                    color: 'warning',                   
                    content: $appRoot.state.json['public_lang-000221'], /* 国际化处理： 确定要放弃当前所编辑的数据吗？*/
                    beSureBtnClick: () =>{
                        this.handlePageInfo(type);
                    },
                    cancelBtnClick: () =>{
                        return;
                    }   
                });
            }else{
                this.handlePageInfo(type); 
            }
        }else{
            this.handlePageInfo(type);
        }
    }

    // 前一页
    previous = () => {
        if (this.state.current !== '' && this.state.current <= 1) {
            return
        }
        this.handleCheckDataEditStatus('previous');
    }

    // 下一页
    next = () => {
        if ((this.state.current !== '') && (this.state.current >= this.props.total)) {
            return
        }
        this.handleCheckDataEditStatus('next');
    }

    // 跳转
    jump = () => {
        this.handleCheckDataEditStatus('jump');
    }

    // inputChange
    inputChange = (event) => {
        // 正则校验必须为数字
        if(!/^[0-9]*$/.test(event.target.value )){
            return
        }
        // 判断输入值是否符合查询区间
        if (event.target.value !== '' && (event.target.value < 1 || event.target.value > Number(this.props.total))) {
            return
        }
        let current = '';
        if (event.target.value !== '') {
            current = parseInt(event.target.value);
        }
        this.setState({
            current
        })
    }
    reset = () => {
        this.setState({
            current: 1
        })
    }
    // 输入框回车事件
    entryDown = (e) => {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
            this.jump();
        }
    }
    
    render() { 
        let tableSetting = this.props.data && this.props.data.TableSetting ? this.props.data.TableSetting : {};
        let { showUpDown } = tableSetting;
        let total = this.props.total; 
        /**
         * 以下条件全部满足时，才显示分页控件：
         * 1、showUpDown是后台的全局配置参数，由项目自行决定是否显示分页; 
         * 2、show=true(currentSheet存在时)
         * 3、总页数大于1时，才显示
         */
        if (showUpDown === 'true' && this.props.show && total && Number(total) > 1) {
            return (
                <NCDiv areaCode={NCDiv.config.Pagination} className={`report-pagination-comp`}>
                    <span>{$appRoot.state.json['public_lang-000222']} <span>{total}</span>{$appRoot.state.json['public_lang-000223']}</span>{/* 国际化处理： 共,页*/}
                    <span className={`report-pagination-text ${this.state.current == 1 ? 'disable' : ''}`} onClick={this.previous}>{$appRoot.state.json['public_lang-000224']}</span>{/* 国际化处理： 上一页*/}
                    <input fieldid="goto" ref='input' onKeyDown={this.entryDown} className={`report-pagination-skipcount`} value={this.state.current} onChange={this.inputChange} />
                    <span className={`report-pagination-text ${this.state.current == total ? 'disable' : ''}`} onClick={this.next}>{$appRoot.state.json['public_lang-000225']}</span>{/* 国际化处理： 下一页*/}
                    <span className={`report-pagination-text`} onClick={this.jump}>{$appRoot.state.json['public_lang-000226']}</span>{/* 国际化处理： 跳转*/}
                </NCDiv>
            )
        } else {
            return null
        }
    }
}
