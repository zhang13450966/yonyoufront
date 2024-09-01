import { PAGECODE, LIST_BUTTON, BUTTON, FIELD, BUTTON_DISABLED } from '../../constance';

export default function initButtons(props, tabCode) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	if (tabCode != null) {
		rows.length = 0;
	}
	// 初始化全部不可见
	let Delete = true;
	let Commit = true;
	let UnCommit = true;
	let Print = false;
	let PrintOut = false;
	let Refresh = false;
	if (rows.length > 0) {
		if (rows.length == 1) {
			rows.map((item) => {
				let forderstatus = item.data.values.fbillstatus.value; // 单据状态
				if (forderstatus == FIELD.free) {
					Delete = false;
					Commit = false;
				} else if (forderstatus == FIELD.approve || forderstatus == FIELD.approved) {
					UnCommit = false;
				}
			});
		} else {
			Delete = false; //多选不控制
			Commit = false;
			UnCommit = false;
		}
		Print = false;
		PrintOut = false;
	} else {
		Delete = true;
		Commit = true;
		UnCommit = true;
		// Print = false;
		// PrintOut = false;
		Print = true;
		PrintOut = true;
		Refresh = false;
	}
	let disableArr = {
		[BUTTON.Delete]: Delete, //删除
		[BUTTON.Commit]: Commit, //提交
		[BUTTON.UnCommit]: UnCommit, //收回
		[BUTTON.Print]: Print, //打印
		[BUTTON.PrintOut]: PrintOut, //输出
		[BUTTON.Refresh]: Refresh //刷新
	};
	props.button.setDisabled(disableArr);
}
