/*
 * @Author: yechd5 
 * @PageInfo: 计划员物料设置"行"按钮事件
 * @Date: 2018-05-31 09:54:50 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 10:00:46
 */
import { browserDel, editDel } from './rowDel_BtnClick';
import { PLANPOSITION_CONST } from '../const';

export default function rowBtnClick(props, key, record, index) {
	switch (key) {
		case 'Delete':
			let status = props.editTable.getStatus(PLANPOSITION_CONST.TABLEID);
			if (status == PLANPOSITION_CONST.BROWSE || status == undefined) {
				// 浏览态删除
				return browserDel.call(this, props, record, index);
				break;
			} else {
				// 编辑态删除
				return editDel.call(this, props, index);
				break;
			}
	}
}
