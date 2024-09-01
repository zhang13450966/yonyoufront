/*
 * @Author: 刘奇 
 * @PageInfo: 表头编辑前事件
 * @Date: 2019-03-05 16:33:21 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-07 11:02:05
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import vbillcodeBeforeEvent from '../../pubrule/vbillcodeBeforeEvent';
import { transtypeUtils } from '../../../pub/tool';
import {
	rateTypeBuyFilter,
	canRateDateModify,
	canRateModify,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

// 参照只根据销售组织过滤的字段
const csaleorgid_filter_Fields = [ ArsubHeadItem.cemployeeid, ArsubHeadItem.cdeptvid ];
export default async function headBeforeEvent(props, moduleId, key, value, data) {
	// 单据号
	if (key === ArsubHeadItem.vbillcode) {
		let flag = vBillCodeBeforeEdit.call(this, value, data, moduleId);
		return flag;
	} else if (key === ArsubHeadItem.ctrantypeid) {
		let status = data.fstatusflag.value;
		if (status == '2') {
			// 审批中或提交态，交易类型不允许修改
			props.form.setFormItemsDisabled(moduleId, { ctrantypeid: true });
		}
		// 交易类型发布的节点，交易类型不可编辑
		return transtypeUtils.beforeEdit.call(this, key, ArsubHeadItem.ctrantypeid, ArsubHeadItem.vtrantypecode);
	} else if (key === ArsubHeadItem.nexchangerate) {
		let corigcurrencyid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.corigcurrencyid).value;
		let ccurrencyid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ccurrencyid).value;
		// 如果原币不为空，本币不为空，原币等于本币，折本汇率不可编辑
		if (isNull(corigcurrencyid) || (isNull(ccurrencyid) || corigcurrencyid === ccurrencyid)) {
			return false;
		} else {
			// 根据汇率类别判断编辑性
			let fratecategory = props.form.getFormItemsValue(ARSUB_CONST.formId, 'fratecategory');
			return canRateModify.call(
				this,
				(fratecategory || {}).value,
				isBillSelfMake.call(this, (fratecategory || {}).value, ARSUB_CONST.tableId, 'vsrctype', [ '4641' ])
			);
		}
	} else if (key == ArsubHeadItem.cratetype) {
		//组织汇率类型
		let corigcurr = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.corigcurrencyid).value;
		let ccurr = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ccurrencyid).value;

		if (isNull(corigcurr) || isNull(ccurr) || corigcurr === ccurr) {
			return false;
		}
		this.props.cardTable.setQueryCondition(ARSUB_CONST.formId, {
			[key]: () => {
				return rateTypeBuyFilter();
			}
		});
	} else if (key == ArsubHeadItem.dratedate) {
		// 汇率日期
		let corigcurr = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.corigcurrencyid).value;
		let ccurr = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.ccurrencyid).value;

		if (isNull(corigcurr) || isNull(ccurr) || corigcurr === ccurr) {
			return false;
		}
		let fratecategory = props.form.getFormItemsValue(ARSUB_CONST.formId, 'fratecategory');
		return canRateDateModify.call(
			this,
			(fratecategory || {}).value,
			isBillSelfMake.call(this, (fratecategory || {}).value, ARSUB_CONST.tableId, 'vsrctype', [ '4641' ])
		);
	} else if (key == ArsubHeadItem.cemployeeid || key == ArsubHeadItem.cdeptvid) {
		let pk_org = (this.props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.csaleorgvid) || {}).value;
		let nmeta = this.props.meta.getMeta();
		let items = nmeta[ARSUB_CONST.formId].items;
		items.forEach((element) => {
			if (csaleorgid_filter_Fields.includes(element.attrcode) && pk_org) {
				element.isShowUnit = false;
			} else {
				element.isShowUnit = true;
			}
		});
		this.props.meta.setMeta(nmeta);
	}
	return true;
}

/**
 * 单据号编辑前事件
 * @param {*} value 
 * @param {*} data 
 */
async function vBillCodeBeforeEdit(value, data, moduleId) {
	let info = {
		key: ArsubHeadItem.vbillcode,
		formareaid: ARSUB_CONST.formId,
		pk_org_key: ArsubHeadItem.pk_org,
		billtype: '35'
	};

	let flag = await vbillcodeBeforeEvent.call(this, this.props, info);
	if (!flag) {
		// 针对返回的处理有bug：依然可以瞬间输入单据号，在此主动控制编辑性
		this.props.form.setFormItemsDisabled(moduleId, { [ArsubHeadItem.vbillcode]: true });
		this.props.form.setFormItemsValue(moduleId, {
			vbillcode: {
				value: '',
				display: ''
			}
		});
	}
	return flag;
}

function isNull(value) {
	if (value == undefined || value === '') {
		return true;
	}
	return false;
}
