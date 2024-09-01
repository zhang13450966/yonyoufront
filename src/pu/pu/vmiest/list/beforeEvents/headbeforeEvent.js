/*
 * @Author: yinliangc 
 * @PageInfo: 采购暂估表头编辑后
 * @Date: 2021-07-09 13:27:37 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-25 14:30:59
 */
import { FIELD } from '../../constance';
import {
	canRateModify,
	canRateDateModify,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default async function(props, moduleId, item, value, index, record) {
	let key = item.attrcode;
	if ([ 'cratetype', 'fratecategory', 'nesttaxrate', 'nestexchgrate', 'dratedate' ].includes(key)) {
		return false;
	}
}
