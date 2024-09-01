/*
 * @Author: yinliangc 
 * @PageInfo: 采购发票拉单界面
 * @Date: 2021-11-19 16:00:00 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 12:29:54
 */
import React, { Component } from 'react';
import { createPage, sum, base, createPageIcon } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, UISTATE, COMMON, TRANSFER_TYPE, MAIN_ORG_FIELD, APPCODE } from '../constance';
import { initTemplate } from './init';
import searchAfterEvent from '../utils/searchAfterEvent';
import search25BtnClick from './btnClicks/search25BtnClick';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCToggleViewBtn, NCDiv } = base;
import renderCompleteEvent from '../utils/renderCompleteEvent';
import clickBackBtn from '../utils/backBtnClick';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnClick } from './btnClicks';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache';

export default class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.search25);
		this.queryArea = AREA.search25;
		this.state = {
			toggleViewStatus: false,
			ncaninvoicenum: 0, // 可收票数量
			ncaninvoicemny: 0 // 可收票金额
		};
		//this.templetid;
		this.templetid_21P; //拉采购订单模板id
		this.qTempletid_21P; //拉采购订单查询模板id
		this.pageid = ''; // 页面模板id
		initLang(this, [ '4004puinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}

	calTotal = (flag, record, bodys) => {
		let ncaninvoicemny = parseInt(this.state.ncaninvoicemny);
		let ncaninvoicenum = parseInt(this.state.ncaninvoicenum);
		ncaninvoicemny = ncaninvoicemny == NaN ? 0 : ncaninvoicemny;
		ncaninvoicenum = ncaninvoicenum == NaN ? 0 : ncaninvoicenum;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ncaninvoicemny += parseInt(line && line.ncaninvoicemny && line.ncaninvoicemny.value);
					ncaninvoicenum += parseInt(line && line.ncaninvoicenum && line.ncaninvoicenum.value);
				}
			} else {
				ncaninvoicemny += parseInt(record && record.ncaninvoicemny && record.ncaninvoicemny.value);
				ncaninvoicenum += parseInt(record && record.ncaninvoicenum && record.ncaninvoicenum.value);
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ncaninvoicemny -= parseInt(line && line.ncaninvoicemny && line.ncaninvoicemny.value);
					ncaninvoicenum -= parseInt(line && line.ncaninvoicenum && line.ncaninvoicenum.value);
				}
			} else {
				ncaninvoicemny -= parseInt(record && record.ncaninvoicemny && record.ncaninvoicemny.value);
				ncaninvoicenum -= parseInt(record && record.ncaninvoicenum && record.ncaninvoicenum.value);
			}
		}
		this.setState({
			ncaninvoicenum: parseInt(ncaninvoicenum),
			ncaninvoicemny: parseInt(ncaninvoicemny)
		});
	};
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;

		let totalTitle = [
			getLangByResId(this, '4004PUINVOICE-000060'),
			getLangByResId(this, '4004PUINVOICE-000061')
		]; /* 国际化处理： 本次收票数量,本次收票金额*/
		let transType;
		let appid;
		let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
		if (busiInfoData) {
			transType = busiInfoData.transType;
			appid = busiInfoData.appid;
		}
		transType = this.props.getUrlParam('transType');
		appid = this.props.getUrlParam('appid');
		busiInfoData = { transType, appid, type: TRANSFER_TYPE.transfer21Pto25 };
		setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);

		let selectedShow = transferTable.getSelectedListDisplay(AREA.head25);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									title: getLangByResId(this, '4004PUINVOICE-000092') /* 国际化处理：选择采购订单付款计划*/,
									backBtnClick: () => {
										clickBackBtn.call(this);
									}
								})}
							</div>

							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: AREA.list_head,
									onButtonClick: btnClick.bind(this)
								})}
							</div>
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[AREA.view25]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(AREA.view25);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						{/* 查询区 */}
						<div className="nc-bill-search-area">
							{NCCreateSearch(this.queryArea, {
								clickSearchBtn: search25BtnClick.bind(this),
								onAfterEvent: searchAfterEvent.bind(this, this.queryArea),
								renderCompleteEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search21POrg
								),
								statusChangeEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search21POrg
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
						searchAreaCode: AREA.search25, // 用于缓存查询条件
						headTableId: AREA.head25, //表格组件id
						bodyTableId: AREA.body25, //子表模板id
						fullTableId: AREA.view25,
						dataSource: COMMON.TransferCacheKey,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							this.props.pushTo(URL.card, {
								type: TRANSFER_TYPE.transfer21Pto25,
								status: UISTATE.edit,
								pageid: this.pageId,
								pagecode: PAGECODE.invoiceCard,
								appcode: APPCODE.puinvoice
							});
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.view25]) {
								initTemplate(this.props); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.view25);
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

TransferTable = createPage({})(TransferTable);
