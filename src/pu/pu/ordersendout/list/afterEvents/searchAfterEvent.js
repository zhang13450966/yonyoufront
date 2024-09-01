/*
 * @Author: xiahui 
 * @PageInfo: 查询区编辑后
 * @Date: 2019-03-26 10:22:04 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-04-19 09:29:43
 */
import { AREA } from '../../constance';
import { onAfterEvent } from '../../../orderonwaypub/searchafterevent';

export default function(field, val) {
	onAfterEvent.call(this, this.props, field, val, AREA.searchId);
}
