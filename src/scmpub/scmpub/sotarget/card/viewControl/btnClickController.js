/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置按钮点击事件   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-28 15:02:14
*/

import { TARGET_CARD_BUTTON, TARGET_CARD } from '../../siconst';
import addBtnClick from '../btnClicks/addBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import deleteBtnClick from '../btnClicks/deleteBtnClick';
import refreshBtnClick from '../btnClicks/refreshBtnClick';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import addLineBtnClick from '../btnClicks/addLineBtnClick';
import delLineBtnClick from '../btnClicks/delLineBtnClick';
import delInnerBtnClick from '../btnClicks/delInnerBtnClick';
import fileBtnClick from '../btnClicks/fileBtnClick';

export default function(props, id, text, record, index) {
	switch (id) {
		case TARGET_CARD_BUTTON.Add:
			addBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.Edit:
			editBtnClick(props);
			break;
		case TARGET_CARD_BUTTON.Save:
			saveBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.Delete:
			deleteBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.Cancel:
			cancelBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.File:
			fileBtnClick.call(this, props);
			break;
		case TARGET_CARD_BUTTON.Addline_org:
			addLineBtnClick(props, TARGET_CARD.target_org, index);
			break;
		case TARGET_CARD_BUTTON.Addline_mar:
			addLineBtnClick(props, TARGET_CARD.target_mar, index);
			break;
		case TARGET_CARD_BUTTON.Addline_item:
			addLineBtnClick(props, TARGET_CARD.target_item, index);
			break;
		case TARGET_CARD_BUTTON.DelLine_org:
			delLineBtnClick.call(this, props, TARGET_CARD.target_org);
			break;
		case TARGET_CARD_BUTTON.DelLine_mar:
			delLineBtnClick.call(this, props, TARGET_CARD.target_mar);
			break;
		case TARGET_CARD_BUTTON.DelLine_item:
			delLineBtnClick.call(this, props, TARGET_CARD.target_item);
			break;
		case TARGET_CARD_BUTTON.InnerDelLine_org:
			delInnerBtnClick.call(this, props, TARGET_CARD.target_org, index);
			break;
		case TARGET_CARD_BUTTON.InnerDelLine_mar:
			delInnerBtnClick.call(this, props, TARGET_CARD.target_mar, index);
			break;
		case TARGET_CARD_BUTTON.InnerDelLine_item:
			delInnerBtnClick.call(this, props, TARGET_CARD.target_item, index);
			break;
	}
}
