/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单拉单页面
 * @Date: 2021-11-19 16:00:00 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-18 16:53:12
 */
import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, CONSTFIELD, UISTATE } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { initTemplate } from './init';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';

const { NCBackBtn, NCDiv } = base;

export default class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.search);
		this.state = {};
		this.pageid = ''; // 页面模板id
		initLang(this, [ '4004planconfirm' ], 'pu', initTemplate.bind(this, this.props));
	}
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;

		return (
			<div id="transferList" className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<NCBackBtn
						onClick={() => {
							this.props.pushTo(URL.list, { pagecode: PAGECODE.list });
						}}
					/>

					<div className="header-title-search-area">
						{createCardTitle(this, {
							title: getLangByResId(this, '4004planconfirm-000012') /* 国际化处理：选择采购订单付款计划*/ // backBtnClick: () => { // clickBackBtn.call(this); //}
						})}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: AREA.search
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(
						AREA.search,
						{}
						//模块id
					)}
				</div>
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						searchAreaCode: AREA.search, // 用于缓存查询条件
						headTableId: AREA.head, //表格组件id
						bodyTableId: AREA.body, //子表模板id
						fullTableId: AREA.view,
						dataSource: CONSTFIELD.PlanconfirmTransferCache,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004planconfirm-000002'), //转单按钮显示文字/* 国际化处理： 生成进度确认单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							this.props.pushTo(URL.card, {
								type: URL.transfer,
								status: UISTATE.add,
								pageid: this.pageId,
								pagecode: PAGECODE.card,
								channelType: 'channelType'
							});
						},
						onChangeViewClick: () => {
							if (!this.props.meta.getMeta()[PAGECODE.view]) {
								initTemplate.call(this, this.props);
							}
							this.props.transferTable.changeViewType(AREA.view);
						}
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
