/*
 * @Author: zhaochyu
 * @PageInfo: 表头编辑后事件
 * @Date: 2018-04-15 14:43:27
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-08 15:06:33
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELD, URL, PAGECODE, HEAD_FIELD } from '../../constance';
import { toast } from 'nc-lightapp-front';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
export default function afterEvent(props, moduleId, key, value, i, index) {
	let bodyArea = PAGECODE.cardbody;
	let headArea = PAGECODE.cardhead;
	let pagecode = PAGECODE.cardpagecode;
	let data = null;
	//获取表体行数量
	let rows = this.props.cardTable.getNumberOfRows(bodyArea);
	//库存组织
	if (key == HEAD_FIELD.pk_stockorg_v) {
		this.props.form.setFormItemsValue(moduleId, {
			pk_stordoc: {
				value: ''
			}
		});
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_stockorg_value = data.card.head.card_head.rows[0].values.pk_stockorg_v.value;
		if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					return;
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					props.form.setFormItemsDisabled(AREA.cardFormArea, {
						[HEAD_FIELD.pk_stordoc]: false,
						[HEAD_FIELD.pk_managepsn]: false
					});
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.corigcurrencyid) {
		//币种
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.corigcurrencyid.value;
		if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.pk_dept_v) {
		//采购部门
		//获取采购员的值，以防编辑后清除
		let pk_bizpsn = this.props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_bizpsn);
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.pk_dept_v.value;
		if (value.value == null || value.value == '') return;
		//data.card.body.card_body.rows = [];
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					props.form.setFormItemsValue(moduleId, {
						[HEAD_FIELD.pk_bizpsn]: pk_bizpsn
					});
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.pk_bizpsn) {
		//采购员
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.pk_bizpsn.value;
		if (value.value == null || value.value == '') return;
		//data.card.body.card_body.rows = [];
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.pk_stordoc) {
		//仓库
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.pk_stordoc.value;
		if (value.value == null || value.value == '') return;
		//data.card.body.card_body.rows = [];
		ajax({
			url: URL.headAfterEdit,
			data: data,
			mode: 'normal',
			async: false,
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.nexchangerate) {
		//折本汇率
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.nexchangerate.value;
		if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.ctrantypeid) {
		//交易类型
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.ctrantypeid.value;
		if (value.value == null || value.value == '') return;
		//data.card.body.card_body.rows = [];
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.pk_supplier_v || key == HEAD_FIELD.pk_supplier) {
		//供应商
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.pk_supplier.value;
		if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.dbilldate) {
		//单据日期
		for (let i = 0; i < rows; i++) {
			this.props.cardTable.setValByKeyAndIndex(bodyArea, i, key, {
				value: value.value,
				display: value.value,
				scale: '-1'
			});
		}
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.dbilldate.value;
		if (value.value == null || value.value == '') return;
		//data.card.body.card_body.rows = [];
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					props.form.setFormItemsValue(moduleId, {
						dbilldate: ''
					});
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			},
			error: (err) => {
				if (err) {
					props.form.setFormItemsValue(moduleId, {
						dbilldate: ''
					});
					toast({ color: 'danger', content: err.message });
				}
			}
		});
	} else if (key == HEAD_FIELD.pk_purchaseorg_v) {
		//采购组织
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.pk_purchaseorg_v.value;
		if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					props.form.setFormItemsDisabled(AREA.cardFormArea, {
						pk_dept_v: false,
						pk_bizpsn: false
					});
					//cachedata.call(this, moduleId);
				}
			}
		});
	} else if (key == HEAD_FIELD.cratetype) {
		//汇率类型
		data = createHeadAfterEventData(props, pagecode, headArea, bodyArea, moduleId, key, value);
		//let pk_value = data.card.head.card_head.rows[0].values.nexchangerate.value;
		// if (value.value == null || value.value == '') return;
		ajax({
			url: URL.headAfterEdit,
			data: data,
			async: false,
			mode: 'normal',
			success: (res) => {
				if (!res.success) {
					toast({ color: 'danger', content: res.error.message });
				}
				if (res.data && res.data.billCard.head) {
					processBillCardHeadEditResult(props, headArea, bodyArea, res.data);
					//cachedata.call(this, moduleId);
				}
			}
		});
	}
	// else {
	// 	//cachedata.call(this, moduleId);
	// }
}
//设置整个表单区域编辑性
function setFormEditable(props, moduleId, flag) {
	let items = Object.keys(this.props.form.getAllFormValue(moduleId).rows[0].values);
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		this.props.form.setFormItemsDisabled(moduleId, { [item]: !flag });
	}
}
function cachedata(moduleId) {
	// 转单标识
	let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
	if (transfer) {
		let { currentindex, listdata } = this.state;
		let curindex = this.curindex;
		const { transferTable, form } = this.props;
		const { setTransferListValueByIndex } = transferTable;
		if (moduleId == PAGECODE.cardhead && listdata != '') {
			// 转单表头数据做缓存
			let headVals = form.getAllFormValue(moduleId);
			listdata[curindex].head[PAGECODE.cardhead].rows = headVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		} else if (moduleId == PAGECODE.cardbody && listdata != '') {
			// 表格数据
			let bodyVals = this.props.cardTable.getAllData(moduleId);
			listdata[curindex].body[PAGECODE.cardbody].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		}
	}
}
