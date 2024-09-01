import { AREA, URL, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import buttonControl from '../viewControl/buttonControl';

export default function(props, config, pks) {
	let data = {
		pks: pks,
		pageid: PAGECODE.LIST,
	};
	ajax({
		url: URL.PAGEQUERY,
		data: data,
		success: res => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.data) {
				props.table.setAllTableData(AREA.LIST_HEAD, res.data[AREA.LIST_HEAD]);
			} else {
				props.table.setAllTableData(AREA.LIST_HEAD, { rows: [] });
			}
			buttonControl(props, props.table.getCheckedRows(AREA.LIST_HEAD));
		},
	});
}
