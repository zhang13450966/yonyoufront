/*
 * @Author: chaiwx 
 * @PageInfo: 按钮点击入口 
 * @Date: 2018-05-29 14:38:52 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-07-08 10:41:04
 */

import commonSearch from './commonSearch';
import searchBtnClick from './searchBtnClick';
import { BUTTONID } from '../../constance';
import fileBtnClick from './fileBtnClick';
import refreshBtnClick from './refreshBtnClick';
import deleteBtnClick from './deleteBtnClick';
import printBtnClick from './printBtnClick';
import outputBtnClick from './outputBtnClick';
import sendBtnClick from './sendBtnClick';
import unSendBtnClick from './unSendBtnClick';
import confirmBtnClick from './confirmBtnClick';
import unconfirmBtnClick from './unconfirmBtnClick';
import editBtnClick from './editBtnClick';
import pageInfoClick from './pageInfoClick';
import billLinkQueryBtnClick from './billLinkQueryBtnClick';
import BuyStoreBtnClick from './BuyStoreBtnClick';
import invoiceBtnClick from './invoiceBtnClick';
import LinckQueryInvoiceBtnClick from './LinckQueryInvoiceBtnClick';

function buttonClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		case BUTTONID.Add:
			BuyStoreBtnClick.call(this, props);
			break;
		//附件管理
		case BUTTONID.Attachment:
			fileBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case BUTTONID.Delete:
			deleteBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.Send:
			sendBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.UnSend:
			unSendBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.Confirm:
			confirmBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.UnConfirm:
			unconfirmBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTONID.Output:
			outputBtnClick.call(this, props);
			break;
		case BUTTONID.Edit:
			editBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.BillLinkQuery:
			billLinkQueryBtnClick.call(this, props);
			break;
		case BUTTONID.Invoice:
			invoiceBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.LinkQueryInvoice:
			LinckQueryInvoiceBtnClick.call(this, props, record, index);
			break;
	}
}

export { searchBtnClick, commonSearch, pageInfoClick, buttonClick };
