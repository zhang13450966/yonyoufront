import React, { Component, Fragment } from 'react';
import { ajax, toast, base, deepClone, getMultiLang, print, getSysFieldid, serverTimeToLocal, localTimeToServer } from 'nc-lightapp-front';
// import ApproveDown from '../../../../../common/components/ApproveDown';
// import FlowChart from '../../../../../common/components/FlowChart';
// import ContextMenu from '../../../../../common/components/ApproveDetail/ContextMenu';
import ApproveDetail, { ContextMenu } from "uap/common/components/ApproveDetail"
import moment from 'moment';
require("./index.less");

const { NCButton, NCTabs, NCTable, NCCheckbox, NCDropdown, NCMenu,NCIcon, NCRadio, NCModal, NCButtonGroup, NCSwitch, NCTooltip } = base;
const NCTabPane = NCTabs.NCTabPane;
const { Item } = NCMenu;
const { Header, Title, Body, Footer } = NCModal;
const Tooltip = base.NCTooltip;
function getRealUrl(devModule,url){
    let devUrl;
    if(devModule==null){
        devUrl='/nccloud/'+url;
    }else{
        devUrl= '/nccloud/'+devModule+'/'+url;
    }
    return devUrl;
}
export default class RejectBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDown: false,
            selectedRejectData: {},
            activeTab: 'main',//驳回头当前选中tab
            flowListInfo: {},//流程数据
            list:[],
            originalSelectedId: '',
            tableData: {},
            tableColumns: [],
            selectedSRBM: "0",
            showSRBMModal: false,
            json: {},
            inlt: null,
            resetChart: false,
            isHiddenContextMenu: true,
            xPos: 0,
            yPos: 0,
            model: {},
            steps: {},
            relatedRowIndex: [],
            tableselectid: '',
            selectedRowIndex: 0,
            flowAllInfo: {},
            isTrack: props.isTrack || false,
            doforecast: false, //流程预测开关
            isforecast: false, //是否可预测
            bodyHei: 200,
            viewType: 0,
            viewList: [],
            flowHeight: null,
            currDirection: "hor",
            defbuttonName:props.defbuttonName,
            curlanguage:props.curlanguage,
            showRejectModal: false
        }
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(!status) {
				console.error('未加载到 containers_approveoperationbtns.json 多语资源');
				return ;
			}
			this.setState({
				json, inlt,
				colorList: [
					{ display: json["ApproveDetail_013"], value: 'has-approve' },//已审
					{ display: json["ApproveDetail_014"], value: 'not-approve' },//未审
					{ display: json["ApproveDetail_015"], value: 'curr-link' },//当前环节
					{ display: json["ApproveDetail_016"], value: 'forecast-link' }//预测环节
				],
				viewList: [
					{ display: json["ApproveDetail_018"], value: 0 },//全部展示
					{ display: json["ApproveDetail_019"], value: 1 },//流程图
					{ display: json["ApproveDetail_020"], value: 2 }//详情列表
				]
			});
        }
        getMultiLang({
            moduleId: "containers_approveoperationbtns",
            domainName: 'uap',
            callback
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isTrack != this.state.isTrack){
            this.setState({
                isTrack: nextProps.isTrack
            });
        }
    }

    getReachDataById = (list, nodeObj) => {//获取相关联流程数据
		const {researchedata} = this.state;
		let steps = {
			list: []
		};
		if(!list.length) return steps;
		if(researchedata && Object.keys(researchedata).length && Object.keys(researchedata).includes(nodeObj.id)) {
			let data = Object.values(researchedata);
			let virCheckMan = [];
			data.length && data.forEach( (item) => {
				virCheckMan = virCheckMan.concat(item.checkmans);
			})
			steps = {
				isResearchNode: true,
				list: virCheckMan,
				actor: data[0].actor,
				actortype: data[0].actortype,
				participantProcessModeValue: data[0].participantProcessModeValue,
				participantProcessPassingThreshold: data[0].participantProcessPassingThreshold,
				racemodal: data[0].racemodal,
				branchWay: data[0].branchWay,
				mergeWay: data[0].mergeWay,
			}
		}else {
			let stepList = [];
			list.map( (item, index) => {
				if(nodeObj.id === item.values.activity_id.value) {
					stepList.push(item);
				}
			})
			steps = {
				isResearchNode: false,
				list: stepList
			};
		}
		return steps;
    }
    
    showContextMenu = (nodeObj) => {//驳回暂时不再使用右键弹窗信息提示
		const ev = window.event;
		ev.preventDefault();
        const reachData = this.getReachDataById(this.state.tableData.rows, nodeObj);
        //开始结束节点无提示(多结束)
		if(nodeObj.model.id.includes("isstart") || nodeObj.model.id.includes("isend")) return ;
		this.setState({
			isHiddenContextMenu: false,
			xPos: ev.offsetX + 20,
			yPos: ev.offsetY + 80,
			model: nodeObj.model,
            steps: reachData,
		});
    }
    
    getRelatedRow = (nodeObj) => {
		console.log("nodeObj", nodeObj);
		const that = this;
		const ev = window.event;
		ev.preventDefault();
		let relatedRowIndex = [];
		that.state.tableData.rows.map( (item, index) => {
			if(nodeObj.id === item.values.activity_id.value) {
				relatedRowIndex.push(index);
			}
		})
		
		this.setState({
			relatedRowIndex,
			isHiddenContextMenu: true,
            tableselectid: ''
		});
    }
    
    // 刷新消息通知
    changeBenchNote = () => {
        let storage = window.localStorage;
        storage.newMessage = 'workBenchMessage';
    }

    //获取驳回下拉按钮选项
    getMenu = (defbuttonName,curlanguage) => {
        return (
            <NCMenu
                className="reject-menu"
                onClick={this.preApproveReject}
            >

<Item
                    fieldid="rejectto"
                    key="rejectto"
                    className="menu-item u-dropdown-menu-item nc-theme-sp-common-font-c"
                >
                    {/* 驳回至 */}
                    {this.state.json['007']}
                </Item>
                <Item
                    fieldid="billmake"
                    key="billmake"
                    className="menu-item u-dropdown-menu-item nc-theme-sp-common-font-c"
                >
                    {/* 004 制单人 */}
                    {this.state.json['004']}
                </Item>
                <Item
                    key="before"
                    fieldid="before"
                    className="menu-item u-dropdown-menu-item nc-theme-sp-common-font-c"
                >
                    {/* 上一级 */}
                    {this.state.json['005']}
                </Item>
            </NCMenu>
        )
    }

     // 请求TableColumns数据
    getTableColumns = () => {
        let data = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"${10160901}\",\n  \"appcode\": \"${101609}\"\n}`,
                rqCode: 'template'
            },
            {
                rqUrl: '/platform/appregister/queryallbtns.do',
                rqJson: `{\n  \"pagecode\": \"${10160901}\",\n  \"appcode\": \"${101609}\"\n}`,
                rqCode: 'button'
            }
            ,
            {
                rqUrl: '/platform/appregister/queryappcontext.do',
                rqJson: `{\n  \"appcode\": \"${101609}\"}`,
                rqCode: 'context'
            }
        ];
        ajax({
            url: '/nccloud/platform/pub/mergerequest.do',
            data,
            method: 'post',
            success: (res) => {
                if (res.data) {
                    let template = res.data.template['historymsg']['items']
                    let tableColumns = []
                    for (let item of template) {
                        if (item.visible) {
                            if (item.attrcode !== 'attachments') {
                                tableColumns.push({
                                    title: item.label,
                                    dataIndex: item.attrcode,
                                    key: item.attrcode,
                                    width: 150
                                }, )
                            } else {
                                tableColumns.push({
                                    title: item.label,
                                    dataIndex: item.attrcode,
                                    key: item.attrcode,
                                    width: 150,
                                    render: (text, record, index) => {
                                        return (
                                            <div>
                                                {record.attachments > 0 ? <span
                                                    style={{
                                                        textDecoration: 'underline',
                                                        color: '#007ace',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        if (record.index === index + 1) {
                                                            this.setState({
                                                                showDown: true,
                                                                downBillid: record.pk_historymsg
                                                            });
                                                        }
                                                    }}>{this.state.json['006']}({record.attachments})</span> : <span style={{color: '#ccc'}}>{this.state.json['006']}(0)</span>}
                                                    {/* 006 查看附件 */}
                                            </div>
                                        )
                                    }
                                }, )
                            }
                        }
                    }
                    this.setState({
                        tableColumns: tableColumns
                    })
                }
            }
        })
    }

    handleChangeSRBM = (submitRejectBillMode) => {
        this.setState({selectedSRBM: submitRejectBillMode});
    }

    preApproveReject = (obj) => {
        if(this.props.isBillEditStatus()){
            return ;
        }

        if(obj&&obj.key=='rejectto'){
            this.openRejectModal();
            return ;
        }
        const { submitRejectBillMode } = this.props;
        if(submitRejectBillMode==null){
            this.approveReject(obj);
        }
        if(submitRejectBillMode==0){
            if(!obj)obj = {};
            obj.submit2RejectTache = "N";
            this.approveReject(obj);
        }
        else if(submitRejectBillMode==1){
            if(!obj)obj = {};
            obj.submit2RejectTache = "Y";
            this.approveReject(obj);
        }
        else if(submitRejectBillMode==2){
            if(obj){
                this.setState({toKey: obj.key, showSRBMModal: true});
                // this.props.modal.show('srbmModal');
            }
            else {
                this.approveReject(obj);
            }
            
        }
    }

     //执行驳回
    approveReject = (obj) => {
        const { billMessage, sendUsers, comment, skipCodes, attrfiles, submitRejectBillMode, isTrack, addParams={} } = this.props;
        const that = this;
        // let haveChooseNode  = true;
        // if(this.state.selectRejectId === this.state.originalSelectedId) {
        //     haveChooseNode = false;//未进行节点选择
        // }
        let data = {
            billtype: billMessage.billtype,
            billid: billMessage.billid,
            pk_checkflow: billMessage.pk_detail || '',
            // pk_wf_task: haveChooseNode ? this.state.selectRejectId : '',
            pk_wf_task: this.state.selectRejectId,
            skipCodes: skipCodes["reject"] || [],
            checknote: comment || "",
            //抄送用户
            copy_msg_users: sendUsers ? sendUsers.message : '',
            copy_mail_users: sendUsers ? sendUsers.mail : '',
            rejecttype: (obj && obj.key) || null,
            attrfiles: attrfiles,
            isTrack: isTrack,
            addParams
        };
        if(submitRejectBillMode == 2){
            data.submit2RejectTache = (that.state.selectedSRBM == 1 ? "Y" : "N");
        }
        let devModule=this.props.devModule;
        let devUrl=getRealUrl(devModule,'workflow/approvalcenter/approveRejectAction.do');    
        ajax({
            //url: '/nccloud/workflow/approvalcenter/approveRejectAction.do',
            url: devUrl,
            data: data,
            method: 'post',
            success: (res) => {
                that.changeBenchNote();
                if (res.data && (res.data == "200" || res.data.code == "200")) {
                    // 001 操作成功
                    toast({ duration: 3, content: this.state.json['001'], color: 'success' });
                }
                else {
                    // 002  操作失败
                    toast({ content: this.state.json['002'], color: 'error' });
                }
                that.setState({ showSRBMModal: false });
                that.closeRejectModal();
                if(that.props.onHandleSuccess && typeof that.props.onHandleSuccess == 'function' ) {//审批详情操作成功自动返回审批列表
                    that.props.onHandleSuccess();
                    // setTimeout(() => {
                    //     that.props.onHandleSuccess();
                    // }, 4000);
                }
            }
        });
    }

    //请求驳回流程列表
    requestRejectData = (fn, refreshtype='') => {
        const { billMessage, addParams={} } = this.props;
        ajax({
            url: '/nccloud/workflow/approvalcenter/worklownoteHistoryQuery.do',
            data: {
                billtype: billMessage.billtype,
                billid: billMessage.billid,
                addParams
            },
            method: 'post',
            success: (res) => {
                if(refreshtype == 'refreshtype'){
                    toast({content: this.state.json['ApproveDetail_027'] || '刷新成功', color:"success"});
                }
                if(res.data){
                    if (res.data.historymsg.rows && res.data.historymsg.rows.length > 0) {
                        let oids = []
                        for (let item of res.data.historymsg.rows) {
                            oids.push(item.values.pk_historymsg.value)
                        }
                        this.setState({
                            rejectList: res.data.historymsg.rows,
                            tableData: res.data.historymsg,
                            oids: oids,
                            // tableColumns: res.data.tableColumns
                        }, () => {
                            fn();
                        })
                    }
                    let canRejectArr = [];
                    res.data.historymsg.rows.map( (item, index) => {
                        if(item.values.approvestatus_value.value == 1) {
                            canRejectArr.push(index);
                        }
                    })
                    this.setState({canRejectArr: canRejectArr})
                }else{
                    this.setState({
                        canRejectArr: [],
                        tableData: {rows: []}
                    },() => {
                        fn();
                    })
                }
            }
        });

    }

    //打开驳回提示窗
    openRejectModal = () => {
        const {billtype, billid} = this.props.billMessage;
        this.getTableColumns()
        // this.getTableData()
        this.getStatus(billtype, billid)
        this.requestRejectData(() => {
            this.setState({
                relatedRowIndex: [],
                selectRejectId: '',
                tableselectid: '',
                showRejectModal: true
            })
        });
    }
    //确定驳回
    comfirmReject = (selectedNodeId) => {
        // this.onSelctedIdChange(selectedNodeId)
        // var haveChooseNode=true;
        // if(this.state.selectRejectId === this.state.originalSelectedId) {
        //     haveChooseNode = false;//未进行节点选择
        // }
        // if(!haveChooseNode){//未选择驳回环节
        //     toast({ content: this.state.json['020'], color: 'danger' });
        //     return;
        // }
        this.preApproveReject();
    }

    //生成驳回流程title对应数组数据(只有走过的流程节点才可以驳回)
    generateRejectTitleArr = (data) => {
        const {flowAllInfo, isforecast} = this.state;
		let rejectTitleArr = [{ subid: 'main', actName: flowAllInfo.main}]; // 001 主流程
		const keyArr = Object.keys(data);
		data.main.map((item, index, arr) => {
			if (item.subid && item.ispassroute && keyArr.includes(item.subid)) {
                rejectTitleArr.push({ subid: item.subid, actName: flowAllInfo[item.subid] });
            }
		})
		let virTitleArr = deepClone(rejectTitleArr);
		//插入三级及以上子流程节点
		rejectTitleArr.forEach( (item) => {
			if(item.subid !== "main") {
				this.addChildrenNodeTitle(item.subid, data, virTitleArr);
			}
		});
		return virTitleArr;
    }

    addChildrenNodeTitle = (subid, vo, virTitleArr) => {
		const {flowAllInfo, isforecast} = this.state;
		function filterTargetObject(targetObject, propsArray) {
			const result = {};
			Object.keys(targetObject).filter(key => !propsArray.includes(key)).forEach(key => {
					result[key] = targetObject[key];
			})
			return result;
		}
		let newVO = filterTargetObject(vo, ["main", "researchedata"]);
		const keyArr = Object.keys(newVO);
		if(!keyArr.includes(subid)) return ;
		newVO[subid].map( (item, index) => {
			if (item.sub_subid && item.ispassroute && keyArr.includes(item.sub_subid)) {
                virTitleArr.push({ subid: item.subid, actName: flowAllInfo[item.subid] });
                this.addChildrenNodeTitle(item.sub_subid, vo, virTitleArr);
            }
		})
	}

    // 请求审批或工作流的状态
	getStatus = (billtype, billid) => {
        const {addParams = {}} = this.props;
		let data = {
			billid,
            billtype,
            addParams
        };
        const { colorList } = this.state;
		ajax({
			url: '/nccloud/workflow/approvalcenter/flowStateQueryAction.do',
			data,
			// loading: false,
			method: 'post',
			success: (res) => {
				if (res.data) {
					if (res.data) {
                        this.setState({
                            flowState: res.data.flowState,
                            flowcode: res.data.flowcode,
                            isforecast: res.data.isforecast,
                            flowAllInfo: res.data,
                            colorList: res.data.isforecast ? colorList : colorList.slice(0, 3)
                        });
                    } else {
                        this.setState({
                            flowState: '',
                            flowcode: '',
                            isforecast: false,
                            colorList: colorList.slice(0, 3)
                        });
                    }
                    this.getActivityInfoData(billtype, billid);
				}
			}
		})
    }

    //更改是否显示预测流程
	changeForecastStatus = e => {
		const { doforecast, oriResearchedata } = this.state,
		    {billtype, billid} = this.props.billMessage;
		this.setState(
			{
				doforecast: !doforecast,
				researchedata: doforecast ? {} : deepClone(oriResearchedata)
			},
			() => {
				this.getActivityInfoData(billtype, billid);
			}
		);
    };
    
    getStyle= (obj, attr) => {
		if(obj.currentStyle){　　
			return obj.currentStyle[attr];
		}else{
		　　return getComputedStyle(_obj,false)[attr];　
		}
	}

	initBodyHei = (flowListInfo) => {
		if (!document.querySelector(".reject-detail")) return;
        // 32 wui-modal-body上下padding16*2       250是flowchart高度  1 / 3 是边框
        // ue又要求下面没有padding了，，，变来变去的
		let bodyHei = document.querySelector(".wui-modal-body") && this.state.viewType != 2 ?
        (document.querySelector(".wui-modal-body").clientHeight - 16 - 16) * 0.5 - 30 - 1:
		document.querySelector(".wui-modal-body").clientHeight - 16 - 30 - 1;
		//二次iframe嵌套
		bodyHei = bodyHei <= 60 ? 60 : bodyHei; 
		this.setState({
			bodyHei
		})
	}
    
    //请求审批驳回流程节点数据
    getActivityInfoData = (billtype, billid) => {
        const that = this;
        const {addParams = {}} = this.props,
            { doforecast } = this.state;
        ajax({
			url: '/nccloud/workflow/approvalcenter/generActivityInfo.do',
			data: {
				billtype: billtype,
				billid: billid,
                imageindex: 'all',
                addParams,
                doforecast
			},
			method: 'post',
			success: (res) => {
				if (res.data) {
                    let flowListInfo = res.data || {};

                    that.setState((prevState) => ({
                        flowListInfo,
                        list: flowListInfo[prevState.activeTab],
                    }), () => {
                        this.initBodyHei(flowListInfo);
                    })

				}else {
                    that.setState({
                        flowListInfo: {}
					}, () => {
                        // this.initBodyHei(flowListInfo);
                    })
                }
			}
		})
    }
    //关闭驳回提示窗
    closeRejectModal = () => {
        this.setState({
            showRejectModal: false,
            activeTab: 'main',
            isHiddenContextMenu: true,
            bodyHei: 200,
            viewType: 0,
            // viewList: [],
            flowHeight: null,
            selectRejectId: '',
        })
    }

     //驳回id选中
     onSelctedIdChange = (id) => {
        this.setState({
            selectRejectId: id,
        })
    }

    //驳回tab头部切换
    changeTabInfo = (activeTab) => {
        this.setState((prevState) => ({
            activeTab,
            list: prevState.flowListInfo[activeTab]
        }))
    }
    // 驳回列表的点击事件
    nctablerowclick = (record, index, event) => {
        let relatedRowIndex = [];
        relatedRowIndex.push(index)
        this.setState({ 
            relatedRowIndex,
            tableselectid: record.activity_id || ''
        });
    }

    //格式化table数据
    toTableFormat = (data) => {
        if (data && data.rows) {
            // senddate 发送日期 
            // dealdate 审批日期
            return data.rows.map((elem, ii) => {
                let item = {};
                for (let pop in elem.values) {
                    if(pop == 'senddate' || pop == 'dealdate'){
                        let time = elem.values[pop].display || elem.values[pop].value || ''
                        if(time != ''){
                            item[pop] = serverTimeToLocal(
                                moment(time),  // 必输, moment日期对象，如moment("2021-12-11")
                                '1' // 非必输， 字符串值为"1"或“2”，"1"为强制转时区，“2”为强制不转时区
                            ).format('YYYY-MM-DD HH:mm:ss')
                        }else{
                            item[pop] = ''
                        }
                        
                    }else{
                        item[pop] = elem.values[pop].display || elem.values[pop].value || '';
                    }
                    
                }
                item.index = ii + 1;
                return item;
            })
        
        }
    }

    onApproveDown = () => {
        this.setState({
            showDown: false
        })
    }

     // 上传附件
     fileListChange = (billId, fileList) => {
        for (let item of fileList) {
            this.addDocToWorkList({
                filename: item.name,
                pk_file: item.pk_doc,
                filesize: item.fileSize,
                billid: this.props.billMessage.billid,
                billtype: this.props.billMessage.billtype,
            })
        }
    }

    //重置流程图
	onResetChart = () => {
        this.requestRejectData(() => {
            this.setState({
                relatedRowIndex: [],
                selectRejectId: '',
                tableselectid: ''
            })
        }, 'refreshtype');
		this.setState({ resetChart: true })
	}

    
    render() {
        const { json } = this.state;
        const { submitRejectBillMode, billMessage } = this.props;
        // let submitRejectBillMode = 2;
        // const forcastTip = (
		// 	<div>
		// 		<p>{json["ApproveDetail_007"]}</p>
		// 		<p>{json["ApproveDetail_008"]}</p>
		// 		<p>{json["ApproveDetail_009"]}</p>
		// 		<p>{json["ApproveDetail_010"]}</p>
		// 		<p>{json["ApproveDetail_011"]}</p>
		// 	</div>
		// );
        return (
            <div style={{display: 'inline-block'}} onClick={ e => e.stopPropagation()}>
                <span className="reject-btns nc-theme-sp-special-btn">
                 
                {<NCDropdown
                        trigger={['hover']}
                        overlay={this.getMenu()}
                        animation="slide-up"
                        placement="bottomLeft"
                        fieldid="reject"
                        // overlayClassName="fieldid_reject_btn_list"
                    >
                        <NCButton fieldid="reject" is_arrow={true}>
                        {json['019']}<span className="iconfont icon-hangcaozuoxiala1"></span>
                        </NCButton>
                    </NCDropdown>}
                </span>
                {this.state.showRejectModal && <ApproveDetail 
                    visible={this.state.showRejectModal} 
                    billtype={billMessage.billtype} 
                    billid={billMessage.billid} 
                    rejectMod={true}
                    submitRejectBillMode={submitRejectBillMode}
                    changeSRBM={this.handleChangeSRBM}
                    changeReject={this.onSelctedIdChange}
                    confirm={this.comfirmReject}
                    close={this.closeRejectModal}
                />}
                <NCModal
                    fieldid="SRBM"
                    className="form-modal"
                    size="sm"
                    width="500px"
                    visible={this.state.showSRBMModal}
                    mask={"static"}
                    onCancel={() => this.setState({showSRBMModal: false})}>
                    <NCModal.Header closeButton>
                        <NCModal.Title fieldid="srbmTitle"> {json['007'] + (this.state.toKey == "billmake" ? json['004'] : json['005'])} </NCModal.Title>
                    </NCModal.Header >

                    <NCModal.Body>
                        <div style={{marginTop: '30px', marginBottom: '30px',textAlign: 'center', display: 'flex', width: '100%', justifyContent: 'center'}}>
                            <span className="rejectMode nc-theme-common-font-c">{json['013']}:</span>
                            {submitRejectBillMode == 2 ? 
                                <NCRadio.NCRadioGroup
                                    name=""
                                    selectedValue={this.state.selectedSRBM}
                                    onChange={this.handleChangeSRBM.bind(this)}>
                                    <NCRadio value="0" >{json['014']}</NCRadio>
                                    <NCRadio value="1" >{json['015']}</NCRadio>
                                </NCRadio.NCRadioGroup>
                            : 
                            submitRejectBillMode == 0 ? <span style={{marginLeft: '5px'}}>{json['014']}</span> : <span style={{marginLeft: '5px'}}>{json['015']}</span>}
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton fieldid="confirm" colors="primary" onClick={() => this.approveReject({key: this.state.toKey})}> {json['016']} </NCButton>{/* 国际化处理： 确定*/}
                        <NCButton fieldid="cancel" className="btn-transparent" onClick={() => this.setState({showSRBMModal: false})}> {json["010"]} </NCButton>{/* 国际化处理： 取消*/}
                    </NCModal.Footer>
                </NCModal>
            </div>
        )
    }
}