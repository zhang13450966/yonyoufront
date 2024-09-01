/*
 * @Author: chaiwx 
 * @PageInfo: 设置按钮状态  
 * @Date: 2018-05-17 19:06:04 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-29 11:28:40
 */
import { BUTTONID } from '../../constance';
import { BILLSTATUS } from '../../constance';

export default function(props, record, checkArr) {
	if (checkArr.length == 1) {
		// 单行选中，设置按钮状态
		let values = checkArr[0].data.values;
		// 删除
		deleteOp(props, values);
		// 提交
		commitOp(props, values);
		// 收回
		unCommitOp(props, values);
		// 整单关闭
		billCloseOp(props, values);
		// 整单打开
		billOpenOp(props, values);

		props.button.setDisabled({
			[BUTTONID.File]: false,
			[BUTTONID.Print]: false,
			[BUTTONID.Output]: false,
			[BUTTONID.LinkQueryVoucher]: false,
			[BUTTONID.LinkQueryBudget]: false,
			[BUTTONID.BillLinkQuery]: false
		});
	} else if (checkArr.length == 0) {
		props.button.setDisabled({
			[BUTTONID.Delete]: true,
			[BUTTONID.Commit]: true,
			[BUTTONID.UnCommit]: true,
			[BUTTONID.BillClose]: true,
			[BUTTONID.BillOpen]: true,
			[BUTTONID.File]: true,
			[BUTTONID.Print]: true,
			[BUTTONID.Output]: true,
			[BUTTONID.LinkQueryVoucher]: true,
			[BUTTONID.LinkQueryBudget]: true,
			[BUTTONID.BillLinkQuery]: true
		});
	} else {
		props.button.setDisabled({
			[BUTTONID.Delete]: false,
			[BUTTONID.Commit]: false,
			[BUTTONID.UnCommit]: false,
			[BUTTONID.BillClose]: false,
			[BUTTONID.BillOpen]: false,
			[BUTTONID.File]: false,
			[BUTTONID.Print]: false,
			[BUTTONID.Output]: false,
			[BUTTONID.LinkQueryVoucher]: false,
			[BUTTONID.LinkQueryBudget]: false,
			[BUTTONID.BillLinkQuery]: false
		});
	}
}

function unCommitOp(props, values) {
	let fstatusflag = values.fstatusflag.value;
	if (BILLSTATUS.auditing != fstatusflag && BILLSTATUS.audit != fstatusflag) {
		props.button.setDisabled({ [BUTTONID.UnCommit]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.UnCommit]: false });
	}
}

function commitOp(props, values) {
	let fstatusflag = values.fstatusflag.value;
	if (BILLSTATUS.free != fstatusflag) {
		props.button.setDisabled({ [BUTTONID.Commit]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.Commit]: false });
	}
}

function deleteOp(props, values) {
	let fstatusflag = values.fstatusflag.value;
	if (BILLSTATUS.free != fstatusflag) {
		props.button.setDisabled({ [BUTTONID.Delete]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.Delete]: false });
	}
}

function billCloseOp(props, values) {
	let fstatusflag = values.fstatusflag.value;
	if (BILLSTATUS.audit != fstatusflag) {
		props.button.setDisabled({ [BUTTONID.BillClose]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.BillClose]: false });
	}
}

function billOpenOp(props, values) {
	let fstatusflag = values.fstatusflag.value;
	if (BILLSTATUS.close != fstatusflag) {
		props.button.setDisabled({ [BUTTONID.BillOpen]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.BillOpen]: false });
	}
}
