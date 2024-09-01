/*
 * @Author: chaiwx 
 * @PageInfo: 设置按钮状态  
 * @Date: 2018-05-17 19:06:04 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-09-17 19:40:00
 */
import { BUTTONID } from '../../constance';
import { BILLSTATUS } from '../../constance';

export default function(props, record, checkArr) {
	if (checkArr.length == 1) {
		// 单行选中，设置按钮状态
		let values = checkArr[0].data.values;
		// 删除
		deleteOp(props, values);
		// 发送
		sendOp(props, values);
		// 取消发送
		unSendOp(props, values);
		//确认
		confirmOp(props, values);
		//取消确认
		unConfirm(props, values);
		//联查发票
		LinkQueryInvoice(props, values);

		props.button.setDisabled({
			[BUTTONID.BillLinkQuery]: false,
			[BUTTONID.Attachment]: false,
			[BUTTONID.Print]: false,
			[BUTTONID.Output]: false
		});
	} else if (checkArr.length == 0) {
		props.button.setDisabled({
			[BUTTONID.Delete]: true,
			[BUTTONID.Send]: true,
			[BUTTONID.UnSend]: true,
			[BUTTONID.Attachment]: true,
			[BUTTONID.Print]: true,
			[BUTTONID.Output]: true,
			[BUTTONID.BillLinkQuery]: true,
			[BUTTONID.LinkQueryInvoice]: true,
			[BUTTONID.Confirm]: true,
			[BUTTONID.UnConfirm]: true
		});
	} else {
		props.button.setDisabled({
			[BUTTONID.Delete]: false,
			[BUTTONID.Send]: false,
			[BUTTONID.UnSend]: false,
			[BUTTONID.Attachment]: false,
			[BUTTONID.Print]: false,
			[BUTTONID.Output]: false,
			[BUTTONID.BillLinkQuery]: false,
			[BUTTONID.LinkQueryInvoice]: false,
			[BUTTONID.Confirm]: false,
			[BUTTONID.UnConfirm]: false
		});
	}
}

function sendOp(props, values) {
	let forderstatus = values.forderstatus.value;
	if (BILLSTATUS.free != forderstatus) {
		props.button.setDisabled({ [BUTTONID.Send]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.Send]: false });
	}
}
function unSendOp(props, values) {
	let forderstatus = values.forderstatus.value;
	if (BILLSTATUS.send == forderstatus) {
		props.button.setDisabled({ [BUTTONID.UnSend]: false });
	} else {
		props.button.setDisabled({ [BUTTONID.UnSend]: true });
	}
}
//确认
function confirmOp(props, values) {
	let forderstatus = values.forderstatus.value;
	if (BILLSTATUS.confirm != forderstatus) {
		props.button.setDisabled({ [BUTTONID.Confirm]: false });
	} else {
		props.button.setDisabled({ [BUTTONID.Confirm]: true });
	}
}
//取消确认
function unConfirm(props, values) {
	let forderstatus = values.forderstatus.value;
	if (BILLSTATUS.confirm == forderstatus) {
		props.button.setDisabled({ [BUTTONID.UnConfirm]: false });
	} else {
		props.button.setDisabled({ [BUTTONID.UnConfirm]: true });
	}
}
//刪除
function deleteOp(props, values) {
	let forderstatus = values.forderstatus.value;
	if (BILLSTATUS.free != forderstatus) {
		props.button.setDisabled({ [BUTTONID.Delete]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.Delete]: false });
	}
}

//联查发票
function LinkQueryInvoice(props, values) {
	let num = values.ncollectnum.value;
	if (num == 0) {
		props.button.setDisabled({ [BUTTONID.LinkQueryInvoice]: false });
	} else {
		props.button.setDisabled({ [BUTTONID.LinkQueryInvoice]: true });
	}
}
