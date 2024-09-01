/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-10-15 13:50:48
 */
import { ajax } from 'nc-lightapp-front';
import { base } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYINGREQ_CARD, ATTRCODES, ATTRCODE, FBILLSTATUS } from '../../siconst';
import pageInfoClick from './pageInfoClick';
const { NCMessage } = base;
let tableId = BUYINGREQ_CARD.tableId;
export default function delRowRule(props, indexs) {
	let writeRows = [];
	let indexRows = this.props.cardTable.getRowsByIndexs(BUYINGREQ_CARD.tableId, indexs);

	let setPk_srcpraybillb = new Set();
	let crownoMap = new Map();
	indexRows.forEach((item, index) => {
		if (item.values.pk_srcpraybillb.value) {
			setPk_srcpraybillb.add(item.values.pk_srcpraybillb.value);
			crownoMap.set(item.values.pk_srcpraybillb.value, item.values.crowno.value);
		} else {
			setPk_srcpraybillb.add(item.values.pk_praybill_b.value);
			crownoMap.set(item.values.pk_praybill_b.value, item.values.crowno.value);
		}
	});
	let pk_srcpraybill = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_srcpraybill).value;
	let fbillstatus = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.fbillstatus).value;
	let pk_praybill = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	let pk = pk_praybill;
	if (pk_srcpraybill) {
		pk = pk_srcpraybill;
	}
	let data = {
		keyword: pk,
		pageid: BUYINGREQ_CARD.cardpageid
	};
	ajax({
		url: BUYINGREQ_CARD.queryCardInfoURL,
		data: data,
		async: false,
		success: (res) => {
			// if (res.data.head) {
			// 	this.props.form.setAllFormValue({ [BUYINGREQ_CARD.formId]: res.data.head[BUYINGREQ_CARD.formId] });
			// }
			if (res.data.body && res.data.body[tableId]) {
				let datas = res.data.body[tableId].rows;
				datas.forEach((item, index) => {
					if (setPk_srcpraybillb.has(item.values.pk_praybill_b.value)) {
						writeRows.push(item);
					}
				});
				// this.props.cardTable.setTableData(tableId, res.data.body[tableId], null, true, true);
				// writeRows = this.props.cardTable.getRowsByIndexs(tableId, index);
				// this.props.cardTable.setTableData(tableId, allRows, null, true, true);
			}
		}
	});
	let errorMessage = '';
	let deleteRows = new Set();
	for (let i = 0; i < writeRows.length; i++) {
		let flag = true;
		// let crowno = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.crowno).value;
		// let crowno = writeRows[i].values[ATTRCODES.crowno].value;
		let crowno = crownoMap.get(writeRows[i].values[ATTRCODES.pk_praybill_b].value);
		//来源单据类型
		// let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.csourcetypecode)
		// 	.value;
		let csourcetypecode = writeRows[i].values[ATTRCODES.csourcetypecode].value;
		if ('1001Z91000000001U0LZ' == csourcetypecode) {
			flag = false;
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILLR-000006') +
				crowno +
				getLangByResId(this, '4004PRAYBILLR-000007'); /* 国际化处理： 第,行来源于资产配置申请, 不能删除\n*/
		}
		//行关闭
		// let browclose = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.browclose).value;
		let browclose = writeRows[i].values[ATTRCODES.browclose].value;
		if (browclose) {
			flag = false;
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILLR-000006') +
				crowno +
				getLangByResId(this, '4004PRAYBILLR-000008'); /* 国际化处理： 第,行已经关闭\n*/
		}
		//累计订货数量
		// let naccumulatenum = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.naccumulatenum)
		// 	.value;
		let naccumulatenum = writeRows[i].values[ATTRCODES.naccumulatenum].value;
		//生成合同次数
		// let ngenct = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.ngenct).value;
		let ngenct = writeRows[i].values[ATTRCODES.ngenct].value;
		//生成价格审批单次数
		// let npriceauditbill = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.npriceauditbill)
		// .value;
		let npriceauditbill = writeRows[i].values[ATTRCODES.npriceauditbill].value;
		//生成询报价单次数
		// let nquotebill = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.nquotebill).value;
		let nquotebill = writeRows[i].values[ATTRCODES.nquotebill].value;
		//发布到电子商务
		// let bpublishtoec = props.cardTable.getValByKeyAndIndex(tableId, writeRows[i], ATTRCODES.bpublishtoec).value;
		let bpublishtoec = writeRows[i].values[ATTRCODES.bpublishtoec].value;
		if (naccumulatenum > 0 || ngenct > 0 || npriceauditbill > 0 || nquotebill > 0 || bpublishtoec) {
			flag = false;
			errorMessage =
				errorMessage +
				getLangByResId(this, '4004PRAYBILLR-000006') +
				crowno +
				getLangByResId(this, '4004PRAYBILLR-000009'); /* 国际化处理： 第,行已经有后续单据\n*/
		}
		if (flag) {
			deleteRows.add(writeRows[i].values[ATTRCODES.pk_praybill_b].value);
		}
	}
	indexRows.forEach((item, index) => {
		if (fbillstatus == FBILLSTATUS.approved) {
			if (deleteRows.has(item.values.pk_praybill_b.value) || !item.values.pk_praybill_b.value) {
				props.cardTable.delRowByRowId(tableId, item.rowid);
			}
		} else {
			if (deleteRows.has(item.values.pk_srcpraybillb.value) || !item.values.pk_srcpraybillb.value) {
				props.cardTable.delRowByRowId(tableId, item.rowid);
			}
		}
	});
	return errorMessage;
}
