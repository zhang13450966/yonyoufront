/*
 * @Author: zhangchangqing
 * @PageInfo: 初始化查询
 * @Date: 2018-05-04 16:47:42
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-13 15:12:52
 */

import { base, ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES, FBILLSTATUS } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { buttonClick } from '../btnClicks';
import initButtons from '../btnClicks/initButtons';
import { buttonController, btnClickController } from '../viewControl';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { hasListCache, getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
let head = BUYINGREQ_LIST.formId;

export default function(props) {
	let callbackFun = (data) => {
		console.dir(data);

		if (data) {
			if (data.template) {
				let meta = data.template;
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta, () => {
					//initButtons.bind(this, props, true)();
					buttonController.setListButtonVisiable.bind(this, this.props)();
					// let disableArrdef = {
					// 	[BUYINGREQ_LIST_BUTTON.Refresh]: true //刷新
					// };
					// props.button.setDisabled(disableArrdef);
				});
			}
			if (data.button) {
				let button = data.button;
				//props.button.hideButtonsByAreas([BUYINGREQ_LIST.searchId]);
				props.button.setButtons(button);
			}
			if (!hasListCache(this.props, BUYINGREQ_LIST.dataSource)) {
				//commonSerach.bind(this, BUYINGREQ_LIST.executing)(); // 调用查询方法
			} else {
				this.forceUpdate();
			}
		}
	};
	//查询按钮使用
	props.createUIDom(
		{
			pagecode: BUYINGREQ_LIST.listpageid //卡片页面编码 appid: BUYINGREQ_LIST.appid //应用主键
		},
		callbackFun
	);
}

function modifierMeta(props, meta) {
	meta[head].status = BUYINGREQ_LIST.browse;
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
				return {
					pk_org: data,
					pk_dept: pk_plandept,
					busifuncode: BUYINGREQ_LIST.storereq,
					DataPowerOperationCode: 'SCMDefault',
					isDataPowerEnable: true
				};
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
	meta[head].items = meta[head].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == BUYINGREQ_LIST.vbillcode) {
			item.render = (text, record, index) => {
				if (text) {
					return (
						<span
							className="code-detail-link"
							onClick={(e) => {
								e.stopPropagation();
								props.pushTo(BUYINGREQ_LIST.cardUrl, {
									status: BUYINGREQ_LIST.browse,
									id: record.pk_praybill.value,
									pagecode: BUYINGREQ_LIST.cardpageid,
									pk_srcpraybill:
										record.fbillstatus.value == FBILLSTATUS.approve
											? record.pk_srcpraybill.value
											: null
								});
							}}
						>
							{record.vbillcode && record.vbillcode.value}
						</span>
					);
				}
			};
		}
		return item;
	});
	let porCol = {
		//attrcode: 'operation',
		label: getLangByResId(this, '4004PRAYBILLR-000017') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let nversion = record.nversion.value; //版本号
			let fbillstatus = record.fbillstatus.value; //单据状态
			let buttonAry = buttonController.setRowButtons(nversion, fbillstatus);
			return props.button.createOprationButton(buttonAry, {
				area: BUYINGREQ_LIST_BUTTON.list_inner,
				ignoreHotkeyCode: getListDisableHotKeyBtn(), //忽略行操作快捷键防止热键冲突
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	// 将操作列添加到列表态的table中
	meta[head].items.push(porCol);
	return meta;
}
