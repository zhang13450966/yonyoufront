/*
 * @Author: chaiwx 
 * @PageInfo: 页面渲染相关控制
 * @Date: 2019-02-14 10:06:57 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 10:29:53
 */
import { AREA } from '../../constance';
import buttonControl from './buttonControl';

function componentInitFinished() {
	setTimeout(() => {
		let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
		buttonControl.bind(this, this.props, null, checkArr)();
	}, 1);
}

export { componentInitFinished };
