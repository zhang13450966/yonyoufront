/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-08-25 16:56:39 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-27 09:10:13
 */
import bill_BtnClick from './bill_BtnClick';
import row_BtnClick from './row_BtnClick';
import print_BtnClick from './print_BtnClick';

export default function clickBtn(props, id) {
	switch (id) {
		// 行关闭
		case 'LineClose':
			row_BtnClick.call(this, props, true);
			break;
		// 行打开
		case 'LineOpen':
			row_BtnClick.call(this, props, false);
			break;
		// 整单打开
		case 'BillOpen':
			bill_BtnClick.call(this, props, false);
			break;
		// 整单关闭
		case 'BillClose':
			bill_BtnClick.call(this, props, true);
			break;
		// 打印
		case 'Print':
			print_BtnClick.bind(this)(props);
			break;
		default:
			break;
	}
}
