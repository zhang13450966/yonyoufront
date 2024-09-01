/*
 * @Author: zhaochyu
 * @PageInfo: 采购暂估差异表
 * @Date: 2018-06-29 16:52:52
 * @Last Modified by: zhr
 * @Last Modified time: 2020-04-14 17:38:27
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { FIELD } from './constance';
import { disposeFilter, getFieldValue2Arr, systemFormulaRenderCompleteProcess } from '../public/utils';
import dateFormat from '../../../../scmpub/scmpub/pub/tool/dateFormat';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
export default class EstDifferQuery extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		dateFormat();
	}
	/**
   * 加载模板的时候为items增加查询过滤
   * @param {*} meta
   * @param {*} props
   */
	disposeFilter(meta, props) {
		//根据成本域所属财务组织过滤
		let items = meta[FIELD.searchArea].items;
		items.forEach((item) => {
			setPsndocShowLeavePower(item);
			setRefShowDisabledData(item);
			let code = item.attrcode;
			if (code == FIELD.fperiod) {
				// 如果user_name的参照需要根据前面选中参照的值进行过滤
				item.fieldValued = FIELD.refname;
				item.queryCondition = () => {
					let data = getFieldValue2Arr(props, FIELD.pk_financeorg);
					if (data && !data[0]) {
						return { pk_accperiodscheme: 'false' };
					}
				};
			} else if (code == FIELD.pk_marbasclassCode || code == FIELD.fperiod) {
				item.isShowUnit = true;
				disposeFilter(props, FIELD.pk_financeorg, item);
			} else if (code == FIELD.pk_supplierCode || code == FIELD.pk_srcmaterialCode) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data = getFieldValue2Arr(props, FIELD.pk_financeorg);
					return {
						pk_org: data[0],
						isDataPowerEnable: true,
						DataPowerOperationCode: 'SCMDefault'
					};
				};
			} else if (code == FIELD.pk_psndoc || code == FIELD.pk_dept) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let pk_org = getFieldValue2Arr(props, FIELD.pk_purchaseorg);
					let pk_dept = getFieldValue2Arr(props, FIELD.pk_dept);
					return {
						pk_org: pk_org[0],
						pk_dept: pk_dept[0],
						busifuncode: FIELD.pu
					};
				};
			} else if (code == FIELD.pk_financeorg) {
				item.queryCondition = () => {
					return {
						TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
					};
				};
			}
		});
		return meta;
	}
	/**
     * 渲染完成的钩子函数
     * @param{*}props
     * @param{*}searchId
    */
	renderCompleteEvent(props, searchId) {
		//在公式解析后，调用编辑后事件，处理可切换单元的状态
		systemFormulaRenderCompleteProcess(props, searchId, FIELD.pk_org, this.onAfterEvent);
	}
	onAfterEvent(props, searchId, field, val) {
		//通过财务组织的单选多选控制供应商、物料基本分类、物料编码是否可切换组织
		if (field == FIELD.pk_financeorg) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_supplierCode,
				FIELD.pk_srcmaterialCode,
				FIELD.pk_marbasclassCode
			]);
		} else if (field == FIELD.pk_purchaseorg) {
			multiCorpRefHandler(props, val, searchId, [ FIELD.pk_psndoc, FIELD.pk_dept ]);
		}
	}
	render() {
		return (
			<div className="table">
				<SimpleReport
					showAdvBtn={true}
					disposeSearch={this.disposeFilter.bind(this)}
					onAfterEvent={this.onAfterEvent.bind(this)}
					renderCompleteEvent={this.renderCompleteEvent.bind(this)}
					statusChangeEvent={this.renderCompleteEvent.bind(this)}
				/>
			</div>
		);
	}
}
ReactDOM.render(<EstDifferQuery />, document.getElementById('app'));
