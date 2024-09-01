/*
 * @Author: zhaochyu 
 * @PageInfo:采购订单生成期初暂估单
 * @Date: 2018-08-01 09:27:52 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:26:15
 */

import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick } from './btnClick';
import afterEvent from '../list/afterEvents/afterEvent';
import { PAGECODE, AREA, TRANSFER, URL, FIELD, DATASOURCE, UISTATE, SEARCH_FIELD } from '../constance';
import { clearTransferCache } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCToggleViewBtn, NCBackBtn, NCDiv } = base;
class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		this.state = {
			toggleViewStatus: false
		};
		// this.state = { templetid: null }; //模板ID
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004initialest' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			AREA.cardFormArea,
			AREA.cardTableArea,
			[],
			FIELD.pk_order,
			FIELD.pk_order_b
		);
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, SEARCH_FIELD.pk_psfinanceorg);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			afterEvent.call(this, SEARCH_FIELD.pk_psfinanceorg, arr);
		}
	};
	// react：界面渲染函数
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		let selectedShow = transferTable.getSelectedListDisplay(PAGECODE.cardhead);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(URL.listurl, { pagecode: PAGECODE.listpagecode });
								}}
							/>
							<div className="header-title-search-area">
								<h2 className="title-search-detail">{getLangByResId(this, '4004INITIALEST-000036')}</h2>
								{/* 国际化处理： 选择采购订单*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: searchBtnClick.bind(this)
								})}
							</div>
							{/* <NCSetColBtn
                onClick={() => {
                  this.handleClick;
                }}
              /> */}
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[TRANSFER.view]) {
										initTemplate.call(this, TRANSFER.view); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(AREA.searchArea, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: afterEvent.bind(this),
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
						dataSource: DATASOURCE.transferdataSource,
						headTableId: AREA.cardFormArea, //表格组件id
						bodyTableId: AREA.cardTableArea, //子表模板id
						fullTableId: TRANSFER.view,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004INITIALEST-000035'), //转单按钮显示文字/* 国际化处理： 生成期初暂估单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							clearTransferCache(this.props, DATASOURCE.transferdataSource);
							this.props.pushTo(URL.cardurl, {
								status: UISTATE.transfer,
								pagecode: PAGECODE.cardpagecode
							});
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER.view]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(AREA.cardFormArea);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						},
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardpagecode,
		headcode: PAGECODE.cardhead,
		bodycode: {
			[PAGECODE.cardbody]: 'cardTable' //此处发生变化了，需要传一个对象
		}
	}
})(TransferTable);
//ReactDOM.render(<TransferTable />, document.querySelector("#app"));
export default TransferTable;
