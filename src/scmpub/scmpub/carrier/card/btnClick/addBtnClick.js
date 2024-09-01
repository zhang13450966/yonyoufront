/*
 * @Author: zhaochyu
 * @PageInfo:承运商新增
 * @Date: 2020-02-10 12:36:38
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:38:13
 */
import { FILED, URL, STATUS, AREA, CARRIERDATASOURCE } from '../../constance';
import { getDefData } from '../../../pub/cache';
import { removeAllTableData } from './setAllTableData';
export default function addBtnClick(props) {
	props.pushTo(URL.gotoCard, {
		cardStatus: STATUS.add
	});
	this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
	props.form.setFormStatus(AREA.card_head, STATUS.edit);
	props.form.EmptyAllFormValue(AREA.card_head);
	removeAllTableData.call(this);
	let status = props.getUrlParam(FILED.cardStatus);
	if (status == STATUS.add || status == STATUS.browse) {
		let pk_org_v = getDefData(CARRIERDATASOURCE.carrierdatasource, FILED.org);
		if (pk_org_v) {
			let pk_org = getDefData(CARRIERDATASOURCE.carrierdatasource, FILED.pk_org);
			this.props.form.setFormItemsValue(AREA.card_head, { [FILED.org]: pk_org_v, [FILED.pk_org]: pk_org });
		} else {
			props.initMetaByPkorg('pk_org_v');
		}
	}
	this.toggleShow(STATUS.add);
}
