/*
 * @Author: zhangchqf
 * @PageInfo: 请购单安排页面
 * @Date: 2019-06-13 17:31:32
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-23 18:03:47
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCModal, NCButton, NCDiv, NCTooltip, NCHotKeys } = base;
const { Refer } = high;
import { bodyBeforeEvents, afterEvent } from './afterEvents';
import { initTemplate } from './init';
import { searchBtnClick, batchBtnClick } from './btnClicks';
import { BUYINGREQ_LIST, ATTRCODE } from '../siconst';
import commonSerach from './btnClicks/commonSearch';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
//import { initButtons } from './afterEvents';
import './index.less';
import { buttonController, btnClickController } from './viewControl';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
class BuyingreqList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = BUYINGREQ_LIST.moduleId;
		this.head = BUYINGREQ_LIST.formId; //
		this.bodyCode = BUYINGREQ_LIST.tableId;
		this.searchId = BUYINGREQ_LIST.searchId;
		this.pageId = BUYINGREQ_LIST.listpageid;
		this.queryAreaCode = BUYINGREQ_LIST.searchId;
		props.use.search(this.searchId);
		props.use.editTable(BUYINGREQ_LIST.formId);
		this.state = {
			showModal: false, //批量安排弹出框默认不显示
			isShowUnit: true,
			pk_suggestsupplier_v: {}, //供应商
			employee: {}, //采购员
			purchaseorg_v: {}, //采购组织
			searchFlag: false, //查询校验是否必输
			searchVal: null, //查询条件缓存
			showCheck: true, //
			currentTab: BUYINGREQ_LIST.toCommit, //默认显示待提交
			toCommitNum: '0', //待提交数量
			approvingNum: '0', //审批中数量
			executingNum: '0', //执行中
			currentLocale: 'en-US',
			showSearch: true, //是否显示查询区
			test: null,
			pk_purchaseorg: {
				value: null,
				display: null,
				scale: '-1'
			}
		};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybillarrange', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//commonSerach.bind(this, BUYINGREQ_LIST.executing)(); // 调用查询方法
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(BUYINGREQ_LIST.searchId, ATTRCODE.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, ATTRCODE.pk_org, arr);
		}
	};
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		this.setState({ currentTab: tabCode }); //更新当前页签编码
		commonSerach.bind(this, tabCode, this.state.searchVal)(); // 调用查询方法
	};
	//切换页面状态
	toggleShow = (status) => {
		buttonController.setListButtonVisiable.call(this, this.props, status);
	};

	afterEventForBatch(props, field, val) {
		if (field == 'pk_praybill_b.pk_purchaseorg_v') {
			let checkData = props.editTable.getCheckedRows(BUYINGREQ_LIST.formId);
			afterEvent.call(this, this.props, BUYINGREQ_LIST.formId, field, null, val, checkData[0].index, null);
		}
	}
	close = () => {
		this.setState({ showModal: false });
	};

	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [
				'pk_praybill_b.pk_srcmaterial',
				'pk_praybill_b.pk_srcmaterial.pk_marbasclass',
				'pk_praybill_b.pk_suggestsupplier',
				'pk_praybill_b.pk_reqdept',
				'pk_praybill_b.casscustid',
				'approver',
				'billmaker',
				'pk_plandept',
				'pk_planpsn'
			]);
		} else if (field == 'pk_praybill_b.pk_purchaseorg') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [ 'pk_praybill_b.pk_employee' ]);
		}
	}
	render() {
		let { editTable, button, search, modal } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		const { createModal } = modal;
		//获取小应用里注册的按钮
		let buttons = this.props.button.getButtons();
		return (
			<div className="nc-bill-list">
				{this.props.socket.connectMesg({
					tableAreaCode: BUYINGREQ_LIST.formId,
					tableType: 'editTable', // 增加表格类型 editTable / insertTable
					// billtype : '',   // 由于EditTable 节点可能不涉及追溯或者流程，可不传
					billpkname: 'pk_praybill'
				})}

				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 请购单安排*/}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						{!this.state.showSearch && (
							<NCTooltip
								placement="top"
								inverse
								// overlay={'更新采购组织，供应商，采购员后，则对应的请购物料行安排成功'}
								overlay={`${getLangByResId(this, '4004PRAYBILLARRANGE-000025')}`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<i className="iconfont icon-bangzhutishi" />
							</NCTooltip>
						)}
						{this.props.button.createButtonApp({
							area: this.searchId,
							onButtonClick: btnClickController.bind(this)
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				{this.state.showSearch && (
					<div className="nc-bill-search-area">
						{NCCreateSearch(this.searchId, {
							clickSearchBtn: searchBtnClick.bind(this, this.state.currentTab),
							onAfterEvent: this.afterEvent.bind(this, this.props),
							defaultConditionsNum: 9,
							renderCompleteEvent: this.renderCompleteEvent,
							statusChangeEvent: this.renderCompleteEvent
						})}
					</div>
				)}
				<div className="nc-bill-table-area">
					{createEditTable(BUYINGREQ_LIST.formId, {
						//显示序号
						showIndex: true,
						showCheck: true,
						adaptionHeight: true,
						onAfterEvent: afterEvent.bind(this),
						onBeforeEvent: bodyBeforeEvents.bind(this),
						onSelected: buttonController.initButtons.bind(this, this.props, this.state.showCheck),
						onSelectedAll: buttonController.initButtons.bind(this, this.props, this.state.showCheck)
					})}
				</div>
				{this.state.showModal && (
					<div>
						<NCModal
							id="BatchArrange"
							size="sm"
							zIndex="150"
							show={this.state.showModal}
							onHide={this.close}
							fieldid="buyingreqarrangemodal"
						>
							<NCModal.Header closeButton={true}>
								<NCModal.Title>{getLangByResId(this, '4004PRAYBILLARRANGE-000013')}</NCModal.Title>
								{/* 国际化处理： 批量安排*/}
							</NCModal.Header>
							<NCModal.Body className="modal-backsettle-search">
								<NCHotKeys
									keyMap={{
										confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
										cancelBtnHandler: 'ALT+N'
									}}
									handlers={{
										confirmBtnHandler: batchBtnClick.bind(this, this.props),
										cancelBtnHandler: buttonController.setState.bind(this)
									}}
									className="simpleModal-hotkeys-wrapper"
									focused={true}
									attach={document.body}
								/>

								<div className="modal-arrange-content">
									<div className="search-item">
										<div className="item-name">
											<span class="required">*</span>
											{getLangByResId(this, '4004PRAYBILLARRANGE-000016')}
										</div>
										<Refer
											{...this.props}
											refName={getLangByResId(
												this,
												'4004PRAYBILLARRANGE-000016'
											)} /* 国际化处理： 采购组织*/
											isShowDisabledData={true}
											required={true}
											isMultiSelectedEnabled={false}
											refType="grid"
											columnConfig={[
												{
													name: [
														getLangByResId(this, '4004PRAYBILLARRANGE-000022'),
														getLangByResId(this, '4004PRAYBILLARRANGE-000023')
													],
													code: [ 'code', 'name' ]
												}
											]}
											refCode={'pk_praybill_b.pk_purchaseorg_v'}
											queryGridUrl={'/nccloud/uapbd/orgv/PurchaseOrgVersionGridRef.do'}
											value={this.state.purchaseorg_v}
											queryCondition={() => {
												return {
													GridRefActionExt:
														'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter'
												};
											}}
											onChange={(event) => {
												if (event && event.refpk) {
													this.setState(
														{
															isShowUnit: true,
															purchaseorg_v: event
														},
														() => {
															this.afterEventForBatch.call(
																this,
																this.props,
																'pk_praybill_b.pk_purchaseorg_v',
																event
															);
														}
													);
												} else {
													this.setState({
														isShowUnit: false,
														purchaseorg_v: {},
														pk_suggestsupplier_v: {},
														employee: {},
														pk_purchaseorg: {
															value: null,
															display: null,
															scale: '-1'
														}
													});
												}
											}}
										/>
									</div>
									<div className="search-item">
										<div className="item-name">
											{getLangByResId(this, '4004PRAYBILLARRANGE-000017')}
										</div>
										<Refer
											{...this.props}
											refName={getLangByResId(this, '4004PRAYBILLARRANGE-000017')} /* 国际化处理： 采购员*/
											refType="gridTree"
											refCode={'pk_praybill_b.pk_employee'}
											queryGridUrl={'/nccloud/uapbd/ref/PsndocGridRef.do'}
											queryTreeUrl={'/nccloud/uapbd/ref/PsndocTreeRef.do'}
											value={this.state.employee}
											showHistory={false}
											isShowUnit={this.state.isShowUnit}
											isShowDisabledData={true}
											isMultiSelectedEnabled={false}
											columnConfig={[
												{
													name: [
														getLangByResId(this, '4004PRAYBILLARRANGE-000022'),
														getLangByResId(this, '4004PRAYBILLARRANGE-000023')
													],
													code: [ 'psndoccode', 'psndocname' ]
												}
											]}
											treeConfig={{
												name: [ getLangByResId(this, '4004PRAYBILLARRANGE-000023') ],
												code: [ 'name' ]
											}}
											rootNode={{
												refname: getLangByResId(this, '4004PRAYBILLARRANGE-000024'),
												refpk: 'root'
											}}
											queryCondition={() => {
												return {
													pk_org: this.state.pk_purchaseorg.value,
													busifuncode: BUYINGREQ_LIST.purchaseorg
												};
											}}
											onChange={(event) => {
												if (event && event.refpk) {
													this.setState({
														isShowUnit: true,
														employee: event
													});
												} else {
													this.setState({
														isShowUnit: false,
														employee: {}
													});
												}
											}}
										/>
									</div>
									<div className="search-item">
										<div className="item-name">
											{getLangByResId(this, '4004PRAYBILLARRANGE-000018')}
										</div>
										<Refer
											{...this.props}
											refName={getLangByResId(
												this,
												'4004PRAYBILLARRANGE-000018'
											)} /* 国际化处理： 建议供应商*/
											refType="gridTree"
											refCode="pk_praybill_b.pk_suggestsupplier_v"
											queryGridUrl={'/nccloud/uapbd/ref/SupplierGridRef.do'}
											queryTreeUrl={'/nccloud/uapbd/ref/SupplierClassTreeRef.do'}
											value={this.state.pk_suggestsupplier_v}
											isShowUnit={this.state.isShowUnit}
											isShowDisabledData={true}
											showHistory={false}
											isMultiSelectedEnabled={false}
											queryCondition={() => {
												return { pk_org: this.state.pk_purchaseorg.value };
											}}
											columnConfig={[
												{
													name: [
														getLangByResId(this, '4004PRAYBILLARRANGE-000022'),
														getLangByResId(this, '4004PRAYBILLARRANGE-000023')
													],
													code: [ 'code', 'name' ]
												}
											]}
											treeConfig={{
												name: [ getLangByResId(this, '4004PRAYBILLARRANGE-000023') ],
												code: [ 'name' ]
											}}
											rootNode={{
												refname: getLangByResId(this, '4004PRAYBILLARRANGE-000024'),
												refpk: 'root'
											}}
											onChange={(event) => {
												if (event && event.refpk) {
													this.setState({
														pk_suggestsupplier_v: event
													});
												} else {
													this.setState({
														pk_suggestsupplier_v: {}
													});
												}
											}}
										/>
									</div>
								</div>
							</NCModal.Body>
							<NCModal.Footer>
								<NCTooltip
									placement="top"
									inverse
									overlay={`${getLangByResId(this, '4004PRAYBILLARRANGE-000020')} (Alt+Y)`}
									trigger={[ 'focus', 'hover' ]}
									className="model-helper-overlay"
								>
									<NCButton
										fieldid="buyingreqbatch_btn"
										colors="primary"
										onClick={batchBtnClick.bind(this, this.props)}
									>
										{getLangByResId(this, '4004PRAYBILLARRANGE-000020') /* 国际化处理： 确定*/}(<u>Y</u>)
									</NCButton>
								</NCTooltip>
								<NCTooltip
									placement="top"
									inverse
									overlay={`${getLangByResId(this, '4004PRAYBILLARRANGE-000021')} (Alt+N)`}
									trigger={[ 'focus', 'hover' ]}
									className="model-helper-overlay"
								>
									<NCButton
										fieldid="buyingreqsetstate_btn"
										onClick={buttonController.setState.bind(this)}
									>
										{getLangByResId(this, '4004PRAYBILLARRANGE-000021') /* 国际化处理： 取消*/}(<u>N</u>)
									</NCButton>
								</NCTooltip>
							</NCModal.Footer>
						</NCModal>
					</div>
				)}
				{createModal('modelCancel', {
					title: getLangByResId(this, '4004PRAYBILLARRANGE-000002') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4004PRAYBILLARRANGE-000003') /* 国际化处理： 是否确认取消*/
				})}
			</div>
		);
	}
}
BuyingreqList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: BUYINGREQ_LIST.listpageid,
		bodycode: BUYINGREQ_LIST.formId
	}
})(BuyingreqList);
ReactDOM.render(<BuyingreqList />, document.querySelector('#app'));
