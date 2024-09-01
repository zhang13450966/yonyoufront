/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，列表页面，页面及按钮装填控制
 * @Date: 2021-11-19 15:48:21 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-04 16:03:30
 */
import { AREA, CONSTFIELD, FIELD, BTNID } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

/**
 * 表头按钮状态设置
 * 1、设置界面状态
 * 2、设置按钮的显示隐藏
 * 3、设置按钮的可用性
 * @param {*} props 
 * @param {*} status 
 */
export default function setButtonStatus(props) {
	let checkedrows = props.table.getCheckedRows(AREA.head);
	let billflags = [];
	//处理卡片态返回 按钮控制问题
	let data = this.props.ViewModel.getData(CONSTFIELD.dataSource);
	if (checkedrows && checkedrows.length > 0) {
		for (let i = 0; i < checkedrows.length; i++) {
			billflags.push(checkedrows[i].data.values[FIELD.fbillstatus].value);
		}
	} else if (data && data.simpleTable && checkedrows.length == 0) {
		//处理卡片态返回 按钮控制问题
		let rows = data.simpleTable.rows;
		for (let i = 0; i < rows.length; i++) {
			if (rows[i].selected) {
				checkedrows.push({ index: i, data: rows[i] });
				billflags.push(rows[i].values[FIELD.fbillstatus].value);
			}
		}
	}
	// 自由=0,提交=1,正在审批=2,审批通过=3,审批未通过=4
	let btns = {
		[BTNID.Delete]: checkedrows.length <= 0 ? true : checkedrows.length > 1 ? false : !billflags.includes('0'),
		[BTNID.Commit]: checkedrows.length <= 0 ? true : checkedrows.length > 1 ? false : !billflags.includes('0'),
		[BTNID.UnCommit]:
			checkedrows.length <= 0
				? true
				: checkedrows.length > 1 ? false : !(billflags.includes('2') || billflags.includes('3')),
		[BTNID.File]: checkedrows.length <= 0,
		[BTNID.BillLink]: checkedrows.length <= 0,
		[BTNID.Print]: checkedrows.length <= 0,
		[BTNID.PrintCountQuery]: checkedrows.length <= 0,
		[BTNID.Output]: checkedrows.length <= 0,
		[BTNID.Refresh]: false //刷新一直可用
	};
	props.button.setButtonDisabled(btns);
}
