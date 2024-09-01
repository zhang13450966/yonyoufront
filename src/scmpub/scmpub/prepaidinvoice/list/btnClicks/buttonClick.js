/*
 * @Author: 刘奇 
 * @PageInfo: 列表按钮事件处理
 * @Date: 2019-04-12 13:54:04 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-14 10:25:13
 */

import {
	add_BtnClick,
	edit_BtnClick,
	commit_BtnClick,
	fileManage_BtnClick,
	queryAboutBusiness_BtnClick,
	unCommit_BtnClick,
	print_BtnClick,
	printList_BtnClick,
	refresh_BtnClick,
	output_BtnClick,
	delete_BtnClick,
	add30_BtnClick,
	add4804_BtnClick
} from './index';
import { BUTTON, PrepaidinvoiceHeadItem, REVISEHISTORY_CONST } from '../../const';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// add 新增
		case BUTTON.add:
			return add_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add30:
			return add30_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4804:
			return add4804_BtnClick.call(this, props);
			break;
		// edit 修改
		case BUTTON.edit:
			return edit_BtnClick.call(this, props);
			break;
		// delete 删除
		case BUTTON.delete:
			return delete_BtnClick.call(this, props);
			break;
		// Commit	提交
		case BUTTON.commit:
			return commit_BtnClick.call(this, props);
			break;
		// UnCommit	收回
		case BUTTON.unCommit:
			return unCommit_BtnClick.call(this, props);
			break;
		// FileManage	附件管理
		case BUTTON.fileManage:
			return fileManage_BtnClick.call(this, props);
			break;
		// QueryAboutBusiness	单据追溯
		case BUTTON.queryAboutBusiness:
			return queryAboutBusiness_BtnClick.call(this, props);
			break;
		// Print	打印
		case BUTTON.print:
			return print_BtnClick.call(this, props);
			break;
		// Print	打印清单
		case BUTTON.Print_list:
			return printList_BtnClick.call(this, props);
			break;
		// Output 输出
		case BUTTON.output:
			return output_BtnClick.call(this, props);
			break;
		// Refresh 刷新
		case BUTTON.refresh:
			return refresh_BtnClick.call(this, props);
		//打印次数查询
		case BUTTON.PrintCountQuery:
			let CONST = { hid: PrepaidinvoiceHeadItem.hid, area: REVISEHISTORY_CONST.listTableId };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
		default:
			break;
	}
}
