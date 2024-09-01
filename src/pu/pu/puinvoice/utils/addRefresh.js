import { AREA } from '../constance';

/*
 * @Author: jiangfw 
 * @PageInfo: 界面添加刷新按钮
 * @Date: 2018-07-23 08:46:10 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-16 15:18:39
 */
export default function(props) {
	let button = [
		{
			id: 'Refresh_id',
			type: 'general_btn',
			key: 'Refresh',
			area: AREA.list_head,
			order: '1',
			children: []
		}
	];
	props.button.setButtons(button);
}
