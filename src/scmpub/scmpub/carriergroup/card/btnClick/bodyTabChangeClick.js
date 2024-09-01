/*
 * @Author: zhaochyu
 * @PageInfo: 表体页签切换信息
 * @Date: 2020-02-18 18:34:35
 * @Last Modified by: wangpju
 * @Last Modified time: 2020-07-31 10:33:57
 */

import { getDefData } from '../../../pub/cache';
import { AREA, FILED, CARRIERDATASOURCE } from '../../constance';
export default function(props, moduleid, key) {
	let id = this.props.form.getFormItemsValue(AREA.card_head, FILED.ccarrierid).value;
	let data = getDefData(CARRIERDATASOURCE.carrierdatasource, id);
	if (key == AREA.driver) {
		if (data && data.driver) {
			this.props.cardTable.setTableData(AREA.driver, data.driver[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.driver, { rows: [] });
		}
		this.tabkey = AREA.driver;
	} else if (key == AREA.vehicle) {
		if (data && data.vehicle) {
			this.props.cardTable.setTableData(AREA.driver, data.vehicle[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.driver, { rows: [] });
		}
		this.tabkey = AREA.vehicle;
	} else if (key == AREA.vehicletype) {
		if (data && data.vehicletype) {
			this.props.cardTable.setTableData(AREA.driver, data.vehicletype[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.driver, { rows: [] });
		}
		this.tabkey = AREA.vehicletype;
	}
}
