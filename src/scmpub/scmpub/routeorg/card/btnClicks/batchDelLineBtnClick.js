/*
 * @Author: 王勇 
 * @PageInfo: 卡片表体 批量删行 
 * @Date: 2020-02-20 17:09:02 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 11:25:49
 */
import { CARDTEMPLATEINFO } from '../../const/index';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import innerDelLineBtnClick from './innerDelLineBtnClick';
export default function batchDelLineClick(props) {
	const data = props.cardTable.getCheckedRows(CARDTEMPLATEINFO.bodyAreaCode);
	if (data) {
		if (data.length === 0) {
			showWarningInfo(null, getLangByResId(this, '4001ROUTE-000035')); /* 国际化处理： 请选择要删除的单据行！*/
		} else {
			let arr = [];
			data.forEach((element) => {
				arr.push(element.index);
			});
			innerDelLineBtnClick.call(this, props, arr);
		}
	} else {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000035')); /* 国际化处理： 请选择要删除的单据行！*/
	}
}
