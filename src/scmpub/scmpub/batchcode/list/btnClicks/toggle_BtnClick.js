/*
 * @Author: 刘奇 
 * @PageInfo: 启用状态点击事件
 * @Date: 2018-05-16 20:51:00 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-09 13:23:36
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function toggle_BtnClick(props, record, i) {
	// 获取改变的行
	// let tableRows = props.editTable.getChangedRows(AREA.tableArea);
	let data = {};
	// if (tableRows.length > 0) {
	let table = {
		areaType: 'table',
		pageinfo: {
			pageIndex: -1
		},
		rows: [ record ]
	};
	data = {
		pageid: AREA.pageArea,
		table: table
	};
	// } else {
	// 	return;
	// }
	let tableid = AREA.tableArea;
	let url = URL.toggle;
	ajax({
		url: url,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data[tableid]) {
					let updateRow = [
						{
							index: i,
							data: res.data[tableid].rows[0]
						}
					];
					props.editTable.updateDataByIndexs(tableid, updateRow);
					props.editTable.setRowStatus(tableid, i, 0);
					let toggleType = res.data[tableid].rows[0].values.bseal.value;
					if (toggleType) {
						showSuccessInfo(getLangByResId(this, '4001BATCHCODE-000008')); /* 国际化处理： 停用成功*/
					} else {
						showSuccessInfo(getLangByResId(this, '4001BATCHCODE-000009')); /* 国际化处理： 启用成功*/
					}
				}
			}
		}
	});
}
