/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-04 11:14:52
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-08 16:01:31
 */
import delete_BtnClick from './delete_BtnClick';
import edit_BtnClick from './edit_BtnClick';
import { searchById } from '../commonSearch_BtnClick';
import { POSITION_CONST } from '../../../const';

export default function buttonClick(props, id, text, record, index) {
	this.selectIndex = index;

	// 先加载表体数据
	if (id && id !== 'Delete') {
		// 删除的时候不重新加载表体，加载的话会出现先删除完了之后加载返回的数据又重新设置到表体的情况。
		searchById.call(this, props, POSITION_CONST.UPTABLEID, record, index);
	}

	switch (id) {
		// Delete	删除
		case 'Delete':
			return delete_BtnClick.call(this, props, record, index);
			break;
		// Edit	修改
		case 'Edit':
			return edit_BtnClick.call(this, props, record, index);
			break;
		default:
			break;
	}
}
