/*
 * @Author: yechd5 
 * @PageInfo: 协同设置"行"按钮事件
 * @Date: 2018-05-31 09:54:50 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-02 10:45:34
 */
import { browseDel } from './rowDel_BtnClick';
import { browseEdit } from './rowEdit_BtnClick';
import { browseShow } from './rowShow_BtnClick';

export default function rowBtnClick(props, key, record, index) {
	switch (key) {
		// 删除
		case 'Delete':
			return browseDel.call(this, props, record, index);
		// 修改
		case 'Edit':
			return browseEdit(props, record, index);
		// 查看
		case 'Show':
			return browseShow(props, record, index);
	}
}
