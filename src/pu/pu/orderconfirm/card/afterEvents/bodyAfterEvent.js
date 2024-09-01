/*
 * @Author: liujia9 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-19 10:25:45
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELD, URL } from '../../constance';
import { createBodyAfterEventData, processBillCardBodyEditResult } from 'src/scmpub/scmpub/pub/tool/afterEditUtil';

export default function afterEvent(props, moduleId, key, value, changeRow, index, record) {
	if (key == FIELD.NCONFIRMNUM) {
		nconfirmNumAfter(props, moduleId, key, value, changeRow, index, record);
	}
}

function nconfirmNumAfter(props, moduleId, key, value, changeRow, index, record) {
	let norignetprice = record.values.norignetprice.value;
	let mnyscale = record.values.norigmny.scale;
	let nconfirmmny = norignetprice * value;
	let values = {
		nconfirmmny: {
			value: nconfirmmny,
			display: nconfirmmny,
			scale: mnyscale
		}
	};

	props.cardTable.setValByKeysAndIndex(moduleId, index, values);
}
