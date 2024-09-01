/*
 * @Author: jiangfw 
 * @PageInfo: 列表界面按钮常量 
 * @Date: 2018-08-09 09:20:53 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-14 12:35:23
 */
import { BUTTONID } from './index';
// 卡片浏览态表头显示的全部按钮
const LIST_HEAD_ALL_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.Delete,
	BUTTONID.Commit,
	BUTTONID.UnCommit,
	BUTTONID.Assist,
	BUTTONID.SendAp,
	BUTTONID.CancelSendAp,
	BUTTONID.FeeInvoice,
	BUTTONID.Freeze,
	BUTTONID.UnFreeze,
	BUTTONID.DocMng,
	BUTTONID.LinkQuery,
	BUTTONID.QueryAboutBusiness,
	BUTTONID.LinkInvoice,
	BUTTONID.LinkQueryFeeInvoice,
	BUTTONID.Print,
	BUTTONID.PrintOut,
	BUTTONID.Print_list,
	BUTTONID.PrintCountQuery,
	BUTTONID.Refresh,
	BUTTONID.InvoiceDzfp
];

// 自由态表头显示的按钮
const LIST_HEAD_FREE_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.Delete,
	BUTTONID.Commit,
	BUTTONID.Assist,
	BUTTONID.DocMng,
	BUTTONID.LinkQuery,
	BUTTONID.QueryAboutBusiness,
	BUTTONID.LinkInvoice,
	BUTTONID.Print,
	BUTTONID.PrintOut,
	BUTTONID.Print_list,
	BUTTONID.PrintCountQuery,
	BUTTONID.Refresh
];

// 审批中表头显示的按钮
const LIST_HEAD_APPROVING_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.UnCommit,
	BUTTONID.Assist,
	BUTTONID.DocMng,
	BUTTONID.LinkQuery,
	BUTTONID.QueryAboutBusiness,
	BUTTONID.LinkInvoice,
	BUTTONID.Print,
	BUTTONID.PrintOut,
	BUTTONID.Print_list,
	BUTTONID.PrintCountQuery,
	BUTTONID.Refresh
];

// 审批不通过表头显示的按钮
const LIST_HEAD_NOPASS_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.Assist,
	BUTTONID.DocMng,
	BUTTONID.LinkQuery,
	BUTTONID.QueryAboutBusiness,
	BUTTONID.LinkInvoice,
	BUTTONID.Print,
	BUTTONID.Print_list,
	BUTTONID.PrintOut,
	BUTTONID.PrintCountQuery,
	BUTTONID.Refresh
];

// 审批通过表头显示的按钮
const LIST_HEAD_AUDIT_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.UnCommit,
	BUTTONID.Assist,
	BUTTONID.DocMng,
	BUTTONID.LinkQuery,
	BUTTONID.QueryAboutBusiness,
	BUTTONID.LinkInvoice,
	BUTTONID.Print,
	BUTTONID.PrintOut,
	BUTTONID.Print_list,
	BUTTONID.PrintCountQuery,
	BUTTONID.Refresh
];

// 无数据表头显示的按钮
const LIST_HEAD_NODATA_ACTIONS = [
	BUTTONID.Add_G,
	BUTTONID.Add,
	BUTTONID.Invoice,
	BUTTONID.Ref50,
	BUTTONID.ScInvoice,
	BUTTONID.Refresh,
	BUTTONID.Assist,
	BUTTONID.LinkQuery

];

export {
	LIST_HEAD_ALL_ACTIONS,
	LIST_HEAD_FREE_ACTIONS,
	LIST_HEAD_APPROVING_ACTIONS,
	LIST_HEAD_NOPASS_ACTIONS,
	LIST_HEAD_AUDIT_ACTIONS,
	LIST_HEAD_NODATA_ACTIONS
};
