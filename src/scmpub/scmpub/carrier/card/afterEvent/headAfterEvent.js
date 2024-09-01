/*
 * @Author: zhaochyu
 * @PageInfo: 表头编辑后事件
 * @Date: 2018-04-15 14:43:27
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-25 15:23:26
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, PAGEID, HEADFILED } from '../../constance';
import { createHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { removeAllTableData, removeHeadCsupplierField } from '../btnClick/setAllTableData';
export default function afterEvent(props, moduleId, key, value, i, index) {
	let bodyArea = AREA.driver;
	let headArea = AREA.card_head;
	let pagecode = PAGEID.cardpagecodeorg;
	let data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
	//承运商
	if (key == HEADFILED.csupplierid) {
		if (value.value == null || value.value == '') {
			this.props.form.setFormItemsValue(AREA.card_head, {
				bankaccnum: { value: null, display: null },
				bankaddress: { value: null, display: null },
				bankname: { value: null, display: null },
				suplinkman1: { value: null, display: null },
				suplinkman2: { value: null, display: null }
			});
			return;
		}
		ajax({
			url: URL.headafter,
			data: data,
			success: (res) => {
				if (res.data && res.data.head) {
					props.form.setAllFormValue({ [headArea]: res.data.head.card_head });
					removeAllTableData.call(this);
				}
			},
			error: (res) => {
				let error = res;
				props.form.setFormItemsValue(AREA.card_head, { csupplierid: { value: null, display: null } });
				//承运商参照会带出供应商的表头字段
				removeHeadCsupplierField.call(this);
				removeAllTableData.call(this);
				showErrorInfo(error.message);
			}
		});
	}
}
