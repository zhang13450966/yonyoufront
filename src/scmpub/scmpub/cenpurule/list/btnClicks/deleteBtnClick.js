/*
 * @Author: lichao 
 * @PageInfo:删除   
 * @Date: 2019-03-12 16:08:52 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:53:06
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREACODE, STATUS } from '../../constance';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController';
import { deleteTableData } from 'scmpub/scmpub/components/VerticalEditTable';

export default function deleteButton(props, record) {
	let numberindex = parseInt(record.values.numberindex.value);
	let pkcenpurule = record.values[FIELD.pk_cenpurule].value;
	let ts = record.values.ts.value;
	let deleteInfo = { ts: ts, id: pkcenpurule };
	ajax({
		url: URL.delete,
		data: deleteInfo,
		success: (res) => {
			deleteTableData.call(this, AREACODE.listHead, AREACODE.listBody, [ numberindex - 1 ], pkcenpurule);
			buttonController(props, STATUS.browse);
			showSuccessInfo(getLangByResId(this, '4001CENPURULE-000001')); /* 国际化处理： 删除成功*/
		}
	});
}
