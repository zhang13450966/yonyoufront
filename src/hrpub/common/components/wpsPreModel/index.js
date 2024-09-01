import React, { Component } from 'react';

import './index.less';

import {
    base,
    toast,
    promptBox
} from 'nc-lightapp-front';
import StaffCardRef from 'src/hrpub/refer/pub/StaffCardRef';
import { openRevision,wpsQueryFile, getParam } from "./function/toolfunction";
// import language from '../../language';
import {hrAjax as proFetch} from 'src/hrpub/common/utils/utils';
const {
    NCModal,
    NCButton,
    NCCheckbox,
    NCPopconfirm
} = base;

const {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter
} = NCModal;


class SwitchToDocModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json:{},
            PsnCardData:null,
            pk_rpt_def:'',
            rptName:'',
            wpsInitmodelVisible:false,
            pk_psndoc:'',
            pk_conmodel: '',
            from: false, // 从哪种类型的节点来的
            pk_psndoc_sub: '',
            pk_agreement: ''
        };
        this.props.onRef(this);
        this.selectPsnCard = this.selectPsnCard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openWPS = this.openWPS.bind(this);
        this.openView = this.openView.bind(this);
        this.useUrl = this.useUrl.bind(this);
    }
    componentWillMount(){
        let callback = (json, status, inlt) => {
            if (status) {
                this.language = json
                this.setState({ json, inlt })//存json和inlt到页面state中并刷新页面
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: 'cardview', domainName: 'hrpub', callback })
    }
    // 从合同来的
    openView = (rowsData, from)=>{
        console.log(rowsData)
        const {json} = this.state
        let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) {
            toast({
                color: 'warning',
                content: json['cardview-00011']|| '暂不支持MAC'
            })
            return false
        }

        if(Array.isArray(rowsData)){ //判断是否是数组
            if( !rowsData.length ){
                toast({color: 'warning',content: json['cardview-00001']});  /*国际化：请选择数据 */
                return false;
            }else if( JSON.stringify(rowsData) === '[{}]' ){  //判断传值为'[{}]'情况
                toast({color: 'warning',content: json['cardview-00001']});  /*国际化：请选择数据 */
                return false;
            }
        }else{  //判断不是数组
            toast({color: 'warning',content: json['cardview-00001']});  /*国际化：请选择数据 */
            return false;
        }
        let pk_psndoc = '', pk_conmodel='', rptName='', pk_psndoc_sub='', pk_agreement='', pk_psnjob = '';
        if (rowsData[0].data) {
            pk_psnjob = rowsData[0].data.values.pk_psnjob.value;
            pk_psndoc = rowsData[0].data.values.pk_psndoc.value;  //默认获取第一条数据信息
            if (from === 'ct') { // '合同'
                pk_conmodel = rowsData[0].data.values.pk_conttext.value;
                rptName = rowsData[0].data.values.pk_conttext.display;
                pk_psndoc_sub = rowsData[0].data.values.pk_psndoc_sub.value
            } else if (from === 'ag') { // '协议
                pk_conmodel = rowsData[0].data.values.pk_conttext.value;
                rptName = rowsData[0].data.values.pk_conttext.display;
                pk_agreement = rowsData[0].data.values.pk_agreement.value
            }
        } else {
            pk_psnjob = rowsData[0].values.pk_psnjob.value;
            pk_psndoc = rowsData[0].values.pk_psndoc.value;
            if (from === 'ct') { // '合同'
                pk_conmodel = rowsData[0].values.pk_conttext.value;
                rptName = rowsData[0].values.pk_conttext.display;
                pk_psndoc_sub = rowsData[0].values.pk_psndoc_sub.value
            } else if (from === 'ag') { // '协议
                pk_conmodel = rowsData[0].values.pk_conttext.value;
                rptName = rowsData[0].values.pk_conttext.display;
                pk_agreement = rowsData[0].values.pk_agreement.value
            }
        }
        this.setState({
            pk_psndoc,
            pk_psnjob,
            wpsInitmodelVisible: from ? false: true,
            from: from,
            pk_conmodel: pk_conmodel,
            rptName: rptName,
            pk_psndoc_sub: pk_psndoc_sub,
            pk_agreement: pk_agreement
        }, () => {
            if (from) {
                this.openWPS()
            }
        })
    }

    // 调试方便
    async useUrl(allData) {
        // http://preview/nccloud/hrhi/rptfef/ReportDownload.do
        var filePath = ""
        var uploadPath = "D://test/"
        let postData = {
            "uploadPath": uploadPath, // 保存文档上传路径
            "fileName": filePath,
            "RptName":allData.RptName,
            "appcode":allData.appcode,
            "key":allData.key,
            "pk_rpt_def":allData.pk_rpt_def,
            "pk_psndoc":allData.pk_psndoc,
            "pk_conmodel": allData.pk_conmodel,
            "pk_psndoc_sub": allData.pk_psndoc_sub,
            "pk_agreement": allData.pk_agreement,
            "pk_org": allData.pk_org,
            // "userName": allData.UserName, //用户名
            "revisionCtrl": {
                "bOpenRevision": false,
                "bShowRevision": false
            },
            "internalDataFactory": "nccloud.web.hrhi.rptdef.factory.RtfDownloadFactory"
        }
        try {
            let res = await getParam(postData)
            if (res.success) {
                console.log('接口请求成功')
            } 
        } catch(e) {
            console.log(e)
        }
    }
    //选择人员卡片
    selectPsnCard(data, v){
        let { pk_rpt_def } = this.state;
        // if( v.value === pk_rpt_def ){
        //     return false;
        // }
        // console.log('选择完展示的所有数据',data,v)
        this.setState({
            pk_rpt_def: v.value || '',
            rptName:v.display || '',
            PsnCardData: data
        },()=>{
            console.log('更新数据之后的回调')
        })
    }
    closeModal() {
        this.setState({
            wpsInitmodelVisible: false,
            PsnCardData:null,
            pk_psndoc:''
        });
    }
    async openWPS(){
        const {pk_rpt_def,rptName,pk_psndoc, from, pk_conmodel, pk_psndoc_sub, pk_agreement, pk_psnjob} = this.state
        let postData = {
            "RptName":rptName,
            "appcode":this.props.appcode,
            "pk_rpt_def":pk_rpt_def,
            "pk_psndoc":pk_psndoc,
            "pk_psnjob": pk_psnjob,
            "userName": this.props.username, //用户名
            "pk_conmodel": pk_conmodel,
            "pk_psndoc_sub": pk_psndoc_sub,
            "pk_agreement": pk_agreement,
            "pk_org": this.props.pk_org.refpk || '',
            "internalDataFactory": "nccloud.web.hrhi.rptdef.factory.RtfDownloadFactory"
        }
        try {
            let res = await wpsQueryFile();
            if(res.data){
                postData.key = res.data.key
                console.log(postData)
                openRevision(postData)
                this.closeModal()
                // 加个接口  为方便查看接口问题
                // this.useUrl(postData)
            }
        }
        catch (e) {
        }
  

    }
    componentDidUpdate(preProps,preState){
        console.log("更新之后")
    }
    render() {
        const {
            pk_org
        } = this.props;

        const {
            wpsInitmodelVisible,
            PsnCardData,
            json
        } = this.state;
        console.log('渲染')
        return (
            <NCModal
                visible={wpsInitmodelVisible}
                onCancel={this.closeModal}
                size="sm"
                className="wps-preview-model"
                mask="static"
            >
                <ModalHeader
                    closeButton={true}
                >
                    <span>{json['cardview-00003'] || '报表浏览'}</span>{/* 国际化处理： 报表浏览*/}
                </ModalHeader>
                <ModalBody>
                    <div className="wpsModelbody">
                    <StaffCardRef
                        onChange={this.selectPsnCard}
                        value={PsnCardData}
                        queryCondition={() => {
                            return {
                                rpt_type: "1",
                                pk_org: pk_org.refpk
                            }
                        }}
                    ></StaffCardRef>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <NCButton
                        colors="primary"
                        onClick={this.openWPS}
                    >
                        {json['cardview-00009'] || '预览'}{/* 国际化处理： 是*/}
                    </NCButton>
                    <NCButton
                        onClick={this.closeModal}
                    >
                        {json['cardview-00010']}{/* 国际化处理： 否*/}
                    </NCButton>
                </ModalFooter>
            </NCModal>
        );
    }
}

export default SwitchToDocModal;
