/*
 * @Author: zhangshqb 
 * @PageInfo: 打印  
 * @Date: 2018-06-26 11:36:36 
 * @Last Modified by: zhangshqb 
 * @Last Modified time: 2018-06-26 11:36:36 
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
						areacode: 'po_vmi',
						rows: [
							{
								values: item.data.values
							}
						]
					}
				},
				body: {
					po_stockps_fee: {
						areacode: 'po_vmi_fee',
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
