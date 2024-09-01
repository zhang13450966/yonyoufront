/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义修改
 * @Date: 2020-02-10 12:44:52
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-02-21 13:51:43
 */

import { AREA, FILED, HEADFILED, STATUS } from '../../constance';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function EditBtnClick(props) {
	let pk_org_v = props.form.getFormItemsValue(AREA.card_head, HEADFILED.pk_org_v);
	if (!pk_org_v.value) {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000008')); /* 国际化处理： 组织节点不能修改集团数据*/
		return;
	}
	props.setUrlParam({ [FILED.cardStatus]: STATUS.edit });
	this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
	props.form.setFormStatus(AREA.card_head, STATUS.edit);
	this.toggleShow(STATUS.edit);
}
