import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
export default function(props, config, pks) {
	let data = { pks: pks, pagecode: PAGECODE.pagecode };
	//得到数据渲染到页面
	let _this = this;

	ajax({
		url: URL.pageQueryURL,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(PAGECODE.tableId, data[PAGECODE.tableId]);
				} else {
					props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
				}
			}
			_this.onSelect();
		}
	});
}
