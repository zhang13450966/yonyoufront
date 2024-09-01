/*
 * @Author: qishy 
 * @PageInfo:业务对账单卡片删除
 * @Date: 2019-04-29 13:34:28 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:08:04
 */
import { ajax } from 'nc-lightapp-front';
import pageInfoClick from './pageInfoClick';
import { REQUESTURL, AREA, CACHDATASOURCE, FIELDS, OPTIONS, PAGECODE } from '../../constance';
import { deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props) {
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value,
				ts: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.ts).value
			}
		]
	};

	showSingleDeleteDialog({
		beSureBtnClick: () => {
			ajax({
				url: REQUESTURL.delete,
				data: data,
				success: (res) => {
					if (res.success && !res.data.errMsg) {
						if (props.getUrlParam('option') == OPTIONS.transfer) {
							// 转单
							if (props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
								let transferFrom = props.getUrlParam('transferFrom');
								if (transferFrom == OPTIONS.from21) {
									props.pushTo(REQUESTURL.toTransfer21, { pagecode: PAGECODE.transferPagecode21 });
								} else if (transferFrom == OPTIONS.from45) {
									props.pushTo(REQUESTURL.toTransfer45, { pagecode: PAGECODE.transferPagecode45 });
								}
							} else {
								props.transferTable.setTransformFormStatus(AREA.leftarea, {
									status: false,
									onChange: (current, next) => {
										showSuccessInfo(getLangByResId(this, '4004comarebill-000020')); /* 国际化处理： 删除成功*/
									}
								});
							}
						} else {
							let nextId = getNextId(props, props.getUrlParam('id'), CACHDATASOURCE.dataSourceList);
							deleteCacheData(
								props,
								FIELDS.pk_comparebill,
								props.getUrlParam('id'),
								CACHDATASOURCE.dataSourceList
							);
							showSuccessInfo(getLangByResId(this, '4004comarebill-000020')); /* 国际化处理： 删除成功*/
							pageInfoClick.call(this, props, nextId);
						}
					}
				}
			});
		}
	});
}
