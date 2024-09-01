/*
 * @Author: zhangshqb
 * @PageInfo: 消耗汇总暂估页面初始化
 * @Date: 2018-05-26 11:31:49
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-31 13:38:18
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick, searchBtnClick, rowClick } from './btnClicks';
import { PAGECODE, LIST_BUTTON, URL, FIELD } from '../constance';
import { afterEvent, childAfterEvent } from './afterEvents';
import { bodybeforeEvent, headbeforeEvent } from './beforeEvents';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createPageIcon } from 'nc-lightapp-front';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { BillTrack } = high;
const { NCDiv } = base;
class VMIEstList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.editTable(PAGECODE.tableId);
		props.use.editTable(PAGECODE.childTableId);
		this.feeItems;
		this.feeItem;
		this.bfee;
		this.esttype;
		this.searchdata;
		this.state = {
			showModal: false,
			showTrack: false,
			pk: ''
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		initLang(this, [ '4004vmiest' ], 'pu', initTemplate.bind(this, this.props));
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

	close = () => {
		this.setState({ showModal: false });
	};

	open = () => {
		this.setState({ showModal: true });
	};

	sureFeeDis = () => {
		this.props.editTable.filterEmptyRows(PAGECODE.modaltablecode, [ 'nestototalmny' ]);
		let fee = this.props.editTable.getAllRows(PAGECODE.modaltablecode);
		let feegrid = fee.map((item) => {
			return { po_vmi_fee: { rows: [ { values: item.values } ] } };
		});

		let head = this.props.editTable.getCheckedRows(PAGECODE.tableId);
		let grids = head.map((item) => {
			return {
				po_vmi: {
					rows: [ { values: item.data.values } ]
				}
			};
		});
		let data = { feegrid: feegrid, grids: grids, pagecode: PAGECODE.pagecode };
		ajax({
			url: URL.feedis,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						let heads = this.props.editTable.getCheckedRows(PAGECODE.tableId);
						let indexs = heads.map((item) => {
							return item.index;
						});
						let resdata = data.headGrid.po_vmi.rows;
						let updatas = [];
						for (let i = 0; i < heads.length; i++) {
							let updata = {};
							updata.index = indexs[i];
							updata.data = resdata[i];
							updatas.push(updata);
						}
						this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatas);
						let pks = data.headGrid.po_vmi.rows;
						pks.map((item) => {
							let feerows = this.feeItems[item.values.pk_stockps_b.value];
							if (
								feerows.po_vmi_fee.rows.length !=
								data.bodyMap[item.values.pk_stockps_b.value].po_vmi_fee.rows.length
							) {
								let ros = feerows.po_vmi_fee.rows;
								for (let i = 0; i < ros.length; i++) {
									if (data.bodyMap[item.values.pk_stockps_b.value].po_vmi_fee.rows[i]) {
										ros[i] = data.bodyMap[item.values.pk_stockps_b.value].po_vmi_fee.rows[i];
									}
								}
							} else {
								this.feeItems[item.values.pk_stockps_b.value] =
									data.bodyMap[item.values.pk_stockps_b.value];
							}
						});
						let headrows = this.props.editTable.getClickRowIndex(PAGECODE.tableId);
						if (!headrows) {
							headrows = {};
							headrows.record = this.props.editTable.getAllRows(PAGECODE.tableId)[0];
							headrows.index = 0;
						}
						this.props.editTable.setTableData(
							PAGECODE.childTableId,
							this.feeItems[headrows.record.values.pk_stockps_b.value].po_vmi_fee
						);
						if (this.bfee == '1') {
							this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
						} else {
							this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
						}
						this.close();
						this.onSelect();
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
					}
				}
			}
		});
	};

	//切换页面状态时按钮显示隐藏的问题
	toggleShow = () => {};

	onSelect = () => {
		let butArray = [ LIST_BUTTON.print, LIST_BUTTON.linkQuery, LIST_BUTTON.feeDistribute, LIST_BUTTON.est ];
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
		const { editTable, button, search, socket } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { NCModal, NCButton } = base;
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
						onAfterEvent: afterEvent.bind(this),
						onBeforeEvent: headbeforeEvent.bind(this),
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelect.bind(this),
						isAddRow: false,
						onRowClick: rowClick.bind(this),
						height: '240px'
					})}
				</div>

				<div className="nc-bill-table-area">
					<div className="child-table-header">
						<span className="child-table-header-title">{getLangByResId(this, '4004VMIEST-000007')}</span>
						<span>{getLangByResId(this, '4004VMIEST-000008')}</span>
					</div>
					{createEditTable(PAGECODE.childTableId, {
						showCheck: false,
						showIndex: true,
						onAfterEvent: childAfterEvent.bind(this),
						onBeforeEvent: bodybeforeEvent.bind(this),
						isAddRow: false,
						// height: '160px',
						adaptionHeight: true
					})}
				</div>
				<div>
					<NCModal show={this.state.showModal} onHide={this.close} size="xlg" fieldid="vimestlistmodal">
						<NCModal.Header>
							<NCModal.Title>{getLangByResId(this, '4004VMIEST-000004')}</NCModal.Title>
						</NCModal.Header>
						<NCModal.Body className="flex-container">
							{createEditTable(PAGECODE.modaltablecode, {
								showIndex: true,
								adaptionHeight: true,
								onAfterEvent: afterEvent.bind(this)
							})}
						</NCModal.Body>
						<NCModal.Footer>
							<NCButton
								fieldid="vmiestlistsure_btn"
								className="button-primary"
								onClick={this.sureFeeDis.bind(this)}
							>
								{getLangByResId(this, '4004VMIEST-000005')}
							</NCButton>
							<NCButton fieldid="vmiestlistclose_btn" onClick={this.close}>
								{getLangByResId(this, '4004VMIEST-000006')}
							</NCButton>
						</NCModal.Footer>
					</NCModal>
				</div>
			</div>
		);
	}
}

VMIEstList = createPage(
	{
		// initTemplate: initTemplate
	}
)(VMIEstList);

ReactDOM.render(<VMIEstList />, document.querySelector('#app'));
