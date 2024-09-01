/*
 * @Author: 刘奇 
 * @PageInfo: 表头编辑前事件
 * @Date: 2019-03-05 16:33:21 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-26 11:37:28
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem, BILLTYPE } from '../../const';
import { ajax } from 'nc-lightapp-front';
import {
	canRateModify,
	rateTypeMindFilter,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default async function headBeforeEvent(props, moduleId, key, value, record) {
	//承运商、开票方
	if (key === PrepaidinvoiceHeadItem.cdmsupplierid || key === PrepaidinvoiceHeadItem.capcustvid) {
		let vsctypes = props.cardTable.getColValue(PREPAIDINVOICE_CONST.tableId, PrepaidinvoiceBodyItem.vsrctype);
		if (isFrom4804(vsctypes)) {
			return false;
		}
	} else if (key === PrepaidinvoiceHeadItem.nexchangerate) {
		//折本汇率
		let corigcurrencyid = props.form.getFormItemsValue(
			PREPAIDINVOICE_CONST.formId,
			PrepaidinvoiceHeadItem.corigcurrencyid
		).value;
		let ccurrencyid = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.ccurrencyid)
			.value;
		// 如果原币为空，本币为空，原币等于本币，折本汇率不可编辑
		if (isNull(corigcurrencyid) || isNull(ccurrencyid) || corigcurrencyid === ccurrencyid) {
			return false;
		}
		// 根据汇率类别判断编辑性
		return canRateModify.call(
			this,
			(record.fratecategory || {}).value,
			isBillSelfMake.call(this, (record.fratecategory || {}).value, PREPAIDINVOICE_CONST.tableId, 'vsrctype', [
				'30',
				'4804'
			])
		);
	} else if (key === PrepaidinvoiceHeadItem.cratetype) {
		//组织汇率类型

		let corigcurrencyid = props.form.getFormItemsValue(
			PREPAIDINVOICE_CONST.formId,
			PrepaidinvoiceHeadItem.corigcurrencyid
		).value;
		let ccurrencyid = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.ccurrencyid)
			.value;
		// 如果原币为空，本币为空，原币等于本币，折本汇率不可编辑
		if (isNull(corigcurrencyid) || isNull(ccurrencyid) || corigcurrencyid === ccurrencyid) {
			return false;
		} else {
			return true;
		}
	} else if (key === PrepaidinvoiceHeadItem.dratedate) {
		//组织汇率来源日期
		// 根据汇率类别判断编辑性
		// return canRateDateModify.call(this, (record.fratecategory || {}).value, true);
		// 如果是固定汇率且非自制，日期不可编辑
		return canRateDateModify.call(
			this,
			(record.fratecategory || {}).value,
			isBillSelfMake.call(this, (record.fratecategory || {}).value, PREPAIDINVOICE_CONST.tableId, 'vsrctype', [
				'30',
				'4804'
			])
		);
	} else if (key === PrepaidinvoiceHeadItem.ngroupexchgrate || key === PrepaidinvoiceHeadItem.nglobalexchgrate) {
		//集团本位币汇率、全局本位币汇率
		return new Promise(function(resolve, reject) {
			let data = {
				key: key,
				params: {
					corigcurrencyid: record[PrepaidinvoiceHeadItem.corigcurrencyid].value || null,
					ccurrencyid: record[PrepaidinvoiceHeadItem.ccurrencyid].value || null,
					pk_group: record[PrepaidinvoiceHeadItem.pk_group].value || null
				}
			};
			ajax({
				url: PREPAIDINVOICE_CONST.headbefore,
				data: data,
				success: (res) => {
					if (res.data) {
						if (res.data.isedit == true) {
							resolve(true);
						} else {
							resolve(false);
						}
					}
				}
			});
		});
	}
	return true;
}

function isFrom4804(vsctypes) {
	for (let vsctype of vsctypes) {
		if (BILLTYPE.delivbill == vsctype) {
			return true;
		}
	}
	return false;
}

function isNull(value) {
	if (value == undefined || value === '') {
		return true;
	}
	return false;
}

/**
 * 汇率日期是否可编辑
 * @param {*} category 
 * @param {*} isSelfMake 
 */
function canRateDateModify(category, isSelfMake) {
	let flag = false;

	if (category == '7') {
		// 自定义
		flag = true;
	} else if (category == '0') {
		// 日汇率(中间汇率)不可编辑
		flag = false;
	} else if (category == '5' && isSelfMake) {
		// 固定汇率并自制，可以编辑
		flag = true;
	}

	return flag;
}
