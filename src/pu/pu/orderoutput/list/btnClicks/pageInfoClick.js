/*
 * @Author: xiahui 
 * @PageInfo: 翻页 
 * @Date: 2018-09-15 11:15:40 
 * @Last Modified by: xiahui
 * @Last Modified time: 2018-09-15 12:30:27
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL, FIELD } from '../../constance/constance';

export default function(num, pks) {
	let reqData = {
		pks: pks,
		pagecode: PAGECODE.list
	};
	//得到数据渲染到页面
	ajax({
		url: URL.qryOrderByPks,
		data: reqData,
		success: (res) => {
			if (res.success && res.data) {
				this.props.insertTable.setInsertTableValue(AREA.head, res.data[AREA.head], FIELD.pk_order);
			} else {
				this.props.insertTable.setInsertTableValue(AREA.head, { rows: [] });
			}
		}
	});
}
