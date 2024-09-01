/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-19 14:57:55
 */
import { BUYINGREQ_LIST } from '../../siconst';
import { buttonController } from '../viewControl';
import { ajax, promptBox } from 'nc-lightapp-front';
import refreshBtnClick from './refreshBtnClick';
import { showWarningInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let formId = BUYINGREQ_LIST.formId; //'head';
export default function batchBtnClick(props) {
	let showFlag = false; //是否进行提示
	//获取表体勾选数据
	let checkData = props.editTable.getCheckedRows(formId);
	if (checkData == undefined) {
		return;
	}
	if (checkData.length <= 0) {
		showWarningInfo(null, getLangByResId(this, '4004PRAYBILLARRANGE-000000')); /* 国际化处理： 请选择需要处理的数据！*/
		return;
	}
	if (!this.state.purchaseorg_v.refpk) {
		showWarningInfo(null, getLangByResId(this, '4004PRAYBILLARRANGE-000014')); /* 国际化处理： 请选择采购组织！*/
		return false;
	}
	//需求确认 不需要校验供应商和采购员
	// else if (!this.state.employee.refpk || !this.state.pk_suggestsupplier_v.refpk) {
	// 	showFlag = true;
	// }

	if (showFlag) {
		promptBox({
			color: 'warning', // 提示类别
			title: getLangByResId(this, '4004PRAYBILLARRANGE-000013'), // 提示标题
			content: getLangByResId(this, '4004PRAYBILLARRANGE-000015'), // 提示内容,非必输
			beSureBtnName: getLangByResId(this, '4004PRAYBILLARRANGE-000026'), // 确定按钮名称
			cancelBtnName: getLangByResId(this, '4004PRAYBILLARRANGE-000027'), // 取消按钮名称
			hasCloseBtn: true, //显示“X”按钮，默认不显示，不显示是false，显示是true
			beSureBtnClick: () => {
				backtotransfer.bind(this, props, checkData, true)();
			}, // 确定按钮点击调用函数
			cancelBtnClick: () => {
				backtotransfer.bind(this, props, checkData, false)();
			}, // 取消按钮点击调用函数
			closeBtnClick: () => {
				buttonController.setState.call(this);
			}, //关闭按钮点击调用函数
			closeByClickBackDrop: false //点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false
		});
	} else {
		backtotransfer.bind(this, props, checkData, false)();
	}
}
function backtotransfer(props, checkData, flag) {
	this.setState({
		showModal: false
	});
	// 获取选中行

	//将输入的值赋给勾选的行上
	let pk_purchaseorg_v = {
		value: this.state.purchaseorg_v.refpk,
		display: this.state.purchaseorg_v.refname,
		scale: '-1'
	};
	let pk_purchaseorg = this.state.pk_purchaseorg;
	let pk_employee = {
		value: null,
		display: null,
		scale: '-1'
	};
	let pk_suggestsupplier_v = {
		value: null,
		display: null,
		scale: '-1'
	};
	if (this.state.employee.refpk) {
		pk_employee.value = this.state.employee.refpk;
		pk_employee.display = this.state.employee.refname;
	}
	if (this.state.pk_suggestsupplier_v.refpk) {
		pk_suggestsupplier_v.value = this.state.pk_suggestsupplier_v.refpk;
		pk_suggestsupplier_v.display = this.state.pk_suggestsupplier_v.refname;
	}

	for (let i = 0; i < checkData.length; i++) {
		props.editTable.setValByKeyAndIndex(formId, checkData[i].index, 'pk_purchaseorg_v', pk_purchaseorg_v);
		props.editTable.setValByKeyAndIndex(formId, checkData[i].index, 'pk_purchaseorg', pk_purchaseorg);
		if (flag) {
			props.editTable.setValByKeyAndIndex(formId, checkData[i].index, 'pk_employee', pk_employee);
			props.editTable.setValByKeyAndIndex(
				formId,
				checkData[i].index,
				'pk_suggestsupplier_v',
				pk_suggestsupplier_v
			);
		} else {
			if (this.state.employee.refpk) {
				props.editTable.setValByKeyAndIndex(formId, checkData[i].index, 'pk_employee', pk_employee);
			}
			if (this.state.pk_suggestsupplier_v.refpk) {
				props.editTable.setValByKeyAndIndex(
					formId,
					checkData[i].index,
					'pk_suggestsupplier_v',
					pk_suggestsupplier_v
				);
			}
		}
	}
	let editData = props.editTable.getChangedRows(formId);
	if (editData.length <= 0 || editData == undefined) {
		//refreshBtnClick.bind(this)();
		this.setState({
			showSearch: true
		});
		refreshBtnClick.bind(this)();
		//点击取消重新查询数据
		this.toggleShow(BUYINGREQ_LIST.browse);
		return;
	}
	let rows = [];
	editData.map((item) => {
		rows.push(item);
	});
	let formData = {
		areacode: BUYINGREQ_LIST.formId,
		areaType: 'table',
		rows: rows
	};
	let data = {
		pageid: BUYINGREQ_LIST.listpageid,
		model: formData
	};
	// 发送请求
	ajax({
		url: BUYINGREQ_LIST.saveBatchURL,
		data: data,
		success: (res) => {
			if (res.success) {
				buttonController.setState.call(this);
				refreshBtnClick.bind(this, false)();
				//点击取消重新查询数据
				this.toggleShow(BUYINGREQ_LIST.browse);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLARRANGE-000009')); /* 国际化处理： 安排成功！*/
			} else {
			}
		}
	});
}
