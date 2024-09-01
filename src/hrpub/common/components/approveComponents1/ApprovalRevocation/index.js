//陈道成使用
import React, {PureComponent} from 'react';
import { getMultiLang, toast, ajax } from 'nc-lightapp-front';
import {is} from 'immutable';
import NCConfirmModal from 'uap/common/components/nc_ConfirmModal';

export default class ApprovalRevocation extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            show: false, // 弹框显示状态
            data: {},
            json: {},
            inlt: null
        }
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(json){
                this.setState({json, inlt});
            }else{
                console.log('未加载 containers_Process_Revocation_Detail.json 多语文件');
            }
        }
        getMultiLang({moduleId: 'containers_Process_Revocation_Detail', domainName: 'uap', callback});
    }

    // 刷新消息通知
    changeBenchNote = () => {
        let storage = window.localStorage;
        storage.newMessage = 'workBenchMessage';
    }
    shouldComponentUpdate = (nextProps = {}, nextState = {}) => {
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    submit = () => {
        let data = Object.assign({}, this.props.data, 
            this.state.data)
        const that = this;
        let submitData = {
            url: this.props.url || '/nccloud/workflow/approvalcenter/uNWorkflowSingalPassAction.do',
            method: this.props.method || 'post',
            data,
            async: true,
            success: (res) => {
                that.changeBenchNote();
                if(res.data && (res.data == '200' || res.data.code == "200")){
                    if (typeof this.props.success === 'function') {
                        this.props.success(res);
                    }
                    toast({color: 'success', content: this.state.json['ApprovalRevocation_002']});
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }else{
                    toast({color: 'danger', content: res.data.error});
                }
                this.close()
            },
            error: (res) => {
                if (typeof this.props.error === 'function') {
                    this.props.error(res);
                }
                toast({color: 'danger', content: res.message});
            },
            mode: '',
            params: {},
            headers: {'Content-Type': 'application/json;charset:UTF-8'}
        }
        ajax(submitData)
    }
    open = () => {
        this.setState({show: true})
    }
    close = () => {
        this.setState({show: false})
    }

    render() {
        let {json} = this.state;
        return <NCConfirmModal show={this.state.show}
                               title={json['ApprovalRevocation_000']} // 000 撤销确认
                               content={json['ApprovalRevocation_001']} // 001 确定要撤销此次批复吗？
                               data={this.props.data}
                               onOk={this.submit}
                               onCancel={this.close}
        />
    }
}