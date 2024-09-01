/*
 * @Author: chaiwx 
 * @PageInfo: 刷新  
 * @Date: 2018-04-11 15:20:44 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 16:14:56
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, CACHDATASOURCE, FIELDS, PAGECODE } from '../../constance';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl } from '../viewControl/buttonControl';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props) {
	let data = {
		pks: [ props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value ],
		pageid: PAGECODE.cardPagecode
	};
	ajax({
		url: REQUESTURL.queryCard,
		data: data,
		success: (res) => {
			props.beforeUpdatePage();
			if (res.data.head) {
				props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head[AREA.cardFormId] });
			}
			if (res.data.body) {
				props.cardTable.setTableData(AREA.cardTableId, res.data.body[AREA.cardTableId]);
			}
			buttonControl.call(
				this,
				props,
				props.form.getFormItemsValue([ AREA.cardFormId ], FIELDS.fstatusflag).value
			);
			props.updatePage(AREA.cardFormId, AREA.cardTableId);

			showRefreshInfo();

			updateCacheData(
				props,
				FIELDS.pk_taxinvoice,
				res.data.head.head.rows[0].values.pk_taxinvoice.value,
				res.data,
				AREA.cardFormId,
				CACHDATASOURCE.dataSourceList
			);
		}
	});
}
