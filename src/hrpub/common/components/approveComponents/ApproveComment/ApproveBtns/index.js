import React, { Component } from 'react';
import { getMultiLang, ajax, toast, base,promptBox } from 'nc-lightapp-front';
import SingleTargetTransferModal from '../../ApprovalOpinions/SingleTargetTransferModal';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import ApprovalRevocation from '../../ApprovalRevocation';
import { RejectBtn } from '../../ApproveOperationBtns';
require('./index.less');
const { NCModal, NCButton, NCTextArea } = base;
const { Header, Title, Body, Footer } = NCModal;

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
        this.pageMsgType = "approve";
        this.defaultSgt = "";
        this.passOrNopass = 'pass';
        this.state = {
            btns: props.btns || [],
            assginTreeValue: {},
            approveType: '',
            showBtnsModal: false,
            skipCodes: {},
            resumeDetail: '',
            resumeCode: '',
            showResumeModal: false,
            addApproverUsers: [],
            transferApproverUser: {},
            confirmOrCancle: null,
            json: {},
            inlt: null,
            comment: props.comment || '',
            addApproveSuggestion: "", // 加签意见
            showAddApproveModal: false,
            showConfirmTransfer: false, // 是否显示指派弹框提交确认信息
            transferInfo: "" , // 指派弹框提交确认信息
            isTrack:props.isTrack,   //追踪复选框
            showApproveModal: false,
            unApproveConfirmModal: false, // 取消审批确认弹框
            defbuttonName:props.defbuttonName,
            curlanguage:props.curlanguage
        }
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载到 containers_approvecomment.json 多语资源')
            }
        }
        getMultiLang({
            moduleId: 'containers_approvecomment',
            domainName: 'uap',
            callback
        });
        this.defaultSgt = this.state.json['approvebtns_001'] // approvebtns_001 同意
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

    //审批意见 this.state.comment
    //抄送用户 this.props.sendUsers

    componentWillReceiveProps(nextProps) {
        let { btns = [], comment, isTrack } = nextProps;
        this.setState({
            btns,
            isTrack,
            comment
        });
    }

    // 点击撤销按钮
    onRevocation = () => {
        this.refs.revocation.open()
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
        else if (this.state.approveType == "unApprove") {
            this.cancelApprove()
        }
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
                check_note: this.state.comment,
                isTrack: this.state.isTrack
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
                    toast({color: 'danger', content: this.state.json['approvebtns_002']}); // approvebtns_002 操作失败
                }else{
                    this.approveAssgin(null);
                }
            }
        });

    }
//执行批准
approvePass = async () => {
    let _this = this;
    let msg = _this.props.message;
    //智能审核失败
    if(msg&&msg.pointStatus&&msg.pointStatus=='4'){
        toast({ color: 'danger', content:this.state.json['10160501-000194'] })
        return ;
    }

    if(_this.props.hasOwnProperty('saveApprovePoint')){
        await _this.props.saveApprovePoint();
    }
  
       if(msg&&msg.pointStatus&&msg.pointStatus!=5){
              let pk_checkflow=msg.pk_detail;
              let data={
                pk_checkflow:pk_checkflow,
                check_note: this.state.comment
              }
              let devModule=this.props.devModule;
              let cadevUrl= getRealUrl(devModule,'workflow/approvalcenter/approvePassPointCheckAction.do');
              ajax({
                url: cadevUrl,
                data: data,
                async : true,  //同步请求  
                method: 'POST',
                success: (res) => {
                     // 待确认
                     if(res.data.haveErrorPoint){
                        toast({ color: 'danger', content: res.data.haveErrorPoint })
                        return ;
                    }
                    if(res.data.haveNoPassPoint&&res.data.haveNoPassPoint=='true'){
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10160501-000188'] ,                // 操作提示
                            content:  _this.state.json['10160501-000193'] ,           // 提示内容,非必输  '智能核查不通过，确定要继续操作吗？'
                            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                            beSureBtnName: _this.state.json['10160501-000191'],          // 确定按钮名称, 默认为"确定",非必输
                            cancelBtnName: _this.state.json['10160501-000192'],  
                            hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                            beSureBtnClick: _this.beSureBtnClickApprovePass2,   // 确定按钮点击调用函数,非必输
                            // cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
                            // closeBtnClick:functionClose,    //关闭按钮点击调用函数，非必输
                            closeByClickBackDrop:false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                            // zIndex:200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                        })
                    }else{
                        _this.approvePass2();
                    }
                },
                error: function (res) {
                    toast({ color: 'danger', content: res.message })
                    return ;
                }
            });
            
        }else{
            _this.approvePass2();
        }

    }
    approvePass2(){
        const { billMessage, attrfiles } = this.props;
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail,
            skipCodes: this.state.skipCodes.approve || [],
            // comment 非必输
            check_note: this.state.comment,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles,
            isTrack:this.state.isTrack||false  //追踪
        };
        if(this.state.confirmOrCancle){
            data.confirmOrCancleAction = this.state.confirmOrCancle;
        }
        const that = this;
        let devModule=this.props.devModule;
        console.log("approvePassAction.do",this.state.isTrack)

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

                  data["isNeedCaSign"] = isNeedCaSign;
                  data["sn"] = sn;
                  data["signStr"] = signStr;
        
                let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approvePassAction.do');
                ajax({
                   // url: '/nccloud/workflow/approvalcenter/approvePassAction.do',
                    url: devUrl,
                    data: data,
                    method: 'post',
                    success: (res) => {
                        that.changeBenchNote();
                        if (res.data && (res.data == "200" || res.data.code == "200")) {
                            that.closeResumeModal();
                            toast({ content: this.state.json['approvebtns_003'], color: 'success' }); // approvebtns_003 批准成功
                            if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                                that.props.onHandleSuccess({approvePass: true});
                            }
                        }
                        else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                            // 审批提示--------------------没有单据示例
                            let skipCodes = this.state.skipCodes;
                            
                            skipCodes["approve"] = res.data.skipCodes;
                            this.setState({
                                skipCodes,
                                resumeDetail: res.data.detail,
                                resumeCode: res.data.code,
                                showResumeModal: true,
                                approveType: "approve"
                            });
                        }
                        else {
                            // toast({ content: this.state.json['approvebtns_002'], color: 'error' }); // approvebtns_002 操作失败
                            toast({ content: res.data.error, color: 'danger' }); 
                        }
                    }
                });
              },
              error: function (res) {
                // toast({ color: 'error', content: res.message })
                return ;
            }          
          });
        
    }

    // 不批准指派
    approveNoPassAssign = (value) => {
        const { billMessage, attrfiles } = this.props;
        // const that = this;
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail || '',
            skipCodes: this.state.skipCodes["Noapprove"] || [],
            checknote: this.state.comment,
            assgininfo: value,  
            isAssgin: this.isAssgin,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles,
            isTrack: this.state.isTrack
        };

        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveNoPassAction.do');
        ajax({
           // url: '/nccloud/workflow/approvalcenter/approveNoPassAction.do',
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                this.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    this.setState({
                        showBtnsModal: false,
                        approveType: ''
                    });
                    toast({ content: this.state.json['approvebtns_021'], color: 'success' });  // approvebtns_021 操作成功
                }else {
                    toast({ content: this.state.json['approvebtns_002'], color: 'danger' }); // approvebtns_002 操作失败
                }
                if(this.props.onHandleSuccess && typeof this.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                    this.props.onHandleSuccess();
                }
            }
        });

    }

    changeBenchNote = () => {
        let storage = window.localStorage;
        storage.newMessage = 'workBenchMessage';
    }

    // 执行不批准 noPass
    approveRefuse = () => {
        if(this.props.isBillEditStatus()){
            return;
        };
        const { billMessage, attrfiles } = this.props;
        const that = this;
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail || '',
            skipCodes: this.state.skipCodes["Noapprove"] || [],
            checknote: this.state.comment,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            attrfiles: attrfiles,
            isTrack:this.state.isTrack||false,  //追踪
        };

        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveNoPassAction.do');
        ajax({
            url: devUrl,
            // url: '/nccloud/workflow/approvalcenter/approveNoPassAction.do',
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    toast({ content: this.state.json['approvebtns_021'], color: 'success' });  // approvebtns_021 操作成功
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }else if(res.data && (res.data == '355' || res.data.code == '355')){
                    console.log('test--355');
                    this.isAssgin = true;
                    this.passOrNopass = 'noPass';
                    this.setState({
                        assginTreeValue: {
                            leftTreeData: res.data,
                        },
                        showBtnsModal: true,
                        approveType: "assign"
                    });
                }else {
                    toast({ content: this.state.json['approvebtns_002'], color: 'danger' }); // approvebtns_002 操作失败
                }
            }
        });
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
            toast({ content: this.state.json['approvebtns_004'], color: 'warning' }); // approvebtns_004 请选择加签用户
            return;
        }
        const { billMessage } = this.props;
        let data = {
            pk_checkflow: billMessage.pk_detail,
            pk_message: billMessage.pk_message,
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            approve_users: cdata,
            // check_note: this.state.comment || this.defaultSgt,
            check_note: this.state.addApproveSuggestion,
            checknote: this.state.addApproveSuggestion,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            isTrack: this.state.isTrack
        };
        const that = this;

        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/addApprove.do');
        ajax({
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                if (res.data) {
                    if (res.data && (res.data == "200" || res.data.code == "200")) {
                        toast({ content: this.state.json['approvebtns_021'], color: 'success' }); // approvebtns_021 操作成功
                        this.setState({
                            addApproveSuggestion: '', // 清空意见
                            showAddApproveModal: false, // 关闭弹框
                        }); 
                    }
                    if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                        that.props.onHandleSuccess();
                    }
                }
            }
        });
    }
    //执行改派
    transferApprove = (force_trans) => {
        const { billMessage } = this.props;
        let value = this.state.transferApproverUser;
        let addTransferUsers = [];
        if (!value) {
            toast({ content: this.state.json['approvebtns_005'], color: 'warning' }); // approvebtns_005 改派人员不能为空
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
            checknote: this.state.comment,
            force_trans: force_trans || false,
            //抄送用户
            copy_msg_users: this.props.sendUsers.message,
            copy_mail_users: this.props.sendUsers.mail,
            isTrack: this.state.isTrack
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
                        that.setState({showConfirmTransfer: false});
                        toast({ content: this.state.json['approvebtns_021'], color: 'success' }); // approvebtns_021 操作成功
                    }
                    if(res.data && (res.data == "300" || res.data.code == "300")){
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
  approveAssgin =async (value) => {
    let _this = this;
    let msg = _this.props.message;
    //智能审核失败
    if(msg&&msg.pointStatus&&msg.pointStatus=='4'){
        toast({ color: 'danger', content:this.state.json['10160501-000194'] })
        return ;
    }
    if(_this.props.hasOwnProperty('saveApprovePoint')){
        await _this.props.saveApprovePoint();
    }

       if(msg&&msg.pointStatus&&msg.pointStatus!=5){
              let pk_checkflow=msg.pk_detail;
              let data={
                pk_checkflow:pk_checkflow,
                check_note: this.state.comment
              }
              let devModule=this.props.devModule;
              let cadevUrl= getRealUrl(devModule,'workflow/approvalcenter/approvePassPointCheckAction.do');
              ajax({
                url: cadevUrl,
                data: data,
                async : true,  //同步请求  
                method: 'POST',
                success: (res) => {
                    // 待确认
                    if(res.data.haveErrorPoint){
                        toast({ color: 'danger', content: res.data.haveErrorPoint })
                        return ;
                    }

                    if(res.data.haveNoPassPoint&&res.data.haveNoPassPoint=='true'){
                        promptBox({
                            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10160501-000188'] ,                // 操作提示
                            content:  _this.state.json['10160501-000193'] ,           // 提示内容,非必输  '智能核查不通过，确定要继续操作吗？'
                            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                            beSureBtnName: _this.state.json['10160501-000191'],          // 确定按钮名称, 默认为"确定",非必输
                            cancelBtnName: _this.state.json['10160501-000192'],  
                            hasCloseBtn:false,  
                            beSureBtnClick: () => {_this.beSureBtnClickApproveAssgin2(value) },         //显示“X”按钮，默认不显示，不显示是false，显示是true
                            // beSureBtnClick: ,   // 确定按钮点击调用函数,非必输
                            // cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
                            // closeBtnClick:functionClose,    //关闭按钮点击调用函数，非必输
                            closeByClickBackDrop:false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                            // zIndex:200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                        })
                    }else{
                        _this.approveAssgin2(value);
                    }
                },
                error: function (res) {
                    toast({ color: 'danger', content: res.message })
                    return ;
                }
            });
            
        }else{
            _this.approveAssgin2(value);
        }
    }

    beSureBtnClickApproveAssgin2 = (value) => {
        this.approveAssgin2(value);
    }

    beSureBtnClickApprovePass2 = () => {
        this.approvePass2();
    }

    approveAssgin2=(value)=>{
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
            attrfiles: attrfiles,
            isTrack:this.state.isTrack||false  //追踪
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

                 data["isNeedCaSign"] = isNeedCaSign;
                 data["sn"] = sn;
                 data["signStr"] = signStr;
        
                let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approvePassAction.do');
                ajax({
                   // url: '/nccloud/workflow/approvalcenter/approvePassAction.do',
                    url:devUrl,
                    data: data,
                    method: 'POST',
                    success: (res) => {
                        that.changeBenchNote();
                        if (res.data && (res.data == "200" || res.data.code == "200")) {
                            this.closeBtnsModal();
                            this.closeResumeModal();
                            toast({ content: this.state.json['approvebtns_021'], color: 'success' }); // approvebtns_021 操作成功
                            if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                                that.props.onHandleSuccess({approvePass: true});
                            }
                        }else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                            let { skipCodes } = this.state;
                            skipCodes["approve"] = res.data.skipCodes;
                            this.setState({
                                skipCodes: skipCodes,
                                resumeDetail: res.data.detail,
                                resumeCode: res.data.code,
                                approveType: "approve"
                            });
                            this.openResumeModal();
                        }
                        else {
                            // toast({ content: this.state.json['approvebtns_002'], color: 'error' }); // approvebtns_002 操作失败
                            toast({ content: res.data.error, color: 'danger' }); 
                        }
                        // 单据审批回调
                        if(typeof this.props.cb == 'function'){
                            this.props.cb(res);
                        }
                    }
                });
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
    comfirmApprove = (result) => {
        if(this.passOrNopass == 'noPass'){
            this.passOrNopass = 'pass';
            this.approveNoPassAssign(result);
        }else{
            this.approveAssgin(result);
        }
    }

    //修改改派用户参照
    setTransferApprover = (val) => {
        if(this.props.isBillEditStatus()){
            return;
        };

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
            // approveType: "approve", // 修正点确定未发送请求bug
            showResumeModal: true
        });
    }

    //打开审批提示窗
    openBtnsModal = (approveType) => {
        this.setState({
            approveType: approveType,
            showBtnsModal: true
        });
    }

    // 改派确认按钮触发事件
    onReassignmentSubmit = (targetKeys) => {
        this.setState({
            targetKeys: targetKeys
        })
    }

    cancelApprove = () => {//取消审批，取消批复
        //workflowtype==2,3,6 取消审批 其余为取消批复,但是当为6的时候走的是取消批复的接口
        const { billMessage, attrfiles } = this.props;
        const that = this;
        let _this = this;
        let _state = _this.state;
        _this.setState({ approveType: "unApprove" });
        if('2' == billMessage.workflowtype || '3' == billMessage.workflowtype) {
            let _data = {
                billtype: billMessage.billtype,
                billid: billMessage.billid,
                pk_checkflow: billMessage.pk_detail,
                attrfiles: attrfiles, 
                skipCodes: _this.state.skipCodes["unApprove"] || []
            };
            if (_this.state.confirmOrCancle) {
                _data["confirmOrCancleAction"] = _this.state.confirmOrCancle;
            }
            let devModule=this.props.devModule;
            let devUrl=getRealUrl(devModule,'workflow/approvalcenter/unApproveAction.do');
            ajax({
                //url: '/nccloud/workflow/approvalcenter/unApproveAction.do',
                url: devUrl,
                data: _data,
                method: 'post',
                success: (res) => {
                    that.changeBenchNote();
                    if (res.data && (res.data == '200' || res.data.code == '200')) {
                        toast({ content: this.state.json['approvebtns_006'] }); // approvebtns_006 取消审批成功
                        if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                            that.props.onHandleSuccess();
                        }
                    }
                    else if (res.data.code && res.data.code == "321") {
                        // _this.openWorkflowDetailPage();
                        _this.props.openTo(res.data.detail.url, { appcode: res.data.detail.appcode, pagecode: res.data.detail.pagecode, c: res.data.detail.appcode, p: res.data.detail.pagecode, status: "browse" });
                    }
                    else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                        _state.skipCodes["unApprove"] = res.data.skipCodes;
                        _state.resumeDetail = res.data.detail;
                        _state.resumeCode = res.data.code;
                        _state.approveType = "unApprove";
                        _this.setState(_state);
                        _this.openResumeModal();
                    }else{
                        toast({ color: 'danger', content: res.data.error });
                    }
                }
            })
        }else {//取消批复
            let _data = {
                billtype: billMessage.billtype,
                billid: billMessage.billid,
                pk_checkflow: billMessage.pk_detail,
                workflowtype: billMessage.workflowtype, 
                skipCodes: _this.state.skipCodes["unApprove"] || []
            };
            if (_this.state.confirmOrCancle) {
                _data["confirmOrCancleAction"] = _this.state.confirmOrCancle;
            }
            let devModule=this.props.devModule;
            let devUrl=getRealUrl(devModule,'workflow/approvalcenter/uNWorkflowSingalPassAction.do');
            ajax({
                //url: '/nccloud/workflow/approvalcenter/uNWorkflowSingalPassAction.do',
                 url: devUrl,
                data: _data,
                method: 'post',
                success: (res) => {
                    this.changeBenchNote();
                    if (res.data && (res.data == '200' || res.data.code == '200')) {
                        toast({ content: this.state.json['approvebtns_006'] }); // approvebtns_006 取消审批成功
                        if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                            that.props.onHandleSuccess();
                        }
                    }
                    else if (res.data.code && res.data.code == "321") {
                        // _this.openWorkflowDetailPage();
                        _this.props.openTo(res.data.detail.url, { appcode: res.data.detail.appcode, pagecode: res.data.detail.pagecode, c: res.data.detail.appcode, p: res.data.detail.pagecode, status: "browse" });
                    }
                    else if (res.data.code && res.data.code.length == 3 && res.data.code.slice(0, 1) == "3") {
                        _state.skipCodes["unApprove"] = res.data.skipCodes;
                        _state.resumeDetail = res.data.detail;
                        _state.resumeCode = res.data.code;
                        _state.approveType = "unApprove";
                        _this.setState(_state);
                        _this.openResumeModal();
                    }else{
                        toast({ color: 'danger', content: res.data.error });
                    }
                }
            })
        }
    }

    handleSuccess = () => {
        if(this.props.onHandleSuccess && typeof this.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
            this.props.onHandleSuccess();
        }
    }

     //重置iframe内页面样式
    resetIframeStyle = () => {
        let $frame = document.querySelector("#detailIframe");
        let frameWin = $frame.contentWindow;
        let $body = frameWin.document.body;
        consoel.log('body', $body)
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
        if(this.props.isBillEditStatus()){
            return;
        };
        this.setState({
            approveType: 'addapprove',
            showAddApproveModal: true
        });
    }

    showTransferModule = () =>{
        if(this.isBillEditStatus()){
            return ;
         }
    }


    isBillEditStatus=()=>{
        if(this.props.isBillEditStatus){
            if(this.props.isBillEditStatus()){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }


    addApproveSuggestChange = val => {
        this.setState({
            addApproveSuggestion: val
        });
    }

    // 关闭确认穿梭框
    cancelConfirmTrans = () => {
        this.setState({ showConfirmTransfer: false });
    }

    switchUnApproveConfirmModal = () => {
        promptBox({
            color: 'warning',               // 提示类别默认"success"
            title: this.state.json['approvebtns_028'] , // 取消审批 
            content:  this.state.json['approvebtns_029'] , // 已经审批完成，确定收回？
            noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            beSureBtnName: this.state.json['approvebtns_019'], // 确定
            cancelBtnName: this.state.json['approvebtns_022'],  // 取消
            hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
            beSureBtnClick: this.cancelApprove,   // 确定按钮点击调用函数,非必输
            // cancelBtnClick: this.switchUnApproveConfirmModal,  // 取消按钮点击调用函数,非必输
            // closeBtnClick:functionClose,    //关闭按钮点击调用函数，非必输
            closeByClickBackDrop:false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
            // zIndex:200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
        })
        // this.setState({
        //     unApproveConfirmModal: !this.state.unApproveConfirmModal
        // });
    }

    // 确认
    beSureConfirmTrans = () => {
        let force_trans = true;
        this.transferApprove(force_trans);
    }

    render() {
        let { btns, skipCodes, json, showApproveModal, isTrack } = this.state;
        const {billMessage, sendUsers, comment, attrfiles, submitRejectBillMode, AddUserRefer, UserRefer, showApproveDetail, addParams={} } = this.props;
        return <span className="approve-btns">
            {/*审批按钮*/}
            <span className="btns">
                {/* approvebtns_013 批准 */}
                {btns.includes('pass') && <NCButton fieldid="pass" colors='primary' onClick={this.onPass}>{json['approvebtns_013']}</NCButton>}
                {/* approvebtns_014 改派 approvebtns_015 撤销 */}
                {
                    btns.includes('reject') && 
                    <RejectBtn 
                        devModule={this.props.devModule}
                        defbuttonName={this.state.defbuttonName}
                        curlanguage={this.state.curlanguage}
                        billMessage={billMessage} sendUsers={sendUsers} 
                        comment={comment} skipCodes={skipCodes}
                        attrfiles={attrfiles}
                        submitRejectBillMode={submitRejectBillMode}
                        onHandleSuccess={this.handleSuccess.bind(this)}
                        isTrack={isTrack}//追踪
                        addParams={addParams}
                        isBillEditStatus={this.isBillEditStatus}
                    />
                }
                {btns.includes('unapprove') && <span>
                    <NCButton 
                        fieldid="approvebtns-unapprove"
                        className="reject-btn"
                        onClick={this.switchUnApproveConfirmModal}>
                        {['2','3','6'].includes(this.props.billMessage.workflowtype) ? json['approvebtns_008']: json['approvebtns_009']} 
                        {/* approvebtns_008 取消审批 approvebtns_009 取消批复 */}
                    </NCButton>
                </span>}
                {/* approvebtns_016 不批准 */}
                {btns.includes('nopass') && <NCButton fieldid="nopass"  onClick={this.approveRefuse}>{json['approvebtns_016']}</NCButton>}
                {btns.includes('addapprover') && <NCButton fieldid="addApprove" onClick={this.openAddApproveModal}>{json['approvebtns_017']}</NCButton>}
                {btns.includes('transfer') && <span className="user-refer">
                    {UserRefer ? <UserRefer
                        fieldid="user"
                        value={this.state.transferApproverUser}
                        onChange={this.setTransferApprover}
                        isMultiSelectedEnabled={false}
                        isAlwaysEmitOnChange={true}
                        placeholder={json['approvebtns_011']} // approvebtns_011 改派人
                        clickContainer={<NCButton fieldid="reassign"  onClick={this.showTransferModule}>{json['approvebtns_014']}</NCButton>} // approvebtns_014 改派
                        queryCondition={{
                            GridRefActionExt: "nccloud.web.riart.billtype.ref.action.ItfApproveCenterUserRef",
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
                    /> : null}
                </span>}
                {/* index_007审批详情*/}
                { showApproveDetail && <NCButton fieldid="approvebtns-approve-detail" onClick={() => this.setState({showApproveModal: true})}>{json['index_007']}</NCButton>}
            </span>

            {/*撤销确认弹框*/}
            <ApprovalRevocation ref='revocation' data={{
                billtype: this.props.billMessage && this.props.billMessage.billtype,
                billid: this.props.billMessage && this.props.billMessage.billid,
                check_note: comment,
                workflowtype: this.props.billMessage.workflowType || "",
                pk_checkflow: this.props.billMessage.pk_checkflow  || "",   
            }} onHandleSuccess={this.handleSuccess.bind(this)}/>

            {/* 审批详情 */}
            {
                showApproveModal && <ApproveDetail
                    show={showApproveModal}
                    close={() => {
                        this.setState({showApproveModal: false});
                    }}
                    billtype={billMessage && billMessage.billtype}  //billMessage.billtype
                    billid={billMessage && billMessage.billid}  //billMessage.billid
                    addParams={addParams}
                />
            }

            {/*选择指派人员*/}
            {/* approvebtns_012 改派人 */}
            {this.state.showBtnsModal ? <ApprovalTrans data={this.state.assginTreeValue.leftTreeData} title={json['approvebtns_012']}  getResult={this.comfirmApprove} display={this.state.showBtnsModal} cancel={this.closeBtnsModal}/> : ''}
            {/*审批警告*/}
            <NCModal
                fieldid="approve-warning"
                className="approve-warning-modal"
                size={this.state.resumeDetail && this.state.resumeDetail.size ? this.state.resumeDetail.size : "lg"}
                visible={this.state.showResumeModal}
                mask={true}
                onCancel={this.closeResumeModal}>

                <Header closeButton>
                    {/* approvebtns_018 审批警告 */}
                    <Title fieldid={json['approvebtns_018']}> {json['approvebtns_018']} </Title>
                </Header>
                <Body>
                    {this.state.resumeDetail && this.state.resumeDetail.html ?
                        <div dangerouslySetInnerHTML={{__html: this.state.resumeDetail.html}}></div> : ""
                    }
                    {this.state.resumeDetail && this.state.resumeDetail.url ?
                        <iframe src={this.state.resumeDetail.url} style={{ width: "100%", height: "100%" }} id="resumeDetailIframe" scrolling="yes"
                            onLoad={
                                () => {
                                    this.resetIframeStyle();
                                }
                            }></iframe> : ""
                    }
                </Body>
                <Footer>
                    {/* approvebtns_019 确定  approvebtns_020 关闭  approvebtns_022 取消 */}
                    {this.state.resumeCode == "313" || this.state.resumeCode == "316" ? "" :
                            <NCButton fieldid="confirm" colors="primary" onClick={this.detailDoApprove}> {json['approvebtns_019']} </NCButton>}
                    {this.state.resumeCode != "314" && this.state.resumeCode != "315"  ? "" :
                            <NCButton fieldid="cancel" colors="primary" onClick={this.detailCancelApprove}> {json['approvebtns_022']} </NCButton>}
                            <NCButton fieldid="close" className="btn-transparent" onClick={this.closeResumeModal}> {json['approvebtns_020']} </NCButton>
                </Footer>
            </NCModal>

            {/* 撤销确认弹框 */}
            <NCModal fieldid="unApprove-confirm" size="sm" visible={this.state.unApproveConfirmModal}>
                {/* approvebtns_028 取消审批 */}
                <NCModal.Header><NCModal.Title fieldid="unApprove-warning">{json['approvebtns_028']}</NCModal.Title></NCModal.Header>
                {/* approvebtns_029 已经审批完成，确定收回？ */}
                <NCModal.Body>{json['approvebtns_029']}</NCModal.Body>
                <NCModal.Footer>
                    <NCButton fieldid="confirm" colors="primary" onClick={this.cancelApprove}>{json['approvebtns_019']}</NCButton>{/* 国际化处理： 确定*/}
                    <NCButton fieldid="cancel" className="btn-transparent" onClick={this.switchUnApproveConfirmModal}> {json['approvebtns_022']} </NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>

            {/* 加签弹框 */}
            <NCModal fieldid="addApprover" size="sm" height={254} className="form-modal addApprover" mask={true} onHide={this.closeAddApproveModal} show={this.state.showAddApproveModal}>
                    <NCModal.Header closeButton={true}>
                        <NCModal.Title fieldid="addApprover">{json['approvebtns_017']}</NCModal.Title>
                    </NCModal.Header >
                    <NCModal.Body>
                        <div className="body-content">
                            <div className="content-inner">
                                <div className="label" style={{ width: 90 }}><i style={{color: 'red', marginRight: 4}}>*</i>{json['approvebtns_025']}</div>{/* 国际化处理： 选择加签人*/}
                                <div className="content">
                                    <div style={{ width: "100%" }}>
                                    {AddUserRefer ? <AddUserRefer
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
                                            placeholder={json['approvebtns_010']}/* 国际化处理： 加签人*/
                                        /> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="content-inner">
                                <div className="label" style={{width: 90}}>{json['10160501-000195']}</div>{/* 国际化处理：加签原因*/}
                                <div className="content">
                                    <NCTextArea fieldid="comment" value={this.state.addApproveSuggestion} onChange={this.addApproveSuggestChange} showMax={true} maxlength={4000}/>
                                    {/* <NCFormControl
                                        fieldid="comment"
                                        className="demo-input"
                                        value={this.state.addApproveSuggestion}
                                        onChange={this.addApproveSuggestChange}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid="confirm" colors="primary" onClick={this.detailDoApprove}>{json['approvebtns_019']}</NCButton>{/* 国际化处理： 确定*/}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={this.closeAddApproveModal}> {json['approvebtns_022']} </NCButton>{/* 国际化处理： 关闭*/}
                    </NCModal.Footer>
            </NCModal>
            <NCModal fieldid="confirmTrans" className="confirmTrans" show={this.state.showConfirmTransfer}>
                <NCModal.Header>
                    {/* approvebtns_027 询问 */}
                    <NCModal.Title fieldid="confirmTrans">{json['approvebtns_027']}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>{ this.state.transferInfo }</NCModal.Body>
                <NCModal.Footer>
                        <NCButton fieldid="confirm" colors="primary" onClick={this.beSureConfirmTrans}>{json['approvebtns_019']}</NCButton>{/* 国际化处理： 确定*/}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={this.cancelConfirmTrans}> {json['approvebtns_022']} </NCButton>{/* 国际化处理： 关闭*/}
                </NCModal.Footer>
            </NCModal>
            <SingleTargetTransferModal ref={'reassignmentModal'} changeCallback={this.onReassignmentSubmit}/>
        </span>
    }
}
