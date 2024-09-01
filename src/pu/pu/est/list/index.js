/*
 * @Author: zhangshqb
 * @PageInfo: 采购暂估处理
 * @Date: 2018-04-26 11:27:47
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-15 17:53:20
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick, searchBtnClick, setChildTableData, rowClick } from './btnClicks';
import { PAGECODE, URL, LIST_BUTTON, FIELD } from '../constance';
import { afterEvent, childAfterEvent } from './afterEvents';
import { bodybeforeEvent, headbeforeEvent } from './beforeEvents';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDataByIndex } from '../../pub/utils/getDataByIndex';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { BillTrack } = high;
const { NCDiv } = base;
import './index.less';

class EstList extends Component {
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
			pk: '',
			showCompleted: false,
			allNum: '',
			successNum: '',
			failNum: ''
		};
		this.bqueryandest;
		this.errvos;
		this.message;
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.po_stockps_fee_mustCol = []; // 费用明细必输项字段
		this.map = new Map(); // 费用明细字段与字段label的映射关系
		initLang(this, [ '4004est' ], 'pu', initTemplate.bind(this, this.props));
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
		let fee = this.props.editTable.getAllRows(PAGECODE.modaltablecode, true);
		let isFeeDis = false;
		for (let i = 0; i < fee.length; i++) {
			if (fee[i].values.pk_supplier.value && fee[i].values.nestomny.value) {
				isFeeDis = true;
				break;
			}
		}
		if (!isFeeDis) {
			this.close();
			return;
		}
		let feegrid = fee.map((item) => {
			return { po_stockps_fee: { rows: [ { values: item.values } ] } };
		});

		let head = this.props.editTable.getCheckedRows(PAGECODE.tableId);
		let grids = head.map((item) => {
			return {
				po_stockps: {
					rows: [ { values: item.data.values } ]
				}
			};
		});
		let onebillselectpks = {};
		head.map((item) => {
			if (!item.data.values.onebillselect) {
				item.data.values.onebillselect = {};
				item.data.values.onebillselect.value = false;
				item.data.values.onebillselect.display = false;
			}

			onebillselectpks[item.data.values.pk_stockps_b.value] = item.data.values.onebillselect.value;
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
						let resdata = data.headGrid.po_stockps.rows;
						let updatas = [];
						for (let i = 0; i < heads.length; i++) {
							let updata = {};
							updata.index = indexs[i];
							updata.data = resdata[i];
							updatas.push(updata);
						}
						for (let i = 0; i < updatas.length; i++) {
							if (!updatas[i].data.values.onebillselect) {
								updatas[i].data.values.onebillselect = {};
							}
							updatas[i].data.values.onebillselect.value =
								onebillselectpks[updatas[i].data.values.pk_stockps_b.value];
							updatas[i].data.values.onebillselect.display =
								onebillselectpks[updatas[i].data.values.pk_stockps_b.value];
						}
						this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatas);
						let pks = data.headGrid.po_stockps.rows;
						pks.map((item) => {
							let feerows = this.feeItems[item.values.pk_stockps_b.value];
							if (
								feerows.po_stockps_fee.rows.length !=
								data.bodyMap[item.values.pk_stockps_b.value].po_stockps_fee.rows.length
							) {
								let ros = feerows.po_stockps_fee.rows;
								for (let i = 0; i < ros.length; i++) {
									if (data.bodyMap[item.values.pk_stockps_b.value].po_stockps_fee.rows[i]) {
										ros[i] = data.bodyMap[item.values.pk_stockps_b.value].po_stockps_fee.rows[i];
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
							this.feeItems[headrows.record.values.pk_stockps_b.value].po_stockps_fee
						);
						if (this.bfee == '1') {
							this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
						} else {
							this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
						}
						// this.props.cardTable.setStatus(PAGECODE.tableId, 'edit');
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

	onReturn = () => {
		this.setState({
			showCompleted: false,
			allNum: '',
			successNum: '',
			failNum: ''
		});
	};

	onAfterEvent(field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [
				FIELD.pk_supplier_v,
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
		} else if (field == FIELD.festtype) {
			//费用暂估的话，查询并同时暂估不可用
			if (val == 1) {
				this.props.search.setSearchValByField(PAGECODE.searchId, FIELD.queryandest, {
					display: '否',
					value: false
				});
				this.props.search.setDisabledByField(PAGECODE.searchId, FIELD.queryandest, true);
			} else {
				this.props.search.setDisabledByField(PAGECODE.searchId, FIELD.queryandest, false);
			}
		}
	}

	onSelectAll(props, moduleId, status, length) {
		let butArray = [
			LIST_BUTTON.print,
			LIST_BUTTON.linkquery,
			LIST_BUTTON.hqhp,
			LIST_BUTTON.feeDistribute,
			LIST_BUTTON.est
		];
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
					index: item.index, // 序号修正
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

	onViewErr = () => {
		this.props.editTable.setTableData(PAGECODE.tableId, this.errvos);
		this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
		this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
		if (this.feeItem && this.feeItem.po_stockps_fee) {
			this.props.editTable.setTableData(
				PAGECODE.childTableId,
				JSON.parse(JSON.stringify(this.feeItem.po_stockps_fee))
			);
		} else {
			this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
		}

		this.props.editTable.setStatus(PAGECODE.childTableId, 'edit');
		if (this.message) {
			showWarningInfo(null, this.message);
		}
	};

	onSelect(props, moduleId, record, index, status) {
		let butArray = [
			LIST_BUTTON.print,
			LIST_BUTTON.linkquery,
			LIST_BUTTON.hqhp,
			LIST_BUTTON.feeDistribute,
			LIST_BUTTON.est
		];
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
				// if (isallcheck) {
				// let alldatas = props.editTable.getAllRows(PAGECODE.tableId);
				// let datas = [];
				// for (let i; i < alldatas.length; i++) {
				// 	if (i in indexs) {
				// 		datas.push(alldatas[i]);
				// 	}
				// }
				let datas = getDataByIndex(props, PAGECODE.tableId, indexs);
				let flag = true;
				datas.map((item, index) => {
					if (flag && item.selected) {
						flag = true;
					} else {
						flag = false;
					}
				});
				// let datas = props.cardTable.getRowsByIndexs(PAGECODE.tableId, indexs);
				let updatedatas = datas.map((item, index) => {
					if (!item.values.onebillselect) {
						item.values.onebillselect = {};
					}
					if (flag) {
						item.values.onebillselect.display = true;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = true;
					} else {
						item.values.onebillselect.display = false;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = false;
					}

					return {
						// index: item.key,
						index: indexs[index],
						data: item
					};
				});
				this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updatedatas);
				this.forceUpdate();
				// }
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
				let flag = true;
				datas.map((item, index) => {
					if (flag && item.selected) {
						flag = true;
					} else {
						flag = false;
					}
				});

				let updates = datas.map((item, index) => {
					if (!item.values.onebillselect) {
						item.values.onebillselect = {};
					}
					if (flag) {
						item.values.onebillselect.display = true;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = true;
					} else {
						item.values.onebillselect.display = false;
						item.values.onebillselect.isEdit = false;
						item.values.onebillselect.value = false;
					}

					return {
						// index: item.key,
						index: indexs[index],
						data: item
					};
				});
				this.props.editTable.updateDataByIndexs(PAGECODE.tableId, updates);
				this.forceUpdate();
			}
		}
	}

	socketMesg = (props, mesg) => {
		if (mesg.error) {
			//出错时，控制业务按钮显示
		} else {
			//成功时，显示原来的浏览态按钮
		}
	};

	render() {
		const { editTable, button, search, socket } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { NCModal, NCButton } = base;
		const { Header, Body, Footer, Title } = NCModal;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					billpkname: 'pk_stockps_b',
					tableType: 'editTable', // 增加表格类型 editTable / insertTable
					// billtype : '',   // 由于EditTable 节点可能不涉及追溯或者流程，可不传
					onMessage: this.socketMesg
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
						showIndex: true,
						onAfterEvent: afterEvent.bind(this),
						showCheck: true,
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelectAll.bind(this),
						isAddRow: false,
						onRowClick: rowClick.bind(this),
						onBeforeEvent: headbeforeEvent.bind(this)
						// height: '240px'
					})}
				</div>
				<div className="nc-bill-table-area">
					<div className="child-table-header">
						<span className="child-table-header-title">{getLangByResId(this, '4004EST-000015')}</span>
						<span>{getLangByResId(this, '4004EST-000016')}</span>
					</div>
					{createEditTable(PAGECODE.childTableId, {
						showIndex: true,
						showCheck: false,
						onAfterEvent: childAfterEvent.bind(this),
						onBeforeEvent: bodybeforeEvent.bind(this),
						isAddRow: false,
						// height: '160px',
						adaptionHeight: true
					})}
				</div>
				<div>
					{
						<NCModal
							show={this.state.showCompleted}
							onHide={this.onReturn}
							className="calc-result-modal"
							size="sm"
							fieldid="estlistmodal"
						>
							<Header closeButton={true}>
								<Title>{getLangByResId(this, '4004EST-000007')}</Title>
								{/* 国际化处理： 暂估处理*/}
							</Header>
							<Body>
								<i className="iconfont icon-wancheng" />
								<div className="pu-est-calc-result-modal">
									<div className="title">
										{/* {title} */}
										{getLangByResId(this, '4004EST-000008')}
									</div>
									{/* 国际化处理： 完成*/}
									<div>
										{getLangByResId(this, '4004EST-000009')}：{this.state.allNum}{' '}
										{getLangByResId(this, '4004EST-000010')}
									</div>
									{/* 国际化处理： 查询结果共,条*/}
									<div>
										{getLangByResId(this, '4004EST-000011')}：{this.state.successNum}{' '}
										{getLangByResId(this, '4004EST-000010')}
									</div>
									{/* 国际化处理： 暂估成功条数共,条*/}
									<div>
										{getLangByResId(this, '4004EST-000012')}：{' '}
										<span className="fail">{this.state.failNum}</span>{' '}
										{getLangByResId(this, '4004EST-000010')}
										{/* 国际化处理： 计算失败条数,条*/}
										{this.state.failNum > 0 && (
											<a
												href="#"
												style={{ marginLeft: 8 }}
												onClick={() => {
													this.onReturn();
													this.onViewErr();
													// this.props.lookCallBack();
												}}
											>
												{getLangByResId(this, '4004EST-000013')}
												{/* 国际化处理： 查看*/}
											</a>
										)}
									</div>
								</div>
							</Body>
							<Footer>
								<NCButton fieldid="estreturn_btn" onClick={this.onReturn}>
									{getLangByResId(this, '4004EST-000014')}
								</NCButton>
								{/* 国际化处理：返回*/}
							</Footer>
						</NCModal>
					}
				</div>
				<div>
					<NCModal show={this.state.showModal} onHide={this.close} size="xlg">
						<NCModal.Header>
							<NCModal.Title>
								{getLangByResId(this, '4004EST-000004')} {/* 国际化处理： 费用分摊*/}
							</NCModal.Title>
						</NCModal.Header>
						<NCModal.Body className="flex-container">
							{createEditTable(PAGECODE.modaltablecode, {
								showIndex: true,
								adaptionHeight: true,
								onAfterEvent: afterEvent.bind(this)
							})}
						</NCModal.Body>
						<NCModal.Footer>
							{/* {NCButton('sure', {
                                name: '确定分摊',
                                className: 'btn',
                                onButtonClick: this.sureFeeDis.bind(this),
                                buttonColor: 'main-button'
                            })} */}
							<NCButton
								fieldid="estsure_btn"
								className="button-primary"
								onClick={this.sureFeeDis.bind(this)}
							>
								{getLangByResId(this, '4004EST-000005') /* 国际化处理： 确定分摊*/}
							</NCButton>
							<NCButton fieldid="estclose_btn" onClick={this.close}>
								{getLangByResId(this, '4004EST-000006')}
							</NCButton>
							{/* {NCButton('cancel', {
                                name: '取消',
                                className: 'btn',
                                onButtonClick: this.close,
                                buttonColor: 'second - button'
                            })} */}
						</NCModal.Footer>
					</NCModal>
				</div>
			</div>
		);
	}
}

EstList = createPage(
	{
		// initTemplate: initTemplate
	}
)(EstList);

ReactDOM.render(<EstList />, document.querySelector('#app'));
