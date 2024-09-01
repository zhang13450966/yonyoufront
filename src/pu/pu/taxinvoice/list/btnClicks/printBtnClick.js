/*
 * @Author: chaiwx 
 * @PageInfo: 打印
 * @Date: 2018-07-06 11:07:23 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-02-15 10:54:08
 */
import { print, ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let oids = [];
	let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
		return;
	}
	checkArr.map((row) => {
		oids.push(row.data.values[FIELDS.pk_taxinvoice].value);
	});
	//数据权限校验
	ajax({
		url: REQUESTURL.printdatapermission,
		data: oids,
		success: (res) => {
			if (res.success) {
				print(
					'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
					REQUESTURL.print, //后台服务url
					{
						oids: oids // 功能节点的数据主键
					}
				);
			}
		}
	});
}
