/*
 * @Author: wanglzh7 
 * @PageInfo: 复制 
 * @Date: 2018-05-28 21:38:09 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 18:08:28
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, OPTIONS, FIELDS, PAGECODE } from '../../constance';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props) {
	ajax({
		url: REQUESTURL.copy,
		data: {
			pks: [ props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value ],
			pageid: PAGECODE.cardPagecode
		},
		success: (res) => {
			if (res.success && res.data) {
				props.setUrlParam({
					status: 'edit',
					option: OPTIONS.copy,
					id: props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value
				});
				let data = res.data;
				// 效率优化开启
				props.beforeUpdatePage();
				if (data.head) {
					// 设置表头数据
					props.form.EmptyAllFormValue(AREA.cardFormId);
					props.form.setAllFormValue({ [AREA.cardFormId]: data.head[AREA.cardFormId] });
					props.form.setFormItemsDisabled(AREA.cardFormId, { [FIELDS.pk_org_v]: true });
				}
				if (data.body) {
					// 设置表体数据
					props.cardTable.setTableData(AREA.cardTableId, data.body[AREA.cardTableId]);
				}
				buttonControl.call(this, props);
				// 效率优化关闭
				props.updatePage(AREA.cardFormId, AREA.cardTableId);
			}
		}
	});
}
