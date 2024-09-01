/*
 * @Author: lichao 
 * @PageInfo: 单击主表行  
 * @Date: 2019-03-12 16:09:16 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:53:15
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, AREACODE, STATUS } from '../../constance';
import { setDownTableData } from 'scmpub/scmpub/components/VerticalEditTable';
export default function(props, moduleId, record, index, e) {
	this.selectIndex = index;
	let pk_cenpurule = record.values.pk_cenpurule.value;
	ajax({
		url: URL.queryByPks,
		data: { pks: [ pk_cenpurule ], pageid: PAGECODE, bodyArea: AREACODE.listBody, headArea: AREACODE.listHead },
		method: 'POST',
		success: (res) => {
			setDownTableData.call(this, res.data[0], AREACODE.listBody);
		}
	});
}
