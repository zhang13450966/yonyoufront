/*
 * @Author: qishy 
 * @PageInfo:卡片翻页查询
 * @Date: 2019-04-29 13:37:53 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-15 13:22:54
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, CACHDATASOURCE, FIELDS, PAGECODE } from '../../constance';
import { updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonControl } from '../viewControl/buttonControl';
export default function(props, pk) {
	//pk值不存在或则没有定义时
	if (pk == undefined || !pk) {
		props.form.EmptyAllFormValue(AREA.cardFormId);
		props.cardTable.setTableData(AREA.cardTableId, { rows: [] });
		props.setUrlParam({ status: 'browse' });
		props.setUrlParam({ id: '' });
		buttonControl.call(this, props);
		return;
	}

	let cardData = getCacheDataByPk(props, CACHDATASOURCE.dataSourceList, pk);
	if (cardData) {
		props.beforeUpdatePage();
		this.props.form.setAllFormValue({ [AREA.cardFormId]: cardData.head[AREA.cardFormId] });
		this.props.cardTable.setTableData(AREA.cardTableId, cardData.body[AREA.cardTableId], null, true, true);
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值
		props.setUrlParam({ status: 'browse', id: pk });
		buttonControl.call(this, props, cardData.head[AREA.cardFormId].rows[0].values[FIELDS.forderstatus].value);
		props.updatePage(AREA.cardFormId, AREA.cardTableId);
	} else {
		let data = { pks: [ pk ], pageid: PAGECODE.cardPagecode };
		ajax({
			url: REQUESTURL.queryCard,
			data: data,
			success: (res) => {
				if (res.data) {
					//效率优化开启
					props.beforeUpdatePage();
					if (res.data.head) {
						this.props.form.EmptyAllFormValue(AREA.cardFormId);
						this.props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head.head });
						this.props.setUrlParam(pk); //动态修改地址栏中的id的值
					}
					if (res.data.body) {
						props.cardTable.setTableData(AREA.cardTableId, res.data.body.body, null, true, true);
					}
					props.setUrlParam({ status: 'browse', id: pk });
					buttonControl.call(
						this,
						props,
						res.data.head[AREA.cardFormId].rows[0].values[FIELDS.forderstatus].value,
						null,
						res.data.head[AREA.cardFormId].rows[0].values[FIELDS.ncollectnum].value
					);
					//效率优化关闭
					props.updatePage(AREA.cardFormId, AREA.cardTableId);
				} else {
					this.props.form.setAllFormValue({ [AREA.cardFormId]: { rows: [] } });
					this.props.cardTable.setTableData(AREA.cardTableId, { rows: [] }, null, true, true);
					props.setUrlParam({ status: 'browse', id: pk });
					buttonControl.call(this, props);
				}
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
}
