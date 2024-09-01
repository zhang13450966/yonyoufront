/*
 * @Author: zhaochyu
 * @PageInfo:行内删除
 * @Date: 2018-04-12 14:23:01
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:36:44
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, record, index) {
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
				showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000003')); /* 国际化处理： 删除成功!*/
				/* 国际化处理： 删除成功！*/
			} else {
				showSuccessInfo(getLangByResId(this, '4001CARRIERGROUP-000021')); /* 国际化处理： 删除失败!*/
				/* 国际化处理： 删除失败！*/
			}
		}
	});
}
