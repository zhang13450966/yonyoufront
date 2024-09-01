/*
 * @Author: zhangshqb 
 * @PageInfo: 打印功能按钮
 * @Date: 2018-06-07 10:14:40 
 * @Last Modified by: zhangshqb 
 * @Last Modified time: 2018-06-07 10:14:40 
 */
import { print } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
export default function printBtnClick(props) {
	let data = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	let condata = null;
	if (data) {
		//构造前后台传递的数据结构
		condata = data.map((item) => {
			return {
				head: {
					po_stockps: {
						areacode: 'po_stockps',
						rows: [
							{
								values: item.data.values
							}
						]
					}
				},
				body: {
					po_stockps_fee: {
						areacode: 'po_stockps_fee',
						rows: item.data.childData
					}
				}
			};
		});
	}
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print, //后台服务url
		{
			userjson: JSON.stringify(condata)
		}
	);
}
