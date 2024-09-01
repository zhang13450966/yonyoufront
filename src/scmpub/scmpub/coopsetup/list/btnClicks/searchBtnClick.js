/*
 * @Author: yechd5 
 * @PageInfo: 点击查询，获取查询区数据
 * @Date: 2018-04-18 14:52:24 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-10 16:42:37
 */
import { ajax, cacheTools } from 'nc-lightapp-front';
import { showNoQueryResultInfo, showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { COOPSETUP_CONST } from '../../const';
import setTableButtonEnable from '../viewController/buttonController';
import { setDefData } from '../../../pub/cache';
export default function serachBtnClick(props, noshow) {
	let searchVal = this.props.search.getQueryInfo(COOPSETUP_CONST.SEARCHID);
	let data = getSearchData(searchVal);
	ajax({
		url: COOPSETUP_CONST.QUERYURL,
		data: data,
		success: (res) => {
			let allpks = new Array();
			if(noshow && 'refresh' == noshow && (res.data === undefined || res.data == null)){
				// 刷新界面且查出数据为空时，渲染界面并提示刷新成功
				this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, { rows: [] });
				// 缓存主键pks
				cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, allpks);
				showRefreshInfo();
			} else if (noshow && 'refresh' == noshow){
				// 刷新界面且查出数据不为空时，渲染界面并提示刷新成功
				this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, res.data.head);
				let rows = res.data.head.rows;
				for (let i = 0; i < rows.length; i++) {
					let row = rows[i];
					allpks.push(row.values.pk_coopsetup.value);
				}
				showRefreshInfo();
				// 缓存主键pks
				cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, allpks);
				setTableButtonEnable.call(this, props);
			} else if (res.data === undefined || res.data == null) {
				this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, { rows: [] });
				// 缓存主键pks
				cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, allpks);
				showNoQueryResultInfo(); /* 国际化处理： 未查到数据！*/
			} else {
				this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, res.data.head);
				let rows = res.data.head.rows;
				for (let i = 0; i < rows.length; i++) {
					let row = rows[i];
					allpks.push(row.values.pk_coopsetup.value);
				}
				showQueryResultInfoForNoPage(rows.length);
				// 缓存主键pks
				cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, allpks);
				setTableButtonEnable.call(this, props);
			}
			setDefData(COOPSETUP_CONST.dataSource, COOPSETUP_CONST.queryFlag, true);
		}
	});
}

/**
 * 删除所有行
 * @param {} moduleId 
 * @param {*} len
 */
function delRows(props, moduleId, len) {
	if (len > 0) {
		let rows = [];
		for (let i = 0; i < len; i++) {
			rows.push(i);
		}
		props.table.deleteTableRowsByIndex(moduleId, rows);
	}
}

/**
 * 组装查询参数结构
 * @param {*} searchVal
 */
function getSearchData(searchVal) {
	let data = {
		querycondition: searchVal.querycondition,
		pageCode: COOPSETUP_CONST.PAGEID_LIST,
		queryAreaCode: searchVal.queryAreaCode, //查询区编码
		oid: searchVal.oid, // 查询区oid
		querytype: searchVal.querytype
	};
	return data;
}
