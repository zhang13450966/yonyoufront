/*
 * @Author: 赵强
 * @PageInfo: 打印查询按钮  
 * @Date: 2021-07-14 13:24:26
 * @Last Modified by: zhaoqiang
 * @Last Modified time: 2021-07-14 13:58:33
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function buttonClick(props) {
	let CONST = { area: ARSUB_CONST.formId, hid: ArsubHeadItem.carsubid };
	return printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
}
