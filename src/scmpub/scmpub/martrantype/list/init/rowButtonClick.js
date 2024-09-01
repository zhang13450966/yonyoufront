/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型行按钮事件
 * @Date: 2018-05-31 09:54:50 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 14:26:38
 */
import { browserDel, editDel } from './rowDel_BtnClick';
import { MARTRANTYPE_CONST, BTNCODE } from '../const';
const { DELETE } = BTNCODE;

export default function rowBtnClick(props, key, record, index) {
	switch (key) {
		case DELETE:
			let status = props.editTable.getStatus(MARTRANTYPE_CONST.TABLEID);
			if (status == MARTRANTYPE_CONST.BROWSE || status == undefined) {
				// 浏览态删除
				return browserDel.call(this, props, record, index);
			} else {
				// 编辑态删除
				return editDel.call(this, props, index);
			}
	}
}
