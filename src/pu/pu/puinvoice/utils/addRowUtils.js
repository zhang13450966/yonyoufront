/*
 * @Author: jiangfw 
 * @PageInfo: 校验是否存在来源表头数据与当前表头数据不一致单据
 * @Date: 2018-11-07 19:41:37 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-04 16:27:14
 */

/**
 * @param {*} newInvoices 新发票 数组
 * @param {*} currentHead 当前发票表头
 * @param {*} checkAttrs 对比的属性 数组
 * @param {*} combineRows 待合并的表体
 */
export function existDifSrcBill(newInvoices, currentHead, checkAttrs, combineRows) {
	for (let newInvoice of newInvoices) {
		let newHeadVal = newInvoice.head.card_head.rows[0].values;
		let newbody = newInvoice.body.card_body.rows;
		let currentHeadVal = currentHead.rows[0].values;

		for (let attr of checkAttrs) {
			let newItemVal = '';
			let currentItemVal = '';
			if (newHeadVal[attr]) {
				newItemVal = newHeadVal[attr].value;
			}
			if (currentHeadVal[attr]) {
				currentItemVal = currentHeadVal[attr].value;
			}
			// if (!(newItemVal == currentItemVal)) return true;
			if (!equalStr(newItemVal, currentItemVal)) return true;
		}

		for (let newRow of newbody) {
			combineRows.push(newRow);
		}
	}
	return false;
}

function equalStr(str1, str2) {
	if (null == str1 || undefined == str1) str1 = '';
	if (null == str2 || undefined == str2) str2 = '';

	if (str1 == str2) {
		return true;
	} else {
		return false;
	}
}
