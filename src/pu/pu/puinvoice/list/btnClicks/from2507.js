/*
 * @Author: jiangfw 
 * @PageInfo: 通用列表查询  
 * @Date: 2018-05-08 13:43:33 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-08-26 11:08:52
 */
import { ajax } from 'nc-lightapp-front';
import { URL, COMMON, AREA } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { btnController } from '../viewControl';

export default function() {
	let id = this.props.getUrlParam('id');
	let pageInfo = this.props.table.getTablePageInfo(this.tableId);
	let queryInfo = { pageInfo: pageInfo };
	let data = {
		userobj: {
			id: id
		},
		queryInfo: queryInfo
	};

	ajax({
		url: URL.from2507Qry,
		data: data,

		success: (res) => {
			let { success, data } = res;
			if (success) {
				let toCommitNum = '0'; // 未提交数量
				let approvingNum = '0'; // 审批中数量

				if (data) {
					// 执行公式
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}

					if (res.data && res.data[this.tableId]) {
						// let rowsData = res.data[this.tableId];
						// toCommitNum = rowsData.pageInfo.total;
						// this.props.table.setAllTableData(this.tableId, rowsData);
						this.setState(
							{
								toCommitNum: toCommitNum,
								approvingNum: approvingNum
							},
							() => {
								let rowsData = { rows: [] };
								if (res.data && res.data[this.tableId]) {
									rowsData = res.data[this.tableId];
								}
								this.props.table.setAllTableData(this.tableId, rowsData);
							}
						);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
						this.setState({
							toCommitNum: 0,
							approvingNum: 0
						});
					}
				}

				setDefData(COMMON.PuinvoiceCacheKey, 'totalNum', {
					toCommitNum: toCommitNum,
					approvingNum: approvingNum
				});
				setDefData(COMMON.PuinvoiceCacheKey, COMMON.CurrentTab, AREA.all);

				btnController.call(this, this.props);
			}
		}
	});
}
