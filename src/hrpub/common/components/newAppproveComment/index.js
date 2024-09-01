import React, { Component } from 'react';

import { high, ajax, toast, base } from 'nc-lightapp-front';
import { ApproveComment, ApproveBtns, Comment } from '../approveComponents/index'
// import ApproveComment from '../approveComponents/ApproveComment';
// import ApproveBtns from '../approveComponents/ApproveComment/ApproveBtns';
// import Comment from '../approveComponents/ApproveComment/comment';
import PropTypes from "prop-types";
import './index.less'
import AddUserRefer from '../hr-approveUserRefer/hr-addUserRefer'
import UserRefer from 'uap/refer/riart/userRefer'  //改派的参照如果写成和加签的参照一样，那么就会导致改派按钮直接变成改派参照，如果以后改派参照出现问题，需要重新解决

// const peopleToHeavy = (topTargetKeys,bottomTargetKeys) => {//去除重复的选定人，生成数目
//     let arr = topTargetKeys.concat();
//     bottomTargetKeys.map( (item, index) => {
//         !arr.includes(item) && arr.push(item)
//     })
//     return arr.length;
// }
const defaultUrl = {
    getMessageUrl: '/nccloud/hrwa/hrapprove/HRApproveAction.do',
    getMessageListUrl: '/nccloud/riart/message/list.do',
    queryUserByBusinessUrl: '/nccloud/riart/approve/queryUserByBusiness.do'
}
class NewApproveComment extends Component {
    static contextTypes = {
        self: PropTypes.object,
        ctx: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            //审批意见
            comment: this.props.checknote || '',
            //审批按钮
            btns: this.props.btns || [],
            billMessage: this.props.billMessage || {},
            attrfiles: [],//已上传附件信息,
            commonList: [], //个性化意见
            isTrack: false,
            isFirstLoad: true,
            pk_checkflow: this.props.pk_checkflow || '',
            message: {},
            workflowType: '2',
            topTargetKeys: [],
            devModule:'hrwa',
            bottomTargetKeys: [],
            defbuttonName:{
                rejectto:[],
                billmake:[],
                before:[],
                reject:[]
            },
            sendUsers: this.props.sendUsers || { 'message': [], 'mail': [] }, //抄送的用户
            type: 'approve' //流程类型，默认是审批流 如果是工作流需要传参数
        };
    }

    componentDidMount() {
        this.getpk_message()
    }


    //获取pk_message
    getpk_message = () => {
        const { billid, billtype,isFlow} = this.props.billMessage
        let requestData = {};
        if(isFlow){
            requestData = {
                billId: billid,
                billType: billtype,
                isFlow:isFlow
            };
        }else{
            requestData = {
                billId: billid,
                billType: billtype
            };
        }
        ajax({
            url: defaultUrl.getMessageUrl,
            method: 'post',
            data: requestData,
            success: (res) => {
                let msgData = {}
                let devModule = 'hrwa'
                if (res.data) {
                    msgData = res.data
                    devModule = res.data.moduleCode||'hrwa'
                    let pk_message = msgData.pk_message || ''
                    this.setState({ pk_message,devModule:devModule}, () => {
                        let params = { "pk_message": pk_message };
                        this.begServiceCurrDate();
                        this.requestCheckNote('get');
                        this.getMessagelist(params, pk_message)
                    })
                }
            }
        })
    }

    getMessagelist = (params = {}, pk_message) => {
        ajax({
            url: defaultUrl.getMessageListUrl,
            data: params,
            method: 'POST',
            success: (res) => {
                // billTypeToModuleMap=res.data.billTypeToModuleMap;
                let dt = res.data.items.map(function (item, idx, origin) {
                    let _item = item;
                    _item.id = _item.pk_message;
                    return _item;
                });
                let msg = dt[0];
                let _detail = JSON.parse(msg.detail);
                let _enableActions = _detail["enableActions"];
                this.setState({
                    message: msg,
                    enableActions: _enableActions,
                }, () => {
                    let data = {
                        billtype: msg.billtype,
                        billid: msg.billid,
                        pk_message: pk_message
                    }
                    this.queryUserByBusiness(data)
                });
            }
        })
    }

    queryUserByBusiness = (data = {}) => {
        ajax({
            url: defaultUrl.queryUserByBusinessUrl,
            data: data,
            method: 'post',
            success: (res) => {
                let detail = res.data.detail;
                let btns = JSON.parse(detail) && JSON.parse(detail).enableActions;
                this.workflowType = res.data.workflowtype;
                if (res.data.workflowtype != 2 && res.data.workflowtype != 3) {
                    this.setState({
                        btns: btns,
                        billMessage: res.data,
                        pk_checkflow: res.data.pk_detail,
                        isFirstLoad: false
                    })
                } else {
                    this.setState({
                        btns: btns,
                        billMessage: res.data,
                        pk_checkflow: res.data.pk_detail,
                        isFirstLoad: false
                    });
                }
            }
        });
    }

    begServiceCurrDate = () => {//请求服务器当前时间
        const that = this;
        ajax({
            url: '/nccloud/workflow/approvalcenter/queryServerTimeAction.do',
            data: {},
            method: 'post',
            loading: false,
            success: (res) => {
                if (res && res.data) {
                    that.setState({
                        currTime: res.data
                    }, () => {
                        this.render();
                    });
                }
            }
        });
    }

    // 获取 或 更新常用意见    
    requestCheckNote = (opr, newData) => {
        if (opr == 'get') {
            ajax({
                url: '/nccloud/workflow/checknote/queryDefaultChecknote.do',
                method: 'post',
                success: (res) => {
                    if (res.data) {
                        this.setState({
                            commonList: JSON.parse(res.data)
                        });
                    }
                }
            });
        } else {
            ajax({
                url: '/nccloud/workflow/checknote/updatePfChecknote.do',
                data: newData,
                method: 'post',
                async: false,
                success: (res) => {
                    if (res.success) {
                        //将新增的意见输出
                        this.setState({
                            commonList: newData.checknotes
                        });
                    } else {
                        return new Error('更新意见请求出错');
                    }
                }
            });
        }
    }

    setAttr = ({ attrfiles, sendUsers, billMessage, isTrack }) => {
        if (sendUsers) {
            this.setState({ sendUsers })
        }
        if (attrfiles) {
            this.setState({ attrfiles })
        }
        if (billMessage && JSON.stringify(billMessage) !== '{}') {
            this.setState({ billMessage })
        }

        if (isTrack) {
            this.setState({ isTrack: !this.state.isTrack })
        }
    }


    onHandleSuccess = () => {
        this.props.onHandleSuccess()
    }


    render() {
        const {
            btns,
            comment,
            defbuttonName,
            billMessage,
            attrfiles,
            commonList,
            isTrack,
            isFirstLoad,
            pk_checkflow,
            message,
            pk_message,
            workflowType,
            sendUsers,
            devModule,
            type
        } = this.state;
        let billid = message.billid;
        let billtype = message.billtype;
        let detail = message.detail && JSON.parse(message.detail);
        let submitRejectBillMode = detail && detail["SubmitRejectBillMode"] || null;

        return <div>

            <div className="approve-comment">
                <div className="comment">
                    <Comment
                        minWidth={400}
                        minHeight={65}
                        defbuttonName={defbuttonName}
                        setComment={val => this.setState({ comment: val })}
                        commonList={commonList}
                        update={newlist => this.requestCheckNote('save', newlist)}
                        noShadow={true}
                        ref={div => this.comment = div}
                    />
                    <ApproveComment
                        devModule={devModule}
                        defbuttonName={defbuttonName}
                        className='outer-comment'
                        billid={billid}
                        billtype={billtype}
                        isTrack={isTrack}
                        setAttr={this.setAttr}
                        onHandleSuccess={this.onHandleSuccess.bind(this)}
                        needRefresh={false}
                        billMessage={billMessage}
                        workflowType={workflowType}
                        isFirstLoad={isFirstLoad}
                        pk_message={pk_message}
                        pk_checkflow={pk_checkflow}
                    />
                </div>
                <div className="comment-btns">
                    {type === 'approve' ? <ApproveBtns
                        devModule={devModule}
                        btns={btns}
                        comment={comment}
                        AddUserRefer={AddUserRefer}
                        UserRefer={UserRefer}
                        defbuttonName = {defbuttonName}
                        submitRejectBillMode={submitRejectBillMode}
                        attrfiles={attrfiles}
                        isBillEditStatus = {()=>{
                            return false
                        }}
                        sendUsers={sendUsers}
                        billMessage={Object.assign({}, billMessage, {
                            workflowType: '',
                            pk_checkflow: ''
                        })}
                        isTrack={isTrack}
                        showApproveDetail={false}
                        onHandleSuccess={this.onHandleSuccess}
                    /> :
                        <WorkflowBtns
                            devModule={devModule}
                            btns={btns}
                            defbuttonName={defbuttonName}
                            comment={comment} // 提交的审批意见
                            AddUserRefer={AddUserRefer}
                            UserRefer={UserRefer}
                            attrfiles={attrfiles} // 已上传的附件信息
                            sendUsers={sendUsers} // 抄送的用户
                            billMessage={Object.assign({}, billMessage, {
                                workflowType: '',
                                pk_checkflow: '',
                                devModule: devModule
                            })}
                            // url={`/nccloud/${billTypeToModuleMap[billtype]}/workflow/approvalcenter/uNWorkflowSingalPassAction.do`}
                            onHandleSuccess={this.handleSuccess.bind(this)}
                        />}
                </div>
                {/* <HrReferLoader

                >


                </HrReferLoader> */}
            </div>
        </div>
    }


}
export default NewApproveComment;
