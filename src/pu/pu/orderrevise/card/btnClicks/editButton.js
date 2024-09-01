/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片编辑按钮
 * @Date: 2018-04-19 14:39:42 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-20 16:55:44
 */
import { ajax, base } from 'nc-lightapp-front';
import { URL, FIELD, STATUS, PAGECODE } from '../../constance';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';

export default function editButton(props) {
	// 单据卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
	this.props.cardTable.selectAllRows(PAGECODE.cardbody, false);
	let pk_order = this.props.getUrlParam(FIELD.id);
	changeUrlParam(props, { id: pk_order, status: STATUS.edit });
	buttonController.materialPasteCancel.call(this, this.props);
	buttonController.togglePageShow.call(this, props);
}
