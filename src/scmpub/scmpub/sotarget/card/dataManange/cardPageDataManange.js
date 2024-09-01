/* 
* @Author: lichaoah  
* @PageInfo:卡片页面数据管理   
* @Date: 2019-11-30 11:20:26  
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-15 10:39:14
*/

import { TARGET_CARD } from '../../siconst';
/**
 * 给页面设置值
 * @param {*} props 
 * @param {*} pageData 
 */
function setPageData(props, pageData) {
	props.beforeUpdatePage();
	setFormData(props, pageData.head);
	if (pageData.bodys[TARGET_CARD.target_period]) {
		setPeriodData(props, pageData.bodys[TARGET_CARD.target_period]);
	}
	if (pageData.bodys[TARGET_CARD.target_org]) {
		setOrgData(props, pageData.bodys[TARGET_CARD.target_org]);
	}
	if (pageData.bodys[TARGET_CARD.target_mar]) {
		setMarData(props, pageData.bodys[TARGET_CARD.target_mar]);
	}
	if (pageData.bodys[TARGET_CARD.target_item]) {
		setItemData(props, pageData.bodys[TARGET_CARD.target_item]);
	}
	if (pageData.bodys[TARGET_CARD.target_ratio]) {
		props.cardTable.setTableData(TARGET_CARD.target_ratio, pageData.bodys[TARGET_CARD.target_ratio].rows[0]);
	}
	props.updatePage(TARGET_CARD.formId, [
		TARGET_CARD.target_period,
		TARGET_CARD.target_org,
		TARGET_CARD.target_mar,
		TARGET_CARD.target_item
	]);
}
function updatePageData(props, pageData) {
	props.beforeUpdatePage();
	setFormData(props, pageData.head);
	if (pageData.bodys[TARGET_CARD.target_period]) {
		pageData.bodys[TARGET_CARD.target_period] = updatePeriodData(props, pageData.bodys[TARGET_CARD.target_period]);
	}
	if (pageData.bodys[TARGET_CARD.target_org]) {
		pageData.bodys[TARGET_CARD.target_org] = updateOrgData(props, pageData.bodys[TARGET_CARD.target_org]);
	}
	if (pageData.bodys[TARGET_CARD.target_mar]) {
		pageData.bodys[TARGET_CARD.target_mar] = updateMarData(props, pageData.bodys[TARGET_CARD.target_mar]);
	}
	if (pageData.bodys[TARGET_CARD.target_item]) {
		pageData.bodys[TARGET_CARD.target_item] = updateItemData(props, pageData.bodys[TARGET_CARD.target_item]);
	}
	props.updatePage(TARGET_CARD.formId, [
		TARGET_CARD.target_period,
		TARGET_CARD.target_org,
		TARGET_CARD.target_mar,
		TARGET_CARD.target_item
	]);
	return pageData;
}
function clearPageData(props) {
	props.beforeUpdatePage();
	props.form.EmptyAllFormValue(TARGET_CARD.formId); //
	props.cardTable.setTableData(TARGET_CARD.target_org, { rows: [] });
	props.cardTable.setTableData(TARGET_CARD.target_period, { rows: [] });
	props.cardTable.setTableData(TARGET_CARD.target_mar, { rows: [] });
	props.cardTable.setTableData(TARGET_CARD.target_item, { rows: [] });
	props.cardTable.setTableData(TARGET_CARD.target_ratio, { rows: [] });
	props.updatePage(TARGET_CARD.formId, [
		TARGET_CARD.target_period,
		TARGET_CARD.target_org,
		TARGET_CARD.target_mar,
		TARGET_CARD.target_item
	]);
}
function getPageData(props) {
	return props.createExtCardData(TARGET_CARD.cardpageid, TARGET_CARD.formId, [
		TARGET_CARD.target_org,
		TARGET_CARD.target_period,
		TARGET_CARD.target_mar,
		TARGET_CARD.target_item,
		TARGET_CARD.target_ratio
	]);
}

function setFormData(props, headData) {
	props.form.setAllFormValue(headData);
}
function setPeriodData(props, data) {
	props.cardTable.setTableData(TARGET_CARD.target_period, data);
}
function setOrgData(props, data) {
	props.cardTable.setTableData(TARGET_CARD.target_org, data);
}
function setMarData(props, data) {
	props.cardTable.setTableData(TARGET_CARD.target_mar, data);
}
function setItemData(props, data) {
	props.cardTable.setTableData(TARGET_CARD.target_item, data);
}
function setRatioData(props, data) {
	//进行 关联年指标 clinkyearitemid 字段的翻译
	let name = new Map();
	let meta = props.meta.getMeta();
	let newdata = { rows: [] };
	let itemData = props.cardTable.getAllRows(TARGET_CARD.target_item);
	let namesoptions = [];
	itemData.map((item) => {
		// 保存前用的temp+行号作为key,保存后用的主键
		if (item.values.pk_target_item && item.values.pk_target_item.value) {
			name.set(item.values.pk_target_item.value, item.values.vtargetname.value);
		} else {
			name.set('temp' + item.values.citemrowno.value, item.values.vtargetname.value);
		}
	});
	data.rows.map((item) => {
		if (item.values.clinkyearitemid.value) {
			item.values.clinkyearitemid = {
				value: item.values.clinkyearitemid.value,
				display: name.get(item.values.clinkyearitemid.value)
			};
			namesoptions.push({
				value: item.values.clinkyearitemid.value,
				display: name.get(item.values.clinkyearitemid.value)
			});
			newdata.rows.push(item);
		}
	});
	meta[TARGET_CARD.target_ratio].items.map((item) => {
		if (item.attrcode == TARGET_CARD.clinkyearitemid) {
			item.datatype = '203';
			item.itemtype = 'select';
			item.options = namesoptions;
		}
	});
	props.meta.setMeta(meta);
	props.cardTable.setTableData(TARGET_CARD.target_ratio, newdata);
	if (newdata.rows.length == 0) {
		props.cardTable.addRow(TARGET_CARD.target_ratio, 0, {}, false);
	}
}
function updatePeriodData(props, data) {
	return props.cardTable.updateDataByRowId(TARGET_CARD.target_period, data, true);
}
function updateOrgData(props, data) {
	return props.cardTable.updateDataByRowId(TARGET_CARD.target_org, data, true);
}
function updateMarData(props, data) {
	return props.cardTable.updateDataByRowId(TARGET_CARD.target_mar, data, true);
}
function updateItemData(props, data) {
	return props.cardTable.updateDataByRowId(TARGET_CARD.target_item, data, true);
}

export { setPageData, getPageData, updatePageData, clearPageData, setRatioData };
