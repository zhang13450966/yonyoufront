import React, { Component } from 'react';
import { ajax, toast, base, getMultiLang, pageTo } from 'nc-lightapp-front';
import { RejectBtn } from '../../ApproveOperationBtns';
import ApprovalRevocation from '../../ApprovalRevocation';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import ApprovalTrans from 'uap/common/components/approvalTrans';
require('./index.less');
const { NCButton, NCModal, NCTextArea } = base;

function getRealUrl(devModule,url){
    let devUrl;
    if(devModule==null){
        devUrl='/nccloud/'+url;
    }else{
        devUrl= '/nccloud/'+devModule+'/'+url;
    }
    return devUrl;
}

export default class ApproveBtns extends Component {
    constructor(props) {
        super(props);
        this.isAssgin = false;
        this.state = {
            btns: props.btns || [],
            assginTreeValue: {},
            approveType: '',
            showBtnsModal: false,
            skipCodes: {},
            resumeDetail: '',
            resumeCode: '',
            showResumeModal: false,
            showApproveModal: false,
            addApproverUsers: [],
            transferApproverUser: {},
            selectedRejectData: {},
            comment: props.comment || '',
            showAddApproveModal: false,
            addApproveSuggestion: "", // 加签意见
            showConfirmTransfer: false, // 是否显示指派弹框提交确认信息
            transferInfo: "", // 指派弹框提交确认信息内容
            json: {},
            inlt: null
        }
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载到 containers_workflowbtns.json 多语资源')
            }
        }
        getMultiLang({
            moduleId: 'containers_workflowbtns',
            domainName: 'uap',
            callback
        });
        this.defaultSgt = this.state.json['005'] // approvebtns_001 同意
    }

    componentDidMount(){
        window.document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        if(e.altKey){
            if(e.keyCode == 89){ //y
                this.detailDoApprove();
                e.stopPropagation();
            }else if(e.keyCode == 78){// n
                this.closeAddApproveModal();
                e.stopPropagation();
            }
        }
    }

    //审批意见 this.props.comment
    //抄送用户 this.props.sendUsers
    componentWillReceiveProps(nextProps, oldProps) {
        let { btns = [], comment } = nextProps;
        this.setState({ btns, comment });
    }

    // 刷新消息通知
    changeBenchNote = () => {
        let storage = window.localStorage;
        storage.newMessage = 'workBenchMessage';
    }
    // 点击撤销按钮
    onRevocation = () => {
        this.refs.revocation.open()
    }
    //点击批准按钮判断逻辑
    onPass = () => {
        if(this.props.isBillEditStatus()){
            return;
        };
       
        const { billMessage } = this.props;
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/workflowSingalEnableQueryAction.do');
        ajax({
            url: devUrl,
            data: {
                billtype: billMessage.billtype,
                billid: billMessage.billid,
                pk_checkflow: billMessage.pk_detail,
                check_note: this.state.comment
            },
            method: 'post',
            success: (res) => {
                let data = res.data;
                if(data && data.content){
                    this.isAssgin = true;
                    this.setState({
                        assginTreeValue: {
                            leftTreeData: res.data,
                        },
                        showBtnsModal: true,
                        approveType: "assign"
                    });
                }else if(data && (data == "500" || data.code == "500" )){
                    toast({color: 'error', content: this.state.json['011']}) // 011 操作失败
                }else{
                    this.approveAssgin(null);
                }
            }
        });
    }
    //执行批准
    approvePass = () => {
        const { billMessage, attrfiles } = this.props;
        let data = {
            "from_terminal":"pc",
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail,
            skipCodes: this.state.skipCodes.approve || [],
            // comment 非必输
            check_note: this.state.comment,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles
        };
        const that = this;
        let devModule=this.props.devModule;

          //ca电子签名
          let isNeedCaSign=false;
          let sn;
          let signStr;
          let cadevUrl= getRealUrl(devModule,'workflow/approvalcenter/ApprovePassActionCheckCaSign.do');
          ajax({
              url: cadevUrl,
              data: data,
              async : false,  //同步请求  
              method: 'POST',
              success: (res) => {
                  //this.changeBenchNote();
                  isNeedCaSign=res.data.isNeedCaSign
                  if (res.data && isNeedCaSign) {
                  let value =res.data.value;
                  let usercode=res.data.usercode;
                  let isca=res.data.isca;
                  let result=superSign(value,usercode,false,isca);
                  if(result.status==1){
                      toast({ color: 'danger', content: result.msg });
                      return ;
                  }
                  sn=result.sn;
                  signStr=result.signStr;
                  }
              },
              error: function (res) {
                // toast({ color: 'error', content: res.message })
                return ;
            }
          });
          data["isNeedCaSign"] = isNeedCaSign;
          data["sn"] = sn;
          data["signStr"] = signStr;

        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approvePassAction.do');
        ajax({
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    that.closeResumeModal();
                    toast({ content: this.state.json['012'], color: 'success' }); // 012 批准成功
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                    if(res.data.code == '321'){
                        pageTo.linkTo(res.data.detail.url, { appcode: res.data.detail.appcode, pagecode: res.data.detail.pagecode, c: res.data.detail.appcode, p: res.data.detail.pagecode, status: "browse" });
                        return;
                    }
                    // 审批提示--------------------没有单据示例
                    this.setState({
                        skipCodes: this.state.skipCodes,
                        resumeDetail: res.data.detail,
                        resumeCode: res.data.code,
                        showResumeModal: true
                    });
                }else {
                    // toast({ content: this.props.json['011'], color: 'error' }); // 011 操作失败                            
                    toast({ color: 'danger', content: res.data.error });
                }
            }
        });
    }
    //执行不批准
    approveRefuse = () => {
        const { billMessage, attrfiles } = this.props;
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail,
            skipCodes: this.state.skipCodes["Noapprove"] || [],
            checknote: this.state.comment,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles
        };
        const that = this;
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveNoPassAction.do');
        ajax({
           // url: '/nccloud/workflow/approvalcenter/approveNoPassAction.do',
            url:devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    toast({ content: that.state.json['013'], color: 'success' }); // 013 操作成功
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }
                else {
                    toast({ content: that.state.json['011'], color: 'error' }); // 011 操作失败
                }
            }
        });
    }
    //执行驳回
    approveReject = (obj) => {
        const { billMessage } = this.props;
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail,
            pk_wf_task: this.state.selectedRejectData ? this.state.selectedRejectData.pk_task : '',
            skipCodes: this.state.skipCodes["reject"] || [],
            check_note: this.state.comment || '',
            //抄送用户
            copy_msg_users: this.props.sendUsers ? this.props.sendUsers.message : '',
            copy_mail_users: this.props.sendUsers ? this.props.sendUsers.mail : '',
            rejecttype: (obj && obj.key) || null
        };
        const that = this;
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveRejectAction.do');
        ajax({
           // url: '/nccloud/workflow/approvalcenter/approveRejectAction.do',
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                this.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    toast({ content: that.state.json['013'], color: 'success' }); // 013 操作成功
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }else {
                    toast({ content: that.state.json['011'], color: 'error' }); // 011 操作失败
                }
            }
        });
    }

    detailDoApprove = () =>  {
        console.log("detailDoApprove");
        if(this.state.resumeCode == "315" || this.state.resumeCode == "314"){
            this.setState({
                confirmOrCancle:1
            })
        }
        if (this.state.approveType == "approve") {
            //
            this.approvePass();
        }
        else if (this.state.approveType == "Noapprove") {
            //
            this.approveRefuse();
        }
        else if (this.state.approveType == "reject") {
            // this.approveReject();
        }
        else if (this.state.approveType == "addapprove") {
            this.addapprove();
        }
        else if (this.state.approveType == "transfer") {
            //this.transferApprove()
        } 
        this.setState({ addApproveSuggestion: ''});
    }

    detailCancelApprove = () => {
        console.log("detailCancelApprove");
        if(this.state.resumeCode == "315" || this.state.resumeCode == "314"){
            this.setState({
                confirmOrCancle:2
            })
        }
        this.approvePass();
    } 

    //执行加签
    addapprove = () => {
        let addApproverUsers = this.state.addApproverUsers;
        let cdata = [];
        if (addApproverUsers && addApproverUsers.length > 0) {
            for (let i = 0; i < addApproverUsers.length; i++) {
                cdata.push(addApproverUsers[i].refpk)
            }
        } else {
            toast({ content: this.state.json['014'], color: 'warning' }); // 014 请选择加签用户
            return;
        }
        const { billMessage } = this.props;
        let data = {
            pk_checkflow: billMessage.pk_detail,
            pk_message: billMessage.pk_message,
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            approve_users: cdata,
            check_note: this.state.addApproveSuggestion,
            checknote: this.state.addApproveSuggestion,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail
        };
        const that = this;
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/addApprove.do');
        ajax({
            url: devUrl,
            data: data,
            method: 'POST',
            success: (res) => {
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        that.setState({ showAddApproveModal: false});
                        toast({ content: that.state.json['013'], color: 'success' }); // 013 操作成功
                        if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                            that.props.onHandleSuccess();
                        }
                    }
                }
            }
        });
    }
    //执行改派
    transferApprove = force_trans => {
        const { billMessage } = this.props;
        let value = this.state.transferApproverUser;
        let addTransferUsers = [];
        if (!value) {
            toast({ content: this.state.json['015'], color: 'warning' }); // 015 改派人员不能为空
            return;
        } else {
            addTransferUsers.push(value.refpk);
        }
        let data = {
            pk_checkflow: billMessage.pk_detail,
            pk_message: billMessage.pk_message,
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            trans_user: addTransferUsers,
            check_note: this.state.comment,
            force_trans: force_trans || false,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail
        }
        const that = this;
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveTransfer.do');
        ajax({
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        toast({ content: that.state.json['013'], color: 'success' }); // 013 操作成功
                        that.setState({ showConfirmTransfer: false });
                    }
                    if(res.data && (res.data == "300" || res.data.code == "300")) {
                        that.setState({
                            transferInfo: res.data.content,
                            showConfirmTransfer: true
                        });
                        return;
                    }
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }
            }
        });
    }
    //执行指派
    approveAssgin = (value) => {
        const { billMessage, attrfiles } = this.props;
        let check_note = this.state.comment;
        let data = {
            "from_terminal":"pc",
            pk_checkflow: billMessage.pk_detail,
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            skipCodes: this.state.skipCodes["approve"] || [],
            isAssgin: this.isAssgin,
            assgininfo: value,
            check_note: check_note,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles
        }
        const that = this;
        let devModule=this.props.devModule;

          //ca电子签名
          let isNeedCaSign=false;
          let sn;
          let signStr;
          let cadevUrl= getRealUrl(devModule,'workflow/approvalcenter/ApprovePassActionCheckCaSign.do');
          ajax({
              url: cadevUrl,
              data: data,
              async : false,  //同步请求  
              method: 'POST',
              success: (res) => {
                  //this.changeBenchNote();
                  isNeedCaSign=res.data.isNeedCaSign
                  if (res.data && isNeedCaSign) {
                  let value =res.data.value;
                  let usercode=res.data.usercode;
                  let isca=res.data.isca;
                  let result=superSign(value,usercode,false,isca);
                  if(result.status==1){
                      toast({ color: 'danger', content: result.msg });
                      return ;
                  }
                  sn=result.sn;
                  signStr=result.signStr;
                  }
              }
          });
          data["isNeedCaSign"] = isNeedCaSign;
          data["sn"] = sn;
          data["signStr"] = signStr;

        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approvePassAction.do');
        ajax({
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    this.closeBtnsModal();
                    this.closeResumeModal();
                    toast({ content: that.state.json['013'], color: 'success' }); // 013 操作成功
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                    if(res.data.code == '321'){
                        pageTo.linkTo(res.data.detail.url, { appcode: res.data.detail.appcode, pagecode: res.data.detail.pagecode, c: res.data.detail.appcode, p: res.data.detail.pagecode, status: "browse" });
                        return;
                    }
                    let { skipCodes } = this.state;
                    skipCodes["approve"] = res.data.skipCodes;
                    this.setState({
                        skipCodes: skipCodes,
                        resumeDetail: res.data.detail,
                        resumeCode: res.data.code
                    });
                    this.openResumeModal();
                }
                else {
                    // toast({ content: that.props.json['011'], color: 'error' }); // 011 操作失败
                    toast({ color: 'danger', content: res.data.error });
                }
            }
        });
    }

    //关闭审批提示窗
    closeBtnsModal = () => {
        this.setState({
            showBtnsModal: false
        });
    }

    //审批提示窗确认执行
    confirmApprove = (result) => {
        this.approveAssgin(result);
    }

    //修改改派用户参照
    setTransferApprover = (val) => {
        if(this.isBillEditStatus()){
            return ;
         }
        this.setState({
            transferApproverUser: val
        }, () => {
            //确定改派
            this.transferApprove()
        })
    }

    //修改加签用户参照
    setAddApprover = (val) => {
        this.setState({
            addApproverUsers: val
        });
    }

    //关闭审批警告
    closeResumeModal = () => {
        this.setState({
            approveType: "approve",
            skipCodes: {},
            showResumeModal: false
        });
    }

    //打开审批警告
    openResumeModal() {
        this.setState({
            showResumeModal: true
        });
    }

    // 工作流程
    showWorkflow = () => {
        this.setState({
            showApproveModal: true
        })
    }

    showTransferModule = () =>{
        if(this.isBillEditStatus()){
            return ;
         }
    }

    // 改派确认按钮触发事件
    onReassignmentSubmit = (targetKeys) => {
        this.setState({
            targetKeys: targetKeys
        })
    }

    handleSuccess = () => {
        if(this.props.onHandleSuccess && typeof this.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
            this.props.onHandleSuccess();
        }
    } 

    isBillEditStatus=()=>{
       if(!this.props.isBillEditstatus){
            return false;
        }
        if(this.props.isBillEditStatus()){
            return true;
        }else{
            return false;
        }
    }

    // 关闭加签弹框
    closeAddApproveModal = () => {
        console.log("closeApproveModal");
        this.setState({
            approveType: "",
            showAddApproveModal: false,
            addApproveSuggestion: ''
        });
    }

    // 打开加签框
    openAddApproveModal = () => {
        if(this.isBillEditStatus()){
           return ;
        }
        this.setState({
            approveType: 'addapprove',
            showAddApproveModal: true
        });
    }

    addApproveSuggestChange = val => {
        this.setState({
            addApproveSuggestion: val
        });
    }

    // 关闭指派弹框提交确认框
    cancelConfirmTrans = () => {
        this.setState({ showConfirmTransfer: false });
    }

    // 确认
    beSureConfirmTrans = () => {
        let force_trans = true;
        this.transferApprove(force_trans);
    }

    render() {
        let { btns, showApproveModal, skipCodes , comment, json} = this.state;
        let { billMessage, sendUsers, AddUserRefer, UserRefer, submitRejectBillMode,devModule, addParams={} } = this.props;

        return <span className="approve-btns">
            <span className="btns">
                {/*批准按钮 判断条件为“isread="N"且btns不为空，btns[0]即为审批按钮名称”*/}
                {(!btns.includes('unapprove') && btns.length) && <NCButton fieldid="workflow-pass" onClick={this.onPass}>{btns[0]}</NCButton>}
                {/* 026 撤销 */}
                {btns.includes('unapprove') && <NCButton fieldid="undo" onClick={this.onRevocation}>{json['026']}</NCButton>}
                {/* 驳回至 */}
                {btns.includes('reject') && <RejectBtn
                    devModule={this.props.devModule}
                    billMessage={billMessage} sendUsers={sendUsers} 
                    comment={comment} skipCodes={skipCodes}
                    onHandleSuccess={this.handleSuccess.bind(this)}
                    submitRejectBillMode={submitRejectBillMode}
                    addParams={addParams}
                    isBillEditStatus={this.isBillEditStatus}
                    />}
                {/* 028 工作流程 */}
                {<NCButton fieldid="workflow-process" onClick={this.showWorkflow}>{json['028']}</NCButton>}
                {/* 改派按钮 */}
                {btns.includes('transfer') && <span className="user-refer">
                    <UserRefer
                        value={this.state.transferApproverUser}
                        onChange={this.setTransferApprover}
                        isMultiSelectedEnabled={false}
                        placeholder={json['019']} // 019 改派人
                        clickContainer={<NCButton onClick={this.showTransferModule}>{json['029']}</NCButton>} // 029 改派
                        queryCondition={{
                            isMutiGroup:false,
                            isShowGroupAdmin:false,
                            isShowSysAdmin:false,
                            isAuthFilter:false,
                            isAllUserVisible:false,
                            isShareUserVisible:false,
                            isSelfVisible:false,
                            isNeedNCUser:false,
                            adminoption:'USE' 
                        }}
                    />
                </span>}
                {/* 加签 */}
                {btns.includes('addapprover') && <NCButton fieldid="addApprover" onClick={this.openAddApproveModal}>{json['044']}</NCButton>}  
            </span>

            {/* 撤销 */}
            <ApprovalRevocation ref='revocation' url={this.props.url} data={{
                billtype: this.props.billMessage.billtype,
                billid: this.props.billMessage.billid,
                check_note: comment,
                workflowtype: this.props.billMessage.workflowType || "",
                pk_checkflow: this.props.billMessage.pk_checkflow  || "",
                ...this.props.billMessage   
            }} 
            onHandleSuccess={this.handleSuccess.bind(this)}/>

            {/* 审批详情 */}
            {
                showApproveModal && <ApproveDetail
                    show={showApproveModal}
                    close={() => {
                        this.setState({
                            showApproveModal: false
                        })
                    }}
                    billtype={billMessage && billMessage.billtype}  //billMessage.billtype
                    billid={billMessage && billMessage.billid}  //billMessage.billid
                    addParams={addParams}
                    detailType="workflow"
                />
            }
            {/* 加签弹框 */}
            <NCModal fieldid="addApprover" className="form-modal" mask={true} visible={this.state.showAddApproveModal}>
                    <NCModal.Header>
                        <NCModal.Title fieldid="addApprover">{json['044']}</NCModal.Title> {/* 加签 */}
                    </NCModal.Header >
                    <NCModal.Body>
                        <div className="body-content">
                            <div className="content-inner">
                                <div className="label" style={{ width: 90 }}><i style={{color: 'red', marginRight: 4}}>*</i>{json['046']}</div>{/* 国际化处理： 选择加签人*/}
                                <div className="content">
                                    <div style={{ width: 200 }}>
                                    <AddUserRefer
                                    fieldid="adduserRefer"
                                            value={this.state.addApproverUsers}
                                            queryCondition={{
                                                GridRefActionExt: "nccloud.web.riart.billtype.ref.action.ItfApproveCenterUserRef",
                                                isMutiGroup: false,
                                                isShowGroupAdmin: false,
                                                isShowSysAdmin: false,
                                                isAuthFilter: false,
                                                isAllUserVisible: false,
                                                isShareUserVisible: false,
                                                isSelfVisible: false,
                                                isNeedNCUser: false,
                                                adminoption: 'USE'
                                            }}
                                            onChange={this.setAddApprover}
                                            isMultiSelectedEnabled={true}
                                            placeholder={json['045']}/* 国际化处理： 加签人*/
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content-inner">
                                <div className="label">{json['047']}</div>{/* 国际化处理： 输入批语*/}
                                <div className="content">
                                    <NCTextArea fieldid="comment" value={this.state.addApproveSuggestion}
                                        onChange={this.addApproveSuggestChange}
                                        showMax={true} 
                                        maxlength={500}
                                    />
                                </div>
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid="confirm" colors="primary" onClick={this.detailDoApprove}>{json['031']}</NCButton>{/* 国际化处理： 确定*/}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={this.closeAddApproveModal}> {json['033']} </NCButton>{/* 国际化处理： 关闭*/}
                    </NCModal.Footer>
            </NCModal>
            
            {/* { 指派弹框提交确认框 } */}
            <NCModal fieldid="confirmTrans" className="confirmTrans" visible={this.state.showConfirmTransfer}>
                <NCModal.Header>
                    {/* 048 询问 */}
                    <NCModal.Title fieldid="confirmTrans">{json['048']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>{ this.state.transferInfo }</NCModal.Body>
                <NCModal.Footer>
                        <NCButton fieldid="confirm" colors="primary" onClick={this.beSureConfirmTrans}>{json['031']}</NCButton>{/* 国际化处理： 确定*/}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={this.cancelConfirmTrans}> {json['032']} </NCButton>{/* 国际化处理： 关闭*/}
                </NCModal.Footer>
            </NCModal>

            <NCModal
                fieldid="approve-warn-workflowbtn"
                className="form-modal"
                size={this.state.resumeDetail && this.state.resumeDetail.size ? this.state.resumeDetail.size : "lg"}
                visible={this.state.showResumeModal}
                mask={true}
                onCancel={this.closeResumeModal}>
                <NCModal.Header closeButton>
                    {/* 030 审批警告 */}
                    <NCModal.Title fieldid={json['030']}> {json['030']} </NCModal.Title>
                </NCModal.Header >

                <NCModal.Body >
                    {this.state.resumeDetail && this.state.resumeDetail.html ? <div dangerouslySetInnerHTML={{__html: this.state.resumeDetail.html}}></div> : ""}
                    {this.state.resumeDetail && this.state.resumeDetail.url ? <iframe src={this.state.resumeDetail.url} style={{ width: "100%" }}></iframe> : ""}
                </NCModal.Body>
                {/* 031 确定 032 取消 033 关闭 */}
                <NCModal.Footer>
                    {this.state.resumeCode == "313" ? "" :
                        <NCButton fieldid="confirm" colors="primary" onClick={this.detailDoApprove}> {json['031']} </NCButton>}
                    {this.state.resumeCode != "314" && this.state.resumeCode != "315"  ? "" :
                        <NCButton fieldid="close" colors="primary" onClick={this.detailCancelApprove}> {json['032']} </NCButton>}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={this.closeResumeModal}> {json['033']} </NCButton>
                </NCModal.Footer>
            </NCModal>
            {/* 020 选择指派 */}
            {this.state.showBtnsModal ? <ApprovalTrans title={json['020']} 
            data={this.state.assginTreeValue.leftTreeData}
            display={this.state.showBtnsModal}
            cancel={this.closeBtnsModal}
            hideNote={true}
            getResult={this.confirmApprove}
            />: ''}
        </span>
    }
}