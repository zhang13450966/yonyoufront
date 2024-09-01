/*
 * @Author: jiangfw 
 * @PageInfo: 拉采购订单收票
 * @Date: 2018-06-15 13:49:34 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-09 15:49:26
 */
import React, { Component } from 'react';
import { createPage, base, sum, createPageIcon } from 'nc-lightapp-front';
import getNumber from '../utils/getNumber';
import init21Template from './init/init21Template';
import search21BtnClick from './btnClicks/search21BtnClick';
import { UISTATE, TRANSFER_TYPE, URL, AREA, COMMON, MAIN_ORG_FIELD, APPCODE, PAGECODE } from '../constance';
import searchAfterEvent from '../utils/searchAfterEvent';
import renderCompleteEvent from '../utils/renderCompleteEvent';
const { NCBackBtn, NCToggleViewBtn, NCSetColBtn, NCDiv } = base;
import { btnClick } from './btnClicks';
import clickBackBtn from '../utils/backBtnClick';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
let refDataSource = COMMON.TransferCacheKey;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
class Transfer21Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.search21);
		// this.isRefAddLine = props.isRefAddLine; //是否参照增行
		// this.pk_busitype = props.pk_busitype;
		this.transType;
		// this.refAddLineComfirmBtnClick = props.refAddLineComfirmBtnClick;
		this.queryArea = AREA.search21;
		this.state = {
			toggleViewStatus: false
			// ntotalnum: 0,
			// ntotalmny: 0,
		};
		this.templetid_21; //拉采购订单模板id
		this.qTempletid_21; //拉采购订单查询模板id

		initLang(this, [ '4004puinvoice' ], 'pu', init21Template.bind(this, this.props));
	}

	componentDidMount() {}

	// 计算合计
	calTotal = (flag, record, bodys, numkey, mnykey) => {
		let ntotalnum = this.state.ntotalnum;
		let ntotalmny = this.state.ntotalmny;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, getNumber(line[numkey]));
					ntotalmny = sum(ntotalmny, getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, getNumber(record[numkey]));
				ntotalmny = sum(ntotalmny, getNumber(record[mnykey]));
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, -getNumber(line[numkey]));
					ntotalmny = sum(ntotalmny, -getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, -getNumber(record[numkey]));
				ntotalmny = sum(ntotalmny, -getNumber(record[mnykey]));
			}
		}
		this.setState({
			ntotalnum: ntotalnum,
			ntotalmny: ntotalmny
		});
	};

	handleClick() {}

	// react：界面渲染函数
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		// let totalstr = `${getLangByResId(this, '4004PUINVOICE-000060')}：${this.state.ntotalnum} ${getLangByResId(
		// 	this,
		// 	'4004PUINVOICE-000061'
		// )}：${this.state.ntotalmny}`; /* 国际化处理： 本次收票数量,本次收票金额*/
		let totalTitle = [
			getLangByResId(this, '4004PUINVOICE-000060'),
			getLangByResId(this, '4004PUINVOICE-000061')
		]; /* 国际化处理： 本次收票数量,本次收票金额*/

		let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
		let appid = busiInfoData.appid;
		this.transType = busiInfoData.transType;
		let selectedShow = transferTable.getSelectedListDisplay(AREA.head21);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{appid ? (
								<div className="header-title-search-area">
									{createPageIcon()}
									<h2 className="title-search-detail">
										{getLangByResId(this, '4004PUINVOICE-000033')}
									</h2>
									{/* 国际化处理：采购订单*/}
								</div>
							) : (
								<div className="header-title-search-area">
									{createCardTitle(this, {
										title: getLangByResId(this, '4004PUINVOICE-000033') /* 国际化处理：采购订单*/,
										backBtnClick: () => {
											clickBackBtn.call(this);
										}
									})}
								</div>
							)}

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
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[AREA.view21]) {
										init21Template.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(AREA.view21);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						{/* 查询区 */}
						<div className="nc-bill-search-area">
							{NCCreateSearch(this.queryArea, {
								clickSearchBtn: search21BtnClick.bind(this),
								onAfterEvent: searchAfterEvent.bind(this, this.queryArea),
								renderCompleteEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search21Org
								),
								statusChangeEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search21Org
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
						totalKey: [ 'ncaninvoicenum', 'ncaninvoicemny' ],
						totalTitle: totalTitle,
						searchAreaCode: AREA.search21, // 用于缓存查询条件
						dataSource: refDataSource,
						// tableType: 'simple',
						headTableId: AREA.head21, //表格组件id
						bodyTableId: AREA.body21, //子表模板id
						fullTableId: AREA.view21,
						transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							// this.props.pushTo(URL.card, {
							// 	type: TRANSFER_TYPE.transfer21,
							// 	status: UISTATE.edit,
							// 	qTempletid_50: this.state.qTempletid_21,
							// 	appid: this.state.appid
							// });
							if (this.isRefAddLine == true) {
								this.refAddLineComfirmBtnClick(ids);
							} else {
								if (appid) {
									this.props.pushTo(URL.card, {
										type: TRANSFER_TYPE.transfer21,
										status: UISTATE.edit,
										qTempletid_50: this.state.qTempletid_21,
										appid: appid,
										appcode: APPCODE.puinvoice,
										pagecode: PAGECODE.invoiceCard
									});
								} else {
									this.props.pushTo(URL.card, {
										type: TRANSFER_TYPE.transfer21,
										status: UISTATE.edit,
										qTempletid_50: this.state.qTempletid_21,
										appid: appid,
										pagecode: PAGECODE.invoiceCard
										// appcode: APPCODE.puinvoice
									});
								}
							}
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.view21]) {
								init21Template(this.props); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.view21);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						},
						selectArea: () => {
							//已选列表个性化区域
							// return <span>{totalstr}</span>;
						},
						onCheckedChange: (flag, record, index, bodys) => {
							//勾选的回调函数
							// 计算下方合计
							// this.calTotal(flag, record, bodys, 'ncaninvoicenum', 'ncaninvoicemny');
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
Transfer21Table = createPage({})(Transfer21Table);
export default Transfer21Table;
