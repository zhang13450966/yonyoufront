/*
 * @Author: jiangfw
 * @PageInfo: 取消
 * @Date: 2018-04-25 20:48:18
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-02-14 16:52:17
 */
import { URL, AREA, UISTATE, COMMON, FIELD, BUTTONID, TRANSFER_TYPE, PAGECODE } from '../../constance';
import { getCurrentLastId, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import loadData from '../init/loadData';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import clickRefreshBtn from './refreshBtnClick';

export default function canelBtnClick(props, currentindex) {
	let _this = this;
	showWarningDialog(
		getLangByResId(_this, '4004PUINVOICE-000079'),
		getLangByResId(_this, '4004PUINVOICE-000006') /* 国际化处理：取消,确认要取消吗？*/,
		{
			beSureBtnClick: () => {
				props.form.setFormStatus(AREA.card_head, UISTATE.browse);
				props.cardTable.setStatus(AREA.card_body, UISTATE.browse);
				_this.props.resMetaAfterPkorgEdit();
				let type = _this.type;
				let channelType = _this.props.getUrlParam('channelType');
				let appid;
				let url = '';
				let pagecode = '';
				if (type) {
					let id = getCurrentLastId(COMMON.PuinvoiceCacheKey);
					if (props.transferTable.getTransformFormCompleteStatus(AREA.card_left, currentindex) == true) {
						_this.indexstatus[_this.curindex] = UISTATE.browse;
						changeUrlParam(props, {
							status: UISTATE.browse,
							id: id
						});
						clickRefreshBtn.call(_this, true);
					} else {
						if (props.transferTable.getTransformFormAmount(AREA.card_left) == 1) {
							// 移除浏览器监听提示
							window.removeEventListener('beforeunload', this.onMove);
							//history.go(-1);
							if (
								type == TRANSFER_TYPE.invoice ||
								type == TRANSFER_TYPE.transfer21 ||
								type == TRANSFER_TYPE.transfer45 ||
								type == TRANSFER_TYPE.transfer4T
							) {
								// 收票
								// url = URL.multitransfer;
								url = URL.invoice;
								pagecode = PAGECODE.refAll_list;
							} else if (
								type == TRANSFER_TYPE.transferSc ||
								type == TRANSFER_TYPE.transfer47 ||
								type == TRANSFER_TYPE.transfer61
							) {
								// 委外收票
								url = URL.scInvoice;
								pagecode = PAGECODE.invoiceScAll;
							} else if (type == TRANSFER_TYPE.transfer50) {
								// 消耗汇总
								url = URL.transfer50;
								pagecode = PAGECODE.ref50_list;
							} else if (type == TRANSFER_TYPE.transfer21Pto25) {
								url = URL.transfer21Pto25;
								pagecode = PAGECODE.ref25_list;
							} else if (type == TRANSFER_TYPE.transfer55E6to25) {
								url = URL.transfer55E6to25;
								pagecode = PAGECODE.ref55E6_list;
							}
							this.props.pushTo(url, { pagecode: pagecode });
						} else {
							props.transferTable.setTransformFormStatus(AREA.card_left, {
								status: false,
								onChange: (current, next) => {
									showSuccessInfo(getLangByResId(_this, '4004PUINVOICE-000007' /* 国际化处理： 取消成功*/));
								}
							});
						}
					}
				} else if (channelType) {
					let appid;
					let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
					if (busiInfoData) {
						appid = busiInfoData.appid;
					}
					_this.props.pushTo(URL.list, {
						appid,
						appcode: appid,
						pagecode: PAGECODE.invoiceList
					});
				} else {
					let pk_invoice = props.getUrlParam(FIELD.id);

					//是否暂存取消
					let tempsave = getDefData(COMMON.tempCardCacheKey, 'tempsave');
					if ((pk_invoice == null || pk_invoice == 'undefined' || pk_invoice == 'null') && !tempsave) {
						pk_invoice = this.props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice);
						pk_invoice = pk_invoice && pk_invoice.value;
					}
					pk_invoice =
						pk_invoice == null || pk_invoice == 'undefined'
							? getCurrentLastId(COMMON.PuinvoiceCacheKey)
							: pk_invoice;
					props.pushTo(URL.card, {
						status: UISTATE.browse,
						id: pk_invoice,
						pagecode: PAGECODE.invoiceCard
					});
					loadData.call(_this);
				}
				setDefData(COMMON.tempCardCacheKey, 'tempsave', false);
			}
		}
	);
}
