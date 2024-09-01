/*
 * @Author:  王龙华 
 * @PageInfo: 信用额度审批单按钮点击事件 
 * @Date: 2018-06-02 14:53:05 
 * @Last Modified by: zhaoqiang
 * @Last Modified time: 2021-07-14 14:07:45
 */
import {
	add_BtnClick,
	delete_BtnClick,
	edit_BtnClick,
	cancel_BtnClick,
	save_BtnClick,
	copy_BtnClick,
	addLine_BtnClick,
	deleteLine_BtnClick,
	copyLine_BtnClick,
	refresh_BtnClick,
	saveCommit_BtnClick,
	commit_BtnClick,
	unCommit_BtnClick,
	print_BtnClick,
	pasteLineToTail_BtnClick,
	canelCopy_BtnClick,
	billClose_BtnClick,
	billOpen_BtnClick,
	fileManage_BtnClick,
	queryAboutBusiness_BtnClick,
	arsubDetail_BtnClick,
	output_BtnClick,
	add4621_BtnClick,
	add4641_BtnClick,
	quittransfer_BtnClick,
	pushReceivable_BtnClick,
	pushArsubToGathering_BtnClick,
	resetRowNo_BtnClick,
	queryBudget_BtnClick,
	approveInfo_BtnClick,
	printCountQuery_BtnClick
} from './index';
import { BUTTON } from '../../const';

export default function clickBtn(index, props, id, value) {
	switch (id) {
		// 新增
		case BUTTON.add:
			add_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4621:
			return add4621_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4641:
			return add4641_BtnClick.call(this, props);
			break;
		// 修改
		case BUTTON.edit:
			edit_BtnClick.call(this, props);
			break;
		// 删除
		case BUTTON.delete:
			delete_BtnClick.call(this, props);
			break;
		//	保存并提交
		case BUTTON.saveCommit:
			saveCommit_BtnClick.call(this, props);
			break;
		//	提交
		case BUTTON.commit:
			commit_BtnClick.call(this, props);
			break;
		//	收回
		case BUTTON.unCommit:
			unCommit_BtnClick.call(this, props);
			break;
		// CloseBill 整单关闭
		case BUTTON.closeBill:
			return billClose_BtnClick.call(this, props);
			break;
		// OpenBill 整单打开
		case BUTTON.openBill:
			return billOpen_BtnClick.call(this, props);
			break;
		// FileManage	附件管理
		case BUTTON.fileManage:
			return fileManage_BtnClick.call(this, props);
			break;
		// QueryAboutBusiness	单据追溯
		case BUTTON.queryAboutBusiness:
			return queryAboutBusiness_BtnClick.call(this, props);
			break;
		// 费用冲抵
		case BUTTON.offsetInfo:
			arsubDetail_BtnClick.call(this, props);
			break;
		// ApproveInfo 查看审批意见
		case BUTTON.approveInfo:
			return approveInfo_BtnClick.call(this, props);
			break;
		// 生成红字应收
		case BUTTON.pushReceivable:
			pushReceivable_BtnClick.call(this, props);
			break;
		// 生成收款
		case BUTTON.pushArsubToGathering:
			pushArsubToGathering_BtnClick.call(this, props);
			break;
		// 打印
		case BUTTON.print:
			return print_BtnClick.call(this, props);
		// Output 输出
		case BUTTON.output:
			return output_BtnClick.call(this, props);
			break;
		// 取消
		case BUTTON.cancel:
			cancel_BtnClick.call(this, props, index);
			break;
		// 保存
		case BUTTON.save:
			save_BtnClick.call(this, props);
			break;
		// 复制
		case BUTTON.copy:
			copy_BtnClick.call(this, props);
			break;
		//	刷新
		case BUTTON.refresh:
			refresh_BtnClick.call(this, props);
			break;
		// 重排行号
		case BUTTON.resetRowNo:
			resetRowNo_BtnClick.call(this, props);
			break;
		// 新增行
		case BUTTON.addLine:
			addLine_BtnClick.call(this, props);
			break;
		// 删除行
		case BUTTON.deleteLine:
			deleteLine_BtnClick.call(this, props);
			break;
		// 复制行
		case BUTTON.copyLine:
			copyLine_BtnClick.call(this, props);
			break;
		// 粘贴至末行
		case BUTTON.pasteLineToTail:
			pasteLineToTail_BtnClick.call(this, props);
			break;
		// 取消粘贴
		case BUTTON.canelCopy:
			canelCopy_BtnClick.call(this, props);
			break;
		// QuitTransfer 退出转单
		case BUTTON.quitTransfer:
			return quittransfer_BtnClick.call(this, props);
			break;
		// 联查预算
		case BUTTON.queryBudget:
			queryBudget_BtnClick.call(this, props);
			break;
		// PrintCountQuery 打印查询
		case BUTTON.printCountQuery:
			printCountQuery_BtnClick.call(this, props);
			break;
		default:
			break;
	}
}
