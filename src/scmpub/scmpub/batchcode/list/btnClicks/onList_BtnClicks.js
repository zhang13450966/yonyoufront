/*
 * @Author: 刘奇 
 * @PageInfo: 按钮处理 
 * @Date: 2018-05-08 16:13:15 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-03 14:13:14
 */
import {
	delete_BtnClick,
	edit_BtnClick,
	add_BtnClick,
	save_BtnClick,
	cancel_BtnClick,
	search_BtnClick,
	print_BtnClick,
	output_BtnClick
} from './index.js';
import { BUTTON } from '../constance';
export default function onList_BtnClicks(props, btncode) {
	switch (btncode) {
		case BUTTON.add:
			add_BtnClick.call(this, props);
			break;
		case BUTTON.edit:
			edit_BtnClick.call(this, props);
			break;
		case BUTTON.save:
			save_BtnClick.call(this, props);
			break;
		case BUTTON.delete:
			delete_BtnClick.call(this, props);
			break;
		case BUTTON.cancel:
			cancel_BtnClick.call(this, props);
			break;
		case BUTTON.print:
			print_BtnClick.call(this, props);
			break;
		case BUTTON.refresh:
			search_BtnClick.call(this, props, true);
			break;
		case BUTTON.output:
			output_BtnClick.call(this, props);
			break;
	}
}
