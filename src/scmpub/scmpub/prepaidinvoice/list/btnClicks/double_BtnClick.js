/*
 * @Author: wangceb 
 * @PageInfo: 列表下双击进入卡片界面
 * @Date: 2018-05-17 15:08:59 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:18:56
 */
import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';

export default function doubleClick(record, index, e) {
	this.props.pushTo(PREPAIDINVOICE_CONST.Card_URL, {
		status: PREPAIDINVOICE_CONST.browse,
		id: record[PrepaidinvoiceHeadItem.hid].value,
		pagecode: PREPAIDINVOICE_CONST.cardPageId
	});
}
