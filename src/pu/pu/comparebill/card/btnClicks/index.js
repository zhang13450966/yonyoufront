/*
 * @Author: qishy 
 * @Date: 2019-04-28 13:27:45 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-07-08 10:40:39
 */
import saveBtnClick from './saveBtnClick';
import refreshBtnClick from './refreshBtnClick';
import { BUTTONID } from '../../constance';
import backBtnClick from './backBtnClick';
import editBtnClick from './editBtnClick';
import cancelBtnClick from './cancelBtnClick';
import deleteBtnClick from './deleteBtnClick';
import sendBtnClick from './sendBtnClick';
import attachBtnClick from './attachBtnClick';
import unsendBtnClick from './unsendBtnClick';
import confirmBtnClick from './confirmBtnClick';
import unConfirmBtnClick from './unConfirmBtnClick';
import openBrowseBtnClick from './openBrowseBtnClick';
import openEditBtnClick from './openEditBtnClick';
import resetRowNoBtnClick from './resetRowNoBtnClick';
import printBtnClick from './printBtnClick';
import outputBtnClick from './outputBtnClick';
import deleteLineBtnClick from './deleteLineBtnClick';
import quitBtnClick from './quitBtnClick';
import selPriceBtnClick from './selPriceBtnClick';
import invoiceBtnClick from './invoiceBtnClick';
import billLinkQueryBtnClick from './billLinkQueryBtnClick';
import LinckQueryInvoiceBtnClick from './LinckQueryInvoiceBtnClick';
import BuyStoreBtnClick from './BuyStoreBtnClick';

export function buttonClick(props, id, text, record, index) {
	switch (id) {
		/* 卡片头部按钮 */
		//采购入库
		case BUTTONID.Add:
			BuyStoreBtnClick.call(this, props);
			break;
		case BUTTONID.Save:
			saveBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case BUTTONID.Back:
			backBtnClick.call(this, props);
			break;
		case BUTTONID.Edit:
			editBtnClick.call(this, props);
			break;
		case BUTTONID.Delete:
			deleteBtnClick.call(this, props);
			break;
		case BUTTONID.Cancel:
			cancelBtnClick.call(this, props);
			break;
		case BUTTONID.Send:
			sendBtnClick.call(this, props);
			break;
		case BUTTONID.Attachment:
			attachBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case BUTTONID.UnSend:
			unsendBtnClick.call(this, props);
			break;
		case BUTTONID.Confirm:
			confirmBtnClick.call(this, props);
			break;
		case BUTTONID.UnConfirm:
			unConfirmBtnClick.call(this, props);
			break;
		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTONID.Output:
			outputBtnClick.call(this, props);
			break;
		case BUTTONID.Quit:
			quitBtnClick.call(this, props);
			break;
		case BUTTONID.BillLinkQuery:
			billLinkQueryBtnClick.call(this, props);
			break;
		case BUTTONID.LinkQueryInvoice:
			LinckQueryInvoiceBtnClick.call(this, props);
			break;
		/* 卡片肩部按钮 */
		case BUTTONID.SelPrice:
			selPriceBtnClick.call(this, props);
			break;
		case BUTTONID.DeleteLine:
			deleteLineBtnClick.call(this, props, record, index);
			break;
		case BUTTONID.ResetRowNo:
			resetRowNoBtnClick.call(this, props);
			break;
		case BUTTONID.Invoice:
			invoiceBtnClick.call(this, props);
			break;
		/* 卡片行按钮 */
		case BUTTONID.openbrowse:
			openBrowseBtnClick.call(this, props, record);
			break;
		case BUTTONID.openedit:
			openEditBtnClick.call(this, props, record, index);
			break;
	}
}
