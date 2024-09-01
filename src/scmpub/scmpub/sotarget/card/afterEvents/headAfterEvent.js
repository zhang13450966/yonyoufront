/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置表头编辑后   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-29 08:59:54
*/
import { TARGET_CARD } from '../../siconst';
import orgAfterEvent from './pk_orgAfterEvent';
import yearAfterEvent from './yearAfterEvent';
import blowsetAfterEvent from './blowsetEvent';
import marsetHeadAfterEvent from './marsetHeadAfterEvent';

export default function headAfterEvent(props, moduleId, key, value, oldValue) {
	switch (key) {
		case TARGET_CARD.pk_org:
			orgAfterEvent.call(this, props, moduleId, key, value, oldValue);
			break;
		case TARGET_CARD.fyearflag:
		case TARGET_CARD.fcyclesetflag:
		case TARGET_CARD.denddate:
		case TARGET_CARD.dbegindate:
			yearAfterEvent.call(this, props, moduleId, key, value, oldValue);
			break;
		case TARGET_CARD.blowsetflag:
			blowsetAfterEvent.call(this, props, moduleId, key, value, oldValue);
			break;
		case TARGET_CARD.fmarsetflag:
			marsetHeadAfterEvent.call(this, props, moduleId, key, value, oldValue);
			break;
	}
}
