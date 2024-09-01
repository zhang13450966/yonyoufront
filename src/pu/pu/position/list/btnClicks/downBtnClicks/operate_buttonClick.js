/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-04 11:14:52
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 16:15:06
 */
import deleteLine_BtnClick from './deleteLine_BtnClick';
import insertLine_BtnClick from './insertLine_BtnClick';
import addLine_BtnClick from './addLine_BtnClick';

export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// AddLine	删行
		case 'AddLine':
			return addLine_BtnClick.bind(this)(props, record, index);
			break;
		// DeleteLine	删行
		case 'DeleteLine':
			return deleteLine_BtnClick.bind(this)(props, record, index);
			break;
		// InsertLine	插入行
		case 'InsertLine':
			return insertLine_BtnClick.bind(this)(props, record, index);
			break;
		default:
			break;
	}
}
