/*
 * @Author: sunzhijun 
 * @Date: 2020-03-16 16:49:29 
 * @Last Modified by: sunzhijun
 * @Last Modified time: 2020-04-30 11:38:31
 */

import React, {Component} from 'react';
import { base, toast } from 'nc-lightapp-front';
const {NCModal, NCButton, NCTable, NCRadio, NCSelect, NCStep, NCFormControl} = base;
const {Header: NCModalHeader, Body: NCModalBody, Footer: NCModalFooter} = NCModal;
import { hrAjax as ajax } from 'src/hrpub/common/utils/utils';
import EmptyData from "src/hrpub/common/components/emptyImg";
import StaffCardRef from 'src/hrpub/refer/pub/StaffCardRef';
import download from 'src/hrpub/common/utils/download/download';
import './index.less';
import { propTypes } from 'react-codemirror';

/**
 * @class CardViewModal 联查卡片组件
 * @function openCardViewModal  打开联查组件方法可用refs获取
 */
class CardViewModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            cardViewModalVisible: false,
            isTemplate : false,          //判断是否获取到模板信息
            tableId: '',
            setSize: 'xxlg',              //控制弹窗尺寸
            isCloudNative: false,                 //判断是否云原生
            dialogClassName: 'view-card-modal'
        }
        this.props.onRef(this);         //接收refs传值以便调用内部方法
        this.closeCardViewModal = this.closeCardViewModal.bind(this);
        this.searchValueFn = this.searchValueFn.bind(this);
        this.selectPsnCard = this.selectPsnCard.bind(this);
        this.cardViewFn = this.cardViewFn.bind(this);
        this.openCardViewModal = this.openCardViewModal.bind(this);
        this.exportWord = this.exportWord.bind(this);
        props.use&&props.use.editTable('areacode123')
    }
    
    componentWillMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.lang = json
                this.setState({ json, inlt })//存json和inlt到页面state中并刷新页面
            }
        }
        this.props.MultiInit.getMultiLang({ moduleId: 'cardview', domainName: 'hrpub', callback })
    }

    //获取选择的列表或者卡片的数据
    setListData (){
        let { rowsData } = this.state;
        const { editTable, meta } = this.props;
        ajax({
            url: '/nccloud/hrhi/cardrep/CardrptTempQueryAction.do',
            data: {
                psndata : rowsData
            },
            success: res => {
                let data = res.data;
                data.template.areacode123.areaVisible = true;
                let template = {
                    areacode123: data.template.areacode123
                };
                let rowsData = data && data.grid.areacode123.rows;
                meta.addMeta(template,()=>{
                    this.setState({
                        isTemplate : true,
                        tableId: 'areacode123',
                        oldRowsData: rowsData
                    },()=>{
                        let { tableId, pk_rpt_def } = this.state;
                        editTable.setTableData(tableId, { rows: rowsData || [] });
                        editTable.focusRowByIndex(tableId, 0);
                        if( !!pk_rpt_def ){
                            this.cardViewInfo();
                        }
                    })
                });
                
            }
        })
    }

    /**
     * @param {Array} rowsData  必须为数组类型 
     * @memberof CardViewModal
     */
    openCardViewModal(rowsData){
        let { json } = this.state;
        let newData = [], pk_psnjob;
        ajax({
            url: '/nccloud/hrpub/hr/env/HRRunningEnvAction.do',  //判断是否云原生
            success: res => {
                let isCloudNativeData = res.data && res.data.isCloudNative;
                // let isCloudNativeData = true;
                if( isCloudNativeData ){
                    this.setState({
                        setSize: 'sm',
                        isCloudNative: isCloudNativeData,
                        dialogClassName: 'view-card-primary-modal'
                    })
                }else{
                    this.setState({
                        setSize: 'xxlg',
                        isCloudNative: isCloudNativeData,
                        dialogClassName: 'view-card-modal'
                    })
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
                if( rowsData[0].data ){
                    rowsData.forEach((item,index)=>{
                        newData.push(item.data)
                    })
                    rowsData = newData;
                }
                pk_psnjob = rowsData && rowsData[0].values.pk_psnjob.value;  //默认获取第一条数据信息
                this.setState({
                    cardViewModalVisible: true,
                    rowsData: rowsData,
                    pk_psnjob: pk_psnjob
                },()=>{
                    this.setListData();
                })
            }
        })
    }
    // 关闭联查卡片
    closeCardViewModal(){
        this.setState({
            cardViewModalVisible: false
        })
    }

    //搜索人员编码或姓名
    searchValueFn( val ){
        const { editTable } = this.props;
        let { oldRowsData, tableId } = this.state;
        let newRowsData = [];
        this.setState({
            searchValue: val
        })
        if( !!val ){
            oldRowsData.map((item, index)=>{
                if( item.values['pk_psndoc.code'] && item.values['pk_psndoc.code'].display.indexOf(val) > -1 || item.values['pk_psndoc.name'] && item.values['pk_psndoc.name'].display.indexOf(val) > -1 ){
                    newRowsData.push(item);
                }
            });
            editTable.setTableData(tableId, { rows: newRowsData});
        }else{
            editTable.setTableData(tableId, { rows: oldRowsData || [] });
        }
    }

    //卡片预览
    cardViewFn(props, moduleId, record, index, e){
        // let pk_psnjobs = !!record ? record.values.pk_psnjob.value : pk_psnjob;
        if(!!record){
            this.setState({
                pk_psnjob: record.values.pk_psnjob.value
            })
        }
       this.cardViewInfo();
    }
    //卡片预览信息
    cardViewInfo(){
        let { pk_rpt_def, pk_psnjob, isCloudNative, json } = this.state;
        if( !isCloudNative ){
            if( !!pk_rpt_def ){
                ajax({
                    url: '/nccloud/hrhi/cardrep/CardrptPreviewAction.do',
                    data: {
                        pk_rpt_def: pk_rpt_def,
                        pk_psnjob: pk_psnjob
                    },
                    success: res => {
                        let data = res.data;
                        this.setState({
                            cardViewData : data
                        })                    
                    }
                })
            }else{
                toast({color: 'warning',content: json['cardview-00002']}); /*国际化：请选择人员卡片 */
            }
        }
    }

    //选择人员卡片
    selectPsnCard(data, v){
        let { pk_rpt_def, isCloudNative } = this.state;
        if( v.value === pk_rpt_def ){
            return false;
        }
        this.setState({
            pk_rpt_def: v.value || '',
            PsnCardData: data
        },()=>{
            v.value ? this.cardViewFn() : this.setState({
                cardViewData: ''
            });
        })
    }

    //下载
    exportWord (){
        let { pk_rpt_def, pk_psnjob, json } = this.state;
        if( !!pk_rpt_def ){
            download({
                url: '/nccloud/hrhi/cardrep/CardrptExportAction.do',
                body: {
                    jsonStr: JSON.stringify({
                        pk_rpt_def: pk_rpt_def,
                        pk_psnjob: pk_psnjob
                    })
                },
                onResult: (res) => {
                    // debugger
                }
            })
        }else{
            toast({color: 'warning',content: json['cardview-00002']}); /*国际化：请选择人员卡片 */
        }
    }

    render() {
        let { editTable: {createEditTable}, pk_org } = this.props;
        let { cardViewModalVisible, searchValue, pk_rpt_def, cardViewData, PsnCardData, isTemplate, tableId, setSize, isCloudNative, dialogClassName, json } = this.state;
        return (
            <NCModal
                visible={cardViewModalVisible}
                onCancel={ this.closeCardViewModal }
                mask={'static'}
                size={setSize}
                className={ dialogClassName }
                resizable={false}
            >
                <NCModalHeader closeButton={true}>
                    {/*国际化： 卡片浏览 */}
                    { json ? json['cardview-00003'] : null }   
                </NCModalHeader>
                <NCModalBody>
                    <div className="cardview-container">
                        <div className="cardview-left">
                            <div className="cardview-select-box">
                                <div className="staff-card-ref">
                                    <StaffCardRef
                                        onChange={this.selectPsnCard}
                                        value={PsnCardData}
                                        queryCondition={() => {
                                            return {
                                                rpt_type: "1",
                                                pk_org: pk_org
                                            }
                                        }}
                                    ></StaffCardRef>
                                </div>
                                <NCFormControl
                                    type='search'
                                    placeholder={json ? json['cardview-00004'] : null}    /*国际化：输入人员编码/姓名搜索*/
                                    // className="cardview-search-box"
                                    value={searchValue}
                                    onChange={this.searchValueFn}
                                    onSearch={this.searchValueFn}
                                    // size="sm"
                                />
                            </div>
                            { isTemplate ? createEditTable(tableId,{
                                cancelCustomRightMenu: true,
                                onRowClick: this.cardViewFn                        // 左侧选择列单个选择框回调
                            }) : null}
                        </div>
                        { isCloudNative  ? null : <div className="cardview-right">
                            <div className="card-view">
                                {
                                    !!pk_rpt_def ? 
                                        <div className="card-view-con">
                                            <span
                                                style={{
                                                    display: 'inline-block'
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: cardViewData
                                                }}
                                            >
                                            </span>
                                        </div>
                                    : <EmptyData text={json ? json['cardview-00002'] : null /*国际化：请选择人员卡片*/}></EmptyData>
                                }
                                
                            </div>
                        </div>}
                    </div>
                </NCModalBody>
                <NCModalFooter>
                    <NCButton onClick={ this.exportWord }>
                        { json ? json['cardview-00008'] : null /*国际化：下载*/}
                    </NCButton>
                </NCModalFooter>
            </NCModal>
        );
    }
}
export default CardViewModal;
