/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮 修改
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-19 18:19:46
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE } from '../../constance';
import buttonController from '../viewControl/buttonController';
export default function() {
	let pk = this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value;
	let data = { pk: pk };
	ajax({
		method: 'post',
		data: data,
		url: '/nccloud/pu/arrival/edit.do',
		success: (res) => {
			if (this.props.getUrlParam('type')) {
				this.props.cardTable.selectAllRows(AREA.body, false);
				this.indexstatus[this.state.index] = 'edit';
				buttonController.call(this, 'edit');
			} else {
				this.props.pushTo(URL.card, {
					status: 'edit',
					id: this.props.getUrlParam('id'),
					pagecode: PAGECODE.card,
					scene: this.props.getUrlParam('scene')
				});

				buttonController.call(this);
				this.props.cardTable.selectAllRows(AREA.body, false);
			}

			// this.select();
		}
	});
}
