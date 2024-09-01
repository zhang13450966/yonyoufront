/*
 * @Author: ligangt
 * @PageInfo: 到货单列表
 * @Date: 2018-04-17 15:48:43
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-21 14:19:07
 */
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';
import { searchBtnClick, buttonClick, pageInfoClick, commonSearch, commit } from './btnClicks';
import { initTemplate } from './init';
import { URL, AREA, COMMON, BUTTONAREA, FIELD, BILLTYPE, PAGECODE } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { getDefData, setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { NCTabsControl, NCDiv, NCTooltip, NCHotKeys } = base;
const { BillTrack } = high;
import './index.less';
class ArrivalList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = COMMON.moudleid;
		this.searchId = AREA.searchArea;
		this.tableId = AREA.head;
		props.use.search(this.searchId);
		props.use.table(this.tableId);
		this.scmodelcode = '4012';
		this.appcode;
		this.state = {
			pk: '',
			target: null,
			showUploader: false,
			billNo: '',
			showTrack: false,
			showApproveInfo: false,
			searchVal: null,
			currentTab: 'toCommit',
			billtype: '23',
			toCommitNum: '0',
			approvingNum: '0',
			exeNum: '0',
			currentLocale: 'en-Us',
			compositedisplay: false, //指派参数
			compositedata: null, //指派
			vordercode: null,
			isbrowsebeforesave: 'Y',
			showModal: false
		};
		this.commitInfo = {
			index: null,
			record: null
		};
		// initTemplate.call(this);
		initLang(this, [ '4004arrival' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		this.onSelect();
	}

	hanelChange = (tab) => {
		this.setState({ currentTab: tab }); //更新当前页签编码
		setDefData.call(this, COMMON.arrivalCacheKey, COMMON.arrivalCacheTabKey, {
			tabCode: tab
		});
		// if ('all' == tab) {
		// 	// 点击全部页签时，若未输入查询条件，就不查
		// 	if (this.state.searchVal) {
		// 		commonSearch.bind(this, tab, this.state.searchVal)(); // 调用查询方法
		// 	} else {
		// 		let rowsData = { rows: [] };
		// 		this.props.table.setAllTableData(AREA.head, rowsData);
		// 		return;
		// 	}
		// } else {
		commonSearch.bind(this, tab, this.state.searchVal)(); // 调用查询方法
		//}
	};

	handleChange = (value) => {
		this.setState({ isbrowsebeforesave: 'N' });
	};

	// 提交指派
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.commitInfo.record) {
			commit.call(this, this.props, this.commitInfo.record, this.commitInfo.index, value);
		} else {
			commit.call(this, this.props, null, null, value);
		}
		this.setState({ compositedisplay: false });
	};

	sure = () => {
		let data = {
			vordercode: this.state.vordercode,
			isbrowsebeforesave: this.state.isbrowsebeforesave
		};

		if (!this.state.vordercode) {
			toast({
				content: getLangByResId(this, '4004ARRIVAL-000044'),
				color: 'warning'
			}); /* 国际化处理： 订单号未录入！*/
			return;
		}

		if (this.state.isbrowsebeforesave == 'Y') {
			this.setState({ showModal: false });
			let _this = this;
			ajax({
				method: 'post',
				url: URL.quickArr,
				data: data,
				success: function(res) {
					if (res && res.data) {
						_this.props.pushTo(URL.card, {
							type: 'quickArr',
							vordercode: _this.state.vordercode,
							pagecode: PAGECODE.card
						});
					} else {
						toast({
							color: 'warning',
							content: getLangByResId(this, '4004ARRIVAL-000045')
						}); /* 国际化处理： 该订单不满足快速收货条件，无法再进行快速收货！*/
					}
				}
			});
		} else {
			this.setState({ showModal: false });
			let _this = this;
			ajax({
				method: 'post',
				url: URL.quickArr,
				data: data,
				success: function(res) {
					toast({
						content: getLangByResId(_this, '4004ARRIVAL-000026'),
						color: 'success'
					}); /* 国际化处理： 快速收货成功*/
				}
			});
		}
	};

	onAfterEvent(field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [
				'pk_supplier',
				'pk_arriveorder_b.pk_srcmaterial',
				'pk_arriveorder_b.casscustid',
				'pk_arriveorder_b.pk_receivestore',
				'vdef1',
				'vdef2',
				'vdef3',
				'vdef4',
				'vdef5',
				'vdef6',
				'vdef7',
				'vdef8',
				'vdef9',
				'vdef10',
				'vdef11',
				'vdef12',
				'vdef13',
				'vdef14',
				'vdef15',
				'vdef16',
				'vdef17',
				'vdef18',
				'vdef19',
				'vdef20',
				'pk_arriveorder_b.vbdef1',
				'pk_arriveorder_b.vbdef2',
				'pk_arriveorder_b.vbdef3',
				'pk_arriveorder_b.vbdef4',
				'pk_arriveorder_b.vbdef5',
				'pk_arriveorder_b.vbdef6',
				'pk_arriveorder_b.vbdef7',
				'pk_arriveorder_b.vbdef8',
				'pk_arriveorder_b.vbdef9',
				'pk_arriveorder_b.vbdef10',
				'pk_arriveorder_b.vbdef11',
				'pk_arriveorder_b.vbdef12',
				'pk_arriveorder_b.vbdef13',
				'pk_arriveorder_b.vbdef14',
				'pk_arriveorder_b.vbdef15',
				'pk_arriveorder_b.vbdef16',
				'pk_arriveorder_b.vbdef17',
				'pk_arriveorder_b.vbdef18',
				'pk_arriveorder_b.vbdef19',
				'pk_arriveorder_b.vbdef20',
				'pk_arriveorder_b.vfree1',
				'pk_arriveorder_b.vfree2',
				'pk_arriveorder_b.vfree3',
				'pk_arriveorder_b.vfree4',
				'pk_arriveorder_b.vfree5',
				'pk_arriveorder_b.vfree6',
				'pk_arriveorder_b.vfree7',
				'pk_arriveorder_b.vfree8',
				'pk_arriveorder_b.vfree9',
				'pk_arriveorder_b.vfree10',
				'pk_arriveorder_b.pk_srcmaterial.pk_marbasclass',
				'pk_arriveorder_b.pk_material.materialstock.pk_marpuclass',
				'pk_arriveorder_b.pk_receivestore',
				'pk_arriveorder_b.cprojectid',
				'pk_arriveorder_b.casscustid'
			]);
		} else if (field == 'pk_purchaseorg') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [ 'pk_dept', 'pk_pupsndoc' ]);
		}
	}

	doubleClick = (record, index) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: record.pk_arriveorder.value,
			pagecode: PAGECODE.card
		});
	};

	onSelect = () => {
		let butArray = [
			'ReturnArrival',
			'Delete',
			'Commit',
			'UnCommit',
			'AccessoryManage',
			'QueryAboutBusiness',
			'Print',
			'Print_list',
			'PrintCountQuery',
			'OutPrint',
			'CombinPrint',
			'SplitPrint',
			'UrgentLetGo'
		];
		//单选可用按钮
		let singlebutArray = [
			'ReturnArrival',
			'AccessoryManage',
			'QueryAboutBusiness',
			'Print',
			'Print_list',
			'PrintCountQuery',
			'OutPrint',
			'CombinPrint',
			'SplitPrint'
		];
		//多选可用按钮
		let mutibutarray = [
			'Delete',
			'Commit',
			'UnCommit',
			'AccessoryManage',
			'QueryAboutBusiness',
			'Print',
			'Print_list',
			'PrintCountQuery',
			'OutPrint',
			'CombinPrint',
			'SplitPrint',
			'UrgentLetGo'
		];
		let rows = this.props.table.getCheckedRows(AREA.head);
		if (rows && rows.length > 0) {
			if (rows.length == 1) {
				this.props.button.setButtonDisabled(butArray, true);
				this.props.button.setButtonDisabled(singlebutArray, false);
				let status = rows[0].data.values.fbillstatus.value;
				if (status == 0) {
					this.props.button.setButtonDisabled([ 'Commit', 'Delete' ], false);
				} else if (status == 1 || status == 2 || status == 3) {
					this.props.button.setButtonDisabled([ 'UnCommit', 'UrgentLetGo' ], false);
				}
				if (status == 3) {
					this.props.button.setButtonDisabled([ 'ReturnArrival' ], false);
				} else {
					this.props.button.setButtonDisabled([ 'ReturnArrival' ], true);
				}
			} else {
				this.props.button.setButtonDisabled(mutibutarray, false);
			}
		} else {
			this.props.button.setButtonDisabled(butArray, true);
		}
	};

	closeApprove = () => {
		this.setState({
			showApproveInfo: false
		});
	};

	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	open = () => {
		this.setState({ showModal: true });
	};

	close = () => {
		this.setState({ showModal: false });
	};

	onChange = (e) => {
		this.setState({ vordercode: e });
	};

	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, AREA.searchArea, 'ctrantypeid');
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, 'pk_org');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent('pk_org', arr);
		}
	};

	getdefaultTab = () => {
		let tabCode = getDefData.call(this, COMMON.arrivalCacheKey, COMMON.arrivalCacheTabKey);
		// 里程碑看板跳转过来，直接跳转全部页签
		let srcpk = this.props.getUrlParam(FIELD.pk);
		if (srcpk) {
			tabCode = { tabCode: 'all' };
		}
		if (tabCode == null || tabCode.tabCode == null) {
			return 0;
		} else {
			// return tabCode.tabCode;
			if (tabCode.tabCode == 'toCommit') {
				return 0;
			} else if (tabCode.tabCode == 'approving') {
				return 1;
			} else if (tabCode.tabCode == 'exe') {
				return 2;
			} else if (tabCode.tabCode == 'all') {
				return 3;
			}
		}
	};
	render() {
		const { table, button, search, ncmodal } = this.props;
		const { createSimpleTable } = table;
		const { NCCreateSearch } = search;
		const { NCModal, NCButton, NCSelect, NCFormControl } = base;
		let { createModal } = ncmodal;
		const NCOption = NCSelect.NCOption;
		const { socket } = this.props;
		let { toCommitNum, approvingNum, exeNum } = this.state;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: this.tableId,
					billpkname: FIELD.pk_arriveorder,
					billtype: BILLTYPE.arrival
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: BUTTONAREA.listhead,
							onButtonClick: buttonClick.bind(this)
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk}
							type="23"
						/>
						{this.state.showUploader && (
							<NCUploader
								billId={this.state.pk}
								billNo={this.state.billNo}
								target={this.state.target}
								placement={''}
								onHide={this.onHideUploader}
								billcode={this.state.pk}
								pk_billtypecode={BILLTYPE.arrival}
							/>
						)}
						<ApproveDetail
							show={this.state.showApproveInfo}
							close={this.closeApprove}
							billtype={this.state.billtype}
							billid={this.state.pk}
						/>
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch('searchArea', {
						clickSearchBtn: searchBtnClick.bind(this, this.state.currentTab),
						onAfterEvent: this.onAfterEvent.bind(this),
						defaultConditionsNum: 5,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent,
						dataSource: COMMON.arrivalCacheKey,
						pkname: 'pk_arriveorder'
					})}
				</div>

				{createModal('delete')}
				{createModal('quickReceive', {
					size: 'sm',
					title: getLangByResId(this, '4004ARRIVAL-000030'), // 快速收货
					content: <div />
				})}
				<div className="nc-bill-table-area">
					<NCTabsControl defaultKey={this.getdefaultTab()}>
						<div key={0} clickFun={() => this.hanelChange('toCommit')}>
							{`${getLangByResId(this, '4004ARRIVAL-000046')}(${toCommitNum})`}
						</div>
						<div key={1} clickFun={() => this.hanelChange('approving')}>
							{`${getLangByResId(this, '4004ARRIVAL-000047')}(${approvingNum})`}
						</div>
						<div key={2} clickFun={() => this.hanelChange('exe')}>
							{`${getLangByResId(this, '4004ARRIVAL-000048')}(${exeNum})`}
						</div>
						<div key={3} clickFun={() => this.hanelChange('all')}>
							{getLangByResId(this, '4004ARRIVAL-000049')}
						</div>
					</NCTabsControl>
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						showIndex: true,
						showCheck: true,
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelect.bind(this),
						dataSource: COMMON.arrivalCacheKey,
						pkname: 'pk_arriveorder',
						componentInitFinished: this.onSelect.bind(this)
					})}
					{/* 快速收货弹窗 */}
					<NCModal
						show={this.state.showModal}
						onHide={this.close}
						size="sm"
						fieldid="arrivelistmodal"
						className="quick-receive-modal"
					>
						<NCHotKeys
							keyMap={{
								confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
								cancelBtnHandler: 'ALT+N'
							}}
							handlers={{
								confirmBtnHandler: this.sure,
								cancelBtnHandler: this.close
							}}
							className="simpleModal-hotkeys-wrapper"
							focused={true}
							attach={document.body}
						/>
						<NCModal.Header>
							<NCModal.Title>{getLangByResId(this, '4004ARRIVAL-000030')}</NCModal.Title>
						</NCModal.Header>
						<NCModal.Body>
							<div className="field-item">
								<label className="nc-theme-common-font-c field-label">
									{getLangByResId(this, '4004ARRIVAL-000031')}
								</label>
								<div className="field-content">
									<NCFormControl onChange={this.onChange} value={this.state.vordercode} />
								</div>
							</div>
							<div className="field-item">
								<label className="nc-theme-common-font-c field-label">
									{getLangByResId(this, '4004ARRIVAL-000032')}
								</label>
								<div className="field-content">
									<NCSelect fieldid="arrivalh_select" defaultValue="Y" onChange={this.handleChange}>
										<NCOption value="Y">{getLangByResId(this, '4004ARRIVAL-000033')}</NCOption>
										<NCOption value="N">{getLangByResId(this, '4004ARRIVAL-000034')}</NCOption>
									</NCSelect>
								</div>
							</div>
						</NCModal.Body>
						<NCModal.Footer>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4004ARRIVAL-000035')} (Alt+Y)`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<NCButton className="button-primary" onClick={this.sure} fieldid="confirm_btn">
									{getLangByResId(this, '4004ARRIVAL-000035') /* 国际化处理： 确定*/}(<u>Y</u>)
								</NCButton>
							</NCTooltip>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4004ARRIVAL-000036')} (Alt+N)`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<NCButton onClick={this.close} fieldid="cancel_btn">
									{getLangByResId(this, '4004ARRIVAL-000036') /* 国际化处理： 取消*/}(<u>N</u>)
								</NCButton>
							</NCTooltip>
						</NCModal.Footer>
					</NCModal>
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004ARRIVAL-000027')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr.bind(this)}
							cancel={() => {
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
				</div>
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}

ArrivalList = createPage({})(ArrivalList);
export default ArrivalList;
