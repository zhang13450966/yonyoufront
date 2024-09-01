/*
 * @Author: zhaochyu
 * @PageInfo: 供应商暂估余额查询
 * @Date: 2018-06-28 14:04:22
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-23 17:29:54
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { ajax } from 'nc-lightapp-front';
import { FIELD } from './constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { disposeFilter, getFieldValue2Arr, systemFormulaRenderCompleteProcess } from '../public/utils';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
export default class SupplierestQuery extends Component {
	constructor(props) {
		super(props);
		initLang(this, [ '4004pub' ], 'pu');
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
			if (code == FIELD.pk_supplierAreacl || code == FIELD.pk_marbasclassCode) {
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
	setConnectionSearch(transSaveObject, obj, data, props, url, urlParam, sessionKey) {
		url = '/pu/pu/report/supplierestdetailquery/index.html';
		urlParam.appcode = '400413220';
		urlParam.pageCode = '400413220_report';
		// 联查明细
		if (obj.key == 'linkDetail') {
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
						let pk_supplier = res.data.pk_supplier;
						let supplierDisplay = res.data.supplierDisplay == undefined ? "" : res.data.supplierDisplay;
						let conds = data.querycondition.conditions;
						conds.push({
							field: 'eb.pk_supplier',
							display: supplierDisplay,
							value: { firstvalue: pk_supplier, secondvalue: '' },
							oprtype: '=',
							datatype: '204'
						});

						conds.forEach((condition) => {
							params[condition.field] = JSON.stringify(condition);
						});
						props.openTo(url, {
							appcode: urlParam.appcode,
							pageCode: urlParam.pageCode,
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
		systemFormulaRenderCompleteProcess(props, searchId, FIELD.pk_financeorg, this.onAfterEvent);
	}
	onAfterEvent(props, searchId, field, val) {
		//通过财务组织的单选多选控制供应商、物料基本分类、物料编码是否可切换组织
		if (field == FIELD.pk_financeorg) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_supplierCode,
				FIELD.pk_supplierAreacl,
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
					disposeSearch={this.disposeSearch.bind(this)}
					onAfterEvent={this.onAfterEvent.bind(this)}
					setConnectionSearch={this.setConnectionSearch.bind(this)}
					renderCompleteEvent={this.renderCompleteEvent.bind(this)}
					statusChangeEvent={this.renderCompleteEvent.bind(this)}
				/>
			</div>
		);
	}
}
ReactDOM.render(<SupplierestQuery />, document.getElementById('app'));
