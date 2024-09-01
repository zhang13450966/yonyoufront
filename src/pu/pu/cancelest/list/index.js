/*
 * @Author: zhangshqb
 * @PageInfo: 取消采购暂估
 * @Date: 2018-06-07 10:15:38
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-25 17:17:25
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick, searchBtnClick, beSureBtnClick, cancelBtnClick, closeModalEve, rowClick } from './btnClicks';
import afterEvent from './afterEvents/afterEvent';
import { PAGECODE, LIST_BUTTON, FIELD } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDataByIndex } from '../../pub/utils/getDataByIndex';
import { createPageIcon } from 'nc-lightapp-front';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { BillTrack } = high;
const { NCDiv } = base;

class CancelEstList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.editTable(PAGECODE.tableId, PAGECODE.childTableId);
		this.feeItems;
		this.onlyCancelFee = false;
		this.searchdata;
		this.state = {
			showTrack: false,
			pk: ''
		};
		initLang(this, [ '4004cancelest' ], 'pu', initTemplate.bind(this, this.props));
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

	onSelectAll(props, moduleId, status, length) {
		let butArray = [ LIST_BUTTON.cancelest, LIST_BUTTON.linkQuery, LIST_BUTTON.print ];
		let rows = this.props.editTable.getCheckedRows(PAGECODE.tableId);
		if (rows && rows.length > 0) {
			this.props.button.setButtonDisabled(butArray, false);
		} else {
			this.props.button.setButtonDisabled(butArray, true);
		}
		let updates = [];
		if (status && rows && rows.length > 0) {
			rows.forEach((item) => {
				if (!item.data.values.onebillselect) {
					item.data.values.onebillselect = {};
				}
				item.data.values.onebillselect.value = status;
				item.data.values.onebillselect.display = status;
				let data = {
					index: item.index, //序号修正
					data: item.data
				};
				updates.push(data);
			});
		} else {
			let allrows = this.props.editTable.getAllRows(PAGECODE.tableId);
			if (allrows && allrows.length > 0) {
				allrows.forEach((item, index) => {
					if (!item.values.onebillselect) {
						item.values.onebillselect = {};
					}
					item.values.onebillselect.value = false;
					item.values.onebillselect.display = false;
					let data = {
						index: index,
						data: item
					};
					updates.push(data);
				});
			}
		}
		if (updates && updates.length > 0) {
			this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updates);
		}

		this.forceUpdate();
	}

	onSelect(props, moduleId, record, index, status) {
		let butArray = [ LIST_BUTTON.cancelest, LIST_BUTTON.linkQuery, LIST_BUTTON.print ];
		let rows = this.props.editTable.getCheckedRows(PAGECODE.tableId);
		if (rows && rows.length > 0) {
			this.props.button.setButtonDisabled(butArray, false);
		} else {
			this.props.button.setButtonDisabled(butArray, true);
		}
		if (!record) {
			return;
		}
		let pk_stockps = record.values.pk_stockps.value;
		let indexs = [];
		let allrows = this.props.editTable.getAllRows(PAGECODE.tableId);
		allrows.forEach((item, index) => {
			if (item.values.pk_stockps.value == pk_stockps) {
				indexs.push(index);
			}
		});
		if (indexs.length == 1 && indexs[0] == index) {
			if (!record.values.onebillselect) {
				record.values.onebillselect = {};
			}
			record.values.onebillselect.display = record.selected;
			record.values.onebillselect.value = record.selected;
			this.forceUpdate();
		} else {
			if (record.selected) {
				let checkindexs = [];
				rows.forEach((item, index) => {
					if (item.data.values.pk_stockps.value == pk_stockps) {
						checkindexs.push(item.index);
					}
				});
				let isallcheck = true;
				indexs.forEach((item) => {
					if (checkindexs.indexOf(item) < 0) {
						isallcheck = false;
					}
				});
				if (isallcheck) {
					// let alldatas = props.editTable.getAllRows(PAGECODE.tableId);
					// let datas = [];
					// for (let i; i < alldatas.length; i++) {
					// 	if (i in indexs) {
					// 		datas.push(alldatas[i]);
					// 	}
					// }
					let datas = getDataByIndex(props, PAGECODE.tableId, indexs);
					// let datas = props.cardTable.getRowsByIndexs(PAGECODE.tableId, indexs);
					let updatedatas = datas.map((item) => {
						if (!item.values.onebillselect) {
							item.values.onebillselect = {};
						}
						if (record.selected) {
							item.values.onebillselect.display = true;
							item.values.onebillselect.isEdit = false;
							item.values.onebillselect.value = true;
						} else {
							item.values.onebillselect.display = false;
							item.values.onebillselect.isEdit = false;
							item.values.onebillselect.value = false;
						}

						return {
							index: item.key,
							data: item
						};
					});
					this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatedatas);
					this.forceUpdate();
				}
			} else {
				let checkindexs = [];
				rows.forEach((item, index) => {
					if (item.data.values.pk_stockps.value == pk_stockps) {
						checkindexs.push(item.index);
					}
				});
				let isallcheck = true;
				indexs.forEach((item) => {
					if (checkindexs.indexOf(item) < 0) {
						isallcheck = false;
					}
				});

				let datas = getDataByIndex(props, PAGECODE.tableId, indexs);
				let updates = datas.map((item) => {
					if (!item.values.onebillselect) {
						item.values.onebillselect = {};
					}
					if (record.selected) {
						item.values.onebillselect.display = true;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = true;
					} else {
						item.values.onebillselect.display = false;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = false;
					}

					return {
						index: item.key,
						data: item
					};
				});
				this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updates);
				this.forceUpdate();
			}
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(FIELD.pk_org, arr);
		}
	};

	onAfterEvent(field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [
				FIELD.pk_supplier,
				FIELD.pk_srcmaterial,
				FIELD.pk_material,
				'vdef1',
				'vdef2',
				'vdef3',
				'vdef4',
				'vdef5',
				'vdef6',
				'vdef7',
				'vdef8',
				'vdef9',
				'vdef10',
				'vdef11',
				'vdef12',
				'vdef13',
				'vdef14',
				'vdef15',
				'vdef16',
				'vdef17',
				'vdef18',
				'vdef19',
				'vdef20',
				'pk_stockps_b.pk_srcmaterial.pk_marbasclass',
				'pk_stockps_b.pk_material.materialstock.pk_marpuclass',
				'pk_stockps_b.cprojectid',
				'pk_stockps_b.vbdef1',
				'pk_stockps_b.vbdef2',
				'pk_stockps_b.vbdef3',
				'pk_stockps_b.vbdef4',
				'pk_stockps_b.vbdef5',
				'pk_stockps_b.vbdef6',
				'pk_stockps_b.vbdef7',
				'pk_stockps_b.vbdef8',
				'pk_stockps_b.vbdef9',
				'pk_stockps_b.vbdef10',
				'pk_stockps_b.vbdef11',
				'pk_stockps_b.vbdef12',
				'pk_stockps_b.vbdef13',
				'pk_stockps_b.vbdef14',
				'pk_stockps_b.vbdef15',
				'pk_stockps_b.vbdef16',
				'pk_stockps_b.vbdef17',
				'pk_stockps_b.vbdef18',
				'pk_stockps_b.vbdef19',
				'pk_stockps_b.vbdef20'
			]);
		} else if (field == FIELD.pk_stockorg) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [ 'pk_stordoc', 'pk_dept', 'pk_psndoc' ]);
		}
	}

	render() {
		const { editTable, button, search, modal, socket } = this.props;
		const { createEditTable } = editTable;
		const { createModal } = modal;
		const { NCCreateSearch } = search;
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
							type="45"
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
						onAfterEvent: afterEvent.bind(this),
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelectAll.bind(this),
						onRowClick: rowClick.bind(this),
						adaptionHeight: true
					})}
				</div>
				<div className="nc-bill-table-area">
					<div className="child-table-header">
						<span className="child-table-header-title">{getLangByResId(this, '4004CANCELEST-000008')}</span>
						<span>{getLangByResId(this, '4004CANCELEST-000009')}</span>
					</div>
					{createEditTable(PAGECODE.childTableId, {
						showCheck: false,
						showIndex: true,
						onAfterEvent: afterEvent.bind(this),
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelectAll.bind(this),
						adaptionHeight: true
					})}
				</div>

				{createModal(PAGECODE.modalid, {
					title: getLangByResId(this, '4004CANCELEST-000003') /* 国际化处理： 询问*/,
					content: getLangByResId(
						this,
						'4004CANCELEST-000004'
					) /* 国际化处理： 存在既作过货物暂估又作过费用暂估的记录，是否仅取消费用暂估（是：仅取消费用暂估；否：货物暂估和费用暂估全部取消）*/,
					beSureBtnClick: beSureBtnClick.bind(this),
					cancelBtnClick: cancelBtnClick.bind(this),
					closeModalEve: closeModalEve.bind(this),
					rightBtnName: getLangByResId(this, '4004CANCELEST-000005') /* 国际化处理： 否*/,
					leftBtnName: getLangByResId(this, '4004CANCELEST-000006') /* 国际化处理： 是*/
				})}
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
