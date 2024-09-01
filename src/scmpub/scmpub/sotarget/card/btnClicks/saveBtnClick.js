/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-14 20:58:21
*/
import { ajax } from 'nc-lightapp-front';
import { TARGET_CARD } from '../../siconst';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { getPageData, updatePageData } from '../dataManange/cardPageDataManange';
import { updateCache, addCache, modify } from '../dataManange/cacheManange';
import viewController from '../viewControl/viewController';
import { showSaveInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function saveButton(props) {
	//过滤空行
	filterEmptyRows(props);
	if (!processValidate(props)) return;

	let data = getPageData(props);
	processTargetItemData.call(this, props, data);

	setForeignKey(props, data);
	let actionType = props.getUrlParam(TARGET_CARD.status) == TARGET_CARD.add ? TARGET_CARD.insert : TARGET_CARD.update;
	let url = actionType == TARGET_CARD.insert ? TARGET_CARD.insertUrl : TARGET_CARD.updateUrl;
	executeSave(props, data, url, actionType);
}

function filterEmptyRows(props) {
	props.cardTable.filterEmptyRows(TARGET_CARD.target_org);
	props.cardTable.filterEmptyRows(TARGET_CARD.target_period);
	props.cardTable.filterEmptyRows(TARGET_CARD.target_mar);
	props.cardTable.filterEmptyRows(TARGET_CARD.target_item);
	props.cardTable.filterEmptyRows(TARGET_CARD.target_ratio, 'clinkyearitemid', 'include');
}
/**
 * 指标项比例合并到指标项中
 * @param {*} props 
 * @param {*} data 
 */
function processTargetItemData(props, data) {
	//防止这一行没有缓存
	let ratioRows = data.bodys[TARGET_CARD.target_ratio].rows;
	if (ratioRows.length == 0) {
		return;
	}
	let linkyearitemid;
	if (ratioRows.length == 1) {
		linkyearitemid = ratioRows[0].values[TARGET_CARD.clinkyearitemid].value;
	}

	//将平台方法获取的页面指标比例加到缓存里
	//如果最后没有一次表体换行没有重新触发onrowclick，最后一行输入的指标项比例就没放到this.target_item_cache里边。导致最后一行指标项比例丢失。
	let clickrow = props.cardTable.getClickRowIndex(TARGET_CARD.target_item);
	//表体指标项rowid
	let clickrowid = clickrow && clickrow.record && clickrow.record.rowid ? clickrow.record.rowid : '';
	for (let i = 0; i < ratioRows.length; i++) {
		this.target_item_cache[clickrowid] = {
			areaType: 'table',
			rows: [ ratioRows[i] ]
		};
	}

	data.bodys[TARGET_CARD.target_item].rows.map((row) => {
		//当前这个子表下有指标项比例(缓存里边取的)
		let currentItemRatioRows =
			this.target_item_cache && this.target_item_cache[row.rowid] && this.target_item_cache[row.rowid].rows
				? this.target_item_cache[row.rowid].rows
				: '';
		if (this.target_item_cache && currentItemRatioRows && currentItemRatioRows.length > 0) {
			for (let i = 0; i < currentItemRatioRows.length; i++) {
				//数据合并
				let newvalues = modify(currentItemRatioRows[i].values, true);
				Object.assign(row.values, newvalues);

				return true;
			}
		}
	});

	delete data.bodys[TARGET_CARD.target_ratio];
}
function processValidate(props) {
	let flag = props.validatePageToToast([
		{ name: TARGET_CARD.formId, type: 'form' },
		{ name: TARGET_CARD.target_org, type: 'cardTable' },
		{ name: TARGET_CARD.target_mar, type: 'cardTable' },
		{ name: TARGET_CARD.target_item, type: 'cardTable' }
	]);
	return flag.allPassed;
}

function setForeignKey(props, data) {
	let pk_target = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_target);
	data.bodys[TARGET_CARD.target_org].rows.map((row) => {
		if (row.status != '3') {
			row.values.pk_target = pk_target;
		}
	});
	data.bodys[TARGET_CARD.target_period].rows.map((row) => {
		if (row.status != '3') {
			row.values.pk_target = pk_target;
		}
	});
	data.bodys[TARGET_CARD.target_mar].rows.map((row) => {
		if (row.status != '3') {
			row.values.pk_target = pk_target;
		}
	});
	data.bodys[TARGET_CARD.target_item].rows.map((row) => {
		if (row.status != '3') {
			row.values.pk_target = pk_target;
		}
	});
}
function executeSave(props, data, url, actionType) {
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: url,
			data: data,
			success: function(res) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}

				let pk_target = res.data.head[TARGET_CARD.formId].rows[0].values.pk_target;
				let pk = props.getUrlParam('id');
				let fullPageData = updatePageData(props, res.data);
				if (props.getUrlParam('status') == 'add' || props.getUrlParam('option') == 'copy') {
					changeUrlParam(props, { id: pk_target.value, status: TARGET_CARD.browse });
					addCache(props, pk_target.value, fullPageData);
				} else {
					changeUrlParam(props, { id: pk_target.value, status: TARGET_CARD.browse });
					updateCache(props, fullPageData, true);
				}

				viewController.call(this, props, TARGET_CARD.browse);
				showSaveInfo();
			}
		});
	});
}
