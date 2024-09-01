/*
 * @Author: chaiwx 
 * @PageInfo: 按钮点击事件  
 * @Date: 2018-04-10 12:21:16 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-25 14:08:25
 */
import addFeeLineBtnClick from './addFeeLineBtnClick';
import addMatLineBtnClick from './addMatLineBtnClick';
import addBtnClick from './addBtnClick';
import saveBtnClick from './saveBtnClick';
import deleteFeeLineBtnClick from './deleteFeeLineBtnClick';
import deleteMatLineBtnClick from './deleteMatLineBtnClick';
import copyLineBtnClick from './copyLineBtnClick';
import pasteLineBtnClick from './pasteLineBtnClick';
import deleteBtnClick from './deleteBtnClick';
import cancelBBtnClick from './cancelBBtnClick';
import copyBtnClick from './copyBtnClick';
import billCloseBtnClick from './billCloseBtnClick';
import billOpenBtnClick from './billOpenBtnClick';
import cancelBtnClick from './cancelBtnClick';
import editBtnClick from './editBtnClick';
import commitBtnClick from './commitBtnClick';
import unCommitBtnClick from './unCommitBtnClick';
import openBtnClick from './openBtnClick';
import saveCommitBtnClick from './saveCommitBtnClick';
import resetRowNoBtnClick from './resetRowNoBtnClick';
import fileBtnClick from './fileBtnClick';
import billLinkQueryBtnClick from './billLinkQueryBtnClick';
import approveInfoBtnClick from './approveInfoBtnClick';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';
import { BUTTONID } from '../../constance';
import outputBtnClick from './outputBtnClick';
import backBtnClick from './backBtnClick';
import lineCloseBtnClick from './lineCloseBtnClick';
import lineOpenBtnClick from './lineOpenBtnClick';
import linkQueryVoucherBtnClick from './linkQueryVoucherBtnClick';
import linkQueryBudgetBtnClick from './linkQueryBudgetBtnClick';

export function buttonClick(props, id, text, record, index) {
	switch (id) {
		case BUTTONID.Back:
			backBtnClick.call(this, props);
			break;

		case BUTTONID.Add:
			addBtnClick.call(this, props);
			break;

		case BUTTONID.AddFeeLine:
			addFeeLineBtnClick.call(this, props);
			break;
		case BUTTONID.AddMatLine:
			addMatLineBtnClick.call(this, props);
			break;

		case BUTTONID.Save:
			saveBtnClick.call(this, props);
			break;

		case BUTTONID.SaveCommit:
			saveCommitBtnClick.call(this, props);
			break;

		case BUTTONID.DeleteFeeLine:
			deleteFeeLineBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.DeleteMatLine:
			deleteMatLineBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.Delete:
			deleteBtnClick.call(this, props);
			break;

		case BUTTONID.BillClose:
			billCloseBtnClick.call(this, props);
			break;

		case BUTTONID.BillOpen:
			billOpenBtnClick.call(this, props);
			break;

		case BUTTONID.CopyLine:
			copyLineBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.PasteLineToTail:
			pasteLineBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.PasteLine:
			pasteLineBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.LineClose:
			lineCloseBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.LineOpen:
			lineOpenBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.CancelB:
			cancelBBtnClick.call(this, props);
			break;

		case BUTTONID.Copy:
			copyBtnClick.call(this, props);
			break;

		case BUTTONID.Cancel:
			cancelBtnClick.call(this, props);
			break;

		case BUTTONID.Edit:
			editBtnClick.call(this, props);
			break;

		case BUTTONID.Commit:
			commitBtnClick.call(this, props);
			break;

		case BUTTONID.UnCommit:
			unCommitBtnClick.call(this, props);
			break;

		case BUTTONID.TransInfo:
			bizInfoBtnClick.call(this, props);
			break;

		case BUTTONID.Open:
			openBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.ResetRowNo:
			resetRowNoBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.File:
			fileBtnClick.call(this, props);
			break;

		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;

		case BUTTONID.Output:
			outputBtnClick.call(this, props);
			break;

		case BUTTONID.BillLinkQuery:
			return billLinkQueryBtnClick.call(this, props);

		case BUTTONID.ApproveInfo:
			return approveInfoBtnClick.call(this, props);

		case BUTTONID.Refresh:
			return refreshBtnClick.call(this, props);

		case BUTTONID.LinkQueryVoucher:
			return linkQueryVoucherBtnClick.call(this, props);
		case BUTTONID.LinkQueryBudget:
			return linkQueryBudgetBtnClick.call(this, props);
	}
}
