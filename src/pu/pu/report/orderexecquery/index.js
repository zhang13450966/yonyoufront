/*
 * @Author: zhaochyu
 * @PageInfo: 采购订单执行情况查询
 * @Date: 2018-06-26 21:06:47
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-15 15:17:26
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { ajax, high, viewModel } from 'nc-lightapp-front';
import { FIELD } from './constance';
let { setGlobalStorage } = viewModel;
import {
	disposeFilter,
	getFieldValue2Arr,
	systemFormulaRenderCompleteProcess,
	getUrlConditions
} from '../public/utils';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { drillToBill } from '../../../../scmpub/scmpub/pub/tool/reportDrillBillUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
const { BillTrack } = high;
export default class OrderExecQuery extends Component {
	constructor(props) {
		super(props);
		this.linkQueryConditions;
		this.state = {
			showTrack: false,
			pk: ''
		};
		initLang(this, [ '4004pub' ], 'pu');
	}

	componentWillMount() {
		//处理联查过来的情况
		let params = getUrlConditions('params');
		if (params && params.length > 0) {
			params.forEach((param) => {
				if (param.field == 'stattype') {
					param.value.firstvalue = '0';
				}
			});
			let conditions = {
				logic: 'and',
				conditions: params
			};
			this.linkQueryConditions = params;
			setGlobalStorage('sessionStorage', 'LinkReport', JSON.stringify(conditions), () => {});
		}
	}

	/**
   * 加载模板的时候为items增加查询过滤
   * @param {*} meta
   * @param {*} props
   */
	disposeSearch(meta, props) {
		let items = meta[FIELD.searchArea].items;
		items.map((item) => {
			setPsndocShowLeavePower(item);
			setRefShowDisabledData(item);
			let code = item.attrcode;
			//参照成本域所属财务组织过滤：物料基本分类、物料编码、物料名称、客户名称、客户编码、供应商名称、供应商编码、客户
			if (
				code == FIELD.pk_supplierAreacl ||
				code == FIELD.pk_marbasclass ||
				code == FIELD.cprojectid ||
				code == FIELD.casscustid ||
				code == FIELD.pk_marpuclass
			) {
				item.isShowUnit = true;
				disposeFilter(props, FIELD.pk_org, item);
			} else if (code == FIELD.cemployeeid || code == FIELD.pk_dept) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let pk_org = getFieldValue2Arr(props, FIELD.pk_org);
					let pk_dept = getFieldValue2Arr(props, FIELD.pk_dept);
					return {
						pk_org: pk_org[0],
						pk_dept: pk_dept[0],
						busifuncode: FIELD.pu
					};
				};
			} else if (
				code == FIELD.pk_supplierCode ||
				code == FIELD.pk_supplierName ||
				code == FIELD.pk_srcmaterialCode ||
				code == FIELD.pk_materialName
			) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data = getFieldValue2Arr(props, FIELD.pk_org);
					return {
						pk_org: data[0],
						isDataPowerEnable: true,
						DataPowerOperationCode: 'SCMDefault'
					};
				};
			} else if (code == FIELD.cproductorid) {
				//生产厂商使用自定义档案
				item.queryCondition = () => {
					return { pk_defdoclist: '1002ZZ1000000000066Q' };
				};
			} else if (code == FIELD.ctrantypeid) {
				item.queryCondition = () => {
					return { parentbilltype: '21' };
				};
			} else if (code == FIELD.pk_org) {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
					};
				};
			}
		});
		return meta;
	}
	setConnectionSearch(transSaveObject, obj, data, props, url, urlParam, sessionKey) {
		//单据联查
		if (obj.key == 'billDrill') {
			drillToBill(props, transSaveObject, { ...data, billTypeValue: '21' }, 'cbillid', 'cbilltypecode');
		} else if (obj.key == 'billTrack') {
			//单据追溯
			let pkCode = 'cbillid';
			let billTypeCode = 'cbilltypecode';
			ajax({
				url: '/nccloud/pu/report/billTrackQueryPk.do',
				data: {
					...data,
					transSaveObject,
					pkCode,
					billTypeCode
				},
				method: 'post',
				success: (res) => {
					if (res.success) {
						return this.setState({ pk: res.data, showTrack: true });
					} else {
						showErrorInfo(null, getLangByResId(this, '4004pub-000006')); /* 国际化处理： 请选择数据*/
					}
				}
			});
		} else if (obj.key == 'linkDetail') {
			let condit = data.querycondition.conditions.filter((condition) => condition.field == 'stattype');
			if (condit && condit instanceof Array && condit[0].value.firstvalue == '0') {
				showErrorInfo(null, getLangByResId(this, '4004pub-000007')); /* 国际化处理： 当前已经是明细数据，不需要联查明细。 */
				return false;
			}
			// 联查明细
			ajax({
				url: '/nccloud/pu/report/linkDetailQuery.do',
				data: {
					...data,
					transSaveObject
				},
				method: 'post',
				success: (res) => {
					if (res.success) {
						// return this.setState({ pk: res.data, showTrack: true });
						let params = {};
						let pk_material = res.data.pk_material;
						let vbillcode = res.data.vbillcode;
						let conds = data.querycondition.conditions;
						conds.push({
							field: 'po_order.vbillcode',
							value: { firstvalue: vbillcode, secondvalue: '' },
							oprtype: '=',
							datatype: '1'
						});
						conds.push({
							oprtype: '=',
							datatype: '204',
							field: 'po_order_b.pk_srcmaterial.code',
							value: { firstvalue: pk_material, secondvalue: '' }
						});

						conds.forEach((condition) => {
							params[condition.field] = JSON.stringify(condition);
						});
						props.openTo(url, {
							params: JSON.stringify(params)
						});
					} else {
						showErrorInfo(null, getLangByResId(this, '4004pub-000006')); /* 国际化处理： 请选择数据*/
					}
				}
			});
		}
	}
	/**
     * 渲染完成的钩子函数
     * @param{*}props
     * @param{*}searchId
    */
	renderCompleteEvent(props, searchId) {
		//在公式解析后，调用编辑后事件，处理可切换单元的状态
		systemFormulaRenderCompleteProcess(props, searchId, FIELD.pk_org, this.onAfterEvent);
		if (this.linkQueryConditions) {
			props.search.setSearchValue(searchId, this.linkQueryConditions);
		}
	}
	onAfterEvent(props, searchId, field, val) {
		//通过财务组织的单选多选控制供应商、物料基本分类、物料编码是否可切换组织
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_supplierCode,
				FIELD.pk_supplierName,
				FIELD.pk_supplierAreacl,
				FIELD.cemployeeid,
				FIELD.pk_dept,
				FIELD.pk_srcmaterialCode,
				FIELD.pk_materialName,
				FIELD.pk_marbasclass,
				FIELD.cprojectid,
				FIELD.casscustid
			]);
		}
	}
	render() {
		return (
			<div className="table">
				<SimpleReport
					showAdvBtn={true}
					disposeSearch={this.disposeSearch.bind(this)}
					onAfterEvent={this.onAfterEvent.bind(this)}
					setConnectionSearch={this.setConnectionSearch.bind(this)}
					renderCompleteEvent={this.renderCompleteEvent.bind(this)}
					statusChangeEvent={this.renderCompleteEvent.bind(this)}
				/>
				<BillTrack
					show={this.state.showTrack}
					close={() => {
						this.setState({ showTrack: false });
					}}
					pk={this.state.pk}
					type="21"
				/>
			</div>
		);
	}
}
ReactDOM.render(<OrderExecQuery />, document.getElementById('app'));
