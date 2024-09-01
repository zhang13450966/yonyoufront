/*
 * @Author: 王勇 
 * @PageInfo: 列表-操作列按钮绑定  
 * @Date: 2020-01-17 09:48:12 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-10 10:19:42
 */
import innerEditClick from './innerEditClick';
import innerDelClick from './innerDelClick';
import { BUTTONINFO } from '../../const/index';
import innerCopyClick from './innerCopyClick';
import innerEnableChangeClick from './innerEnableChangeClick';
export default function innerBtnClicks(record, index, props, btnCode) {
	switch (btnCode) {
		case BUTTONINFO.delBtnCode:
			innerDelClick.call(this, props, record, index);
			break;
		case BUTTONINFO.editBtnCode:
			innerEditClick.call(this, props, record);
			break;
		case BUTTONINFO.copyBtnCode:
			innerCopyClick.call(this, props, record);
			break;
		case BUTTONINFO.StartUse:
			innerEnableChangeClick.call(this, props, record, index);
			break;
		case BUTTONINFO.StopUse:
			innerEnableChangeClick.call(this, props, record, index);
			break;
	}
}
