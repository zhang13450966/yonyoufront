/*
 * @Author: ligangt 
 * @PageInfo: 处理表头编辑后事件  
 * @Date: 2018-05-02 15:06:16 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-09 14:49:02
 */
import { URL, AREA, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
export default function(props, moduleId, key, value, changedrows, record, index) {
	if (key != 'ctrantypeid' && key != 'pk_pupsndoc') {
		return;
	}
	let headArea = AREA.head;
	let bodyArea = AREA.body;
	// afterEditHead: '/nccloud/pu/puinvoice/afterEditHead.do', //表头编辑后
	let data = props.createHeadAfterEventData(PAGECODE.card, headArea, bodyArea, moduleId, key, value);
	data.card.body.body.rows = [];
	if (value !== null && value.value !== null && value.value !== '') {
		ajax({
			url: URL.afterEditHead,
			data: data,
			mode: 'normal',
			async: false,
			success: (res) => {
				let data = res.data;
				// if (res.data && res.data.data && res.data.data.head && res.data.data.head[headArea]) {
				// 	let headvo = res.data.data.head[headArea];
				// 	setTimeout(() => {
				// 		this.props.form.setAllFormValue({ [headArea]: headvo });
				// 	}, 0);
				// }
				if (data && data.billCard && data.billCard.head && data.billCard.head[headArea]) {
					let headvo = data.billCard.head[headArea];
					// setTimeout(() => {
					props.form.setAllFormValue({ [headArea]: headvo }, false);
					// }, 0);
				}
				if (
					data &&
					data.billCard &&
					data.billCard.body &&
					data.billCard.body[bodyArea] &&
					data.billCard.body[bodyArea].rows
				) {
					let bodyrows = res.data.billCard.body[bodyArea].rows;
					// setTimeout(() => {
					props.cardTable.setTableData(bodyArea, bodyrows, false);
					// }, 0);
				}
				// if (data && data.data && data.data.body && data.data.body[bodyArea] && data.data.body[bodyArea].rows) {
				// 	let bodyrows = data.data.body[bodyArea].rows;
				// 	setTimeout(() => {
				// 		this.props.cardTable.setTableData(bodyArea, bodyrows);
				// 	}, 0);
				// }
				// transtypeUtils.setValue.call(this, moduleId, 'ctrantypeid', 'vtrantypecode');
			}
		});
	}
}
