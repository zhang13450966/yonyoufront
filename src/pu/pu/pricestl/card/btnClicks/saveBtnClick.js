import { ajax, toast } from 'nc-lightapp-front';
import { togglePageShow } from '../afterEvents';
import { viewController } from '../viewController';
import { URL, PAGECODE, FIELD, STATUS, TRANSFER, OrderCache } from '../../constance';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function saveBtnClick(props, skipCodes, callback) {
	let _this;
	if (this) {
		_this = this;
	}
	let bodyids = [ PAGECODE.cardbody, PAGECODE.cardbodyano ];
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ PAGECODE.cardhead ],
			type: 'form'
		},
		{
			// creteForm 使用的areaCode
			name: bodyids,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	//创建保存的聚合VO
	let data = props.createExtCardData(PAGECODE.cardcode, PAGECODE.cardhead, bodyids);
	//判断页面状态是新增还是编辑
	let _url = URL.cardinsert;
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle).value;

	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	if (pk_order) {
		_url = URL.cardupdate;
		let supplier = props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_supplier').value;
		if (supplier == null || supplier == undefined || supplier == '') {
			showWarningInfo('', getLangByResId(this, '4004PRICESTL-000011')); /* 国际化处理： 供应商不能为空*/
			return;
		}
	}
	let rows = data.head[PAGECODE.cardhead].rows;
	if (rows && rows.length > 0) {
		rows.map((item) => {
			item.status = '1';
		});
	}
	if (flag) {
		//公式
		props.validateToSave(data, () => {
			ajax({
				method: 'post',
				url: _url,
				data: data,
				success: function(res) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					let datas = res.data;
					let pkCache;
					// let pkCache = datas.head.card_head.rows[0].values.pk_pricesettle.value;
					if (datas.head) {
						props.form.setAllFormValue({ [PAGECODE.cardhead]: datas.head[PAGECODE.cardhead] });
						pkCache = datas.head.card_head.rows[0].values.pk_pricesettle.value;
					}
					if (datas.bodys) {
						let cards = datas.bodys;
						if (cards.car_quality) {
							let card_pay = props.cardTable.updateDataByRowId(
								PAGECODE.cardbodyano,
								cards[PAGECODE.cardbodyano]
							);
							res.data.bodys[PAGECODE.cardbodyano] = card_pay;
						}
						if (cards.card_meterial) {
							let card_mater = props.cardTable.updateDataByRowId(
								PAGECODE.cardbody,
								cards[PAGECODE.cardbody]
							);
							res.data.bodys[PAGECODE.cardbody] = card_mater;
						}
					}
					updateCacheData(
						props,
						FIELD.pk_pricesettle,
						pkCache,
						res.data,
						PAGECODE.cardhead,
						OrderCache.OrderCacheKey
					);
					let billStatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
					billStatus = billStatus && billStatus.value;
					// props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
					// props.cardTable.setStatus(PAGECODE.cardbody, STATUS.browse);
					// props.cardTable.setStatus(PAGECODE.cardbodyano, STATUS.browse);
					//开关关闭
					props.updatePage(PAGECODE.cardhead, [ PAGECODE.cardbodyano, PAGECODE.cardbody ]);
					let transfer = props.getUrlParam(TRANSFER.transfer);
					if (callback == null) {
						showSuccessInfo(
							getLangByResId(_this, '4004PRICESTL-000012')
						); /* 国际化处理： 保存成功*/ /* 国际化处理： 保存成功！*/
						billStatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
						billStatus = billStatus && billStatus.value;
						// togglePageShow.call(_this, props, STATUS.browse, billStatus);
					}
					viewController.call(_this, props, STATUS.browse, billStatus);
					if (res.success) {
						if (callback) {
							callback.call(this, skipCodes);
						}
					}
				}
			});
		});
	}
}
