/*
 * @Author: jiangfw 
 * @PageInfo: 删除行 
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-09 14:29:00
 */
import { AREA } from '../../constance';
import { cacheData } from '../utils/cacheData';
let tableId = AREA.card_body;
export default function clickDeleteLineBtn(props, record, index) {
	if (index == null) {
		// 表肩删除行按钮
		let rows = props.cardTable.getCheckedRows(tableId);
		let rowIds = [];
		rows.map((item) => {
			rowIds.push(item.index);
		});
		props.cardTable.delRowsByIndex(tableId, rowIds);
		let map = new Map();
		for (let i = 0; i < rows.length; i++) {
			if (rows[i] && rows[i].data && rows[i].data.values && rows[i].data.values.csourcebid) {
				map.set(rows[i].data.values.csourcebid.value, rows[i].data.values.csourcebid.value);
			}
		}
		if (this.refsourcdata && this.refsourcdata.transferInfo) {
			this.refsourcdata.transferInfo.forEach((o) => {
				if (o.key && 'ic_vmi_sum.cvmihid' == o.key) {
					// 消耗汇总特殊处理
					if (o.data && o.data.length > 0) {
						for (let j = o.data.length - 1; j >= 0; j--) {
							if (o.data[j].head && map.get(o.data[j].head.pk)) {
								o.data.splice(j, 1);
							}
						}
					}
				} else {
					if (o.data && o.data.length > 0) {
						o.data.forEach((e) => {
							if (e.bodys && e.bodys.length > 0) {
								for (let j = e.bodys.length - 1; j >= 0; j--) {
									if (map.get(e.bodys[j].pk) != null || map.get(e.bodys[j].pk) != undefined) {
										e.bodys.splice(j, 1);
									}
								}
							}
						});
					}
				}
			});
		}
	} else {
		// 行操作删除行按钮
		props.cardTable.delRowsByIndex(tableId, index);
		if (this.refsourcdata && this.refsourcdata.transferInfo) {
			this.refsourcdata.transferInfo.forEach((o) => {
				if (o.key && 'ic_vmi_sum.cvmihid' == o.key) {
					// 消耗汇总特殊处理
					if (o.data && o.data.length > 0) {
						for (let j = o.data.length - 1; j >= 0; j--) {
							if (o.data[j].head && record.values.csourcebid.value == o.data[j].head.pk) {
								o.data.splice(j, 1);
							}
						}
					}
				} else {
					if (o.data && o.data.length > 0) {
						o.data.forEach((e) => {
							if (e.bodys && e.bodys.length > 0) {
								for (let i = e.bodys.length - 1; i >= 0; i--) {
									if (record.values.csourcebid.value == e.bodys[i].pk) {
										e.bodys.splice(i, 1);
									}
								}
							}
						});
					}
				}
			});
		}
	}

	// 更新缓存
	cacheData.call(this, tableId);
}
