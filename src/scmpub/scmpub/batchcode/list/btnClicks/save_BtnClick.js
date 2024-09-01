/*
 * @Author: 刘奇 
 * @PageInfo: 保存按钮点击事件
 * @Date: 2018-05-16 20:51:00 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-13 13:33:06
 */
import { ajax } from 'nc-lightapp-front';
import { STATUS, URL, AREA } from '../constance';
import { getChangedRows, updateEditTableRows } from '../../../pub/tool/editTableTools';
import { showSuccessInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { buttonControl } from '../viewController/buttonController';
export default function save_BtnClick(props) {
	// 过滤空行
	props.editTable.filterEmptyRows(this.tableId, [ 'binqc' ]);
	// 获取改变的行
	let tableRows = getChangedRows(props, this.tableId);
	if (tableRows) {
		let flag = props.editTable.checkRequired(this.tableId, props.editTable.getAllRows(this.tableId));
		if (flag) {
			let table = {
				areaType: 'table',
				areacode: AREA.tableArea,
				pageinfo: {
					pageIndex: -1
				},
				rows: tableRows
			};
			let data = {
				pageid: this.pageId,
				table: table
			};
			this.props.validateToSave(data, () => {
				ajax({
					url: URL.save,
					data: data,
					success: (res) => {
						if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
							props.dealFormulamsg(res.formulamsg);
						}
						if (res.success) {
							if (res.data[this.tableId]) {
								updateEditTableRows(props, this.tableId, res.data[this.tableId].rows);
								let newdata = props.editTable.getAllRows(this.tableId);
								newdata.forEach((item) => {
									if (item.status != 3) {
										item.status = 0;
									}
								});
								let newdatas = { rows: newdata };
								props.editTable.setTableData(this.tableId, newdatas);
							}
							this.props.editTable.selectAllRows(this.tableId, false);
							buttonControl.call(this, STATUS.browse);
							showSuccessInfo(getLangByResId(this, '4001BATCHCODE-000006')); /* 国际化处理： 保存成功*/
						}
					}
				});
			});
		}
	} else {
		props.editTable.setStatus(this.tableId, STATUS.browse);
		this.props.editTable.selectAllRows(this.tableId, false);
		buttonControl.call(this, props);
		showSuccessInfo(getLangByResId(this, '4001BATCHCODE-000006')); /* 国际化处理： 保存成功*/
	}
}
