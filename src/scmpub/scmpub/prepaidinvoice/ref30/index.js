/*
 * @Author: 刘奇 
 * @PageInfo: 返利结算单拉单界面
 * @Date: 2019-03-20 16:46:28 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:25:47
 */

import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import { REF30_CONST, FIELD } from './const';
import { initTemplate, initSingleTemplate } from './init';
import { serach_btnClick, buttonClick } from './btnClicks';
import { search_afterEvent } from './events';
import { renderCompleteEvent } from '../../pub/queryarea/queryAreaInit';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { PREPAIDINVOICE_CONST } from '../const';
const { NCBackBtn, NCToggleViewBtn, NCDiv } = base;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(REF30_CONST.searchId);
		this.state = {
			toggleViewStatus: false
		};
	}

	// 点击返回
	clickReturn = () => {
		this.props.pushTo('/list', { pagecode: PREPAIDINVOICE_CONST.listPageId });
	};

	// 切换
	changeViewType = () => {
		if (!this.props.meta.getMeta()[REF30_CONST.singleTableId]) {
			initSingleTemplate.call(this, this.props); //加载主子拉平模板
		}
		this.props.transferTable.changeViewType();
		this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
	};

	componentWillMount() {
		initLang(this, [ '4001prepaidinvoice' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	CompleteEvent() {
		renderCompleteEvent.call(this, REF30_CONST.searchId, FIELD.csettleorgid, search_afterEvent);
		renderCompleteEvent.call(this, REF30_CONST.searchId, FIELD.pk_org, search_afterEvent);
	}
	// react：界面渲染函数
	render() {
		const { transferTable, button, search } = this.props;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		const { createTransferTable } = transferTable;
		let isShowSel = transferTable.getSelectedListDisplay(REF30_CONST.formId);

		return (
			<div id="transferList" className="nc-bill-list">
				{!isShowSel ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn onClick={this.clickReturn} />
							<div className="header-title-search-area">
								{createListTitle(this, {
									title: getLangByResId(this, '4006PREPAIDINVOICE-000026') /*国际化处理： 选择销售订单*/
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
								<NCToggleViewBtn expand={this.state.toggleViewStatus} onClick={this.changeViewType} />
							</div>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								REF30_CONST.searchId,
								{
									clickSearchBtn: serach_btnClick.bind(this),
									onAfterEvent: search_afterEvent.bind(this),
									renderCompleteEvent: this.CompleteEvent.bind(this),
									statusChangeEvent: this.CompleteEvent.bind(this)
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
						dataSource: REF30_CONST.dataSource,
						headTableId: REF30_CONST.formId, //表格组件id
						bodyTableId: REF30_CONST.tableId, //子表模板id
						fullTableId: REF30_CONST.singleTableId,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4006PREPAIDINVOICE-000027'), //转单按钮显示文字/* 国际化处理： 生成代垫发票*/
						containerSelector: '#transferList',
						showMasterIndex: true,
						showChildIndex: false,
						onChangeViewClick: this.changeViewType,
						onTransferBtnClick: (ids) => {
							this.props.pushTo(REF30_CONST.destPageUrl, {
								buttonType: 'ref30',
								pagecode: PREPAIDINVOICE_CONST.cardPageId
							});
						},
						totalKey: [ FIELD.nastnum, FIELD.norigtaxmny ],
						totalTitle: [
							getLangByResId(this, '4006PREPAIDINVOICE-000028'),
							getLangByResId(this, '4006PREPAIDINVOICE-000030') /* 国际化处理： 数量,价税合计*/
						]
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default TransferTable;
