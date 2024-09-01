/*
 * @Author: zhaochyu
 * @PageInfo: 采购待开票数量查询
 * @Date: 2018-06-27 18:23:58
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:18:12
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { FIELD } from './constance';
import { disposeFilter, getFieldValue2Arr, systemFormulaRenderCompleteProcess } from '../public/utils';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
export default class PuchaseReportQuery extends Component {
	constructor(props) {
		super(props);
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
			if (code == FIELD.pk_supplierAreac || code == FIELD.pk_marbasclass) {
				item.isShowUnit = true;
				disposeFilter(props, FIELD.pk_org, item);
			} else if (code == FIELD.pk_supplierCode || code == FIELD.pk_supplierName) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data = getFieldValue2Arr(props, FIELD.pk_org);
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
			} else if (code == FIELD.ctrantypeid) {
				item.queryCondition = () => {
					return { parentbilltype: '45' };
				};
			} else if (code == FIELD.pk_org) {
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
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_supplierCode,
				FIELD.pk_supplierName,
				FIELD.pk_supplierAreac,
				FIELD.pk_marbasclass
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
					disposeSearch={this.disposeSearch.bind(this)}
					onAfterEvent={this.onAfterEvent.bind(this)}
					renderCompleteEvent={this.renderCompleteEvent.bind(this)}
					statusChangeEvent={this.renderCompleteEvent.bind(this)}
				/>
			</div>
		);
	}
}
ReactDOM.render(<PuchaseReportQuery />, document.getElementById('app'));
