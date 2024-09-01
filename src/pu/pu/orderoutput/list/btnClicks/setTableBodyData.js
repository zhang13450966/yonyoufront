/*
 * @Author: jiangfw
 * @PageInfo: 设置表体数据  
 * @Date: 2018-06-19 14:25:47 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-02-27 11:34:22
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELD } from '../../constance/constance';

/*
 *点击加号展开内嵌表格时，业务组请求表格数据，并且返回该数据
 *record为点击的当前行信息; hasThisChild:是否已经有该子表，如果有，不需要再次请求；
 */
export default function(record, hasThisChild) {
	if (!hasThisChild) {
		/*发送ajax请求内嵌表格数据，并return该数据
		 *内嵌表格列信息
		 */
		let reqData = {
			pks: [ record.pk_order.value ]
		};

		ajax({
			url: URL.qryOrderItem,
			data: reqData,
			success: (res) => {
				let { success, data } = res;
				if (success && data) {
					this.props.insertTable.setChildTableData(AREA.head, record, data[AREA.body], FIELD.pk_order_b);
				} else {
					this.props.insertTable.setChildTableData(AREA.body, record, { rows: [] });
				}
			}
		});
	}
}
