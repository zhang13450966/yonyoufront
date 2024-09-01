import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick } from './btnClick';
import { AREA, COMMON, URL, BUTTONAREA, PAGECODE } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
//import ScanCode from '../../../../uap/msgcenter/message/scanCodeView';
import { showRefreshInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { createCardTitle, createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

const { NCToggleViewBtn, NCBackBtn, NCDiv, NCFormControl } = base;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		this.state = {
			ntotalnum: 0,
			templetid: '', //拉单模板ID
			isreceive: false,
			scanValue: '',
			toggleViewStatus: false
		};
		this.searchVal;
		this.appc;
		// initTemplate.call(this);
		initLang(this, [ '4004arrival' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		// this.props.transferTable.setTransferTableValue(AREA.head, AREA.body, [], 'pk_order', 'pk_order_b');
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, 'pk_order_b.pk_arrvstoorg');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent('pk_order_b.pk_arrvstoorg', arr);
		}
	};

	onAfterEvent(field, val) {
		if (field == 'pk_order_b.pk_arrvstoorg') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [
				'pk_supplier',
				'pk_payterm',
				'pk_invcsupllier',
				'pk_recvcustomer',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.casscustid',
				'pk_order_b.pk_material',
				'pk_order_b.pk_recvstordoc',
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
				'pk_order_b.vbdef1',
				'pk_order_b.vbdef2',
				'pk_order_b.vbdef3',
				'pk_order_b.vbdef4',
				'pk_order_b.vbdef5',
				'pk_order_b.vbdef6',
				'pk_order_b.vbdef7',
				'pk_order_b.vbdef8',
				'pk_order_b.vbdef9',
				'pk_order_b.vbdef10',
				'pk_order_b.vbdef11',
				'pk_order_b.vbdef12',
				'pk_order_b.vbdef13',
				'pk_order_b.vbdef14',
				'pk_order_b.vbdef15',
				'pk_order_b.vbdef16',
				'pk_order_b.vbdef17',
				'pk_order_b.vbdef18',
				'pk_order_b.vbdef19',
				'pk_order_b.vbdef20',
				'pk_order_b.vfree1',
				'pk_order_b.vfree2',
				'pk_order_b.vfree3',
				'pk_order_b.vfree4',
				'pk_order_b.vfree5',
				'pk_order_b.vfree6',
				'pk_order_b.vfree7',
				'pk_order_b.vfree8',
				'pk_order_b.vfree9',
				'pk_order_b.vfree10',
				'pk_order_b.pk_srcmaterial.pk_marbasclass',
				'pk_order_b.pk_recvstordoc',
				'pk_order_b.cprojectid'
			]);
		} else if (field == 'pk_org') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [ 'cemployeeid', 'pk_dept' ]);
		} else if (field == 'pk_order_b.pk_reqstoorg') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [ 'pk_order_b.pk_reqstordoc' ]);
		}
	}

	clickBtn(props, id, text, record, index) {
		switch (id) {
			//刷新
			case 'Refresh':
				this.refreash.call(this);
				break;
			//扫码
			case 'ScanTransfer':
				this.scanTransfer.call(this);
				break;
		}
	}
	// scanTransfer() {
	// 	this.props.modal.show('general', {
	// 		title: getLangByResId(this, '4004ARRIVAL-000065') /* 国际化处理： 扫码枪直接扫描*/,
	// 		size: 'lg',
	// 		noFooter: true,
	// 		content: <ScanCodeView props={this.props} scanCodeSearchMessage={this.scanCodeSearchMessage.bind(this)} />
	// 	});
	// }
	onScanTransferChange = (e) => {
		this.setState({ scanValue: e });
	};

	onScanTransfer = (e) => {
		let scanValue = this.state.scanValue;
		this.setState({ scanValue: '' });
		ajax({
			url: URL.scanTrans,
			data: scanValue,
			success: (res) => {
				if (res && res.data) {
					let datas = [];
					for (let i = 0; i < res.data.length; i++) {
						let insertData = {
							children: res.data[i].body.body.rows,
							values: res.data[i].head.head.rows[0].values
						};
						datas[i] = insertData;
					}

					this.props.transferTable.insertTransferTableValue(
						AREA.head,
						AREA.body,
						datas,
						'pk_order',
						'pk_order_b'
					);
					// this.props.transferTable.insertTransferTableValue
				}
			}
		});
	};
	// scanCodeSearchMessage = (value) => {
	// 	if (value == null || value == '') {
	// 		return;
	// 	}
	// 	//检查
	// 	scanBtnClick.call(this, value);
	// };
	refreash() {
		let data = this.searchVal;
		if (data == null || data == 'null') {
			return;
		}
		let _this = this;
		ajax({
			url: URL.queryOrder,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data) {
					_this.props.transferTable.setTransferTableValue(
						AREA.head,
						AREA.body,
						res.data,
						'pk_order',
						'pk_order_b'
					);
					// showQueryResultInfoForNoPage(res.data.length); /* 国际化处理： 查询成功*/
				} else {
					// showNoQueryResultInfo();
					_this.props.transferTable.setTransferTableValue(AREA.head, AREA.body, [], 'pk_order', 'pk_order_b');
				}
				showRefreshInfo();
			}
		});
	}

	getParam() {
		if (this.isreceive == 'Y') {
			return false;
		} else {
			return true;
		}
	}

	// react：界面渲染函数
	render() {
		const { transferTable, button, search, modal } = this.props;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
		const { createTransferTable, createTransferList, getTransformFormDisplay } = transferTable;
		let totalstr = `${getLangByResId(this, '4004ARRIVAL-000057')}：`; /* 国际化处理： 本次收货主数量*/
		let selectedShow = transferTable.getSelectedListDisplay(AREA.head);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{this.state.isreceive &&
								createCardTitle(this, {
									title: getLangByResId(this, '4004ARRIVAL-000054') /*国际化处理： 选择订单*/,
									backBtnClick: () => {
										this.props.pushTo(URL.list, { pagecode: PAGECODE.head });
									}
								})}
							{!this.state.isreceive &&
								createListTitle(this, {
									title: getLangByResId(this, '4004ARRIVAL-000054') /*国际化处理： 选择订单*/
								})}
							{/* {getLangByResId(this, '4004ARRIVAL-000054')} */}
							{/* <div className="header-title-search-area">
								<h2 className="title-search-detail">
								</h2>
							</div> */}
							<div className="header-button-area">
								{
									<NCFormControl
										className="search"
										value={this.state.scanValue}
										placeholder={getLangByResId(this, '4004ARRIVAL-000067') /* 国际化处理： 扫码拉单*/}
										onChange={this.onScanTransferChange}
										onSearch={this.onScanTransfer}
									/>
								}
								{this.props.button.createButtonApp({
									area: BUTTONAREA.listhead,
									onButtonClick: this.clickBtn.bind(this)
								})}
								<NCToggleViewBtn
									expand={this.state.toggleViewStatus}
									onClick={() => {
										if (!this.props.meta.getMeta()[AREA.transferview]) {
											initTemplate.call(this); //加载主子拉平模板
										}
										this.props.transferTable.changeViewType(AREA.head);
										this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
									}}
								/>
							</div>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								AREA.searchArea,
								{
									clickSearchBtn: searchBtnClick.bind(this),
									onAfterEvent: this.onAfterEvent.bind(this),
									renderCompleteEvent: this.renderCompleteEvent,
									statusChangeEvent: this.renderCompleteEvent
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
						searchAreaCode: AREA.searchArea,
						headTableId: AREA.head, //表格组件id
						bodyTableId: AREA.body, //子表模板id
						fullTableId: AREA.transferview, //主子拉平VO
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004ARRIVAL-000055'), //转单按钮显示文字/* 国际化处理： 生成到货单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, false);
							let isrece = this.state.isreceive;
							let appparam = 'N';
							if (isrece == true) {
								appparam = 'Y';
							}
							let type = this.props.getUrlParam('type');
							if (type == 'transfer21' || type == 'ref21') {
								this.props.pushTo(URL.card, {
									type: 'arrivaltransfer21',
									transferoid: queryInfo.oid,
									isreceive: appparam,
									pagecode: PAGECODE.card
								});
							} else {
								this.props.pushTo(URL.card, {
									type: 'arrivaltransfer21',
									transferoid: queryInfo.oid,
									billtype: '23',
									isreceive: appparam,
									srcappcode: this.appc,
									pagecode: PAGECODE.card
								});
							}
						},
						totalKey: [ 'ncanarrivenum' ],
						totalTitle: [ getLangByResId(this, '4004ARRIVAL-000057') ],
						// onCheckedChange: (flag, record, index, bodys) => {
						// 	//勾选的回调函数
						// 	// 计算下方合计
						// 	this.calTotal(flag, record, bodys);
						// },
						// onSelectedItemRemove: (record, bodys) => {
						// 	this.calTotal(false, record, bodys);
						// },
						// selectArea: () => {
						// 	return <span>{totalstr + this.state.ntotalnum}</span>;
						// },
						// onClearAll: () => {
						// 	this.setState({
						// 		ntotalnum: 0
						// 	});
						// },
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.transferview]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.head);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						},
						dataSource: COMMON.arrivalRef21CacheKey
					})}
				</div>
				{createModal('general')}
			</div>
		);
	}
}

TransferTable = createPage(
	{
		// initTemplate: initTemplate
	}
)(TransferTable);
// ReactDOM.render(<TransferTable />, document.querySelector('#app'));
export default TransferTable;
