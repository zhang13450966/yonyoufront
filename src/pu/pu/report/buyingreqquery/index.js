/*
 * @Author: zhaochyu
 * @PageInfo: 请购单执行情况查询
 * @Date: 2018-06-25 16:40:05
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:16:22
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { ajax, high } from 'nc-lightapp-front';
import { FIELD } from './constance';
import { disposeFilter, getFieldValue2Arr, systemFormulaRenderCompleteProcess } from '../public/utils';
import dateFormat from '../../../../scmpub/scmpub/pub/tool/dateFormat';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { drillToBill } from '../../../../scmpub/scmpub/pub/tool/reportDrillBillUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
const { BillTrack } = high;
export default class BuyreqQuery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showTrack: false,
			pk: ''
		};
		initLang(this, [ '4004pub' ], 'pu');
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
			} else if (
				code == FIELD.billmaker ||
				code == FIELD.pk_marbasclassCode ||
				code == FIELD.pk_reqstor ||
				code == FIELD.cprojectid ||
				code == FIELD.casscustid
			) {
				item.isShowUnit = true;
				disposeFilter(props, FIELD.pk_org, item);
			} else if (code == FIELD.pk_planpsn || code == FIELD.pk_plandept) {
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
			} else if (code == FIELD.pk_srcmaterialCode || code == FIELD.pk_srcmaterialName) {
				item.isShowUnit = true;
				item.queryCondition = () => {
					let data = getFieldValue2Arr(props, FIELD.pk_org);
					return {
						pk_org: data[0],
						isDataPowerEnable: true,
						DataPowerOperationCode: 'SCMDefault'
					};
				};
			} else if (code == FIELD.ctrantypeid) {
				item.queryCondition = () => {
					return { parentbilltype: '20' };
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
	/**
     * 渲染完成的钩子函数
     * @param{*}props
     * @param{*}searchId
     */
	renderCompleteEvent(props, searchId) {
		//在公式解析后，调用编辑后事件，处理可切换单元的状态
		systemFormulaRenderCompleteProcess(props, searchId, FIELD.pk_org, this.onAfterEvent);
	}

	setConnectionSearch(transSaveObject, obj, data, props, url, urlParam, sessionKey) {
		//单据联查
		if (obj.key == 'billDrill') {
			drillToBill(props, transSaveObject, { ...data, billTypeValue: '20' }, 'cbillid', 'cbilltypecode');
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
		}
	}
	onAfterEvent(props, searchId, field, val) {
		//通过财务组织的单选多选控制供应商、物料基本分类、物料编码是否可切换组织
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, searchId, [
				FIELD.pk_planpsn,
				FIELD.pk_plandept,
				FIELD.billmaker,
				FIELD.pk_planpsn,
				FIELD.pk_srcmaterialCode,
				FIELD.pk_srcmaterialName,
				FIELD.pk_marbasclassCode,
				FIELD.pk_reqstor,
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
					disposeSearch={this.disposeFilter.bind(this)}
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
					type="20"
				/>
			</div>
		);
	}
}
ReactDOM.render(<BuyreqQuery />, document.getElementById('app'));
