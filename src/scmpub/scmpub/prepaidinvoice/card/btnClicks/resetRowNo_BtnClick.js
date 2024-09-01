/*
 * @Author: wangceb 
 * @PageInfo: 新增行事件
 * @Date: 2018-04-19 10:37:53 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-13 13:29:59
 */
import { PREPAIDINVOICE_CONST } from '../../const';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function buttonClick(props) {
	// 重排行号
	this.props.beforeUpdatePage();
	RownoUtils.resetRowNo(props, PREPAIDINVOICE_CONST.tableId);
	this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
}
