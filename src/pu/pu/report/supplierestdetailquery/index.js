/*
 * @Author: zhaochyu
 * @PageInfo: 供应商暂估明细查询
 * @Date: 2018-06-27 19:59:32
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-27 11:34:45
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { FIELD } from './constance';
import { viewModel } from 'nc-lightapp-front';
let { setGlobalStorage } = viewModel;
import {
	disposeFilter,
	getFieldValue2Arr,
	systemFormulaRenderCompleteProcess,
	getUrlConditions
} from '../public/utils';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
export default class SupplierestDetailQuery extends Component {
	constructor(props) {
		super(props);
		this.linkQueryConditions;
	}
	componentWillMount() {
		//处理联查过来的情况
		let params = getUrlConditions('params');
		if (params && params.length > 0) {
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
			if (code == FIELD.pk_supplierAreacl || code == FIELD.pk_marbasclass) {
				item.isShowUnit = true;
				disposeFilter(props, FIELD.pk_financeorg, item);
			} else if (code == FIELD.pk_supplierCode || code == FIELD.pk_srcmaterial) {
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
		systemFormulaRenderCompleteProcess(props, searchId, FIELD.pk_financeorg, this.onAfterEvent);
		if (this.linkQueryConditions) {
			props.search.setSearchValue(searchId, this.linkQueryConditions);
		}
	}
	onAfterEvent(props, searchId, field, val) {
		//通过财务组织的单选多选控制供应商、物料基本分类、物料编码是否可切换组织
		if (field == FIELD.pk_financeorg) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_supplierCode,
				FIELD.pk_supplierAreacl,
				FIELD.pk_srcmaterial,
				FIELD.pk_marbasclass
			]);
		} else if (field == FIELD.pk_purchaseorg) {
			multiCorpRefHandler(props, val, searchId, [ FIELD.pk_psndoc, FIELD.pk_dept ]);
		} else if (field == FIELD.pk_supplierCode) {
			let supplierCodeconditVal = '';
			let supplierCodeconditDisplay = '';
			for(let i = 0; i < val.length; i++) {
				supplierCodeconditVal += val[i].refcode + ',';
				supplierCodeconditDisplay += val[i].refname + ',';
			}
			supplierCodeconditVal = '' == supplierCodeconditVal ? '' : supplierCodeconditVal.substring(0, supplierCodeconditVal.length-1);
			supplierCodeconditDisplay = '' == supplierCodeconditDisplay ? '' : supplierCodeconditDisplay.substring(0, supplierCodeconditDisplay.length-1);
			let params = this.linkQueryConditions;
			for (let i = 0; i < params.length; i++) {
				if(params[i].field == FIELD.pk_supplierCode) {
					params[i].display = supplierCodeconditDisplay;
					params[i].value.firstvalue = supplierCodeconditVal;
				}
			}
			this.linkQueryConditions = params;
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
ReactDOM.render(<SupplierestDetailQuery />, document.getElementById('app'));
