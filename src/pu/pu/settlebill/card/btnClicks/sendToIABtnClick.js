/**
 * 传成本、取消传成本
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE } from '../../constance';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { pageInfoClick } from './index';

export default function sendToIABtnClick(props, url, content) {
	let datas = this.props.form.getAllFormValue(PAGECODE.cardhead).rows;
	let settleBillInfo = datas.map(item => {
		return {
			id: item.values.pk_settlebill.value,
			ts: item.values.ts.value,
		};
	});
	let pkbill = settleBillInfo[0].id;
	let data = { pagecode: PAGECODE.cardcode, settleBillInfo };
	ajax({
		url: url,
		data: data,
		success: res => {
			let { success, data } = res;
			if (success) {
				showSuccessInfo(content);
				pageInfoClick.call(this, props, pkbill);
			}
		},
	});
}
