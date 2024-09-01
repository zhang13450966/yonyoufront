/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:06:57
 */

import { PREPAIDINVOICE_CONST } from '../../const';
import { REF30_CONST } from '../../ref30/const';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function add30_BtnClick(props) {
	clearTransferCache(props, REF30_CONST.dataSource);
	props.pushTo(PREPAIDINVOICE_CONST.Ref30_URL, { pagecode: REF30_CONST.transPageId });
}
