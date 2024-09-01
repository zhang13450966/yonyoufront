/*
 * @Author: chaiwx 
 * @PageInfo:汇率类型参照过滤公共方法
 * @Date: 2021-06-30 11:31:17 
 * @Last Modified by: chaiwx 
 * @Last Modified time: 2021-06-30 11:31:17 
 */

import { ajax, toast } from 'nc-lightapp-front';

const RATE_TYPE_MIDDLE = 0; //日汇率-中间汇率
const RATE_TYPE_BUYING = 1; //日汇率 - 买入汇率;
const RATE_TYPE_SELLING = 2; //日汇率 - 卖出汇率;
const RATE_TYPE_ADJUST = 3; //期间汇率;
const RATE_TYPE_AVG = 4; //平均汇率;
const RATE_TYPE_FIX = 5; //固定汇率;
const RATE_TYPE_SYSTEM = 6; //系统赋值;
const RATE_TYPE_CUSTOM = 7; //自定义汇率;

/**
 * 汇率类型中间价参照过滤
 */
function rateTypeMindFilter() {
	let categorys = '(' + RATE_TYPE_MIDDLE + ',' + RATE_TYPE_BUYING + ',' + RATE_TYPE_SELLING + ')';
	return {
		rate_category_in_value: categorys
	};
}

/**
 * 汇率类型买入价参照过滤
 */
function rateTypeBuyFilter() {
	let categorys =
		'(' + RATE_TYPE_MIDDLE + ',' + RATE_TYPE_BUYING + ',' + '5' + ',' + RATE_TYPE_CUSTOM + ')';
	return {
		rate_category_in_value: categorys
	};
}

/**
 * 汇率类型卖出价参照过滤
 */
function rateTypeSellFilter() {
	let categorys =
		'(' + RATE_TYPE_MIDDLE + ',' + RATE_TYPE_SELLING + ',' + '5' + ',' + RATE_TYPE_CUSTOM + ')';
	return {
		rate_category_in_value: categorys
	};
}

/**
 * 汇率是否可编辑
 * >三大汇率走参数
 * >自定义汇率始终可改
 * >符合自制，自制始终可改，非自制不可改
 * @param {*} category 
 * @param {*} isSelfMake 
 */
async function canRateModify(category, isSelfMake) {
	let flag = false;

	if (category == RATE_TYPE_MIDDLE || category == RATE_TYPE_BUYING || category == RATE_TYPE_SELLING) {
		// 三种日汇率，请求后台根据参数判断
		flag = new Promise(function(resolve, reject) {
			ajax({
				url: '/nccloud/scmpub/currentcyrate/rateEditable.do',
				data: { category: category },
				loading: false,
				success: (res) => {
					if (res.data) {
						let editFlag = res.data;
						resolve(editFlag);
					}
				},
				error: (error) => {
					toast({
						color: 'warning',
						content: error.message
					});
					resolve(false);
				}
			});
		});
	} else if (category == RATE_TYPE_CUSTOM || !category) {
		// 自定义 || 空
		flag = true;
	} else if (isSelfMake) {
		// 自制
		flag = true;
	}

	return flag;
}

/**
 * 汇率日期是否可编辑
 * @param {*} category 
 * @param {*} isSelfMake 
 */
function canRateDateModify(category, isSelfMake) {
	let flag = false;

	if (category == RATE_TYPE_CUSTOM) {
		// 自定义
		flag = true;
	} else if (category == RATE_TYPE_MIDDLE || category == RATE_TYPE_BUYING || category == RATE_TYPE_SELLING) {
		// 日汇率均不可编辑
		flag = false;
	} else if (category == '5' && isSelfMake) {
		// 固定汇率并自制，可以编辑
		flag = true;
	}

	return flag;
}

/**
 * 表体行是否符合自制规则
 * @param {*} record 
 * @param {*} srctypeField 来源单据类型字段
 * @param {*} cannotEditSrctypes 不可编辑的来源单据类型数组
 * @returns 
 */
function isRowSelfMake(rowdata, srctypeField, cannotEditSrctypes) {
	let isSelfMake = true;
	let category = (rowdata.values.fratecategory || {}).value;
	let srctype = (rowdata.values[srctypeField] || {}).value;

	if (category == '5' && cannotEditSrctypes.includes(srctype)) {
		// 固定汇率、来源单据类型是不可编辑的单据类型
		isSelfMake = false;
	}

	return isSelfMake;
}

/**
 * 单据是否符合自制规则
 * @param {*} data 
 * @param {*} bodyArea 
 * @param {*} srctypeField 
 * @param {*} cannotEditSrctypes 
 */
function isBillSelfMake(category, bodyArea, srctypeField, cannotEditSrctypes) {
	let isSelfMake = true;

	if (category == '5') {
		// 固定汇率
		let bodyRows = this.props.cardTable.getVisibleRows(bodyArea);
		for (let i = 0; i < bodyRows.length; i++) {
			// 获取所有行，有一行有不能编辑的来源类型，不可编辑
			let srctype = bodyRows[i].values[srctypeField].value;
			if (cannotEditSrctypes.includes(srctype)) {
				isSelfMake = false;
				break;
			}
		}
	}

	return isSelfMake;
}

export {
	rateTypeMindFilter,
	rateTypeBuyFilter,
	rateTypeSellFilter,
	canRateModify,
	canRateDateModify,
	isRowSelfMake,
	isBillSelfMake
};
