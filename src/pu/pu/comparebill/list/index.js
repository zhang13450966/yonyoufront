/*
 * @Author: chaiwx 
 * @PageInfo: index  
 * @Date: 2018-04-24 16:02:29 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 15:58:35
 */

//********************************独立编译包引用******************************************************** */
import React, { Component } from 'react';
import { createPage, high, createPageIcon, base } from 'nc-lightapp-front';
//********************************依赖编译包引用******************************************************** */
import { initTemplate } from './init';
import { AREA, BUTTONAREA, PAGECODE, CACHKEY, CACHDATASOURCE, FIELDS, BUTTONID } from '../constance';
import { searchBtnClick, pageInfoClick, buttonClick } from './btnClicks';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
import { onSelected } from './viewControl/rowSelectControl';
import { onRowDoubleClick } from './viewControl/rowClickControl';
import { componentInitFinished } from './viewControl/pageRenderControl';
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { searchAfterEvent } from './afterEvents';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

class ComparebillList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.table(AREA.listTableId);
		this.state = {
			pk_comparebill: null,
			vbillcode: null,
			billtype: null,
			showUploader: false, //附件上传标识
			showTrack: false, //单据追溯标识
			showApprove: false, //审批详情标识
			showSpilt: false, // 分单打印标识
			splitData: {}
		};

		// 当前执行提交的数据（为提交指派提供）
		this.commitInfo = {
			isBatch: false,
			record: null,
			index: null
		};
		this.queryInfo = null;
		initLang(this, [ '4004comarebill' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		//刷新按钮可用性控制
		this.props.button.setDisabled({
			[BUTTONID.Refresh]: true
		});
		if (getDefData(CACHDATASOURCE.dataSourceList, CACHKEY.searchCach)) {
			this.props.button.setDisabled({
				[BUTTONID.Refresh]: false
			});
		}
	}

	render() {
		const { table, search, modal } = this.props;
		let { createModal } = modal;
		const { NCCreateSearch } = search;
		const { createSimpleTable } = table;
		const { NCDiv } = base;

		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* {createListHeadInfo(this, getLangByResId(this, '4004comarebill-000021'))} */}
						{/* 国际化处理：业务对账单*/}
					</div>

					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: BUTTONAREA.list_head,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: searchAfterEvent.bind(this),
						renderCompleteEvent: this.querySchemeAfterEvent,
						statusChangeEvent: this.querySchemeAfterEvent
					})}
				</div>

				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(AREA.listTableId, {
						//显示序号
						showIndex: true,
						showCheck: true,
						onSelected: onSelected.bind(this),
						onSelectedAll: onSelected.bind(this),
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: onRowDoubleClick.bind(this),
						dataSource: CACHDATASOURCE.dataSourceList,
						pkname: FIELDS.pk_comparebill,
						componentInitFinished: componentInitFinished.bind(this)
					})}
				</div>

				{this.state.showUploader && (
					<NCUploader
						billId={this.state.pk_comparebill}
						billNo={this.state.vbillcode}
						onHide={() => {
							this.setState({ showUploader: false });
						}}
					/>
				)}

				<BillTrack
					show={this.state.showTrack}
					close={() => {
						this.setState({ showTrack: false });
					}}
					pk={this.state.pk_comparebill}
					type="2507"
				/>
				<div>
					{createModal('ResumeMessageDlg', {
						className: 'iframe-modal',
						size: 'xlg'
					})}
				</div>
			</div>
		);
	}

	querySchemeAfterEvent = () => {
		searchAfterEvent.call(this, 'pk_org');
	};
}

ComparebillList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: {
			[AREA.listTableId]: 'table'
		}
	}
})(ComparebillList);
export default ComparebillList;
