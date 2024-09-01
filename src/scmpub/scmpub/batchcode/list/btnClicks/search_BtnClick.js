/*
 * @Author: 刘奇 
 * @PageInfo: 查询按钮实现
 * @Date: 2018-04-27 16:04:49 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-13 09:32:47
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELD } from '../constance';
import {
	showWarningInfo,
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { getDefData, setDefData } from '../../../pub/cache';
import { buttonControl } from '../viewController/buttonController';
//点击查询，获取查询区数据
export default function search_BtnClick(props, isRefresh) {
	let data = {};
	//如果是刷新操作直接读取缓存
	if (isRefresh == true) {
		data = getDefData(AREA.dataSource, FIELD.queryInfo);
	} else {
		data = props.search.getQueryInfo(AREA.searchArea);
	}
	if (!data.querycondition) {
		return;
	}
	let isNotNull = false;
	data.querycondition.conditions.forEach((element, index) => {
		if (element.field == FIELD.search_vbatchcode || element.field == FIELD.cmaterialoid) {
			if (element.value.firstvalue != '') {
				isNotNull = true;
			}
		}
		if (element.field == FIELD.bseal && element.value.firstvalue != '') {
			if (element.field == FIELD.bseal) {
				data.querycondition.conditions.splice(index, 1);
			}
		}
	});
	if (!isNotNull) {
		showWarningInfo(null, getLangByResId(this, '4001BATCHCODE-000016')); /* 国际化处理： 物料和批次号不能同时为空！*/
		return;
	}
	ajax({
		url: URL.query,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				props.editTable.setTableData(AREA.tableArea, res.data[AREA.tableArea]);
				if (res.data && res.data.message) {
					showWarningInfo(null, res.data.message);
				} else {
					if (isRefresh == true) {
						showRefreshInfo();
					} else {
						showHasQueryResultInfo(res.data[AREA.tableArea].rows.length);
					}
				}
			} else {
				props.editTable.setTableData(AREA.tableArea, { rows: [] });
				if (isRefresh == true) {
					showRefreshInfo();
				} else {
					showNoQueryResultInfo();
				}
			}
			//如果不是刷新操作,将查询条件缓存
			if (isRefresh != true) {
				setDefData(AREA.dataSource, FIELD.queryInfo, data);
			}
			buttonControl.call(this);
		}
	});
}
