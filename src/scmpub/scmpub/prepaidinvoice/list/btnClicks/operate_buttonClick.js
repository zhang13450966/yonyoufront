/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表操作列按钮事件
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-18 09:57:41
 */

import { BUTTON, PrepaidinvoiceHeadItem } from '../../const';
import { approveInfo_BtnClick, commit_BtnClick, edit_BtnClick, delete_BtnClick, copy_BtnClick } from './index';

export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// Commit	修改
		case BUTTON.edit:
			return edit_BtnClick.call(this, props, record, index);
			break;
		// Delete	删除
		case BUTTON.delete:
			return delete_BtnClick.call(
				this,
				props,
				[ record[PrepaidinvoiceHeadItem.hid].value + ',' + record.ts.value ],
				[ index ]
			);
			break;
		// Commit	提交
		case BUTTON.commit:
			return commit_BtnClick.call(this, props, record, index);
			break;
		// ApproveInfo 查看审批意见
		case BUTTON.approveInfo:
			return approveInfo_BtnClick.call(this, props, record, index);
			break;
		// Copy 复制
		case BUTTON.copy:
			return copy_BtnClick.call(this, props, record, index);
			break;
		default:
			break;
	}
}
