/*
 * @Author: liujia9 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-05-10 15:32:26
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELDS, URL } from '../../constance';
import { createBodyAfterEventData, processBillCardBodyEditResult } from 'src/scmpub/scmpub/pub/tool/afterEditUtil';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (key === FIELDS.nsendoutnum) {
		nsendoutnumAfter(props, moduleId, key, value, changeRow, index, record);
	}
}

function nsendoutnumAfter(props, moduleId, key, value, changeRow, index, record) {
	//本次发货金额 =主无税净价 *本次发货数量 （且本次发货金额的精度与已发货金额 精度一致）
	let norignetprice = record.values.norignetprice.value;
	let mnyscale = record.values.nonwaymny.scale;
	let nstatusmny = norignetprice * value;
	let values = {
		nstatusmny: {
			value: nstatusmny,
			display: nstatusmny,
			scale: mnyscale
		}
	};

	props.cardTable.setValByKeysAndIndex(moduleId, index, values);
}
