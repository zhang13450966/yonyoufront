/*
 * @Author: 王勇 
 * @PageInfo: 卡片-返回按钮 
 * @Date: 2020-01-17 09:34:45 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-11 16:13:47
 */
import { ROUTEURL } from '../../const/index';

export default function backBtnClick(props) {
	props.pushTo(ROUTEURL.List_URL, {
		backFlag: true,
		checked: this.state.checked,
		queryFlag: true
	});
}
