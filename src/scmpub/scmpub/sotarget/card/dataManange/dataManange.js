/* 
* @Author: lichaoah  
* @PageInfo: 销售指标数据管理  
* @Date: 2020-02-19 17:11:16  
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-12-21 14:12:30
 * */
import { ajax } from 'nc-lightapp-front';
import { TARGET_CARD } from '../../siconst';
import { setPageData } from './cardPageDataManange';
import { updateCache } from '../dataManange/cacheManange';
import { headAfterEvent } from '../afterEvents';
import onRowClick from '../btnClicks/onRowClick';
export function queryByPk(props, pk) {
	return new Promise((resolve) => {
		ajax({
			url: TARGET_CARD.queryByPkUrl,
			data: { pks: [ pk ], pageid: TARGET_CARD.cardpageid },
			success: (res) => {
				if (res.data) {
					this.billId = pk;
					setPageData(props, res.data);
					updateCache(props, res.data);
					afterSetPageData.call(this, props);
					let status = props.getUrlParam(TARGET_CARD.status);
					if (status == TARGET_CARD.edit) {
						props.form.setFormItemsDisabled(TARGET_CARD.formId, { pk_org: true });
					}
					resolve(res.data);
				}
			}
		});
	});
}
export function afterSetPageData(props) {
	//物料表格处理
	headAfterEvent(
		props,
		TARGET_CARD.formId,
		TARGET_CARD.fmarsetflag,
		props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.fmarsetflag)
	);
	//统一设定下级
	headAfterEvent(
		props,
		TARGET_CARD.formId,
		TARGET_CARD.blowsetflag,
		props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag)
	);
	let row = props.cardTable.getRowsByIndexs(TARGET_CARD.target_item, 0)[0];
	if (row) {
		onRowClick.call(this, props, TARGET_CARD.target_item, row, 0);
	}
}
