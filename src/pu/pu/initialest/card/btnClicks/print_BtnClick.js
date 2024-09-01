/*
 * @Author: zhaochyu 
 * @PageInfo: 打印 
 * @Date: 2018-07-06 13:58:41 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:00:11
 */
import { print } from 'nc-lightapp-front';
import { AREA, URL, FIELD } from '../../constance';
export default function(props) {
	let pks = [];
	let pk = props.form.getFormItemsValue(AREA.cardFormArea, FIELD.pk_initialest).value;
	pks.push(pk);
	// print(
	//   "html", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
	//   URL.print,
	//   {
	//     billtype: "4T", //单据类型
	//     funcode: "40041600", //功能节点编码，即模板编码
	//     nodekey: null,
	//     oids: pk // 功能节点的数据主键
	//   }
	// );
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		URL.print,
		{
			// billtype: "4T", //单据类型
			// funcode: "40041600", //功能节点编码，即模板编码
			nodekey: null,
			oids: pks // 功能节点的数据主键
		}
	);
}
