/*
 * @Author: zhangflr 
 * @Date: 2021-08-19 10:12:16 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 10:24:15
 */
import { getBodyLineMaxValue } from '../../utils';
import { PAGECODE, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	let bodyrow = props.editTable.getNumberOfRows(PAGECODE.bodyId);
	let bodyLinValue = getBodyLineMaxValue(props);
	props.editTable.addRow(PAGECODE.bodyId);
	props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.bshow, {
		value: true,
		display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
	});
	props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.ishoworder, {
		value: bodyLinValue + 1 + '',
		display: bodyLinValue + 1 + ''
	});
}
