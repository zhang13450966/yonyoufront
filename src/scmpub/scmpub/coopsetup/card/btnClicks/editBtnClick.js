/*
 * @Author: yechd5 
 * @PageInfo: 协同设置卡片编辑按钮
 * @Date: 2018-05-22 16:35:31 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:00:08
 */
import { ajax } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController';

export default function editBtnClick(props) {
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.EDIT,
		id: this.props.getUrlParam('id'),
		srcoperator: COOPSETUP_CONST.CARD_EDIT
	});

	// 后台将被修改的数据 + 新增的初始化数据合并后返回，而不是仅仅是正在修改单据的表体数据
	let pk_coopsetup = this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'pk_coopsetup').value;
	let vbilltype_src = this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
	loadBody(this.props, vbilltype_src, pk_coopsetup);
	buttonController.call(this, props, COOPSETUP_CONST.EDIT);
}

// 加载表体页签数据
function loadBody(props, vbilltype_src, pk_coopsetup) {
	let data = {
		vbilltype_src: vbilltype_src,
		pk_coopsetup: pk_coopsetup,
		operation: COOPSETUP_CONST.EDIT
	};
	ajax({
		url: COOPSETUP_CONST.COPYANDEDITURL,
		data: data,
		success: (res) => {
			props.form.setAllFormValue({ head: res.data.head.head });
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, res.data.salepurchasecoop.coopsetbody);
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.coopsetbody);
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, res.data.invoicecoop.coopsetbody);
		}
	});
}
