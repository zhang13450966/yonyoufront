/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置"行"按钮事件
 * @Date: 2018-05-31 09:54:50 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 14:44:34
 */
import { browserDel, editDel } from './rowDel_BtnClick';
import { BUYPOSITION_CONST } from '../const';

export default function rowBtnClick(props, key, record, index) {
	switch (key) {
		case 'Delete':
			let status = props.editTable.getStatus(BUYPOSITION_CONST.TABLEID);
			if (status == BUYPOSITION_CONST.BROWSE || status == undefined) {
				// 浏览态删除
				return browserDel.call(this, props, record, index);
			} else {
				// 编辑态删除
				return editDel.call(this, props, index);
			}
	}
}
