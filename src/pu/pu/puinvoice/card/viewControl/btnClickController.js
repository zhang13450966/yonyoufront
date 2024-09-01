import addBtnClick from '../btnClicks/addBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import copyBtnClick from '../btnClicks/copyBtnClick';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import addLineBtnClick from '../btnClicks/addLineBtnClick';
import deleteLineBtnClick from '../btnClicks/deleteLineBtnClick';
import ref50BtnClick from '../btnClicks/ref50BtnClick';
import invoiceBtnClick from '../btnClicks/invoiceBtnClick';
import scInvoiceBtnClick from '../btnClicks/scInvoiceBtnClick';
import quitBtnClick from '../btnClicks/quitBtnClick';
import hphqBtnClick from '../btnClicks/hphqBtnClick';
import sendApBtnClick from '../btnClicks/sendApBtnClick';
import cancelSendApBtnClick from '../btnClicks/cancelSendApBtnClick';
import commitBtnClick from '../btnClicks/commitBtnClick';
import uncommitBtnClick from '../btnClicks/uncommitBtnClick';
import saveCommitBtnClick from '../btnClicks/saveCommitBtnClick';
import reRankRownumBtnClick from '../btnClicks/reRankRownumBtnClick';
import copyLineBtnClick from '../btnClicks/copyLineBtnClick';
import insertLineBtnClick from '../btnClicks/insertLineBtnClick';
import unfoldBtnClick from '../btnClicks/unfoldBtnClick';
import backBtnClick from '../btnClicks/backBtnClick';
import queryAboutBusinessBtnClick from '../btnClicks/queryAboutBusinessBtnClick';
import approveInfoBtnClick from '../btnClicks/approveInfoBtnClick';
import docMngBtnClick from '../btnClicks/docMngBtnClick';
import printBtnClick from '../btnClicks/printBtnClick';
import freezeBtnClick from '../btnClicks/freezeBtnClick';
import unFreezeBtnClick from '../btnClicks/unFreezeBtnClick';
import cancel_bBtnClick from '../btnClicks/Cancel_bBtnClick';
import pasteHereBtnClick from '../btnClicks/pasteHereBtnClick';
import pasteToTailBtnClick from '../btnClicks/pasteToTailBtnClick';
import refreshBtnClick from '../btnClicks/refreshBtnClick';
import feeInvoiceClick from '../btnClicks/feeInvoiceClick';
import printOutBtnClick from '../btnClicks/printOutBtnClick';
import combinePrintClick from '../btnClicks/combinePrintClick';
import refAddLineBtnClick from '../btnClicks/refAddLineBtnClick';
import linkQueryFeeInvoiceClick from '../btnClicks/linkQueryFeeInvoiceClick';
import checkDataPermission from '../btnClicks/checkDataPermission';
import { BUTTONID, FIELD, AREA } from '../../constance';
import imageViewBtnClick from '../btnClicks/imageViewBtnClick';
import imageScanBtnClick from '../btnClicks/imageScanBtnClick';
import linkInvoiceBtnClick from '../btnClicks/linkInvoiceBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
import tempStorageBtnClick from '../btnClicks/tempStorageBtnClick';
import invoiceDzfpBtn from '../btnClicks/invoiceDzfpBtnClick';
import MilestoninvoiceBtnClick from '../btnClicks/MilestoninvoiceBtnClick';
import ref55E6invoiceBtnClick from '../btnClicks/ref55E6invoiceBtnClick';

export default function btnClick(props, buttonid, record, index) {
	switch (buttonid) {
		// 新增
		case BUTTONID.Add:
		case BUTTONID.Add_G:
			return addBtnClick.call(this);
		//参照增行
		case BUTTONID.RefAddLine:
			return refAddLineBtnClick.call(this);
		// 费用发票
		case BUTTONID.FeeInvoice:
			return feeInvoiceClick.call(this);
		//联查费用发票
		case BUTTONID.LinkQueryFeeInvoice:
			return linkQueryFeeInvoiceClick.call(this, props);
		// 冻结
		case BUTTONID.Freeze:
			return freezeBtnClick.call(this);
		// 解冻
		case BUTTONID.UnFreeze:
			return unFreezeBtnClick.call(this);
		// 复制
		case BUTTONID.Copy:
			return copyBtnClick.call(this);
		// 取消
		case BUTTONID.Cancel:
			return cancelBtnClick.call(this, props, index);
		// 修改
		case BUTTONID.Edit:
			return checkDataPermission.call(this, 'edit', editBtnClick.bind(this, props));
		// 删除
		case BUTTONID.Delete:
			return delBtnClick.call(this, props);
		// 保存
		case BUTTONID.Save:
			return saveBtnClick.call(this);
		//消耗汇总收票
		case BUTTONID.Ref50:
			return ref50BtnClick.call(this);
		//收票
		case BUTTONID.Invoice:
			return invoiceBtnClick.call(this, props, record);
		case BUTTONID.MilestonInvoice: //采购订单付款计划收票
			return MilestoninvoiceBtnClick.call(this, props, record);
		//gxww
		case BUTTONID.Ref55E6:
			return ref55E6invoiceBtnClick.call(this, props, record);
		//委外收票
		case BUTTONID.ScInvoice:
			return scInvoiceBtnClick.call(this, props, record);
		// 退出转单
		case BUTTONID.Quit:
			return quitBtnClick.call(this);
		// 传应付
		case BUTTONID.SendAp:
			return sendApBtnClick.call(this);
		// 取消传应付
		case BUTTONID.CancelSendAp:
			return cancelSendApBtnClick.call(this);
		// 提交
		case BUTTONID.Commit:
			return commitBtnClick.call(this);
		// 收回
		case BUTTONID.UnCommit:
			return uncommitBtnClick.call(this);
		// 保存提交
		case BUTTONID.SaveCommit:
			return saveCommitBtnClick.call(this);
		// 新增行
		case BUTTONID.AddLine:
			return addLineBtnClick.call(this);
		// 复制行
		case BUTTONID.CopyLine:
			return copyLineBtnClick.call(this, props, index);
		// 表肩取消
		case BUTTONID.Cancel_b:
			return cancel_bBtnClick.call(this, props, index);
		// 粘贴至末行
		case BUTTONID.PasteToTail:
			return pasteToTailBtnClick.call(this, props, index);
		// 粘贴至此
		case BUTTONID.PasteHere:
			return pasteHereBtnClick.call(this, props, index);
		// 删除行
		case BUTTONID.DeleteLine:
			return deleteLineBtnClick.call(this, props, record, index);
		// // 表体删除行
		// case BUTTONID.DeleteLine_i:
		// 	return deleteLineBtnClick.call(this, props, index);
		// 插入行
		case BUTTONID.InsertLine:
			return insertLineBtnClick.call(this, props, index);
		// 展开
		case BUTTONID.Unfold:
			return unfoldBtnClick.call(this, props, record, index);
		// 重排行号
		case BUTTONID.ReRankRownum:
			return reRankRownumBtnClick.call(this);
		// 优质优价取价
		case BUTTONID.Hphq:
			return hphqBtnClick.call(this);
		// 返回
		case BUTTONID.Back:
			return backBtnClick.call(this);
		// 单据追溯
		case BUTTONID.QueryAboutBusiness:
			return queryAboutBusinessBtnClick.call(this, props);
		// 审批详情
		case BUTTONID.ApproveInfo:
			return approveInfoBtnClick.call(this, record);
		// 附件管理
		case BUTTONID.DocMng:
			return docMngBtnClick.call(this);
		// 打印
		case BUTTONID.Print:
			return printBtnClick.call(this, props);
		// 输出
		case BUTTONID.PrintOut:
			return printOutBtnClick.call(this, props);
		// 合并输出
		case BUTTONID.CombinePrint:
			return combinePrintClick.call(this, props);
		// 刷新
		case BUTTONID.Refresh:
			return refreshBtnClick.call(this);
		// 影像查看
		case BUTTONID.ImageView:
			return imageViewBtnClick.call(this, props);
		// 影像扫描
		case BUTTONID.ImageScan:
			return imageScanBtnClick.call(this, props);
		case BUTTONID.TemporaryStorage: //暂存
			tempStorageBtnClick.call(this, this.props);
			break;
		case BUTTONID.ShowDraft: //显示草稿
			this.setState({ showTemp: true });
			break;
		case BUTTONID.LinkInvoice:
			return linkInvoiceBtnClick.call(this, props);
		case BUTTONID.InvoiceDzfp: //电子发票
			return invoiceDzfpBtn.call(this, props);
		case BUTTONID.PrintCountQuery:
			let CONST = { hid: FIELD.pk_invoice, area: AREA.card_head };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
	}
}
