/*
 * @Author: lichao 
 * @PageInfo:编辑后事件   
 * @Date: 2019-03-14 15:29:02 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-03-25 15:46:13
 */
import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { FIELD, AREACODE } from '../../constance';

export default function(props, moduleId, field, value, changedrows, index, record) {
	if (field === FIELD.pk_ctrlorg) {
		//多选增行
		if (value && value.length > 1) {
			for (let i = 0; i < value.length; i++) {
				let obj = {
					pk_ctrlorg: { value: value[i].refpk, display: value[i].refcode }
				};
				obj[FIELD.pk_ctrlorg_name] = { value: value[i].refname, display: value[i].refname };
				if (i != 0) props.cardTable.addRow(moduleId, undefined, undefined, false);
				props.cardTable.setValByKeysAndIndex(moduleId, index + i, obj);
			}
		}
	} else if (field == FIELD.fctrltype) {
		if (value == 1) {
			props.cardTable.setValByKeyAndIndex(moduleId, index, FIELD.ctrantypeid, { value: null, display: null });
		}
	} else if (field == FIELD.pk_marpuclass) {
		if (props.cardTable.getNumberOfRows(AREACODE.listBody) == 0)
			props.cardTable.addRow(AREACODE.listBody, undefined, undefined, false);
	}
}
