/*
 * @Author: fangmj7
 * @PageInfo: 采购订单付款计划生成进度确认单
 * @Date: 2018-06-13 14:14:03
 * @Last Modified by: 
 * @Last Modified time: 
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick, scanBtnClick } from './btnClick';
import { TRANSFER2C, URL, PAGECODE, CONSTFIELD, OHTER, UISTATE } from '../constance';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';

class Transfer21PTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFER2C.SEARCHID);
		this.isRefAddLine = props.isRefAddLine;
		this.refAddLineComfirmBtnClick = props.refAddLineComfirmBtnClick;
		this.refsourcdata = props.refsourcdata; //参照增行要过滤当前页面的数据
		this.state = {
			templetid: null, //模板ID
			ntotalnum: 0,
			ntotalmny: 0,
			toggleViewStatus: false
		};
		// initTemplate.call(this);
		initLang(this, [ '4004planconfirm' ], 'pu', initTemplate.bind(this, this.props));
	}

	onAfterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TRANSFER2C.SEARCHID, [
				'vordertrantype',
				'cvendorid',
				'cemployeeid',
				'pk_dept',
				'pk_order_payplan_b.pk_material.code',
				'pk_order_payplan_b.pk_material.name',
				'pk_order_payplan_b.pk_material',
				'pk_order_payplan_b.pk_material.pk_marbasclass',
				'billmaker',
				'approver'
			]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFER2C.SEARCHID, 'pk_org');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'pk_org', arr);
		}
	};

	scanCodeSearchMessage = (value) => {
		if (value == null || value == '') {
			return;
		}
		//检查
		scanBtnClick.call(this, value);
	};
	calTotal = (flag, record, bodys) => {
		//let ntotalnmy = parseInt(this.state.ntotalmny);
		let ntotalnum = parseInt(this.state.ntotalnum);
		//ntotalnmy = ntotalnmy == NaN ? 0 : ntotalnmy;
		ntotalnum = ntotalnum == NaN ? 0 : ntotalnum;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					//ntotalnmy += parseInt(line && line.ncanconfirmnmny && line.ncanconfirmnmny.value);
					ntotalnum += parseInt(line && line.ncanconfirmnnum && line.ncanconfirmnnum.value);
				}
			} else {
				//ntotalnmy += parseInt(record && record.ncanconfirmnmny && record.ncanconfirmnmny.value);
				ntotalnum += parseInt(record && record.ncanconfirmnnum && record.ncanconfirmnnum.value);
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					//ntotalnmy -= parseInt(line && line.ncanconfirmnmny && line.ncanconfirmnmny.value);
					ntotalnum -= parseInt(line && line.ncanconfirmnnum && line.ncanconfirmnnum.value);
				}
			} else {
				//ntotalnmy -= parseInt(record && record.ncanconfirmnmny && record.ncanconfirmnmny.value);
				ntotalnum -= parseInt(record && record.ncanconfirmnnum && record.ncanconfirmnnum.value);
			}
		}
		this.setState({
			//ntotalnmy: parseInt(ntotalnmy),
			ntotalnum: parseInt(ntotalnum)
		});
	};

	handleClick() {}

	render() {
		const { transferTable, button, search, modal } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createModal } = modal;
		const { createTransferTable } = transferTable;
		let numtotaltitle = `${getLangByResId(this, '4004planconfirm-000015')}`; /* 国际化处理： 本次确认数量*/
		//let nmytotaltitle = `${getLangByResId(this, '4004planconfirm-000011')}`; /* 国际化处理： 本次确认金额*/ /* 国际化处理： 本次确认数量*/
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFER2C.LIST_TABLE);
		let scene = this.props.getUrlParam('scene'); //小部件或消息中心或是
		let dataSources = CONSTFIELD.PlanconfirmTransferCache;
		if (this.isRefAddLine == true) {
			dataSources = CONSTFIELD.PlanConfirmRefAdd21P;
		}
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									title: getLangByResId(this, '4004planconfirm-000012') /* 国际化处理：选择采购订单付款计划*/,
									backBtnClick: () => {
										this.props.pushTo(URL.list, { pagecode: PAGECODE.list });
									}
								})}
							</div>

							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFER2C.AREAID, //
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							{/* <NCSetColBtn
								onClick={() => {
									this.handleClick;
								}}
							/> */}
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[TRANSFER2C.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFER2C.SEARCHID, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.onAfterEvent.bind(this, this.props),
								renderCompleteEvent: this.renderCompleteEvent,
								statusChangeEvent: this.renderCompleteEvent
							})}
						</div>
					</div>
				) : (
					''
				)}
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						headTableId: TRANSFER2C.LIST_TABLE, //表格组件id
						bodyTableId: TRANSFER2C.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFER2C.VIEW, //视图VO，设置表格数据
						searchAreaCode: TRANSFER2C.SEARCHID, // 用于缓存查询条件
						transferBtnText: getLangByResId(this, '4004planconfirm-000013'), //转单按钮显示文字/* 国际化处理： 生成进度确认单*/
						containerSelector: '#transferList',
						dataSource: dataSources,
						totalKey: [ 'ncanconfirmnnum' ], //, 'ncanconfirmnmny'
						totalTitle: [ numtotaltitle ], //, nmytotaltitle ],
						selectedHeaderRender: () => {
							this.props.button.createButtonApp({
								area: TRANSFER2C.PAGEID,
								onButtonClick: buttonClick.bind(this)
							});
						},
						customAreaOfSelectedHead: () => {
							//单转单已选列表右上角自定义区域
							return (
								<div style={{ position: 'relative' }}>
									{this.props.button.createButtonApp({
										area: TRANSFER2C.PAGEID + 's',
										onButtonClick: buttonClick.bind(this)
									})}
								</div>
							);
						},
						onTransferBtnClick: (ids) => {
							let nrows = this.props.transferTable.getTransferTableSelectedValue();
							let rows = [];
							let json = [];
							let pk_order_payplan_bbs = new Array();
							let array = new Array();
							if (nrows) {
								//勾选的所有主子数据
								rows = JSON.parse(JSON.stringify(nrows.list_head));
								for (let i = 0; i < rows.length; i++) {
									//一个主子单位
									let checkdata = {};
									let headRows = rows[i].head.list_head,
										bodyRows = rows[i].body.list_body;
									let head = {};
									headRows.rows.forEach((item) => {
										let ts = item.values.ts.value;
										let pk_order_payplan = item.values.pk_order_payplan.value;
										head = {
											ts: ts,
											pk: pk_order_payplan
										};
									});
									checkdata['head'] = head;
									let bodys = new Array();
									bodyRows.rows.forEach((item, index) => {
										let bts = item.values.ts.value;
										let pk_order_payplan_b = item.values.pk_order_payplan_b.value;
										let nnum = item.values.nnum.value;
										let body = {
											ts: bts,
											pk: pk_order_payplan_b,
											userObject: {
												nnum: nnum
											}
										};
										bodys.push(body);
										// TODO 伪列映射
										pk_order_payplan_bbs.push(pk_order_payplan_b);
									});
									checkdata['bodys'] = bodys;
									array.push(checkdata);
								}
							}
							setDefData(CONSTFIELD.PlanconfirmTransferCache, '21Pto2C', array);
							setDefData(CONSTFIELD.PlanconfirmTransferCache, '21Pto2Cbids', pk_order_payplan_bbs);
							let _this = this;
							if (_this.isRefAddLine == true) {
								_this.refAddLineComfirmBtnClick(array);
							} else {
								if (scene) {
									_this.props.pushTo(URL.card, {
										transfer: TRANSFER2C.CSOURCETYPECODE,
										appcode: '400400806',
										pagecode: PAGECODE.card,
										status: 'edit',
										scene: scene
									});
								} else {
									_this.props.setUrlParam({
										id: OHTER.source21P
									});
									_this.props.pushTo(URL.card, {
										transfer: TRANSFER2C.CSOURCETYPECODE,
										pagecode: PAGECODE.card,
										status: 'edit',
										scene: scene,
										id: OHTER.source21P,
										channelType: 'channelType'
									});
								}
							}
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER2C.VIEW]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
				{createModal('general')}
			</div>
		);
	}
}
Transfer21PTable = createPage({})(Transfer21PTable);
// ReactDOM.render(<Transfer20Table />, document.querySelector('#app'));
export default Transfer21PTable;
