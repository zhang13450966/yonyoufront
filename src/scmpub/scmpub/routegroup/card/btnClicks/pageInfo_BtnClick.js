/*
 * @Author: 王勇 
 * @PageInfo: 卡片翻页功能  
 * @Date: 2020-02-13 15:17:21 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-13 19:53:56
 */
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearchBtcnClick from './commonSearchBtcnClick';
export default function pageInfoClick(props, crouteid, type) {
	commonSearchBtcnClick.call(this, props, crouteid, type);
    changeUrlParam(props, { id: crouteid });
}