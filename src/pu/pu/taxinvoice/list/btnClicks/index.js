/*
 * @Author: chaiwx 
 * @PageInfo: 按钮点击入口 
 * @Date: 2018-05-29 14:38:52 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-15 14:42:10
 */
import pageInfoClick from './pageInfoClick';
import searchBtnClick from './searchBtnClick';
import deleteBtnClick from './deleteBtnClick';
import commitBtnClick from './commitBtnClick';
import unCommitBtnClick from './unCommitBtnClick';
import billLinkQueryBtnClick from './billLinkQueryBtnClick';
import billCloseBtnClick from './billCloseBtnClick';
import billOpenBtnClick from './billOpenBtnClick';
import editBtnClick from './editBtnClick';
import copyBtnClick from './copyBtnClick';
import approveInfoBtnClick from './approveInfoBtnClick';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';
import outputBtnClick from './outputBtnClick';
import { BUTTONID } from '../../constance';
import addBtnClick from './addBtnClick';
import fileBtnClick from './fileBtnClick';
import LinkQueryVoucherBtnClick from './LinkQueryVoucherBtnClick';

function buttonClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		case BUTTONID.Add:
			return addBtnClick.call(this, props);

		case BUTTONID.FromToApply:
			return fromToApplyBtnClick.call(this, props);

		case BUTTONID.Edit:
			return editBtnClick.call(this, props, record, index);

		case BUTTONID.Delete:
			return deleteBtnClick.call(this, props, record, index);

		case BUTTONID.Copy:
			return copyBtnClick.call(this, props, record, index);

		case BUTTONID.Commit:
			return commitBtnClick.call(this, props, record, index);

		case BUTTONID.UnCommit:
			return unCommitBtnClick.call(this, props);

		case BUTTONID.BillLinkQuery:
			return billLinkQueryBtnClick.call(this, props);

		case BUTTONID.BizInfo:
			return bizInfoBtnClick.call(this, props);

		case BUTTONID.FillInv:
			return fillInvBtnClick.call(this, props);

		case BUTTONID.SendInv:
			return sendInvBtnClick.call(this, props);

		case BUTTONID.Freeze:
			return freezeBtnClick.call(this, props);

		case BUTTONID.UnFreeze:
			return unFreezeBtnClick.call(this, props);

		case BUTTONID.BillClose:
			return billCloseBtnClick.call(this, props);

		case BUTTONID.BillOpen:
			return billOpenBtnClick.call(this, props);

		case BUTTONID.BillReturn:
			return billReturnBtnClick.call(this, props);

		case BUTTONID.File:
			fileBtnClick.call(this, props);
			break;

		case BUTTONID.ApproveInfo:
			approveInfoBtnClick.call(this, props, record, index);
			break;

		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;

		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;

		case BUTTONID.Output:
			outputBtnClick.call(this, props);
			break;

		case BUTTONID.Splitprint:
			splitprintBtnClick.call(this, props);
			break;

		case BUTTONID.File:
			fileBtnClick.call(this, props);
			break;

		case BUTTONID.LinkQueryVoucher:
			LinkQueryVoucherBtnClick.call(this, props);
			break;
	}
}

export { pageInfoClick, searchBtnClick, buttonClick };
