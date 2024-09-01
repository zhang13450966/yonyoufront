import { ajax, toast } from 'nc-lightapp-front';
import { togglePageShow } from '../afterEvents';
import { viewController } from '../viewController';
import { URL, PAGECODE, FIELD, STATUS, TRANSFER, OrderCache } from '../../constance';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSaveAndCommitInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

let _this;
export default function saveAndCommitBtnClick(props, skipCodes, assign) {
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
	//指派
	if (assign) {
		data['assign'] = JSON.stringify(assign);
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
				url: URL.saveAndCommitBtnClick,
				data: data,
				success: function(res) {
					if (
						res.data &&
						res.data.workflow &&
						(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
					) {
						skipCodes = data['skipCodes'];
						_this.setState({
							compositedata: res.data,
							compositedisplay: true,
							saveAndCommit: true
						});
						return;
					}
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

					showSaveAndCommitInfo();
					billStatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
					billStatus = billStatus && billStatus.value;
					skipCodes = [];

					viewController.call(_this, props, STATUS.browse, billStatus);
				}
			});
		});
	}
}
