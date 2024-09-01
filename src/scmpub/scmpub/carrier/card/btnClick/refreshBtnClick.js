/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义刷新
 * @Date: 2020-02-10 12:42:59
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-25 14:18:51
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, HEADFILED, PAGEID, URL, CARRIERDATASOURCE } from '../../constance';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	removeAllTableData,
	setAllTableData,
	setHeadCsupplierField,
	removeHeadCsupplierField
} from './setAllTableData';

export default function refreshBtnClick(props) {
	let pk = props.form.getFormItemsValue(AREA.card_head, HEADFILED.ccarrierid).value;
	let data = { id: pk, pagecode: PAGEID.cardpagecodeorg };
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.data == undefined) {
				this.props.form.setAllFormValue(AREA.card_head, { rows: [ {} ] });
				removeHeadCsupplierField.call(this);
				removeAllTableData.call(this);
			}
			if (res.data.carrier) {
				this.props.form.setAllFormValue({
					[AREA.card_head]: res.data.carrier[AREA.listTable]
				});
				showSuccessInfo(getLangByResId(this, '4001CARRIER-000009')); /* 国际化处理： 刷新成功!*/
				if (res.data.supplier) {
					setHeadCsupplierField.call(this, res.data.supplier[AREA.listTable]);
				}
			}
			//更新缓冲里边的数据
			updateCacheData(
				this.props,
				HEADFILED.ccarrierid,
				pk,
				res.data,
				AREA.card_head,
				CARRIERDATASOURCE.carrierdatasource
			);
			setAllTableData.call(this, res.data);
		}
	});
}
