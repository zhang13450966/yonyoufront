/*
 * @Author: yechd5 
 * @PageInfo: 协同设置设置按钮事件
 * @Date: 2018-05-15 13:41:18 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-10 16:36:39
 */

import delBtnClick from './delBtnClick';
import addBtnClick from './addBtnClick';
import serachBtnClick from './searchBtnClick';

export default function clickBtn(props, id) {
	switch (id) {
		case 'Add':
			let add = addBtnClick.bind(this);
			return add(props);
		case 'Delete':
			let del = delBtnClick.bind(this);
			return del(props);
		case 'searchButton':
			let search = serachBtnClick.bind(this);
			return search(props);
		case 'Refresh':
			let refreshSearch = serachBtnClick.bind(this);
			return refreshSearch(props, 'refresh');
			
	}
}
