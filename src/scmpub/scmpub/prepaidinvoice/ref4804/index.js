/*
 * @Author: 刘奇 
 * @PageInfo: 运输单拉单界面
 * @Date: 2019-03-20 16:46:28 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:29:15
 */

import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import { REF4804_CONST, FIELD } from './const';
import { initTemplate, initSingleTemplate } from './init';
import { serach_btnClick, buttonClick } from './btnClicks';
import { search_afterEvent } from './events';
import { renderCompleteEvent } from '../../pub/queryarea/queryAreaInit';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import refresh_BtnClick from './btnClicks/refresh_BtnClick';
import { PREPAIDINVOICE_CONST } from '../const';
const { NCBackBtn, NCToggleViewBtn, NCDiv } = base;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(REF4804_CONST.searchId);
		this.state = {};
	}

	// 点击返回
	clickReturn = () => {
		this.props.pushTo('/list', { pagecode: PREPAIDINVOICE_CONST.listPageId });
	};

	// 切换(暂无主子拉平模板，未使用)
	changeViewType = () => {
		if (!this.props.meta.getMeta()[REF4804_CONST.singleTableId]) {
			initSingleTemplate.call(this, this.props); //加载主子拉平模板
		}
		this.props.transferTable.changeViewType();
	};

	componentWillMount() {
		initLang(
			this,
			[ '4001prepaidinvoice' ],
			'scmpub',
			initTemplate.bind(this, this.props, () => {
				let refresh = this.props.getUrlParam('refresh');
				if (refresh) {
					//刷新且不提示
					refresh_BtnClick.call(this, this.props, true);
				}
			})
		);
	}

	// react：界面渲染函数
	render() {
		const { transferTable, button, search } = this.props;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		const { createTransferTable } = transferTable;
		let isShowSel = transferTable.getSelectedListDisplay(REF4804_CONST.formId);

		return (
			<div id="transferList" className="nc-bill-list">
				{!isShowSel ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn onClick={this.clickReturn} />
							<div className="header-title-search-area">
								{createListTitle(this, {
									title: getLangByResId(this, '4006PREPAIDINVOICE-000038') /*国际化处理： 选择运输单*/
								})}
							</div>
							<div className="header-button-area">
								{createButtonApp({
									area: 'list_head',
									buttonLimit: 8,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
								{/* 切换视图 */}
								{/* <NCToggleViewBtn onClick={this.changeViewType} /> */}
							</div>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								REF4804_CONST.searchId,
								{
									clickSearchBtn: serach_btnClick.bind(this),
									onAfterEvent: search_afterEvent.bind(this),
									renderCompleteEvent: renderCompleteEvent.bind(
										this,
										REF4804_CONST.searchId,
										FIELD.pk_org,
										search_afterEvent
									)
								}
								//模块id
							)}
						</div>
					</div>
				) : (
					''
				)}

				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						tableType: 'simple',
						dataSource: REF4804_CONST.dataSource,
						headTableId: REF4804_CONST.singleTableId, //表格组件id
						fullTableId: REF4804_CONST.singleTableId,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4006PREPAIDINVOICE-000027'), //转单按钮显示文字/* 国际化处理： 核报*/
						containerSelector: '#transferList',
						showMasterIndex: true,
						showChildIndex: false,
						//	onChangeViewClick: this.changeViewType,
						onTransferBtnClick: (ids) => {
							this.props.pushTo(REF4804_CONST.destPageUrl, {
								buttonType: 'ref4804',
								pagecode: PREPAIDINVOICE_CONST.cardPageId
							});
						},
						totalKey: [ 'nrestmny' ],
						totalTitle: [ getLangByResId(this, '4006PREPAIDINVOICE-000030') /* 国际化处理： 本次可核报金额*/ ]
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default TransferTable;
