/*
 * @Author: xiahui
 * @PageInfo: 表单编辑后事件
 * @Date: 2019-01-14 16:49:19
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-05-22 14:44:53
 */
import { FIELDS } from '../const';

export default function(props, moduleId, key, value, oldVal, refInfo) {
	if (key == FIELDS.FPAYMENTFLAG) {
		this.setItemEnabled();
	}
}
