/*
* 页面状态控制器
 * @Author: zhngzh 
 * @Date: 2019-04-28 10:24:25 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-08-27 14:21:41
 */
import { UISTATE, PAGEAREA } from '../constance';
import buttonController from './buttonController';
export default function(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		props.editTable.setStatus(PAGEAREA.list, UISTATE.browse);
		this.setState({
			status: UISTATE.browse
		});
	} else {
		props.editTable.setStatus(PAGEAREA.list, UISTATE.edit);
		//编辑态时，公司应该是置灰
		this.setState({
			status: UISTATE.edit
		});
	}
	//设置按钮显隐性
	buttonController.call(this, props, status);
}
