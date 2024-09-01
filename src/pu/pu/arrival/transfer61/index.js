import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick } from './btnClick';
import { PAGECODE, AREA, COMMON, URL, BUTTONAREA } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../scmpub/scmpub/pub/tool/messageUtil';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
const { NCMessage } = base;

class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		this.state = {
			ntotalnum: 0,
			templetid: '', //拉单模板ID
			toggleViewStatus: false
		};
		this.searchVal;
		// initTemplate.call(this);
		initLang(this, [ '4004arrival' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(AREA.head, AREA.body, [], 'pk_order', 'pk_order_b');
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, 'pk_stockorg');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent('pk_stockorg', arr);
		}
	};

	onAfterEvent(field, val) {
		if (field == 'pk_stockorg') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [
				'pk_supplier',
				'pk_payterm',
				'pk_invcsupllier',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.pk_material.pk_marbasclass',
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
				'pk_order_b.cprojectid'
			]);
		} else if (field == 'pk_org') {
			multiCorpRefHandler(this.props, val, AREA.searchArea, [ 'cemployeeid', 'pk_dept' ]);
		}
	}

	// calTotal = (flag, record, bodys) => {
	// 	let ntotalnum = this.state.ntotalnum;
	// 	if (flag == true) {
	// 		if (bodys) {
	// 			bodys.forEach((element) => {
	// 				ntotalnum = sum(ntotalnum, element.ncanarrivenum.value);
	// 			});
	// 		} else {
	// 			ntotalnum = sum(ntotalnum, record.ncanarrivenum.value);
	// 		}
	// 		//  += (record.ncanarrivenum || {}).value || 0;
	// 	} else {
	// 		if (bodys) {
	// 			bodys.forEach((element) => {
	// 				ntotalnum = sum(ntotalnum, -element.ncanarrivenum.value);
	// 			});
	// 		} else {
	// 			ntotalnum = sum(ntotalnum, -record.ncanarrivenum.value);
	// 		}
	// 		// ntotalnum -= (record.ncanarrivenum || {}).value || 0;
	// 	}
	// 	this.setState({
	// 		ntotalnum: ntotalnum
	// 	});
	// };

	refreash() {
		let data = this.searchVal;
		if (data == null || data == 'null') {
			return;
		}
		let _this = this;
		ajax({
			url: URL.querySubcont,
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

	// react：界面渲染函数
	render() {
		const { transferTable, button, search } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		let totalstr = `${getLangByResId(this, '4004ARRIVAL-000057')}：`; /* 国际化处理： 本次收货主数量*/
		const { createTransferTable, createTransferList, getTransformFormDisplay } = transferTable;
		let selectedShow = transferTable.getSelectedListDisplay(AREA.head);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{/* <NCBackBtn
								onClick={() => {
									this.props.pushTo(URL.list, { PAGECODE: PAGECODE.head });
								}}
							/> */}
							{createCardTitle(this, {
								title: getLangByResId(this, '4004ARRIVAL-000054') /*国际化处理： 选择订单*/,
								backBtnClick: () => {
									this.props.pushTo(URL.list, { pagecode: PAGECODE.head });
								}
							})}
							{/* {getLangByResId(this, '4004ARRIVAL-000054')} */}
							{/* <div className="header-title-search-area">
								<h2 className="title-search-detail">
								</h2>
							</div> */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUTTONAREA.listhead,
									onButtonClick: this.refreash.bind(this)
								})}
								{/* <NCSetColBtn
									onClick={() => {
										this.handleClick;
									}}
								/> */}
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
							{NCCreateSearch(AREA.searchArea, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.onAfterEvent.bind(this),
								renderCompleteEvent: this.renderCompleteEvent,
								statusChangeEvent: this.renderCompleteEvent
							})
							//模块id
							}
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
							this.props.pushTo(URL.card, { type: 'arrivaltransfer61', pagecode: PAGECODE.card });
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
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[AREA.transferview]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.head);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						},
						dataSource: COMMON.arrivalRef61CacheKey
					})}
				</div>
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
