/*
 * @Author: chaiwx 
 * @PageInfo: index  
 * @Date: 2018-04-24 16:02:29 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-13 15:53:41
 */

//********************************独立编译包引用******************************************************** */
import React, { Component } from 'react';
import { createPage, high, createPageIcon, base } from 'nc-lightapp-front';
//********************************依赖编译包引用******************************************************** */
import { initTemplate, initDataFromLinkQuery } from './init';
import { AREA, TABS, BUTTONAREA, CACHDATASOURCE, PAGECODE, FIELDS, REQUESTURL } from '../constance';
import { searchBtnClick, pageInfoClick, buttonClick } from './btnClicks';
import { searchAfterEvent } from './afterEvents';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import commitBtnClick from './btnClicks/commitBtnClick';
import transtypeUtils from '../../../../scmpub/scmpub/pub/tool/transtypeUtils';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { setQueryDefaultValue } = transtypeUtils;
const { BillTrack } = high;
const { NCDiv } = base;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onSelected } from './viewControl/rowSelectControl';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { onRowDoubleClick } from './viewControl/rowClickControl';
import { componentInitFinished } from './viewControl/pageRenderControl';

class TaxinvoiceList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.table(AREA.listTableId);
		this.state = {
			vbillcode: null,
			pk_taxinvoice: null,
			target: null,
			showUploader: false,
			showTrack: false,
			pk: null,
			showModal: false,
			showApprove: false,
			billtype: null,
			compositedisplay: false,
			compositedata: null
		};

		// 当前执行提交的数据（为提交指派提供）
		this.commitInfo = {
			isBatch: false,
			record: null,
			index: null
		};

		this.queryInfo = null;
		this.searchHasClick = false;
		initLang(this, [ '4004taxinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}

	render() {
		const { table, search } = this.props;
		const { NCCreateSearch } = search;
		const { createSimpleTable } = table;

		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理：助促销品申请单*/}
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
						clickSearchBtn: searchBtnClick.bind(this, this.props, true),
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
						pkname: FIELDS.pk_taxinvoice,
						componentInitFinished: componentInitFinished.bind(this)
					})}
				</div>

				{this.state.showUploader && (
					<NCUploader
						billId={this.state.pk_taxinvoice}
						target={this.state.target}
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
					pk={this.state.pk_taxinvoice}
					type="25Tax"
				/>

				<ApproveDetail
					show={this.state.showApprove}
					close={() => {
						this.setState({ showApprove: false });
					}}
					billtype={this.state.billtype}
					billid={this.state.pk_taxinvoice}
				/>

				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004Taxinvoice-000015')} /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getResult.bind(this)}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
			</div>
		);
	}

	querySchemeAfterEvent = () => {
		// 交易类型发布的节点需要设置交易类型默认值
		setQueryDefaultValue.call(this, this.props, AREA.searchId, FIELDS.ctrantypeid);
		searchAfterEvent.call(this, 'pk_org');
	};

	// 提交指派获取结果后重新进行提交
	getResult = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.commitInfo.isBatch) {
			commitBtnClick.call(this, this.props, null, null, null, value);
		} else {
			let { record, index } = this.commitInfo;
			commitBtnClick.call(this, this.props, record, index, null, value);
		}
		this.setState({ compositedisplay: false });
	};

	componentDidMount() {
		//联查加载数据
		// initDataFromLinkQuery.call(this, this.props);
	}
}

TaxinvoiceList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: {
			[AREA.listTableId]: 'table'
		}
	}
})(TaxinvoiceList);
export default TaxinvoiceList;
