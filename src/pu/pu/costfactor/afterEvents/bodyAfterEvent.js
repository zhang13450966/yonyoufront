/*
 * @Author: zhaochyu
 * @PageInfo: 表体编辑后事件
 * @Date: 2018-06-08 13:47:49
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-06-29 09:41:43
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, PAGECODE, URL } from '../constance';
import { headAfterEventData } from '../utils';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getBodyLineMaxValue } from '../utils';
export default function afterEvent(props, moduleId, key, value, before, index) {
	let clearItems = [ FIELD.pk_material, FIELD.pk_materialName, FIELD.pk_srcmaterial ];
	let bodyMaxLine = null;
	let numberRows = props.editTable.getNumberOfRows(moduleId);
	if (key === 'pk_material') {
		//物料多选增行
		let materialsNew = value;
		if (materialsNew.length == 0) {
			for (let item = 0; item < clearItems.length; item++) {
				this.props.editTable.setValByKeyAndIndex(moduleId, index, clearItems[item], {
					value: null,
					display: null,
					scale: '-1'
				});
			}
			return;
		}
		bodyMaxLine = getBodyLineMaxValue(props);
		if (materialsNew.length != 0) {
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: materialsNew[0].refpk,
				display: materialsNew[0].refname,
				scale: '-1'
			});
			for (let i = 1; i < materialsNew.length; i++) {
				props.editTable.addRow(moduleId);
				let ll = props.editTable.getNumberOfRows(moduleId);
				props.editTable.setValByKeyAndIndex(moduleId, ll - 1, key, {
					value: materialsNew[i].refpk,
					display: materialsNew[i].refname,
					scale: '-1'
				});
				props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, ll - 1, FIELD.ishoworder, {
					value: bodyMaxLine + 1 + '',
					display: bodyMaxLine + 1 + ''
				});
				bodyMaxLine++;
			}
		}
		let data = headAfterEventData(props, moduleId, key, before);
		if (
			data.card.body.list_body.rows[index].values.pk_material.value == null ||
			data.card.body.list_body.rows[index].values.pk_material.value == ''
		)
			return;
		ajax({
			url: URL.bodyafter,
			data: data,
			async: false,
			success: (res) => {
				let bodylength = null;
				if (res.data && res.data.body && res.data.body[PAGECODE.bodyId]) {
					bodylength = res.data.body[PAGECODE.bodyId].rows.length;
					for (let j = 0; j < bodylength; j++) {
						let items = Object.keys(res.data.body[PAGECODE.bodyId].rows[j].values);
						for (let i = 0; i < items.length; i++) {
							let item = items[i];
							let itemvalue = res.data.body[PAGECODE.bodyId].rows[j].values[item];
							this.props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, j, item, {
								value: itemvalue.value,
								display: itemvalue.display,
								scale: '-1'
							});
						}
					}
				}
				let bodynum = numberRows;
				for (let a = 0; a < bodylength - bodynum + 1; a++) {
					this.props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, numberRows - 1, FIELD.bshow, {
						value: true,
						display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
					});
					numberRows++;
				}
			}
		});
	}
}
