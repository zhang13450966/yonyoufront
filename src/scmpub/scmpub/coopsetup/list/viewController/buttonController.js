/*
 * @Author: yechd5
 * @PageInfo: 按钮的状态控制
 * @Date: 2018-12-25 10:38:05
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-10 16:59:12
 */
import { COOPSETUP_CONST } from '../../const';

export default function (props) {
	// 设置按钮可用性
	setTableButtonEnable.call(this, props);
}

/**
 * 控制按钮可用性
 * @param {*} props 
 */
function setTableButtonEnable(props) {
	// 1.先设置按钮全部可见 + 不可用
	props.button.setButtonVisible([ 'Add', 'Delete', 'Edit', 'Show', 'Refresh' ], true);

	// 2. 对于列表头“删除”按钮：界面有数据且选中后才可见
	let selectedData = props.table.getCheckedRows(COOPSETUP_CONST.LIST_DATAAREAID);
	if (selectedData.length == 0) {
		props.button.setDisabled({
			'Delete': true
		});
	} else {
		props.button.setDisabled({
			'Delete': false
		});
	}
}
