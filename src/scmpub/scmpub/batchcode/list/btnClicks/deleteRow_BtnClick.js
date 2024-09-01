/*
 * @Author: 刘奇 
 * @PageInfo: 行删除
 * @Date: 2018-05-30 21:59:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2022-04-21 19:22:13
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function deleteRow_BtnClick(props, record, index) {
	let status = props.editTable.getStatus(AREA.tableArea);
	if (status == undefined || status === 'browse') {
		let delObj = {
			rowId: index,
			status: '3',
			values: {
				ts: {
					value: record.values.ts.value
				},
				pk_batchcode: {
					value: record.values.pk_batchcode.value
				},
				version: {
					value: record.values.version.value
				}
			}
		};
		let data = {
			pageid: AREA.pageArea,
			table: {
				areaType: 'table',

				pageinfo: {
					pageIndex: -1
				},
				rows: [ delObj ]
			}
		};
		ajax({
			url: URL.save,
			data: data,
			success: (res) => {
				let { success } = res;
				if (success) {
					props.editTable.deleteTableRowsByIndex(AREA.tableArea, index);
					showSuccessInfo(null, getLangByResId(this, '4001BATCHCODE-000000')); /* 国际化处理： 删除成功*/
				}
			}
		});
	} else {
		props.editTable.deleteTableRowsByIndex(AREA.tableArea, index);
	}
}
