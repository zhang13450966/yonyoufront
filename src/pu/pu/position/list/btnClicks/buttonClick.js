/*
 * @Author: yechd5
 * @PageInfo: 计划员物料设置设置按钮事件
 * @Date: 2018-05-15 19:06:08
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-14 14:31:56
 */
import cancelBtnClick from './cancel_BtnClick';
import delBtnClick from './delete_BtnClick';
import addBtnClick from './add_BtnClick';
import saveBtnClick from './save_BtnClick';
import refreshBtnClick from './refresh_BtnClick';

export default function clickBtn(props, id) {
	switch (id) {
		case 'Add':
			return addBtnClick.call(this, props);
		case 'Save':
			return saveBtnClick.call(this, props);
		case 'Delete':
			return delBtnClick.call(this, props);
		case 'Cancel':
			return cancelBtnClick.call(this, props);
		case 'Refresh':
			return refreshBtnClick.call(this, props);
	}
}
