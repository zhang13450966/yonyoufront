/*
 * @Author: zhaochyu
 * @PageInfo: 新增按钮
 * @Date: 2018-04-02 14:38:26
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:15:17
 */
import { URL, UISTATE, AREA, FIELD, PAGECODE, HEAD_FIELD, DATASOURCE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import afterEvent from '../afterEvents/afterEvent';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function(props) {
	props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
	let pk = props.getUrlParam(FIELD.cardId);
	let err = this.props.getUrlParam('err');
	props.pushTo(URL.cardurl, {
		status: UISTATE.add,
		billStatus: '0',
		id: pk,
		err: err,
		pagecode: PAGECODE.cardpagecode
	});
	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
	props.form.setFormStatus(AREA.cardFormArea, UISTATE.add);
	props.form.EmptyAllFormValue(AREA.cardFormArea);
	props.form.setFormItemsValue(AREA.cardFormArea, {
		[HEAD_FIELD.fbillstatus]: {
			value: '0',
			display: getLangByResId(this, '4004INITIALEST-000000') /* 国际化处理： 自由*/
		}
	});
	props.cardTable.setStatus(AREA.cardTableArea, UISTATE.edit);
	props.cardTable.setTableData(AREA.cardTableArea, { rows: [] });
	let status = props.getUrlParam(FIELD.cardStatus);
	if (status == UISTATE.add || status == UISTATE.browse) {
		setTimeout(() => {
			props.initMetaByPkorg('pk_org_v');
			let pk_org_v = getDefData(DATASOURCE.dataSource, FIELD.org, pk_org_v);
			let pk_org_vName = getDefData(DATASOURCE.dataSource, FIELD.orgName, pk_org_v);
			buttonController.lineSelected.call(this, this.props, true);
			if (pk_org_v) {
				afterEvent.call(
					this,
					this.props,
					PAGECODE.cardhead,
					HEAD_FIELD.pk_org_v,
					{ value: pk_org_v, display: pk_org_vName },
					{ value: null }
				);
			}
		}, 0);
	}
	this.toggleShow();
}
