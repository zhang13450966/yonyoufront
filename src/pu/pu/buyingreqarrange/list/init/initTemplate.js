/*
 * @Author: zhangchangqing 
 * @PageInfo: 初始化查询  
 * @Date: 2018-05-04 16:47:42 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-06 15:28:29
 */

import { base, ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES } from '../../siconst';
import { buttonController } from '../viewControl';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { yycBtnInit } from '../../../yyc/ext/yycBtnInit';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import BillCodeHyperLink from '../../../../../scmpub/scmpub/components/BillCodeStyle';
let { NCPopconfirm, NCIcon } = base;
let head = BUYINGREQ_LIST.formId;

export default function (props) {
	let callbackFun = (data) => {
		if (data) {
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				// 友云采按钮初始化 add by guozhq
				yycBtnInit(props);
			}
			if (data.template) {
				let meta = data.template;
				let new_meta = modifierMeta.call(this, props, meta);
				props.meta.setMeta(new_meta, () => {
					buttonCon(props);
				});
			}
		}
	};
	//查询按钮使用
	props.createUIDom(
		{
			pagecode: BUYINGREQ_LIST.listpageid //卡片页面编码
		},
		callbackFun
	);
}
function buttonCon(props) {
	buttonController.setButtonVisible(props);
	buttonController.setButtonDisabled(props);
}
function modifierMeta(props, meta) {
	meta[head].status = BUYINGREQ_LIST.browse;
	// 请购单单号添加超链接
	meta[head].items.map((item) => {
		if (item.attrcode == 'vbillcode') {
			item.renderStatus = 'browse';
			item.render = (text, record, index) => {
				if (record && record.values.vbillcode) {
					return (
						<BillCodeHyperLink
							value={record.values.vbillcode.value}
							onClick={() => {
								props.openTo(null, {
									appcode: BUYINGREQ_CARD.reqAppcode,
									pagecode: BUYINGREQ_CARD.reqCardPAGECODE,
									status: BUYINGREQ_CARD.browse,
									id: record.values.pk_praybill.value
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});
	//批量设置字段值过滤
	meta[BUYINGREQ_LIST.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		//设置表头请购类型参照过滤 根据单据类型
		if (item.attrcode == ATTRCODE.ctrantypeid) {
			item.queryCondition = () => {
				return { parentbilltype: BUYINGREQ_CARD.billType };
			};
		} else if (item.attrcode == ATTRCODE.pk_org) {
			//主组织过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.pk_plandept || item.attrcode == ATTRCODE.pk_plandept_v) {
			//计划部门 根据pk_org 过滤 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: BUYINGREQ_LIST.storereq };
			};
		} else if (item.attrcode == ATTRCODE.pk_planpsn) {
			//计划员 根据pk_org 过滤 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_plandept = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, ATTRCODE.pk_plandept);
				pk_plandept =
					pk_plandept != null
						? pk_plandept.value.firstvalue.includes(',') ? null : pk_plandept.value.firstvalue
						: null;
				return { pk_org: data, pk_dept: pk_plandept, busifuncode: BUYINGREQ_LIST.storereq };
			};
		} else if (item.attrcode == ATTRCODES.pk_reqdept) {
			//需求部门部门 根据pk_org 过滤 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: BUYINGREQ_LIST.storereq };
			};
		} else if (item.attrcode == 'pk_praybill_b.pk_purchaseorg') {
			//采购组织不需要根据库存组织过滤
			// item.queryCondition = () => {
			// 	return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			// };
		} else if (item.attrcode == 'pk_praybill_b.pk_employee') {
			//采购员 根据采购组织 过滤 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, 'pk_praybill_b.pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: BUYINGREQ_LIST.purchaseorg };
			};
		} else if (item.attrcode == 'approver') {
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'billmaker') {
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			//参照过滤 根据pk_org 过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, BUYINGREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	columnSortUtils.numberSort(meta, BUYINGREQ_LIST.formId, ATTRCODES.crowno);
	return meta;
}
