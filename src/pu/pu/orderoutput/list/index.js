/*
 * @Author: jiangfw 
 * @PageInfo: 输出列表界面
 * @Date: 2019-03-13 15:59:47 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-11 10:32:34
 */
import React, { Component } from 'react';
import { base, createPage, ajax, high, createPageIcon } from 'nc-lightapp-front';
import { AREA, BUTTON, BILLTYPE, URL, FIELD, COMMON, HEAD_VDEF, BODY_VBDEF } from '../constance/constance';
import { initTemplate } from './init';
import searchBtnClick from './btnClicks/searchBtnClick';
import pageInfoClick from './btnClicks/pageInfoClick';
import btnClickController from './viewController/btnClickController';
import { setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import buttonController from './viewController/buttonController';
import getDefArray from '../../pub/utils/getDefArray';
import setTableBodyData from './btnClicks/setTableBodyData';
// import 'src/scmpub/scmpub/pub/style/common.less';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { NCDiv } = base;
class OrderOutPut extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.list_query);
		this.state = {
			msgContent: ''
		};
		initLang(this, [ '4004orderoutput' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		this.props.button.setDisabled({
			[BUTTON.OutPut]: true,
			[BUTTON.Refresh]: true,
			[BUTTON.UnOutPut]: true
		});
		//查询外层表格数据
		// let listTable = {
		// 	pageInfo: {
		// 		pageIndex: 1,
		// 		pageSize: 100
		// 	},
		// 	rows: []
		// };
		// this.props.insertTable.setInsertTableValue(AREA.head, listTable);
	}

	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			let fields = new Array();
			fields = fields.concat([
				/**表头字段 */
				FIELD.pk_supplier_v, //加工商
				FIELD.cemployeeid, //业务员
				FIELD.pk_dept, //采购部门
				/**表体字段 */
				FIELD.pk_srcmaterial, //物料最新版本
				FIELD.pk_marbasclass //物料基本分类
			]);
			// 表头自定义项
			fields = fields.concat(HEAD_VDEF);
			// 表体自定义项
			let body_vdef = getDefArray('pk_order_b', BODY_VBDEF);
			fields = fields.concat(body_vdef);

			multiCorpRefHandler(props, val, AREA.list_query, fields);
		}
	}

	renderCompleteEvent = () => {
		// transtypeUtils.setQueryDefaultValue.call(this, this.props, AREA.list_query, FIELD.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(AREA.list_query, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.pk_org, arr);
		}
	};

	//界面渲染函数
	render() {
		const { insertTable, search, modal } = this.props;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
		const { createInsertTable } = insertTable;

		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: AREA.head,
							onButtonClick: btnClickController.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>

				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.list_query, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createInsertTable({
						headTableId: AREA.head, //表头
						bodyTableId: AREA.body, //表体
						comType: 'hasCheckBox', //嵌套表格类型。'normal':普通，不带复选框。hasCheckBox:只有外层表格带复选框。hasCheckBox_child:内外表格都带复选框
						setTableBodyData: setTableBodyData.bind(this),
						pageIndexChange: pageInfoClick.bind(this), //点击分页时，设置表格数据（不用分页，可不传）
						pageSizeChange: pageInfoClick.bind(this), //切换显示条数，重新请求数据(不用切换pageSize，可不传)
						onAllCheckChangeEve: checkChange.bind(this), //复选框全选(可不传)
						rowCheckChange: checkChange.bind(this), //单行复选框change(可不传)
						needIndex: true,
						childNeedIndex: false,
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}

function checkChange(a, b, c) {
	// 更新按钮状态
	buttonController.call(this, this.props);
}

OrderOutPut = createPage({})(OrderOutPut);
export default OrderOutPut;
