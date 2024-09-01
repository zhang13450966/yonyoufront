/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 11:29:41
 */
import { ajax } from 'nc-lightapp-front';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { URL, AREA, PAGECODE, COMMON, FIELD } from '../../constance';
let tableId = AREA.list;
import {
	showHasQueryResultInfo,
	showWarningInfo,
	showQueryResultInfoForNoPage,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from '../viewControl/btnController';

//点击查询，获取查询区数据
export default function(searchVal, isRefresh) {
	if (!searchVal) {
		searchVal = this.props.search.getQueryInfo(AREA.searchArea);
		if (searchVal && !searchVal.querycondition) return;
		// 将查询条件缓存
		setDefData(COMMON.ArrivalqcCacheKey, AREA.searchArea, searchVal);
	}
	searchVal = searchVal || {};

	let isCheck = this.props.search.getSearchValByField(AREA.searchArea, 'isCheck');
	if (isCheck && isCheck.value.firstvalue) {
		// this.state.isCheck = isCheck.value.firstvalue;
		this.isCheck = isCheck.value.firstvalue == 'Y' ? true : false;
	} else {
		// 跟需求确认过预制查询方案里没有“免检存货是否报检” 则等于是，而且只要是查询出来的单子都能报检 20181221
		this.isCheck = true;
	}

	let pk_org_item = this.props.search.getSearchValByField(AREA.searchArea, 'pk_org');
	let pk_org = null;
	if (pk_org_item && pk_org_item.value.firstvalue) {
		pk_org = pk_org_item.value.firstvalue;
		// this.state.pk_org = pk_org_item.value.firstvalue;
		this.pk_org = pk_org_item.value.firstvalue;
	}

	// 查询库存组织是否启用质检模块
	ajax({
		method: 'post',
		url: URL.qcEnable,
		data: { pk_org: pk_org },
		// data: { pk_org: this.pk_org },
		success: (res) => {
			// this.props.editTable.setStatus(tableId, 'edit');
			this.props.editTable.setStatus(tableId, 'browse');
			if (res.data) {
				// this.setState({ isQcEnable: true });
				this.isQcEnable = true;
				// 显示 到货数量
				this.props.editTable.showColByKey(tableId, [ FIELD.nnum ]);
				// 隐藏 本次报检数量、合格主数量、且不能编辑
				this.props.editTable.hideColByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ]);
				this.props.editTable.setColEditableByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ], true);
			} else {
				// this.setState({ isQcEnable: false });
				this.isQcEnable = false;
				// 显示 本次报检数量、合格主数量且能编辑
				this.props.editTable.showColByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ]);
				this.props.editTable.setStatus(tableId, 'edit');
				this.props.editTable.setColEditableByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ], false);
				// 隐藏 到货数量
				this.props.editTable.hideColByKey(tableId, [ FIELD.nnum ]);
			}
		}
	});

	// 查询库存组织是否启用质检模块
	// let isQcEnable = await isQCEnable.call(this, pk_org);
	// if (isQcEnable) {
	// 	this.setState({ isQcEnable: true });
	// 	// 显示 到货数量
	// 	this.props.editTable.showColByKey(tableId, [ FIELD.nnum ]);
	// 	// 隐藏 本次报检数量、合格主数量、且不能编辑
	// 	this.props.editTable.hideColByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ]);
	// 	this.props.editTable.setColEditableByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ], true);
	// } else {
	// 	this.setState({ isQcEnable: false });
	// 	// 显示 本次报检数量、合格主数量且能编辑
	// 	this.props.editTable.showColByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ]);
	// 	this.props.editTable.setColEditableByKey(tableId, [ FIELD.nchecknum, FIELD.nwillelignum ], false);
	// 	// 隐藏 到货数量
	// 	this.props.editTable.hideColByKey(tableId, [ FIELD.nnum ]);
	// }

	let data = {
		queryInfo: searchVal, //查询条件
		pageCode: PAGECODE.list //页面编码
	};
	//得到数据渲染到页面
	ajax({
		url: URL.queryScheme,
		data: data,
		success: (res) => {
			if (res.data) {
				data = res.data;
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let rowsData = { rows: [] };
				let result = data.result;
				if (result != undefined && result != null) {
					rowsData = result[AREA.list];
				}
				this.props.editTable.setTableData(tableId, rowsData);
				if (data != undefined && data != null) {
					let messa = data.message; //当查询出来的结果大于两千条，只显示2000条数据，并进行提示
					if (messa != undefined && messa != null && isRefresh != true) {
						// showSuccessInfo(messa);
						showWarningInfo(null, messa);
					} else if (data.result != undefined && data.result != null && isRefresh != true) {
						showHasQueryResultInfo(rowsData.rows.length); //显示查询成功条数
					} else if (isRefresh != true) {
						showQueryResultInfoForNoPage();
					}
				}
			} else {
				this.props.editTable.setTableData(tableId, { rows: [] });
				showQueryResultInfoForNoPage();
			}
			if (isRefresh == true) {
				showRefreshInfo();
			}

			// 按钮刷新
			btnController.call(this, this.props);
		}
	});
}
