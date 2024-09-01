/*
 * @Author: 赵强
 * @PageInfo: 打印查询按钮  
 * @Date: 2021-07-14 13:24:26
 * @Last Modified by: zhaoqiang
 * @Last Modified time: 2021-07-14 14:01:27
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function buttonClick(props) {
	let CONST = { area: ARSUB_CONST.formId, hid: ArsubHeadItem.carsubid };
	return printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
}
