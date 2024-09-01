import { PAGECODE, BUTTON, STATUS } from '../../constance';

export default function togglePageShow(props, status) {
	let flag = true;
	if (status === STATUS.browse) {
		flag = false;
		props.editTable.hideColByKey(PAGECODE.tableId, 'opr');
	} else {
		props.editTable.setStatus(PAGECODE.tableId, STATUS.edit);
		props.editTable.showColByKey(PAGECODE.tableId, 'opr');
	}
	//edit true
	props.button.setButtonVisible([ BUTTON.Add, BUTTON.Delete, BUTTON.Update ], flag);
	//browse false
	props.button.setButtonVisible({
		[BUTTON.Add]: !flag, //新增
		[BUTTON.Update]: flag, //修改
		[BUTTON.Delete]: flag, //删除
		[BUTTON.Commit]: flag, //提交
		[BUTTON.UnCommit]: flag, //收回
		[BUTTON.Approval]: flag, // 审批
		[BUTTON.UnApproval]: flag, // 取消审批
		[BUTTON.Approval_opinon]: flag // 审批意见
	});
	props.editTable.setStatus(PAGECODE.tableId, status);
}
