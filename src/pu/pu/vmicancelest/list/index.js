/*
 * @Author: zhangshqb
 * @PageInfo: 消耗汇总取消暂估页面初始化
 * @Date: 2018-06-26 11:39:27
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-25 17:14:13
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick, searchBtnClick, beSureBtnClick, cancelBtnClick, closeModalEve, rowClick } from './btnClicks';
import { PAGECODE, LIST_BUTTON, FIELD } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createPageIcon } from 'nc-lightapp-front';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { BillTrack } = high;
const { NCDiv } = base;
class CancelEstList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.editTable(PAGECODE.tableId);
		props.use.editTable(PAGECODE.childTableId);
		this.feeItems;
		this.bfee;
		this.esttype;
		this.searchdata;
		this.state = { showTrack: false, pk: '' };
		initLang(this, [ '4004vmicancelest' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.toggleShow();
		let data = { pagecode: PAGECODE.pagecode };
		ajax({
			url: '/nccloud/platform/templet/querypage.do',
			data: data,
			success: (res) => {
				this.props.editTable.setTableData(PAGECODE.tableId, res.data[PAGECODE.tableId]);
			}
		});
	}

	//切换页面状态时按钮显示隐藏的问题
	toggleShow = () => {};

	onSelect = () => {
		let butArray = [ LIST_BUTTON.print, LIST_BUTTON.linkQuery, LIST_BUTTON.cancelest ];
		let rows = this.props.editTable.getCheckedRows(PAGECODE.tableId);
		if (rows && rows.length > 0) {
			this.props.button.setButtonDisabled(butArray, false);
		} else {
			this.props.button.setButtonDisabled(butArray, true);
		}
	};

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_financeorg);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(FIELD.pk_financeorg, arr);
		}
	};

	onAfterEvent(field, val) {
		if (field == FIELD.pk_financeorg) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [
				FIELD.cprojectid,
				FIELD.pk_supplier,
				FIELD.pk_srcmaterial,
				FIELD.pk_material,
				'pk_srcmaterial.pk_marbasclass',
				'pk_material.materialstock.pk_marpuclass'
			]);
		} else if (field == FIELD.pk_storeorg) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [ FIELD.pk_stordoc ]);
		}
	}

	render() {
		const { editTable, button, search, modal, socket } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
		const { createButton } = button;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					billpkname: 'pk_stockps_b',
					tableType: 'editTable' // 增加表格类型 editTable / insertTable
					// billtype : '',   // 由于EditTable 节点可能不涉及追溯或者流程，可不传
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 5,
							onButtonClick: btnClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk}
							type="50"
						/>
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(PAGECODE.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),
						defaultConditionsNum: 4,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createEditTable(PAGECODE.tableId, {
						showCheck: true,
						showIndex: true,
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelect.bind(this),
						onRowClick: rowClick.bind(this),
						height: '240px'
					})}
				</div>

				<div className="nc-bill-table-area">
					<div className="child-table-header">
						<span className="child-table-header-title">
							{getLangByResId(this, '4004VMICANCELEST-000008')}
						</span>
						<span>{getLangByResId(this, '4004VMICANCELEST-000009')}</span>
					</div>
					{createEditTable(PAGECODE.childTableId, {
						showCheck: false,
						showIndex: true,
						// height: '160px',
						adaptionHeight: true
					})}
				</div>
				<div className="nc-bill-modal">
					{createModal(PAGECODE.modalid, {
						title: getLangByResId(this, '4004VMICANCELEST-000003') /* 国际化处理： 询问*/,
						content: getLangByResId(
							this,
							'4004VMICANCELEST-000004'
						) /* 国际化处理： 存在既作过货物暂估又作过费用暂估的记录，是否仅取消费用暂估（是：仅取消费用暂估；否：货物暂估和费用暂估全部取消）*/,
						beSureBtnClick: beSureBtnClick.bind(this),
						cancelBtnClick: cancelBtnClick.bind(this),
						closeModalEve: closeModalEve.bind(this),
						rightBtnName: getLangByResId(this, '4004VMICANCELEST-000005') /* 国际化处理： 否*/,
						leftBtnName: getLangByResId(this, '4004VMICANCELEST-000006') /* 国际化处理： 是*/
					})}
				</div>
			</div>
		);
	}
}

CancelEstList = createPage(
	{
		// initTemplate: initTemplate
	}
)(CancelEstList);

ReactDOM.render(<CancelEstList />, document.querySelector('#app'));
