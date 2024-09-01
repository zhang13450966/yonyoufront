/*
 * @Author: 刘奇 
 * @PageInfo: 费用申请单拉单界面
 * @Date: 2019-03-20 16:46:28 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:22:04
 */

import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { REF4641_CONST, FIELD } from './const';
import { initTemplate, initSingleTemplate } from './init';
import { serach_btnClick, buttonClick } from './btnClicks';
import { search_afterEvent } from './events';
import { renderCompleteEvent } from '../../pub/queryarea/queryAreaInit';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { ARSUB_CONST } from '../const';
const { NCBackBtn, NCToggleViewBtn, NCDiv } = base;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(REF4641_CONST.searchId);
		this.state = {};
	}

	// 点击返回
	clickReturn = () => {
		this.props.pushTo('/list', { pagecode: ARSUB_CONST.listPageId });
	};

	// 切换
	changeViewType = () => {
		if (!this.props.meta.getMeta()[REF4641_CONST.singleTableId]) {
			initSingleTemplate.call(this, this.props); //加载主子拉平模板
		}
		this.props.transferTable.changeViewType();
	};

	componentWillMount() {
		initLang(this, [ '4001arsub' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	CompleteEvent() {
		renderCompleteEvent.call(this, REF4641_CONST.searchId, FIELD.cfinanceorgid, search_afterEvent);
		renderCompleteEvent.call(this, REF4641_CONST.searchId, FIELD.pk_org, search_afterEvent);
	}
	// react：界面渲染函数
	render() {
		const { transferTable, button, search } = this.props;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		const { createTransferTable } = transferTable;
		let isShowSel = transferTable.getSelectedListDisplay(REF4641_CONST.formId);

		return (
			<div id="transferList" className="nc-bill-list">
				{!isShowSel ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn onClick={this.clickReturn} />
							<div className="header-title-search-area">
								{createListTitle(this, {
									title: getLangByResId(this, '4006ARSUB-000029') /*国际化处理： 选择客户费用申请单*/
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
								<NCToggleViewBtn onClick={this.changeViewType} />
							</div>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								REF4641_CONST.searchId,
								{
									clickSearchBtn: serach_btnClick.bind(this),
									onAfterEvent: search_afterEvent.bind(this),
									renderCompleteEvent: this.CompleteEvent.bind(this)
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
						dataSource: REF4641_CONST.dataSource,
						headTableId: REF4641_CONST.formId, //表格组件id
						bodyTableId: REF4641_CONST.tableId, //子表模板id
						fullTableId: REF4641_CONST.singleTableId,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4006ARSUB-000027'), //转单按钮显示文字/* 国际化处理： 核报*/
						containerSelector: '#transferList',
						showMasterIndex: true,
						showChildIndex: false,
						onChangeViewClick: this.changeViewType,
						onTransferBtnClick: (ids) => {
							this.props.pushTo(REF4641_CONST.destPageUrl, {
								buttonType: 'ref4641',
								pagecode: ARSUB_CONST.cardPageId
							});
						},
						totalKey: [ 'nrestmny' ],
						totalTitle: [ getLangByResId(this, '4006ARSUB-000030') /* 国际化处理： 本次可核报金额*/ ]
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default TransferTable;
