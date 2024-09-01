/*
 * @Author: qishy 
 * @Date: 2019-05-05 14:09:35 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-05 14:10:09
 */

import searchBtnClick from './searchBtnClick';
import backBtnClick from './backBtnClick';
import refreshBtnClick from './refreshBtnClick';
import { BUTTONID } from '../../constance';

export { searchBtnClick };

export function buttonClick(props, id, text, record, index) {
	switch (id) {
		case BUTTONID.Back:
			backBtnClick.call(this, props);
			break;

		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
	}
}
