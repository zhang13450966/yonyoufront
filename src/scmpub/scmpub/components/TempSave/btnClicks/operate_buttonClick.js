/*
 * @Author: wangceb
 * @PageInfo: 销售订单卡片操作列按钮事件
 * @Date: 2018-04-19 10:34:04
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:16:42
 */

import delete_BtnClick from './delete_BtnClick';
import open_BtnClick from './open_BtnClick';

export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// Open	打开
		case 'Open':
			return open_BtnClick.bind(this)(props, record, index);
		// Delete	删除
		case 'Delete':
			return delete_BtnClick.bind(this)(props, record, index);
		default:
			break;
	}
}
