/*
 * @Author: zhaochyu
 * @PageInfo:行内删除
 * @Date: 2018-04-12 14:23:01
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:34:28
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props, record, index) {
	let pk_org = record.pk_org.value;
	let pk_group = record.pk_group.value;
	if (pk_org == pk_group) {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000005')); /* 国际化处理： 组织节点不能删除集团数据！*/
		return;
	}
	let data = {
		delRows: [
			{
				pk: record.ccarrierid.value, // 主键
				ts: record.ts.value // 时间戳
			}
		]
	};
	//要删除的Pk
	let deletepk = record.ccarrierid.value;
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				props.table.deleteTableRowsByIndex(AREA.listTable, index);
				deleteCacheDataForList(props, AREA.listTable, deletepk);
				showSuccessInfo(getLangByResId(this, '4001CARRIER-000006')); /* 国际化处理： 删除成功!*/
				/* 国际化处理： 删除成功！*/
			} else {
				showSuccessInfo(getLangByResId(this, '4001CARRIER-000027')); /* 国际化处理： 删除失败!*/
				/* 国际化处理： 删除失败！*/
			}
		}
	});
}
