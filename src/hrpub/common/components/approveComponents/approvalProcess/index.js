import React, { Component } from 'react';
import { getMultiLang } from 'nc-lightapp-front';
import ApproveComment from '../ApproveComment'
import WorkFlow from '../Workflow'
let getParams = function () {
    let url = window.location.href; //获取url中"?"符后的字串   
    let params = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.split('?')[1];
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
};

export default class ApproveProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载到container_approvalProcess多语资源');
            }
        }
        getMultiLang({
            moduleId: 'containers_approvalProcess',
            domainName: 'uap',
            callback
        });
    }
    handleSuccess() {
        if(this.props.onHandleSuccess && typeof this.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
            setTimeout(()=>{
                this.props.onHandleSuccess();
            }, 4000);
        }
    }

    render() {
        let { workflowType } = this.props;
        return <div>
            {/* <ApproveComment {...this.state} onHandleSuccess={this.handleSuccess.bind(this)}/> */}
            {/* 手动注销，后期需要撤回 */}
            {/* {(workflowType == 2 || workflowType == 3 || workflowType == 6) && <ApproveComment {...this.props} json={this.state.json} inlt={this.state.inlt}  onHandleSuccess={this.handleSuccess.bind(this)}/>
            }
            {(workflowType != 2 && workflowType != 3 && workflowType != 6) && <WorkFlow {...this.props} json={this.state.json} inlt={this.state.inlt} onHandleSuccess={this.handleSuccess.bind(this)}/>
            } */}


            {<ApproveComment {...this.props} json={this.state.json} inlt={this.state.inlt}  onHandleSuccess={this.handleSuccess.bind(this)}/>
            }
            
        </div>
    }
}
