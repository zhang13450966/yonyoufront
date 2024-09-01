/*
 * @Author: yechd5 
 * @PageInfo: 协同设置按钮事件
 * @Date: 2018-05-15 13:41:18 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-11 14:57:40
 */
import addBtnClick from './addBtnClick';
import backBtnClick from './backBtnClick';
import cancelBtnClick from './cancelBtnClick';
import copyBtnClick from './copyBtnClick';
import delBtnClick from './delBtnClick';
import editBtnClick from './editBtnClick';
import saveBtnClick from './saveBtnClick';
import refreshBtnClick from './refreshBtnClick';

export default function clickBtn(props, id) {
	switch (id) {
		case 'Add':
			let add = addBtnClick.bind(this);
			return add(props);
		case 'Cancel':
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		case 'Copy':
			let copy = copyBtnClick.bind(this);
			return copy(props);
		case 'Delete':
			let del = delBtnClick.bind(this);
			return del(props);
		case 'Save':
			let save = saveBtnClick.bind(this);
			return save(props);
		case 'Back':
			let back = backBtnClick.bind(this);
			return back(props);
		case 'Edit':
			let edit = editBtnClick.bind(this);
			return edit(props);
		case 'Refresh':
			let refreshSearch = refreshBtnClick.bind(this);
			return refreshSearch(props);
	}
}
