/*
 * @Author: zhaochyu
 * @PageInfo: 表体编辑后事件
 * @Date: 2018-04-15 14:47:12
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-08 21:11:22
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, PAGECODE, URL, AREA, BODY_FIELD, ATTRCODES, CLEARFIELDS, FREEFIELD } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import {
	processBillCardBodyEditResult,
	createBodyAfterEventData
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';
export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	let bodyArea = PAGECODE.cardbody;
	// 初始化自定义参数
	let userobject = {};
	//触发联动计算字段
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	let triggerPoints = [
		BODY_FIELD.vchangerate,
		BODY_FIELD.nastnum,
		BODY_FIELD.nnum,
		BODY_FIELD.nastorigprice,
		BODY_FIELD.norigmny,
		BODY_FIELD.ntaxrate,
		BODY_FIELD.nasttaxprice,
		BODY_FIELD.nastprice,
		BODY_FIELD.nmny,
		BODY_FIELD.ntaxmny,
		BODY_FIELD.norigprice,
		BODY_FIELD.norigtaxprice,
		BODY_FIELD.nprice,
		BODY_FIELD.ntaxprice,
		BODY_FIELD.nastorigtaxprice,
		BODY_FIELD.ntax,
		BODY_FIELD.norigtaxmny,
		BODY_FIELD.bopptaxflag,
		BODY_FIELD.naccgoodssettlemny,
		BODY_FIELD.naccsettlemny,
		BODY_FIELD.naccfeesettlemny,
		BODY_FIELD.nsourcenum,
		BODY_FIELD.nestcalcostprice,
		BODY_FIELD.naccwashmny,
		BODY_FIELD.bestimateap,
		BODY_FIELD.naccinvoicenum,
		BODY_FIELD.ncaninvoicenum,
		BODY_FIELD.ncalcostmny,
		BODY_FIELD.ftaxtypeflag,
		BODY_FIELD.nnosubtax,
		BODY_FIELD.ctaxcountryid,
		BODY_FIELD.castunitid,
		BODY_FIELD.vbatchcode,
		BODY_FIELD.pk_apfinanceorg_v,
		BODY_FIELD.ctaxcodeid,
		BODY_FIELD.nnosubtaxrate
	]; //换算率 //数量 //主数量 //无税单价 //无税金额 //税率 //本币含税单价 //本币无税单价 //本币无税金额 //本币价税合计 //主无税单价 //主含税单价 //主本币无税价 //主本币含税价 //含税单价 //税额 //价税合计 //逆向征税 //累计货物结算金额 //累计结算金额 //累计费用结算金额 //来源单据主数量 //计成本单价 //累计冲减暂估金额 //暂估应付标志 //累计开票数量 //可开票数量 //计成本金额
	//物料编辑后要清空的字段
	let clearItems = [
		BODY_FIELD.pk_materialname,
		BODY_FIELD.materialspec,
		BODY_FIELD.materialtype,
		BODY_FIELD.vchangerate,
		BODY_FIELD.pk_srcmaterial,
		BODY_FIELD.castunitid,
		BODY_FIELD.cunitid
	];
	if (key != BODY_FIELD.vbatchcode) {
		if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) return;
	}
	if (key === BODY_FIELD.pk_material) {
		//物料
		let materialsNew = value;
		//清空并且不能编辑
		if (materialsNew.length == 0 || !materialsNew.values) {
			for (let item = 0; item < clearItems.length; item++) {
				this.props.cardTable.setValByKeyAndIndex(moduleId, index, clearItems[item], {
					value: null,
					display: null,
					scale: '-1'
				});
			}
		} else if (materialsNew) {
			let data = createBodyAfterEventData(
				props,
				PAGECODE.cardpagecode,
				AREA.cardFormArea,
				AREA.cardTableArea,
				moduleId,
				key,
				changedrows,
				index,
				userobject
			);
			// data.index = index;
			ajax({
				url: URL.bodyAfterEdit,
				data: data,
				async: false,
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg, //参数一：返回的公式对象
							{
								//参数二：界面使用的表格类型
								card_body: 'cardTable'
							}
						);
					}
					if (res.data && res.data.billCard && res.data.billCard.body && res.data.billCard.body[bodyArea]) {
						processBillCardBodyEditResult(props, moduleId, res.data, index);
						//cachedata.call(this, moduleId);
						RownoUtils.resetRowNo(props, FIELD.cardTable, ATTRCODES.crowno);
						//单位可编辑
						// props.form.setFormItemsDisabled(AREA.cardTableArea, {
						// 	[BODY_FIELD.castunitid]: false,
						// });
						props.cardTable.setColEditableByKey(AREA.cardTableArea, BODY_FIELD.castunitid, false);
					}
				}
			});
		}
	} else if (triggerPoints.includes(key)) {
		// } //单价，数量，金额字段
		if (key === BODY_FIELD.vbatchcode) {
			userobject = processBatchCodeValue(props, moduleId, value, CLEARFIELDS);
			if (!userobject) {
				props.cardTable.setValByKeyAndIndex(moduleId, index, BODY_FIELD.vbatchcode, {
					value: null,
					display: null
				});
				props.cardTable.setValByKeyAndIndex(moduleId, index, BODY_FIELD.pk_batchcode, {
					value: null,
					display: null
				});
				return;
			}
		}
		let afterdata = createBodyAfterEventData(
			props,
			PAGECODE.cardpagecode,
			AREA.cardFormArea,
			AREA.cardTableArea,
			moduleId,
			key,
			changedrows,
			index,
			userobject
		);
		ajax({
			url: URL.bodyAfterEdit,
			data: afterdata,
			async: false,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
				}
				if (res.data) {
					if (res.data) {
						processBillCardBodyEditResult(props, moduleId, res.data, index);
						//cachedata.call(this, moduleId);
					}
					if (res.data && res.data.billCard && res.data.billCard.head[PAGECODE.cardhead]) {
						props.form.setAllFormValue({
							[FIELD.formArea]: res.data.billCard.head[FIELD.formArea]
						});
					}
					// RownoUtils.resetRowNo(props, FIELD.cardTable, ATTRCODES.crowno);
				}
			}
		});
	} else if (key.indexOf('vfree') == 0 || fixAssts.includes(key)) {
		marAsstUtils.afterEdit.call(
			this,
			props,
			null,
			PAGECODE.cardpagecode,
			moduleId,
			key,
			BODY_FIELD.pk_material,
			record,
			index,
			FREEFIELD
		);
	}
	processCardTableAutoAddRow(props, PAGECODE.cardbody, index, { isMuli: changedrows.length > 1 ? true : false });
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
			setTransferListValueByIndex(PAGECODE.leftarea, listdata[curindex], curindex);
		} else if (moduleId == PAGECODE.cardbody && listdata != '') {
			//在修改时，为了更新state中数据表头的主键
			let headdata = form.getAllFormValue(PAGECODE.cardhead);
			listdata[curindex].head[PAGECODE.cardhead].rows = headdata.rows;
			// 表格数据
			let bodyVals = this.props.cardTable.getAllData(moduleId);
			listdata[curindex].body[PAGECODE.cardbody].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		}
	}
}
export { cachedata };
