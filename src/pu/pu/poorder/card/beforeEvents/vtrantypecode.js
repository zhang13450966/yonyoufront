/*
 * @Author: CongKe 
 * @PageInfo: 订单类型编辑前
 * @Date: 2018-08-02 19:01:57 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-14 20:03:38
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, FIELD, PAGECODE } from '../../constance';

export default async function vtrantypecode() {
	let flag = true;
	// let table = this.props.table.getAllTableData(PAGECODE.cardbody);
	let table = this.props.cardTable.getAllData(PAGECODE.cardbody);
	if (!table || table.rows.length == 0) {
		return true;
	}
	let breceiveplan = null;
	table.rows.map((o) => {
		if (o.values.breceiveplan.value == true) {
			breceiveplan = true;
		}
	});
	if (breceiveplan) {
		// 存在到货计划
		flag = false;
	}
	return flag;
}
