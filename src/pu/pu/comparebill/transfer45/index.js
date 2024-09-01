/*
 * @Author: qishy 
 * @Date: 2019-05-05 11:12:24 业务对账单拉采购订单
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:13:18
 */
import React, { Component } from 'react';
import { createPage, base, createPageIcon } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick } from './btnClick';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { searchAfterEvent } from './afterEvents';
import {
	AREA,
	FIELDS,
	REQUESTURL,
	OPTIONS,
	CACHKEY,
	CACHDATASOURCE,
	BUTTONID,
	BUTTONAREA,
	MAIN_ORG_FIELD,
	PAGECODE
} from '../constance';
const { NCToggleViewBtn, NCBackBtn } = base;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
class Transfer45Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		this.contexts;
		this.state = {
			toggleViewStatus: false
		};
		initLang(this, [ '4004comarebill' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		//清空转单数据
		this.props.transferTable.setTransferTableValue(
			AREA.cardFormId,
			AREA.cardTableId,
			[],
			'cgeneralhid',
			'cgeneralbid'
		);
		//刷新按钮可用性控制
		this.props.button.setDisabled({
			[BUTTONID.Refresh]: true
		});
		if (getDefData(CACHDATASOURCE.dataSourceTransfer, CACHKEY.transferSearchCach)) {
			this.props.button.setDisabled({
				[BUTTONID.Refresh]: false
			});
		}
	}

	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let selectedShow = transferTable.getSelectedListDisplay(AREA.cardFormId);
		const { NCDiv } = base;

		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(REQUESTURL.toList, { pagecode: PAGECODE.listPagecode });
								}}
							/>
							{/* {createBillHeadInfo({
									title: getLangByResId(this, '4004comarebill-000031'), //标题 国际化处理： 选择采购入库 
									 billCode: '', //单据号
									backBtnClick: buttonClick.bind(this, this.props, BUTTONID.Back)
								})} */}
							<div className="header-title-search-area">
								{createPageIcon()}
								<h2 className="title-search-detail">{getLangByResId(this, '4004comarebill-000031')}</h2>
							</div>

							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUTTONAREA.list_head,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[AREA.srcView]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(AREA.searchId, {
								//查询区参照过滤
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: searchAfterEvent.bind(this),
								//查询区渲染完成的回调事件
								renderCompleteEvent: this.querySchemeAfterEvent,
								//查询区状态切换的回调事件
								statusChangeEvent: this.querySchemeAfterEvent
							})}
						</div>
					</div>
				) : (
					''
				)}
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						searchAreaCode: AREA.searchId,
						dataSource: CACHDATASOURCE.dataSourceTransfer,
						pkname: FIELDS.pk_comparebill,
						headTableId: AREA.cardFormId, //表格组件id
						bodyTableId: AREA.cardTableId, //子表模板id
						fullTableId: AREA.srcView, //视图VO，设置表格数据
						transferBtnText: getLangByResId(this, '4004comarebill-000032'), //转单按钮显示文字/* 国际化处理： 生成采购入库*/
						containerSelector: '#transferList',
						totalKey: [ 'ntotalnum', 'norigtaxmny' ],
						totalTitle: [
							getLangByResId(this, '4004comarebill-000037') /* 国际化处理： 本次对账数量*/,
							getLangByResId(this, '4004comarebill-000038') /* 国际化处理： 本次对账金额*/
						],
						onTransferBtnClick: (ids) => {
							this.props.pushTo(REQUESTURL.toCard, {
								status: 'edit',
								option: OPTIONS.transfer,
								transferFrom: OPTIONS.from45,
								pagecode: PAGECODE.cardPagecode
							});
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.srcView]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
			</div>
		);
	}
	querySchemeAfterEvent = () => {
		searchAfterEvent.call(this, MAIN_ORG_FIELD.search45Org);
	};
}

Transfer45Table = createPage({})(Transfer45Table);
export default Transfer45Table;
