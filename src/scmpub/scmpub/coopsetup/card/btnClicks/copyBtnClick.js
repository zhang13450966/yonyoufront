/*
 * @Author: yechd5 
 * @PageInfo: 复制按钮实现
 * @Date: 2018-05-17 16:23:21 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:00:00
 */
import { ajax } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController';

export default function copyBtnClick(props) {
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.EDIT,
		id: props.getUrlParam('id'),
		copyFlag: COOPSETUP_CONST.COPY,
		srcoperator: COOPSETUP_CONST.CARD_COPY
	});

	let pk_coopsetup = this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'pk_coopsetup').value;
	let vbilltype_src = this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;

	// 复制时需清空的字段(表头字段前台清空，表体字段调用后台时情况)
	this.props.form.setFormItemsValue(COOPSETUP_CONST.FORMID, {
		pk_coopsetup: {
			value: null,
			display: null
		}
	});
	this.props.form.setFormItemsValue(COOPSETUP_CONST.FORMID, {
		ts: {
			value: null,
			display: null
		}
	});
	// 后台将被复制的数据 + 新增的初始化数据合并后返回，而不是仅仅复制被复制单据的表体数据
	loadBody(this.props, vbilltype_src, pk_coopsetup);
	buttonController.call(this, props, COOPSETUP_CONST.EDIT);
}

// 加载表体页签数据
function loadBody(props, vbilltype_src, pk_coopsetup) {
	let data = {
		vbilltype_src: vbilltype_src,
		pk_coopsetup: pk_coopsetup,
		operation: COOPSETUP_CONST.COPY
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
