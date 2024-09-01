import { TRANSFER30, FIELD, URL } from '../../constance';
import { searchBtnClick } from './index.js';
export default function(props, key, text, record, index) {
	switch (key) {
		case TRANSFER30.Refresh: // 刷新
			searchBtnClick.call(this, 'refresh');
			break;
		default:
			break;
	}
}
