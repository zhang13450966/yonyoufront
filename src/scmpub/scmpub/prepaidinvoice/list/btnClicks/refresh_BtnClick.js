/*
 * @Author: 刘奇 
 * @PageInfo: 刷新  
 * @Date: 2019-03-14 16:05:08 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-14 16:05:08 
 */

import { PREPAIDINVOICE_CONST } from '../../const';
import clickSerachBtn from './commonSearch_BtnClick';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props) {
	let queryInfo = getDefData(PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey, PREPAIDINVOICE_CONST.searchId);

	clickSerachBtn.call(this, props, queryInfo, true);
}
