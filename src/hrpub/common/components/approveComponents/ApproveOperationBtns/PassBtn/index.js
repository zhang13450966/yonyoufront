import React, { Component } from 'react';
import { ajax, base, getMultiLang } from 'nc-lightapp-front';
const { NCButton } = base;

export default class PassBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null
        }
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({
                    json,
                    inlt
                });
            }else{
                console.log('未加载 containers_approveoperationbtns.json 多语文件');
            }
        }
        getMultiLang({moduleId: 'containers_approveoperationbtns', domainName: 'uap', callback});
    }
    //点击批准按钮判断逻辑
    onPass = () => {
        const { billMessage } = this.props;
        const that = this;
        ajax({
            url: '/nccloud/workflow/approvalcenter/workflowSingalEnableQueryAction.do',
            data: {
                billtype: billMessage.billtype,
                billid: billMessage.billid,
                pk_checkflow: billMessage.pk_detail
            },
            method: 'post',
            success: (res) => {
                const data = res.data;
                that.handlePassBack(data);
            }
        });
    }
    
    handlePassBack(data) {
        if(this.props.onPassHandle && typeof this.props.onPassHandle == 'function') {
            this.props.onPassHandle(data);
        }
    }

    render() {
        let { json } = this.state;
        // 000 批准
        return (
            <NCButton fieldid="approve-passBtn" colors='primary' onClick={this.onPass}>{json['011']}</NCButton>
        )
    }
}