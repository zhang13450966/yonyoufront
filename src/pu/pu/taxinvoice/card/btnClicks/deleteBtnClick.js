/*
 * @Author: chaiwx 
 * @PageInfo: 删除 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-06 15:01:24
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, CACHDATASOURCE, FIELDS } from '../../constance';
import { deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import pageInfoClick from './pageInfoClick';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deleteBtnClick(props) {
	let _this = this;
	let data = {
		infos: [
			{
				id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value,
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
						showSuccessInfo(getLangByResId(this, '4004Taxinvoice-000011')); /* 国际化处理： 删除成功*/
						let nextId = getNextId(props, props.getUrlParam('id'), CACHDATASOURCE.dataSourceList);
						deleteCacheData(props, FIELDS.pk_taxinvoice, props.getUrlParam('id'), CACHDATASOURCE.dataSourceList);
						pageInfoClick.call(this, props, nextId);
					}
				}
			});
		}
	});
}
