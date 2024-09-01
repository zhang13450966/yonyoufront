/*
 * @Author: 王勇 
 * @PageInfo: 列表选中行控制  
 * @Date: 2020-01-17 09:53:57 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 14:00:52
 */
import { BUTTONINFO, TEMPLATEINFO } from '../../const/index';
export default function(props) {
	const seldatas = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
	let enableFlag = true;
	let disableFlag = true;

	if (seldatas.length > 1) {
		for (let i = 0; i < seldatas.length; i++) {
			let pk_group = seldatas[i].data.values.pk_group.value;
			let pk_org = seldatas[i].data.values.pk_org.value;
			if (pk_group === pk_org) {
				continue;
			}
			let flag = seldatas[i].data.values.bsealflag.value;
			if (!enableFlag && !disableFlag) {
				break;
			}
			if (flag) {
				enableFlag = false;
			} else {
				disableFlag = false;
			}
		}
		if (enableFlag && disableFlag) {
			props.button.setDisabled({
				[BUTTONINFO.delBtnCode]: true
			});
		} else {
			props.button.setDisabled({
				[BUTTONINFO.delBtnCode]: false
			});
		}
		props.button.setDisabled({
			[BUTTONINFO.printBtnCode]: false,
			[BUTTONINFO.outputBtnCode]: false
		});
	} else if (seldatas.length == 1) {
		let pk_group = seldatas[0].data.values.pk_group.value;
		let pk_org = seldatas[0].data.values.pk_org.value;
		if (pk_group !== pk_org) {
			props.button.setDisabled({
				[BUTTONINFO.delBtnCode]: false,
				[BUTTONINFO.printBtnCode]: false,
				[BUTTONINFO.outputBtnCode]: false
			});
		} else {
			props.button.setDisabled({
				[BUTTONINFO.delBtnCode]: true,
				[BUTTONINFO.printBtnCode]: false,
				[BUTTONINFO.outputBtnCode]: false,
				[BUTTONINFO.attachmentManageBtnCode]: false
			});
			return;
		}
	} else {
		props.button.setDisabled({
			[BUTTONINFO.delBtnCode]: true,
			[BUTTONINFO.outputBtnCode]: seldatas.length == 0,
			[BUTTONINFO.printBtnCode]: seldatas.length == 0
		});
	}
}
