import addBtnClick from '../btnClicks/addBtnClick';
import batchDeleteBtnClick from '../btnClicks/batchDeleteBtnClick';
import batchCommitBtnClick from '../btnClicks/batchCommitBtnClick';
import batchUnCommitBtnClick from '../btnClicks/batchUnCommitBtnClick';
import ref50BtnClick from '../btnClicks/ref50BtnClick';
import invoiceBtnClick from '../btnClicks/invoiceBtnClick';
import MilestoninvoiceBtnClick from '../btnClicks/MilestoninvoiceBtnClick';
import ref55E6invoiceBtnClick from '../btnClicks/ref55E6invoiceBtnClick';
import scInvoiceBtnClick from '../btnClicks/scInvoiceBtnClick';
import queryAboutBusinessBtnClick from '../btnClicks/queryAboutBusinessBtnClick';
import approveInfoBtnClick from '../btnClicks/approveInfoBtnClick';
import docMngBtnClick from '../btnClicks/docMngBtnClick';
import printBtnClick from '../btnClicks/printBtnClick';
import printListBtnClick from '../btnClicks/printListBtnClick';
import printOutBtnClick from '../btnClicks/printOutBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import copyBtnClick from '../btnClicks/copyBtnClick';
import batchFreezeBtnClick from '../btnClicks/batchFreezeBtnClick';
import batchUnFreezeBtnClick from '../btnClicks/batchUnFreezeBtnClick';
import batchSendApBtnClick from '../btnClicks/batchSendApBtnClick';
import batchCancelSendApBtnClick from '../btnClicks/batchCancelSendApBtnClick';
import refreshBtnClick from '../btnClicks/refreshBtnClick';
import feeInvoiceClick from '../btnClicks/feeInvoiceClick';
import checkDataPermission from '../btnClicks/checkDataPermission';
import linkQueryFeeInvoiceClick from '../btnClicks/linkQueryFeeInvoiceClick';
import { BUTTONID, FIELD, AREA } from '../../constance/index';
import linkInvoiceBtnClick from '../btnClicks/linkInvoiceBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
import invoiceDzfpBtnClick from '../btnClicks/invoiceDzfpBtnClick';

export default function btnClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		case BUTTONID.Refresh: //刷新
			return refreshBtnClick.call(this);
		case BUTTONID.Add: //自制
			return addBtnClick.call(this);
		case BUTTONID.Delete: //删除
			return batchDeleteBtnClick.call(this, props, record, index);
		case BUTTONID.Commit: //提交
			return batchCommitBtnClick.call(this, props, record, index);
		case BUTTONID.BatchUnCommit: //批量收回
			return batchUnCommitBtnClick.call(this, props);
		case BUTTONID.UnCommit: //收回
			return batchUnCommitBtnClick.call(this, props);
		case BUTTONID.Freeze: //冻结
			return batchFreezeBtnClick.call(this);
		case BUTTONID.UnFreeze: //解冻
			return batchUnFreezeBtnClick.call(this, props);
		case BUTTONID.SendAp: // 传应付
			return batchSendApBtnClick.call(this, props);
		case BUTTONID.CancelSendAp: // 取消传应付
			return batchCancelSendApBtnClick.call(this, props);
		case BUTTONID.Invoice: //收票
			return invoiceBtnClick.call(this, props, record);
		case BUTTONID.MilestonInvoice: //采购订单付款计划收票
			return MilestoninvoiceBtnClick.call(this, props, record);
		case BUTTONID.Ref55E6: //GXWW
			return ref55E6invoiceBtnClick.call(this, props, record);

		case BUTTONID.ScInvoice: //委外收票
			return scInvoiceBtnClick.call(this, props, record);
		case BUTTONID.Ref50: //消耗汇总收票
			return ref50BtnClick.call(this, props, record);
		case BUTTONID.QueryAboutBusiness: // 单据追溯
			return queryAboutBusinessBtnClick.call(this, props);
		case BUTTONID.ApproveInfo: // 审批详情
			return approveInfoBtnClick.call(this, record);
		case BUTTONID.DocMng: // 附件管理
			return docMngBtnClick.call(this, props);
		case BUTTONID.Print: // 打印
			return printBtnClick.call(this, props);
		case BUTTONID.Print_list: // 打印清单
			return printListBtnClick.call(this, props);
		case BUTTONID.PrintOut: // 打印
			return printOutBtnClick.call(this, props);
		case BUTTONID.Edit: // 修改
			return checkDataPermission.call(this, record, 'edit', editBtnClick.bind(this, props, '', record));
		case BUTTONID.Copy: // 复制
			return copyBtnClick.call(this, props, record, index);
		case BUTTONID.FeeInvoice: // 费用发票
			return feeInvoiceClick.call(this, props);
		case BUTTONID.LinkQueryFeeInvoice: //联查费用发票
			return linkQueryFeeInvoiceClick.call(this, props);
		case BUTTONID.LinkInvoice:
			return linkInvoiceBtnClick.call(this, props);
		case BUTTONID.InvoiceDzfp:
			return invoiceDzfpBtnClick.call(this, props);
		case BUTTONID.PrintCountQuery:
			let CONST = { hid: FIELD.pk_invoice, area: AREA.list_head };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
	}
}
