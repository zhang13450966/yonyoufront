/*
 * @Author: jiangfw 
 * @PageInfo: 消耗汇总收票转单列表界面
 * @Date: 2018-06-10 18:54:41 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-09 15:06:57
 */
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { createPage, base, sum } from 'nc-lightapp-front';
import { searchBtnClick, btnClick } from './btnClicks';
// import getNumber from '../utils/getNumber';
import searchAfterEvent from '../utils/searchAfterEvent';
import { AREA, URL, UISTATE, TRANSFER_TYPE, COMMON, MAIN_ORG_FIELD, APPCODE, PAGECODE } from '../constance';
import clickBackBtn from './btnClicks/backBtnClick';
import initTemplate from './init/initTemplate';
import renderCompleteEvent from '../utils/renderCompleteEvent';
const { NCBackBtn, NCSetColBtn, NCDiv } = base;
// let refDataSource = COMMON.TransferCacheKey;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

class Ref50Addline extends Component {
	constructor(props) {
		super(props);
		this.tableId = AREA.ref50_head;

		this.isRefAddLine = props.isRefAddLine; //是否参照增行
		this.pk_busitype = props.pk_busitype;
		this.transType = props.transType;
		this.refAddLineComfirmBtnClick = props.refAddLineComfirmBtnClick;
		this.queryArea = AREA.ref50_query;
		this.refsourcdata = props.refsourcdata; //参照增行要过滤当前页面的数据
		this.appid = '';
		this.state = {
			// ntotalnum: 0,
			// templetid_50: '', //消耗汇总转单查询界面模板id
			// qTempletid_50: '' //消耗汇总查询模板ID
		};
		this.templetid_50; //消耗汇总转单查询界面模板id
		this.qTempletid_50; //消耗汇总查询模板ID

		initLang(this, [ '4004puinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {}

	// 计算合计
	// calTotal = (flag, record) => {
	// 	let ntotalnum = this.state.ntotalnum;
	// 	if (flag == true) {
	// 		ntotalnum = sum(ntotalnum, getNumber(record['ncaninvoicenum']));
	// 	} else {
	// 		ntotalnum = sum(ntotalnum, -getNumber(record['ncaninvoicenum']));
	// 	}
	// 	this.setState({
	// 		ntotalnum: ntotalnum
	// 	});
	// };

	handleClick() {}

	render() {
		const { transferTable, search, isRefAddLine } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		// let totalstr = `${getLangByResId(this, '4004PUINVOICE-000067')}：${this.state.ntotalnum}`; /* 国际化处理： 本次收票主数量*/
		let totalstr = `${getLangByResId(this, '4004PUINVOICE-000067')}`; /* 国际化处理： 本次收票主数量*/

		let appid = this.props.getUrlParam('appid');
		this.appid = appid;
		let selectedShow = transferTable.getSelectedListDisplay(AREA.ref50_head);

		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{!isRefAddLine &&
								(appid ? (
									<div className="header-title-search-area">
										{createPageIcon()}
										<h2 className="title-search-detail">
											{getLangByResId(this, '4004PUINVOICE-000068')}
										</h2>
										{/*国际化处理： 消耗汇总收票*/}
									</div>
								) : (
									<div className="header-title-search-area">
										{createCardTitle(this, {
											title: getLangByResId(this, '4004PUINVOICE-000068') /* 国际化处理：消耗汇总收票*/,
											backBtnClick: () => {
												clickBackBtn.call(this);
											}
										})}
									</div>
								))}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: AREA.list_head,
									onButtonClick: btnClick.bind(this)
								})}
							</div>
							{/* <NCSetColBtn
								onClick={() => {
									this.handleClick;
								}}
							/> */}
						</NCDiv>
						{/* 查询区 */}
						<div className="nc-bill-search-area">
							{NCCreateSearch(this.queryArea, {
								clickSearchBtn: searchBtnClick.bind(this, null),
								onAfterEvent: searchAfterEvent.bind(this, AREA.ref50_query),
								renderCompleteEvent: renderCompleteEvent.bind(
									this,
									AREA.ref50_query,
									MAIN_ORG_FIELD.search50Org
								),
								statusChangeEvent: renderCompleteEvent.bind(
									this,
									AREA.ref50_query,
									MAIN_ORG_FIELD.search50Org
								),
								defaultConditionsNum: 4
							})}
						</div>
					</div>
				) : (
					''
				)}
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						// dataSource: refDataSource,
						tableType: 'simple',
						headTableId: this.tableId, //表格组件id
						transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
						containerSelector: '#transferList',
						totalKey: [ 'ncaninvoicenum' ],
						totalTitle: [ totalstr ],

						onTransferBtnClick: (ids) => {
							// this.props.pushTo(URL.card, {
							// 	type: TRANSFER_TYPE.transfer50,
							// 	status: UISTATE.edit,
							// 	qTempletid_50: this.state.qTempletid_50,
							// 	appid: this.state.appid
							// });
							if (this.isRefAddLine == true) {
								this.refAddLineComfirmBtnClick(ids);
							} else {
								this.props.pushTo(URL.card, {
									type: TRANSFER_TYPE.transfer50,
									status: UISTATE.edit,
									qTempletid_50: this.qTempletid_50,
									appid: this.appid,
									appcode: APPCODE.puinvoice,
									pagecode: PAGECODE.invoiceCard
								});
							}
						},
						selectArea: () => {
							//已选列表自定义区域
							//已选列表个性化区域
							// return <span>{totalstr}</span>;
						},
						onCheckedChange: (flag, record, index, bodys) => {
							//勾选的回调函数
							// 计算下方合计
							// this.calTotal(flag, record, bodys);
						},
						onClearAll: () => {
							// this.setState({
							// 	ntotalnum: 0
							// });
						}
					})}
				</div>
			</div>
		);
	}
}

Ref50Addline = createPage({})(Ref50Addline);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default Ref50Addline;
