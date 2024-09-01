/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表按钮事件处理
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: zhaoqiang
 * @Last Modified time: 2021-07-14 13:59:54
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
	billClose_BtnClick,
	billOpen_BtnClick,
	arsubDetail_BtnClick,
	add4621_BtnClick,
	add4641_BtnClick,
	pushReceivable_BtnClick,
	pushArsubToGathering_BtnClick,
	queryBudget_BtnClick,
	printCountQuery_BtnClick
} from './index';
import { BUTTON } from '../../const';
export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// add 新增
		case BUTTON.add:
			return add_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4621:
			return add4621_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4641:
			return add4641_BtnClick.call(this, props);
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
			break;
		// CloseBill 整单关闭
		case BUTTON.closeBill:
			return billClose_BtnClick.call(this, props);
			break;
		// OpenBill 整单打开
		case BUTTON.openBill:
			return billOpen_BtnClick.call(this, props);
			break;
		// 费用冲抵
		case BUTTON.offsetInfo:
			arsubDetail_BtnClick.call(this, props);
			break;
		// 生成红字应收
		case BUTTON.pushReceivable:
			pushReceivable_BtnClick.call(this, props);
			break;
		// 生成收款
		case BUTTON.pushArsubToGathering:
			pushArsubToGathering_BtnClick.call(this, props);
			break;
		// 联查预算
		case BUTTON.queryBudget:
			queryBudget_BtnClick.call(this, props);
			break;
		// 联查预算
		case BUTTON.queryBudget:
			queryBudget_BtnClick.call(this, props);
			break;
		// 联查预算
		case BUTTON.printCountQuery:
			printCountQuery_BtnClick.call(this, props);
			break;
		default:
			break;
	}
}
