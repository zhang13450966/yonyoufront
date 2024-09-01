/*
 * @Author:  王龙华 
 * @PageInfo: 信用额度审批单按钮点击事件 
 * @Date: 2018-06-02 14:53:05 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-14 10:25:04
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
	fileManage_BtnClick,
	queryAboutBusiness_BtnClick,
	output_BtnClick,
	add30_BtnClick,
	add4804_BtnClick,
	quittransfer_BtnClick,
	approveInfo_BtnClick,
	resetRowNo_BtnClick
} from './index';
import { rowCopyPasteUtils } from '../../../pub/tool/cardTableTools';
import {
	BUTTON,
	PREPAIDINVOICE_CONST,
	CARD_BODY_BUTTONS,
	PrepaidinvoiceHeadItem,
	REVISEHISTORY_CONST
} from '../../const';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
export default function clickBtn(index, props, id, value) {
	switch (id) {
		// 新增
		case BUTTON.add:
			add_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add4804:
			return add4804_BtnClick.call(this, props);
			break;
		// add 新增
		case BUTTON.add30:
			return add30_BtnClick.call(this, props);
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
			cancelCommon.call(this, props);
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
		// FileManage	附件管理
		case BUTTON.fileManage:
			return fileManage_BtnClick.call(this, props);
			break;
		// approveInfo	审批详情
		case BUTTON.approveInfo:
			return approveInfo_BtnClick.call(this, props);
			break;
		// QueryAboutBusiness	单据追溯
		case BUTTON.queryAboutBusiness:
			return queryAboutBusiness_BtnClick.call(this, props);
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
			cancelCommon.call(this, props);
			cancel_BtnClick.call(this, props, index);
			break;
		// 保存
		case BUTTON.save:
			cancelCommon.call(this, props);
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
		//打印次数查询
		case BUTTON.PrintCountQuery:
			let CONST = { hid: PrepaidinvoiceHeadItem.hid, area: REVISEHISTORY_CONST.listTableId };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
		default:
			break;
	}
}

function cancelCommon(props) {
	//防止点击肩上复制行之后直接点击保存或者取消导致 肩部和行按钮显示出错
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		PREPAIDINVOICE_CONST.tableId,
		CARD_BODY_BUTTONS.EDIT,
		CARD_BODY_BUTTONS.PASTE
	);
}
