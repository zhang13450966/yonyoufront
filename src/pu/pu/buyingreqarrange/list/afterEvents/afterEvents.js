/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-07 09:39:29
 */
import { BUYINGREQ_CARD } from '../../siconst';
import bodyAfterEvent from './bodyAfterEvent';
export default function afterEvent(props, moduleId, key, changeRow, value, index, record) {
	bodyAfterEvent.call(this, props, moduleId, key, value, index, record);
}
