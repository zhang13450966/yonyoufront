/*
 * @Author: sunxxf 
 * @PageInfo: 销售指标维护--导出
 * @Date: 2020-03-18 09:31:49 
 * @Last Modified by: wangpju
 * @Last Modified time: yyyy-09-Fr 06:21:48
 */
import { TARGETBILL_CONST, FIELD } from '../../const/const';
import { constructExcel } from '../../utils/excelTools';
import { formDownload } from 'nc-lightapp-front';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
export default function clickExportBtn(props) {
	//判断表头是物料维度还是期间
	let cmardimenid = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.cmardimenid) || {}).value;
	let vperiod = (props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.vperiod) || {}).value;
	let title = getLangByResId(this, '4001TARGETBILL-000014'); /* 国际化处理： 销售指标维护导出*/
	let head = {};
	let body = {};
	//指标设置是全部物料，不显示物料维度列
	let hasMatCol = false;
	let headmata = props.meta.getMeta();
	headmata[TARGETBILL_CONST.formId].items.map((item) => {
		if (item.attrcode == FIELD.cmardimenid) {
			hasMatCol = true;
			return;
		}
	});
	//初始化表头模板

	head[getLangByResId(this, '4001TARGETBILL-000015')] = {
		/* 国际化处理： 销售组织*/
		code: FIELD.pk_org,
		name: getLangByResId(this, '4001TARGETBILL-000015') /* 国际化处理： 销售组织*/
	};
	head[getLangByResId(this, '4001TARGETBILL-000016')] = {
		/* 国际化处理： 销售组织*/
		code: FIELD.ctargetid,
		name: getLangByResId(this, '4001TARGETBILL-000016') /* 国际化处理： 销售组织*/
	};
	if (cmardimenid && hasMatCol) {
		//物料维度
		head[getLangByResId(this, '4001TARGETBILL-000017')] = {
			/* 国际化处理： 物料维度*/
			code: FIELD.cmardimenid,
			name: getLangByResId(this, '4001TARGETBILL-000017') /* 国际化处理： 物料维度*/
		};
	} else if (vperiod) {
		//期间
		head[getLangByResId(this, '4001TARGETBILL-000018')] = {
			/* 国际化处理： 期间*/
			code: FIELD.vperiod,
			name: getLangByResId(this, '4001TARGETBILL-000018') /* 国际化处理： 期间*/
		};
	}
	let meta = props.meta.getMeta();
	let i = 1;
	//初始化表体模板
	meta[TARGETBILL_CONST.tableId].items.forEach((item) => {
		let excelColumn = {};
		if (item.visible) {
			if (!item.children) {
				//let parentcell = {};
				excelColumn.code = item.attrcode;
				excelColumn.name = item.label;
				//excelColumn.push(parentcell);
			} else if (item.attrcode && item.children && item.children.length > 0) {
				//let parentcell = {};
				excelColumn.code = item.attrcode;
				excelColumn.name = item.label;
				let childrenArr = [];
				item.children.forEach((child) => {
					let childcell = {};
					childcell.code = child.attrcode;
					childcell.name = child.label;
					childrenArr.push(childcell);
				});
				excelColumn.children = childrenArr;
				//excelColumn.push(parentcell);
			}
			if (item.label != '' && item.label != getLangByResId(this, '4001TARGETBILL-000013')) {
				/* 国际化处理： 操作*/
				body[item.label] = excelColumn;
			}
			// body.push(excelColumn);
		}
	});

	let json = constructExcel.call(this, props, TARGETBILL_CONST.formId, TARGETBILL_CONST.tableId, 1);
	let data = {
		template: JSON.stringify({ title, head, body }),
		json: JSON.stringify(json)
	};
	//调用下载组件
	formDownload({
		params: data,
		url: TARGETBILL_CONST.exportexcelUrl,
		enctype: 1,
		target: '_self'
	});
}
