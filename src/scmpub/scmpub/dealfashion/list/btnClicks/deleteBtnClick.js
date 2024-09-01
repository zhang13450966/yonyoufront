/*
 * @Author: lichao 
 * @PageInfo: 删除  
 * @Date: 2019-03-12 16:03:46 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-07-09 16:56:02
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREACODE, STATUS } from '../../constance';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { viewController } from '../viewController';

export default function deleteButton(props, record) {
	let numberindex = parseInt(record.values.numberindex.value);
	let pkcenpurule = record.values[FIELD.pk_dealfashion].value;
	let ts = record.values.ts.value;
	let deleteInfo = { ts: ts, id: pkcenpurule };
	ajax({
		url: URL.delete,
		data: deleteInfo,
		success: (res) => {
			if (res && res.success) {
				props.editTable.deleteTableRowsByIndex(AREACODE, numberindex - 1, true);
				viewController.call(this, props, STATUS.browse);
				showSuccessInfo(getLangByResId(this, '4001DEALFASHION-000001')); /* 国际化处理： 删除成功*/
			}
		}
	});
}
