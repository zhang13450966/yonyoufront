/*
 * @Author: qishy 
 * @PageInfo: 业务对账单刷新
 * @Date: 2019-04-28 15:22:09 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-06-04 15:02:48
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, CACHDATASOURCE, FIELDS, PAGECODE, OPTIONS, CACHKEY } from '../../constance';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonControl } from '../viewControl/buttonControl';
import { getDefData, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props) {
	let data = {
		pks: [ props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value ],
		pageid: PAGECODE.cardPagecode
	};

	ajax({
		url: REQUESTURL.queryCard,
		data: data,
		success: (res) => {
			//效率优化开启
			props.beforeUpdatePage();

			if (res.data.head) {
				//渲染表头数据
				props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head[AREA.cardFormId] });
			}
			if (res.data.body) {
				props.cardTable.setTableData(AREA.cardTableId, res.data.body[AREA.cardTableId]);
			}
			let pageStatus;
			if (props.getUrlParam('option') == OPTIONS.transfer) {
				pageStatus = 'browse';
			}
			buttonControl.call(
				this,
				props,
				props.form.getFormItemsValue([ AREA.cardFormId ], FIELDS.forderstatus).value,
				pageStatus,
				props.form.getFormItemsValue([ AREA.cardFormId ], FIELDS.ncollectnum).value
			);
			//效率优化关闭
			props.updatePage(AREA.cardFormId, AREA.cardTableId);

			showRefreshInfo();
			//更新缓存
			updateCacheData(
				props,
				FIELDS.pk_comparebill,
				res.data.head.head.rows[0].values.pk_comparebill.value,
				res.data,
				AREA.cardFormId,
				CACHDATASOURCE.dataSourceList
			);
		}
	});
}
