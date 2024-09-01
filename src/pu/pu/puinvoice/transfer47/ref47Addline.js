/*
 * @Author: jiangfw 
 * @PageInfo: 拉采购入库单收票
 * @Date: 2018-06-15 13:49:34 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:36:05
 */
import React, { Component } from 'react';
import { createPage, base, sum } from 'nc-lightapp-front';
import getNumber from '../utils/getNumber';
import init47Template from './init/init47Template';
import search47BtnClick from './btnClicks/search47BtnClick';
import { UISTATE, TRANSFER_TYPE, URL, AREA, COMMON, MAIN_ORG_FIELD, PAGECODE } from '../constance';
import searchAfterEvent from '../utils/searchAfterEvent';
import renderCompleteEvent from '../utils/renderCompleteEvent';
const { NCToggleViewBtn, NCSetColBtn, NCDiv } = base;
import { btnClick } from './btnClicks';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
// let refDataSource = COMMON.TransferCacheKey;

class Ref47Addline extends Component {
	constructor(props) {
		super(props);

		this.isRefAddLine = props.isRefAddLine; //是否参照增行
		this.pk_busitype = props.pk_busitype;
		this.transType = props.transType;
		this.refAddLineComfirmBtnClick = props.refAddLineComfirmBtnClick;
		this.queryArea = AREA.search47;
		this.refsourcdata = props.refsourcdata; //参照增行要过滤当前页面的数据
		this.state = {
			toggleViewStatus: false
			// ntotalnum: 0,
			// ntotalmny: 0,
		};

		this.templetid_47; //委托加工入库单模板id
		this.qTempletid_47; //委托加工入库单模板id

		initLang(this, [ '4004puinvoice' ], 'pu', init47Template.bind(this, this.props));
	}

	componentDidMount() {}

	// 计算合计
	calTotal = (flag, record, bodys, numkey, mnykey) => {
		let ntotalnum = this.state.ntotalnum;
		// let ntotalmny = this.state.ntotalmny;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, getNumber(line[numkey]));
					// ntotalmny = sum(ntotalmny, getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, getNumber(record[numkey]));
				// ntotalmny = sum(ntotalmny, getNumber(record[mnykey]));
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, -getNumber(line[numkey]));
					// ntotalmny = sum(ntotalmny, -getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, -getNumber(record[numkey]));
				// ntotalmny = sum(ntotalmny, -getNumber(record[mnykey]));
			}
		}
		this.setState({
			ntotalnum: ntotalnum
			// ntotalmny: ntotalmny
		});
	};

	handleClick() {}

	// react：界面渲染函数
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		// let totalstr = `${getLangByResId(this, '4004PUINVOICE-000060')}：${this.state
		// 	.ntotalnum} `; /* 国际化处理： 本次收票数量,本次收票金额*/
		let totalTitle = [ getLangByResId(this, '4004PUINVOICE-000060') ]; /* 国际化处理： 本次收票数量*/
		let selectedShow = transferTable.getSelectedListDisplay(AREA.head47);

		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								<h2 className="title-search-detail">{getLangByResId(this, '4004PUINVOICE-000066')}</h2>
								{/* 国际化处理：委托加工入库单*/}
							</div>
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
									if (!this.props.meta.getMeta()[AREA.view47]) {
										init47Template.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(AREA.view47);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						{/* 查询区 */}
						<div className="nc-bill-search-area">
							{NCCreateSearch(this.queryArea, {
								clickSearchBtn: search47BtnClick.bind(this),
								onAfterEvent: searchAfterEvent.bind(this, this.queryArea),
								renderCompleteEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search47Org
								),
								statusChangeEvent: renderCompleteEvent.bind(
									this,
									this.queryArea,
									MAIN_ORG_FIELD.search47Org
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
						totalKey: [ 'ninvoicenum' ],
						totalTitle: totalTitle,
						// dataSource: refDataSource,
						// tableType: 'simple',
						headTableId: AREA.head47, //表格组件id
						bodyTableId: AREA.body47, //子表模板id
						fullTableId: AREA.view47,
						transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							// this.props.pushTo(URL.card, {
							// 	type: TRANSFER_TYPE.transfer47,
							// 	status: UISTATE.edit,
							// 	qTempletid_50: this.state.qTempletid_47,
							// 	appid: this.state.appid
							// });
							if (this.isRefAddLine == true) {
								this.refAddLineComfirmBtnClick(ids);
							} else {
								this.props.pushTo(URL.card, {
									type: TRANSFER_TYPE.transfer47,
									status: UISTATE.edit,
									qTempletid_50: this.state.qTempletid_47,
									appid: this.state.appid,
									pagecode: PAGECODE.invoiceCard
								});
							}
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.view47]) {
								init47Template(this.props); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.view47);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						},
						selectArea: () => {
							//已选列表个性化区域
							// return <span>{totalstr}</span>;
						},
						onCheckedChange: (flag, record, index, bodys) => {
							//勾选的回调函数
							// 计算下方合计
							// this.calTotal(flag, record, bodys, 'ninvoicenum');
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
Ref47Addline = createPage({})(Ref47Addline);
export default Ref47Addline;
