/*
 * @Author: wangceb 
 * @PageInfo: 列表下双击进入卡片界面
 * @Date: 2018-05-17 15:08:59 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:10:26
 */
import { ARSUB_CONST, ArsubHeadItem } from '../../const';

export default function doubleClick(record, index, e) {
	this.props.pushTo(ARSUB_CONST.Card_URL, {
		status: ARSUB_CONST.browse,
		id: record[ArsubHeadItem.carsubid].value,
		pagecode: ARSUB_CONST.cardPageId
	});
}
