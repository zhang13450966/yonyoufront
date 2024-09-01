/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片通用查询信息
 * @Date: 2018-04-19 10:09:24
 * @Last Modified by: zhr
 * @Last Modified time: 2021-11-09 16:07:15
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS } from '../../constance';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { showErrorInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, pk, isRefresh) {
	let _this = this;
	//非新增页面获取对应数据
	if (pk == null) {
		pk = _this.getPageParam(FIELD.id);
		let pk_order = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
		pk = pk == '' || pk == null ? pk_order && pk_order.value : pk;
		pk = pk == null ? _this.props.setUrlParam(pk) : pk;
	}
	if (pk) {
		let conditionData = {
			pks: [ pk ],
			pageid: PAGECODE.cardcode,
			status: _this.getPageParam(STATUS.status)
		};
		ajax({
			url: URL.getCard,
			data: conditionData,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						_this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					//维护和修订用后端的是用一个查询无法在后端区分，这里在前端判断下，如果单据状态为自由且版本号是1的单据，一定是在采购订单维护节点收回过的，这里提示‘当前单据已被他人修改，请返回列表重新查询’
					let nversion = res.data.head.card_head.rows[0].values.nversion.value;
					let forderstatus = res.data.head.card_head.rows[0].values.forderstatus.value;
					if (nversion == '1' && forderstatus != '3') {
						showErrorInfo(null, getLangByResId(this, '4004ORDERREVISE-000043')); /*  当前单据已被他人修改，请返回列表重新查询*/
						return;
					}
					let data = res.data;
					if (data.head) {
						_this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
						let pk_order = data.head[PAGECODE.cardhead].rows[0].values.pk_order.value;
						changeUrlParam(_this.props, { id: pk_order });
					}
					if (data.bodys && data.bodys[PAGECODE.cardbody]) {
						let card = data.bodys[PAGECODE.cardbody];
						_this.props.cardTable.setTableData(PAGECODE.cardbody, card, null, true, true);
					}

					buttonController.togglePageShow.call(_this, _this.props);
					showSagaErrorToasts(_this.props, PAGECODE.cardhead, FIELD.pk_order);
					if (isRefresh) {
						showSuccessInfo(getLangByResId(this, '4004ORDERREVISE-000025'), null, null);
					}
				}
			}
		});
	}
}
