/*
 * @Author: ligangt
 * @PageInfo: 到货单列表
 * @Date: 2018-04-17 15:48:43
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-26 13:59:48
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, high, createPageIcon } from 'nc-lightapp-front';
import searchBtnClick from './btnClicks/searchBtnClick';
import { initTemplate } from './init';
import afterEvent from './events/afterEvent';
import {
	URL,
	AREA,
	COMMON,
	PAGECODE,
	BUTTONAREA,
	HEAD_VDEF,
	BODY_VBDEF,
	VFREE,
	BUTTONID,
	ALLBUTTON
} from '../constance';
const { BillTrack } = high;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import getDefArray from './utils/getDefArray';
let dataSource = COMMON.ArrivalqcCacheKey;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import btnController from './viewControl/btnController';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import btnClickController from './viewControl/btnClickController';

export default class ArrivalQcList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = COMMON.moudleid;
		this.searchId = AREA.searchArea;
		this.tableId = AREA.list;
		props.use.search(this.searchId);
		props.use.editTable(this.tableId);
		this.isCheck = false;
		this.pk_org = null;
		this.isQcEnable = false;
		this.state = {
			searchVal: null, //查询条件缓存
			// isCheck: false,
			// pk_org: '',
			// isQcEnable: false,
			pk: '',
			showTrack: false
		};

		initLang(this, [ '4004arrivalqc' ], 'pu', initTemplate.call(this, this.props));
	}
	componentDidMount() {
		this.props.editTable.setTableData(AREA.list, { rows: [] });
		//到货检验，默认进入时，未选择数据时，按钮未置灰，除刷新外
		this.props.button.setButtonDisabled(ALLBUTTON, true);
		this.props.button.setButtonDisabled([ BUTTONID.Refresh ], false);
		//this.getData();
	}

	getData = () => {
		// let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let data = {
			queryInfo: {
				querycondition: searchVal ? searchVal : { logic: 'and' }, //查询条件
				pageInfo: null, //分页信息
				queryAreaCode: AREA.searchArea, //查询区编码
				oid: COMMON.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype: 'tree'
			},
			pageCode: PAGECODE.list //页面编码
		};
		ajax({
			url: URL.queryScheme,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.props.editTable.setAllTableData(this.tableId, data[this.tableId]);
					// 根据质检模块是否启用设置编辑性
					//this.props.editTable.setStatus(AREA.list, 'edit');
				}
			}
		});
	};

	onAfterEvent(props, field, val) {
		if (field == 'pk_org') {
			let fields = new Array();
			fields = fields.concat([
				/**表头字段 */
				'pk_supplier', //供应商

				/**表体字段 */
				'pk_arriveorder_b.pk_receivestore', //收货仓库
				'pk_arriveorder_b.pk_srcmaterial', //物料
				'pk_arriveorder_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
				'pk_arriveorder_b.casscustid', //客户
				'billmaker', //制单人
				'approver', //审批人
				'pk_arriveorder_b.creporterid', //报告人
				'pk_transporttype', //运输方式
				'pk_arriveorder_b.cprojectid' //项目
			]);
			// 表头自定义项
			fields = fields.concat(HEAD_VDEF);
			// 表体自定义项
			let body_vdef = getDefArray('pk_arriveorder_b', BODY_VBDEF);
			fields = fields.concat(body_vdef);
			// 自由辅助属性
			let body_vfree = getDefArray('pk_arriveorder_b', VFREE);
			fields = fields.concat(body_vfree);
			multiCorpRefHandler(props, val, 'searchArea', fields);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, 'pk_org');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'pk_org', arr);
		}
	};

	render() {
		const { editTable, button, search, modal } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		return (
			<div className="nc-single-table">
				{this.props.socket.connectMesg({
					tableAreaCode: this.tableId,
					tableType: 'editTable', // 增加表格类型 editTable / insertTable
					// billtype : '',   // 由于EditTable 节点可能不涉及追溯或者流程，可不传
					billpkname: 'pk_arriveorder'
				})}

				<div className="nc-singleTable-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: BUTTONAREA.listhead,
							onButtonClick: btnClickController.bind(this)
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({
									showTrack: false
								});
							}}
							pk={this.state.pk}
							type="23"
						/>
					</div>
				</div>
				<div className="nc-singleTable-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this, null),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent,
						defaultConditionsNum: 4
					})}
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(this.tableId, {
						showCheck: true,
						showIndex: true,
						onAfterEvent: afterEvent.bind(this),
						onSelected: btnController.bind(this, this.props),
						onSelectedAll: btnController.bind(this, this.props),
						dataSource: dataSource,
						adaptionHeight: true
						// pk_name:
					})}
				</div>
				{/*删掉了原来的createModal方式弹窗确认是否报检，使用messageUtil中的showWarnDialog   modify by zhaoypm @2018-11-06 case:原有样式不对*/}
			</div>
		);
	}
}

ArrivalQcList = createPage({
	//模板
	// initTemplate: initTemplate,
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.list,
		bodycode: AREA.list
	}
})(ArrivalQcList);
ReactDOM.render(<ArrivalQcList />, document.querySelector('#app'));
