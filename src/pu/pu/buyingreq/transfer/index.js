import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import { searchBtnClick } from './btnClick';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYINGREQ_LIST, ATTRCODE } from '../siconst';
class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(BUYINGREQ_LIST.searchId);
		props.use.form(BUYINGREQ_LIST.formId);
		this.state = {
			pageId: '', //模板id
			searchVal: null, //查询条件缓存
			toggleViewStatus: false
		};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybill' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			BUYINGREQ_LIST.formId,
			BUYINGREQ_LIST.tableId,
			[],
			BUYINGREQ_LIST.pk_storereq,
			BUYINGREQ_LIST.pk_storereq_b
		);
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(BUYINGREQ_LIST.searchId, ATTRCODE.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, ATTRCODE.pk_org, arr);
		}
	};
	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [
				'pk_storereq_b.pk_srcmaterial',
				'pk_storereq_b.pk_srcmaterial.pk_marbasclass',
				'pk_storereq_b.pk_appdept',
				'pk_storereq_b.pk_apppsn',
				'pk_storereq_b.pk_reqstordoc',
				'billmaker',
				'pk_apppsnh',
				'pk_appdepth',
				'approver'
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
		let selectedShow = transferTable.getSelectedListDisplay(BUYINGREQ_LIST.formId);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(BUYINGREQ_LIST.listUrl, { pagecode: BUYINGREQ_LIST.listpageid });
								}}
							/>
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: getLangByResId(this, '4004PRAYBILL-000047'),
									initShowBackBtn: false
								})}
								{/*国际化处理： 选择物资需求申请单*/}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUYINGREQ_LIST.searchId,
									onButtonClick: searchBtnClick.bind(this, false)
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
									if (!this.props.meta.getMeta()[BUYINGREQ_LIST.VIEW]) {
										initTemplate.call(this, this.props);
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								BUYINGREQ_LIST.searchId,
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
						searchAreaCode: BUYINGREQ_LIST.searchId, // 用于缓存查询条件
						headTableId: BUYINGREQ_LIST.formId, //表格组件id
						bodyTableId: BUYINGREQ_LIST.tableId, //子表模板id
						fullTableId: BUYINGREQ_LIST.VIEW,
						dataSource: BUYINGREQ_LIST.transferDataSource,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004PRAYBILL-000046'), //转单按钮显示文字/* 国际化处理： 生成请购单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							this.props.pushTo(BUYINGREQ_LIST.cardUrl, {
								type: BUYINGREQ_LIST.transfer,
								status: BUYINGREQ_LIST.add,
								pageid: this.state.pageId,
								pagecode: BUYINGREQ_LIST.cardpageid
							});
						},
						onChangeViewClick: () => {
							if (!this.props.meta.getMeta()[BUYINGREQ_LIST.VIEW]) {
								initTemplate.call(this, this.props);
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
export default TransferTable;
//ReactDOM.render(<TransferTable />, document.querySelector('#app'));
