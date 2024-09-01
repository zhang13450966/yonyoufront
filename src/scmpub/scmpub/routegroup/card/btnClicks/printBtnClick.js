/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线打印  
 * @Date: 2020-01-17 09:40:08 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:06:27
 */
import { CARDTEMPLATEINFO, REQUESTURL, ROUTEVOINFO, APPINFO } from '../../const/index';
import { print } from 'nc-lightapp-front';
export default function printBtnClick(props) {
	let pk = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid);
	let ids = [ pk.value ];
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		REQUESTURL.printRouteUrl,
		{
			funcode: APPINFO.appCode,
			// nodekey: TEMPLATEINFO.nodeKey,
			oids: ids //
		}
	);
}
