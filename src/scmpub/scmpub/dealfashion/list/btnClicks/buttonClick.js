/*
 * @Author: lichao 
 * @PageInfo:按钮点击入口   
 * @Date: 2019-03-12 16:03:19 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-09-24 20:49:37
 */
import { STATUS, BUTTONS, AREACODE } from '../../constance';
import batchDelBtn from './batchDelBtnClick';
import printButtonClick from './printButtonClick';
import cancelBtnClick from './cancelBtnClick';
import reFresh from './reFresh';
import deleteButton from './deleteBtnClick';
import editBtnClick from './editBtnClick';
import { viewController } from '../viewController';
import saveButtonClick from './saveBtnClick';
import outputButtonClick from './outputBtnClick';
import { getBusinessInfo } from 'nc-lightapp-front';

export default function(props, id, text, record, index) {
	let status = props.editTable.getStatus(AREACODE);
	switch (id) {
		case BUTTONS.Add: //新增
			if (status === STATUS.browse) {
				viewController.call(this, props, STATUS.add);
			}
			let businessInfo = getBusinessInfo();
			props.editTable.addRow(AREACODE, undefined, true, {
				pk_group: { value: businessInfo.groupId, display: businessInfo.groupName }
			});

			break;
		case BUTTONS.Edit: //修改
			editBtnClick.call(this, props);
			// viewController.call(this, props, STATUS.edit);
			//props.editTable.setStatus(AREACODE, STATUS.edit);
			break;
		// case BUTTONS.DelLine: //删除行
		// 	break;
		case BUTTONS.Delete: //批量删除
			if (record) {
				// 行删除
				if (status === STATUS.browse) {
					deleteButton.call(this, props, record);
				} else {
					props.editTable.deleteTableRowsByIndex(AREACODE, index);
				}
			} else {
				// 肩头删除
				if (status === STATUS.browse) {
					batchDelBtn.call(this, props);
				} else {
					let rows = props.editTable.getCheckedRows(AREACODE);
					if (rows && rows.length > 0) {
						let rowindex = rows.map((row) => {
							return row.index;
						});
						props.editTable.deleteTableRowsByIndex(AREACODE, rowindex);
					}
				}
			}
			break;
		case BUTTONS.Refresh:
			reFresh.call(this, props);
			break;
		case BUTTONS.Print: //打印
			printButtonClick.call(this, props);
			break;
		case BUTTONS.Output: //输出
			outputButtonClick.call(this, props);
			break;
		case BUTTONS.Save: //保存
			saveButtonClick.call(this, props);
			break;
		case BUTTONS.Cancel: //取消
			cancelBtnClick.call(this, props);
			break;
		default:
			break;
	}
}
