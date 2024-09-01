import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import { searchBtnClick } from './btnClick';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { AREA, PK, URL, FIELD, PAGECODE, TRANSFER_TYPE, UISTATE, COMMON } from '../constance';
export default class Transfer55E6Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.search55E6);
		props.use.form(AREA.head55E6);
		this.state = {
			pageId: '', //模板id
			searchVal: null, //查询条件缓存
			toggleViewStatus: false
		};
		initLang(this, [ '4004puinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(AREA.head55E6, AREA.body55E6, [], PK.head55E6pk, PK.body55E6ok);
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.search55E6, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, FIELD.pk_org, arr);
		}
	};
	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, AREA.search55E6, [
				'pk_supplier',
				'pk_supplier_v',
				'cemployeeid',
				'cdeptvid',
				'cdeptid' //参照过滤字段取消业务单元
			]);
		}
	}
	handleClick() {}
	// react：界面渲染函数
	render() {
		const { transferTable, button, search, BillHeadInfo } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createTransferTable, createTransferList, getTransformFormDisplay } = transferTable;
		let selectedShow = transferTable.getSelectedListDisplay(AREA.head55E6);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(URL.list, { pagecode: PAGECODE.invoiceList });
								}}
							/>
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: getLangByResId(this, '4004PUINVOICE-000095'),
									initShowBackBtn: false
								})}
								{/*国际化处理： 选择工序委外加工费*/}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: AREA.search55E6,
									onButtonClick: searchBtnClick.bind(this, false)
								})}
							</div>

							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[AREA.view55E6]) {
										initTemplate.call(this, this.props);
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								AREA.search55E6,
								{
									clickSearchBtn: searchBtnClick.bind(this, true),
									onAfterEvent: this.afterEvent.bind(this, this.props),
									defaultConditionsNum: 9,
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
						totalKey: [], //合计字段----------------------------------
						searchAreaCode: AREA.search55E6, // 用于缓存查询条件
						headTableId: AREA.head55E6, //表格组件id
						bodyTableId: AREA.body55E6, //子表模板id
						fullTableId: AREA.view55E6,
						dataSource: COMMON.TransferCacheKey,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成请购单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							this.props.pushTo(URL.card, {
								type: TRANSFER_TYPE.transfer55E6to25,
								status: UISTATE.edit,
								pageid: this.state.pageId,
								pagecode: PAGECODE.invoiceCard
							});
						},
						onChangeViewClick: () => {
							if (!this.props.meta.getMeta()[AREA.view55E6]) {
								initTemplate.call(this, this.props);
							}
							this.props.transferTable.changeViewType(AREA.view55E6);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
			</div>
		);
	}
}

Transfer55E6Table = createPage({})(Transfer55E6Table);
//ReactDOM.render(<Transfer55E6Table />, document.querySelector('#app'));
