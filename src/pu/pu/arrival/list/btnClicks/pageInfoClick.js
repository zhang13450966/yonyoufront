/*
 * @Author: jiangfw 
 * @PageInfo: 分页查询
 * @Date: 2018-05-07 08:35:41 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-19 10:02:05
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, COMMON, URL, PAGECODE } from '../../constance';
export default function(props, config, pks) {
	let data = {
		pks: pks,
		pagecode: PAGECODE.head
	};
	//得到数据渲染到页面
	let that = this;
	ajax({
		url: URL.pageQuery,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(AREA.head, data[AREA.head]);
				} else {
					props.table.setAllTableData(AREA.head, { rows: [] });
				}
				let butArray = [
					'ReturnArrival',
					'Delete',
					'Commit',
					'UnCommit',
					'AccessoryManage',
					'QueryAboutBusiness',
					'Print',
					'OutPrint',
					'CombinPrint',
					'SplitPrint',
					'UrgentLetGo'
				];
				props.button.setButtonDisabled(butArray, true);
			}
		}
	});
}
