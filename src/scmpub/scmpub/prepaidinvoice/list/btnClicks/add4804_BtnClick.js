/*
 * @Author: 刘奇 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2019-03-05 14:55:07 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:18:20
 */

import { PREPAIDINVOICE_CONST } from '../../const';
import { REF4804_CONST } from '../../ref4804/const';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function add4804_BtnClick(props) {
	clearTransferCache(props, REF4804_CONST.dataSource);
	props.pushTo(PREPAIDINVOICE_CONST.Ref4804_URL, { pagecode: REF4804_CONST.transPageId });
}
