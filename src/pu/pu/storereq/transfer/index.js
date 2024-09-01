import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';
const { NCToggleViewBtn, NCDiv } = base;
import { searchBtnClick } from './btnClick';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { STOREREQ_LIST, ATTRCODE } from '../siconst';
class TransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(STOREREQ_LIST.searchId);
		this.state = {
			pageId: '', //模板id
			searchVal: null, //查询条件缓存
			toggleViewStatus: false
		};
		initLang(this, [ '4004storereq' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			STOREREQ_LIST.formId,
			STOREREQ_LIST.tableId,
			[],
			STOREREQ_LIST.pk_mater_plan,
			STOREREQ_LIST.pk_mater_plan_b
		);
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(STOREREQ_LIST.searchId, ATTRCODE.pk_org);
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
			//项目组织
			multiCorpRefHandler(props, val, STOREREQ_LIST.searchId, [
				'pk_project',
				'pk_req_maker',
				'pk_req_dept',
				'hdef1',
				'hdef2',
				'hdef3',
				'hdef4',
				'hdef5',
				'hdef6',
				'hdef7',
				'hdef8',
				'hdef9',
				'hdef10',
				'hdef11',
				'hdef12',
				'hdef13',
				'hdef14',
				'hdef15',
				'hdef16',
				'hdef17',
				'hdef18',
				'hdef19',
				'hdef20',
				'bodyvos.bdef1',
				'bodyvos.bdef2',
				'bodyvos.bdef3',
				'bodyvos.bdef4',
				'bodyvos.bdef5',
				'bodyvos.bdef6',
				'bodyvos.bdef7',
				'bodyvos.bdef8',
				'bodyvos.bdef9',
				'bodyvos.bdef10',
				'bodyvos.bdef11',
				'bodyvos.bdef12',
				'bodyvos.bdef13',
				'bodyvos.bdef14',
				'bodyvos.bdef15',
				'bodyvos.bdef16',
				'bodyvos.bdef17',
				'bodyvos.bdef18',
				'bodyvos.bdef19',
				'bodyvos.bdef20'
			]);
		} else if (field == 'bodyvos.pk_stockorg') {
			//库存组织
			multiCorpRefHandler(props, val, STOREREQ_LIST.searchId, [
				'bodyvos.pk_supplier_v',
				'bodyvos.pk_material',
				'bodyvos.pk_material.pk_marbasclass'
			]);
		}
	}
	handleClick() {}
	// react：界面渲染函数
	render() {
		const { transferTable, search, modal, BillHeadInfo } = this.props;
		const { createModal } = modal;
		const { NCCreateSearch } = search;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createTransferTable } = transferTable;
		let selectedShow = transferTable.getSelectedListDisplay(STOREREQ_LIST.formId);

		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createBillHeadInfo({
									title: getLangByResId(this, '4004STOREREQ-000053') /* 国际化处理： 选择物资及服务需求单*/,
									backBtnClick: () =>
										this.props.pushTo(STOREREQ_LIST.listUrl, { pagecode: STOREREQ_LIST.listpageid })
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: STOREREQ_LIST.searchId,
									onButtonClick: searchBtnClick.bind(this, false)
								})}
							</div>
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[STOREREQ_LIST.VIEW]) {
										initTemplate.call(this, this.props);
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(
								STOREREQ_LIST.searchId,
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
						searchAreaCode: STOREREQ_LIST.searchId, // 用于缓存查询条件
						headTableId: STOREREQ_LIST.formId, //表格组件id
						bodyTableId: STOREREQ_LIST.tableId, //子表模板id
						fullTableId: STOREREQ_LIST.VIEW,
						dataSource: STOREREQ_LIST.transferDataSource,
						//点击加号展开，设置表格数据
						transferBtnText: getLangByResId(this, '4004STOREREQ-000054'), //转单按钮显示文字/* 国际化处理： 生成物资需求申请单*/
						containerSelector: '#transferList',
						onTransferBtnClick: (ids) => {
							this.props.pushTo(STOREREQ_LIST.cardUrl, {
								type: STOREREQ_LIST.transfer,
								status: STOREREQ_LIST.add,
								pageid: this.state.pageId,
								pagecode: STOREREQ_LIST.cardpageid
							});
						},
						onChangeViewClick: () => {
							if (!this.props.meta.getMeta()[STOREREQ_LIST.VIEW]) {
								initTemplate.call(this, this.props);
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}

TransferTable = createPage({})(TransferTable);
export default TransferTable;
