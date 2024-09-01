/*
 * @Author: 刘奇 
 * @PageInfo: 卡片下翻页功能
 * @Date: 2019-03-18 16:42:43 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-18 16:42:43 
 */

import commonSearch_BtnClick from './commonSearch_BtnClick';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function pageInfoClick(props, hid, type) {
	commonSearch_BtnClick.call(this, props, hid, type);
	changeUrlParam(props, { id: hid });
}
