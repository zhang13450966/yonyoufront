/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义修改
 * @Date: 2020-02-10 12:44:52
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-02-21 14:10:35
 */

import { AREA, FILED, HEADFILED, STATUS } from '../../constance';
export default function EditBtnClick(props) {
	props.setUrlParam({ [FILED.cardStatus]: STATUS.edit });
	this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
	props.form.setFormStatus(AREA.card_head, STATUS.edit);
	this.toggleShow(STATUS.edit);
}
