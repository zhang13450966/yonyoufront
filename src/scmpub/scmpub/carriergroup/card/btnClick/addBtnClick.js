/*
 * @Author: zhaochyu
 * @PageInfo:承运商新增
 * @Date: 2020-02-10 12:36:38
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:32:28
 */
import { FILED, URL, STATUS, AREA } from '../../constance';
import { removeAllTableData } from './setAllTableData';
export default function addBtnClick(props) {
	props.pushTo(URL.gotoCard, {
		cardStatus: STATUS.add
	});
	this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
	props.form.setFormStatus(AREA.card_head, STATUS.edit);
	props.form.EmptyAllFormValue(AREA.card_head);
	removeAllTableData.call(this);
	this.toggleShow(STATUS.add);
}
