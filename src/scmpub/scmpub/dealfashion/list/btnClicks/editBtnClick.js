/*
 * @Author: yinliangc 
 * @PageInfo: 修改按钮，用于业务活动控制，本身没有任何后台功能
 * @Date: 2020-09-24 20:47:36 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-09-24 20:48:30
 */

import { ajax } from 'nc-lightapp-front';
import { URL, STATUS } from '../../constance';
import { viewController } from '../viewController';

export default function saveButton(props) {
	ajax({
		url: URL.edit,
		method: 'post',
		data: {},
		success: (res) => {
			if (res && res.success) {
				viewController.call(this, props, STATUS.edit);
			}
		}
	});
}
