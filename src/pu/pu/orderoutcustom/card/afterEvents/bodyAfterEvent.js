/*
 * @Author: liujia9 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-19 10:25:45
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
