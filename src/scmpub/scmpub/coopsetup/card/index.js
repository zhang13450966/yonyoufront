/*
 * @Author: yechd5 
 * @PageInfo: 协同设置卡片界面
 * @Date: 2018-05-24 10:13:54 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-11 16:20:38
 */
import React, { Component } from 'react';
import { createPage, ajax, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { afterEvent, beforeEvent } from './events';
import { buttonClick } from './btnClicks';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { COOPSETUP_CONST } from '../const';
import buttonController from './viewController/buttonController';
const { NCTabs, NCAffix, NCDiv } = base;
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import pageInfoClick from './btnClicks/pageInfoClick';
import { updateCacheData } from '../../../scmpub/pub/cache/cacheDataManager';

const NCTabPane = NCTabs.NCTabPane;

class CoopSetupCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(COOPSETUP_CONST.FORMID);
		props.use.editTable(COOPSETUP_CONST.CARD_TABLEID1);
		props.use.editTable(COOPSETUP_CONST.CARD_TABLEID2);
		props.use.editTable(COOPSETUP_CONST.CARD_TABLEID3);
		this.props = props;
		this.state = {
			// 是否显示返回按钮
			showReturnBtn: true,
			json: {},
			inlt: null
		};
		initLang(this, [ '4001coopsetup' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		let status = this.props.getUrlParam('status');
		buttonController.call(this, this.props, status);
		// 加载卡片数据
		//this.getData();
	}

	// 编辑态关闭浏览器提示
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(COOPSETUP_CONST.FORMID);
			let srcoperator = this.props.getUrlParam('srcoperator');
			if (status == 'edit' || status == 'add' || (srcoperator && srcoperator != 'listAdd')) {
				return getLangByResId(this, '4001COOPSETUP-000012'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	// 加载卡片态数据
	getData = () => {
		let status = this.props.getUrlParam('status');
		if (status == COOPSETUP_CONST.BROWSE) {
			let pk_coopsetup = this.props.getUrlParam('id');
			let data = { pk: pk_coopsetup, pageId: COOPSETUP_CONST.PAGEID_CARD };
			// 主键不存在，则无需查card的数据，也无需清空界面
			if (undefined == pk_coopsetup) {
				return;
			}
			ajax({
				url: COOPSETUP_CONST.QUERYCARDURL,
				data: data,
				success: (res) => {
					// 设置表头数据
					if (res.data.head) {
						this.props.form.setAllFormValue({ head: res.data.head.head });
					}
					// 设置表体两个页签数据
					if (res.data && res.data.salepurchasecoop) {
						let rows =
							res.data.salepurchasecoop.salepurchasecoop &&
							res.data.salepurchasecoop.salepurchasecoop.rows;
						let meta = this.props.meta.getMeta();
						for (let i = 0; i < rows.length; i++) {
							let datatype = rows[i].values.datatype.value;
							let reftype = rows[i].values.reftype.value;
							if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
								let item = meta[COOPSETUP_CONST.CARD_TABLEID1].items.find(
									(item) => item.attrcode == 'vvalueref'
								);
								item.datatype = '204';
								item.itemtype = 'refer';
							}
						}
						this.props.meta.setMeta(meta, () => {
							// 向“购销协同”页签设置数据
							this.props.editTable.setTableData(
								COOPSETUP_CONST.CARD_TABLEID1,
								res.data.salepurchasecoop.salepurchasecoop
							);
						});
					} else {
						this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, { rows: [] });
					}
					if (res.data && res.data.boundcoop) {
						// 向“出入库协同”页签设置数据
						let rows = res.data.boundcoop.boundcoop && res.data.boundcoop.boundcoop.rows;
						let meta = this.props.meta.getMeta();
						for (let i = 0; i < rows.length; i++) {
							let datatype = rows[i].values.datatype.value;
							let reftype = rows[i].values.reftype.value;
							if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
								let item = meta[COOPSETUP_CONST.CARD_TABLEID2].items.find(
									(item) => item.attrcode == 'vvalueref'
								);
								item.datatype = '204';
								item.itemtype = 'refer';
							}
						}
						this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.boundcoop);
					} else {
						this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, { rows: [] });
					}
					if (res.data && res.data.invoicecoop) {
						// 向“发票协同”页签设置数据
						let rows = res.data.invoicecoop.invoicecoop && res.data.invoicecoop.invoicecoop.rows;
						let meta = this.props.meta.getMeta();
						for (let i = 0; i < rows.length; i++) {
							let datatype = rows[i].values.datatype.value;
							let reftype = rows[i].values.reftype.value;
							if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
								let item = meta[COOPSETUP_CONST.CARD_TABLEID3].items.find(
									(item) => item.attrcode == 'vvalueref'
								);
								item.datatype = '204';
								item.itemtype = 'refer';
							}
						}
						this.props.editTable.setTableData(
							COOPSETUP_CONST.CARD_TABLEID3,
							res.data.invoicecoop.invoicecoop
						);
					} else {
						this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, { rows: [] });
					}
					updateCacheData(this.props, COOPSETUP_CONST.pk_coopsetup, pk_coopsetup, res.data, COOPSETUP_CONST.FORMID, COOPSETUP_CONST.dataSource);
				}
			});
		} else if (status == COOPSETUP_CONST.ADD) {
			// 清空表头和表体页签的行
			this.props.form.setFormStatus(COOPSETUP_CONST.FORMID, COOPSETUP_CONST.EDIT);
			this.props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);

			this.props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID1, COOPSETUP_CONST.EDIT);
			this.props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID2, COOPSETUP_CONST.EDIT);
			this.props.editTable.setStatus(COOPSETUP_CONST.CARD_TABLEID3, COOPSETUP_CONST.EDIT);
		} else if (status == COOPSETUP_CONST.EDIT) {
			let vbilltype_src = this.props.getUrlParam('vbilltype_src');
			let pk_coopsetup = this.props.getUrlParam('id');
			let data = {
				vbilltype_src: vbilltype_src,
				pk_coopsetup: pk_coopsetup,
				operation: COOPSETUP_CONST.EDIT
			};
			ajax({
				url: COOPSETUP_CONST.COPYANDEDITURL,
				data: data,
				success: (res) => {
					// 设置表头
					this.props.form.setAllFormValue({ head: res.data.head.head });
					// 向“购销协同”页签设置数据
					this.props.editTable.setTableData(
						COOPSETUP_CONST.CARD_TABLEID1,
						res.data.salepurchasecoop.coopsetbody
					);
					// 向“出入库协同”页签设置数据
					this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.coopsetbody);
					// 向“发票协同”页签设置数据
					this.props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, res.data.invoicecoop.coopsetbody);
				}
			});
		}
	};

	// 获取指定url参数值
	getPageParam = (id) => {
		let param = window.location.hash.split('&');
		param.shift();
		let result;
		param.find((item) => {
			if (item.indexOf(id) != -1) {
				result = item.split('=')[1];
			}
		});
		return result;
	};

	render() {
		const { editTable, form, cardPagination } = this.props;
		const { createForm } = form;
		const { createEditTable } = editTable;
		const { createCardPagination } = cardPagination;
		// 获取小应用里注册的按钮
		let buttons = this.props.button.getButtons();
		buttons.sort((a, b) => {
			return a.btnorder - b.btnorder;
		});

		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									initShowBackBtn: this.state.showReturnBtn,
									backBtnClick: buttonClick.bind(this, this.props, 'Back')
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: COOPSETUP_CONST.CARD_HEAD,
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									pkname: COOPSETUP_CONST.pk_coopsetup,
									dataSource: COOPSETUP_CONST.dataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>

					<div className="nc-bill-form-area">
						{createForm(COOPSETUP_CONST.FORMID, {
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						<NCTabs navtype="turn" contenttype="moveleft" defaultActiveKey="1" flex={true}>
							<NCTabPane tab={getLangByResId(this, '4001COOPSETUP-000013') /* 国际化处理： 购销协同*/} key="1">
								{createEditTable(COOPSETUP_CONST.CARD_TABLEID1, {
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									adaptionHeight: true,
									showIndex: true
								})}
							</NCTabPane>
							<NCTabPane tab={getLangByResId(this, '4001COOPSETUP-000014') /* 国际化处理： 出入库协同*/} key="2">
								{createEditTable(COOPSETUP_CONST.CARD_TABLEID2, {
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									adaptionHeight: true,
									showIndex: true
								})}
							</NCTabPane>
							<NCTabPane tab={getLangByResId(this, '4001COOPSETUP-000026') /* 国际化处理： 发票协同*/} key="3">
								{createEditTable(COOPSETUP_CONST.CARD_TABLEID3, {
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									adaptionHeight: true,
									showIndex: true
								})}
							</NCTabPane>
						</NCTabs>
					</div>
				</div>
			</div>
		);
	}
}

CoopSetupCard = createPage({
	billinfo: {
		billtype: 'extcard',
		pagecode: COOPSETUP_CONST.PAGEID_CARD,
		headcode: COOPSETUP_CONST.CARD_HEAD,
		bodycode: [ COOPSETUP_CONST.CARD_TABLEID1, COOPSETUP_CONST.CARD_TABLEID2, COOPSETUP_CONST.CARD_TABLEID3 ]
	},
	// Tab快捷键适配
	orderOfHotKey: [
		COOPSETUP_CONST.FORMID,
		COOPSETUP_CONST.CARD_TABLEID1,
		COOPSETUP_CONST.CARD_TABLEID2,
		COOPSETUP_CONST.CARD_TABLEID3
	]
})(CoopSetupCard);
// ReactDOM.render(<CoopSetupCard />, document.querySelector('#app'));
export default CoopSetupCard;
