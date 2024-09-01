import { ajax } from 'nc-lightapp-front';
import { buttonController } from '../viewController/index';
import { URL, PAGECODE, FIELD, STATUS, BUTTON, TRANSFER, OrderCache } from '../../constance';
import { copyAddBtn } from './index';
import { getDefData, changeUrlParam, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function refresh(props, pk_order, isshow) {
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	transfer = transfer == null ? this.props.getUrlParam(TRANSFER.channelType) : transfer;
	if (pk_order && transfer == null) {
		changeUrlParam(props, { id: pk_order, status: STATUS.browse });
	}
	//非新增页面获取对应数据
	pk_order = pk_order == null ? props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value : pk_order;
	pk_order = pk_order == null || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == 'undefined' ? getNextId(props, pk_order, OrderCache.OrderCacheKey) : pk_order;
	if (pk_order) {
		let conditionData = {
			pks: [pk_order],
			pageid: PAGECODE.cardcode,
		};
		ajax({
			url: URL.getCard,
			data: conditionData,
			method: 'POST',
			success: res => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data) {
					this.props.beforeUpdatePage();
					let copy = this.props.getUrlParam(STATUS.status);
					let data = res.data;
					if (data.head) {
						// 单据状态 改为自由
						if (copy == BUTTON.Copy.toLowerCase()) {
							res.data.head[PAGECODE.cardhead].rows[0].values.forderstatus.value = '0';
						}
						this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
						//订单状态
						let forderstatus = data.head[PAGECODE.cardhead].rows[0].values.forderstatus;
						//冻结原因
						let vfrozenreason = data.head[PAGECODE.cardhead].rows[0].values.vfrozenreason;
						vfrozenreason = vfrozenreason && vfrozenreason.value;
						forderstatus && forderstatus.value
							? this.setState({ forderstatus: forderstatus.value, vfrozenreason: vfrozenreason })
							: '';
						this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
					}
					let cards = data.bodys;
					if (cards && cards[PAGECODE.head_payment]) {
						this.props.cardTable.setTableData(PAGECODE.head_payment, cards[PAGECODE.head_payment]);
						buttonController.paymentShow.call(this, this.props);
					} else {
						this.props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] });
					}
					if (cards && cards[PAGECODE.cardbody]) {
						this.props.cardTable.setTableData(PAGECODE.cardbody, cards[PAGECODE.cardbody]);
					}
					let flag = copy == BUTTON.Copy.toLowerCase() ? BUTTON.Copy : STATUS.browse;
					this.props.updatePage(PAGECODE.cardhead, [PAGECODE.head_payment, PAGECODE.cardbody]);
					buttonController.togglePageShow.call(this, this.props, flag);
					showSagaErrorToasts(props, PAGECODE.cardhead, FIELD.pk_order);
					if (copy == BUTTON.Copy.toLowerCase()) {
						copyAddBtn.call(this);
					}
				}
			},
		});
	} else {
		props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
		props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
		props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
		buttonController.togglePageShow.call(this, this.props);
	}
	if (isshow != false) {
		showSuccessInfo(getLangByResId(this, '4004POORDER-000096')); /* 国际化处理： 刷新成功！*/
	}
}
