/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型设置按钮事件
 * @Date: 2018-05-15 13:41:18 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-08-31 12:34:27
 */
import cancelBtnClick from './cancel_BtnClick';
import delBtnClick from './del_BtnClick';
import addBtnClick from './add_BtnClick';
import editBtnClick from './edit_BtnClick';
import saveBtnClick from './save_BtnClick';
import refreshBtnClick from './refresh_BtnClick';
import print_BtnClick from './print_BtnClick';
import { BTNCODE } from '../const';
const { ADD, EDIT, CANCEL, DELETE, SAVE, REFRESH, PRINT } = BTNCODE;

export default function clickBtn(props, id) {
	switch (id) {
		case ADD:
			let add = addBtnClick.bind(this);
			return add(props);
		case EDIT:
			let edit = editBtnClick.bind(this);
			return edit(props);
		case SAVE:
			let save = saveBtnClick.bind(this);
			return save(props);
		case DELETE:
			let del = delBtnClick.bind(this);
			return del(props);
		case CANCEL:
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		case PRINT:
			let print = print_BtnClick.bind(this);
			return print(props);
		case REFRESH:
			let refresh = refreshBtnClick.bind(this);
			return refresh(props);
	}
}
