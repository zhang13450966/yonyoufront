/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置设置按钮事件
 * @Date: 2018-05-15 19:06:08 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-06-25 17:59:12
 */
import cancelBtnClick from './cancel_BtnClick';
import delBtnClick from './del_BtnClick';
import addBtnClick from './add_BtnClick';
import editBtnClick from './edit_BtnClick';
import saveBtnClick from './save_BtnClick';
import refreshBtnClick from './refresh_BtnClick';

export default function clickBtn(props, id) {
	switch (id) {
		case 'Add':
			let add = addBtnClick.bind(this);
			return add(props);
		case 'Edit':
			let edit = editBtnClick.bind(this);
			return edit(props);
		case 'Save':
			let save = saveBtnClick.bind(this);
			return save(props);
		case 'Delete':
			let del = delBtnClick.bind(this);
			return del(props);
		case 'Cancel':
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		case 'Refresh':
			let refresh = refreshBtnClick.bind(this);
			return refresh(props);
	}
}
