/*
 * @Author: lichao 
 * @PageInfo:通过主键查询 
 * @Date: 2019-03-12 16:08:52 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:52:59
 */
import { ajax } from 'nc-lightapp-front';
import { setDownTableData } from 'scmpub/scmpub/components/VerticalEditTable';
import { URL, FIELD, AREACODE, STATUS, PAGECODE } from '../../constance';

export default function(props, index) {
	let pk_cenpurule = props.cardTable.getDataByIndex(AREACODE.listHead, index).values.pk_cenpurule.value;
	// this.selectIndex = index;
	if (pk_cenpurule) {
		ajax({
			url: URL.queryByPks,
			data: {
				pks: [ pk_cenpurule ],
				pageid: PAGECODE,
				bodyArea: AREACODE.listBody,
				headArea: AREACODE.listHead
			},
			method: 'POST',
			success: (res) => {
				setDownTableData.call(this, res.data[0], AREACODE.listBody);
			}
		});
	} else {
		props.cardTable.setTableData(AREACODE.listBody, { rows: [] });
	}
}
