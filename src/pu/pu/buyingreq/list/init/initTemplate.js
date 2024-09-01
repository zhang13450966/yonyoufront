/*
 * @Author: zhangchangqing
 * @PageInfo: 初始化查询
 * @Date: 2018-05-04 16:47:42
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:25:33
 */
import excelImportconfig from 'uap/common/components/excelImportconfig';
import { BUYINGREQ_LIST, BUYINGREQ_CARD, BUYINGREQ_LIST_BUTTON, ATTRCODE, ATTRCODES } from '../../siconst';
import commonSerach from '../btnClicks/commonSearch';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { hasListCache, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { buttonController, btnClickController } from '../viewControl';
import { yycBtnInit } from '../../../yyc/ext/yycBtnInit';
import { listLinkQuery } from './linkInitData';
import ntpLinkList from './ntpLinkList';
let head = BUYINGREQ_LIST.formId;
let pageId = BUYINGREQ_LIST.listpageid;

export default function(props) {
	//设置导入url  常量
	let excelimportconfig = excelImportconfig(
		props,
		BUYINGREQ_LIST.purchaseorg, //模块名称
		BUYINGREQ_LIST.billType, //单据类型
		true,
		BUYINGREQ_LIST.import,
		{
			noTips: true,
			isSelfDefineImport: true
		}
	);
	let linkkey = props.getUrlParam('pulinkkey');
	let callbackFun = (data) => {
		if (data) {
			transtypeUtils.init.call(this, data.context);
			if (data.template) {
				let meta = data.template;
				transtypeUtils.initQuery.call(this, props, meta, BUYINGREQ_LIST.searchId, ATTRCODE.ctrantypeid);
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				//props.button.hideButtonsByAreas([ BUYINGREQ_LIST.searchId ]);
				props.button.setButtons(button);
				props.button.setPopContent(
					BUYINGREQ_LIST_BUTTON.deleteRow,
					getLangByResId(this, '4004PRAYBILL-000037')
				); /* 国际化处理： 确认删除？*/
				// 友云采按钮初始化 add by guozhq
				yycBtnInit(props);
				// ---------end-----------------
				//将导入组件注册到按钮中
				props.button.setUploadConfig(BUYINGREQ_LIST_BUTTON.Import, excelimportconfig);
				// 初始化按钮状态
				buttonController.setListButtonVisiable(this.props, BUYINGREQ_LIST.toCommit);
			}
			if (data.context && data.context.paramMap) {
				//缓存交易类型,拉单使用
				setDefData(BUYINGREQ_LIST.dataSource, 'transtype', data.context.paramMap.transtype);
			}
			if (props.getUrlParam('pk_ntbparadimvo')) {
				// 采购计划联查过来的
				ntpLinkList.call(
					this,
					props,
					{ cardUrl: BUYINGREQ_LIST.cardUrl, listFormId: BUYINGREQ_LIST.formId },
					buttonController.setListButtonVisiable.bind(this)
				);
			} else {
				if (!hasListCache(this.props, BUYINGREQ_LIST.dataSource)) {
					if (linkkey) {
						let config = {
							areacode: BUYINGREQ_LIST.formId,
							pagecode: BUYINGREQ_LIST.listpageid,
							url: BUYINGREQ_LIST.queryPageURL
						};
						listLinkQuery.call(this, this.props, config);
					} else {
						commonSerach.bind(this, BUYINGREQ_LIST.toCommit)(); // 调用查询方法
					}
				} else {
					this.forceUpdate();
				}
			}
		}
	};
	//查询按钮使用
	props.createUIDom(
		{
			pagecode: pageId //卡片页面编码
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
		} else if (item.attrcode == ATTRCODE.bispositioninv) {
			//按计划岗过滤物料不是元数据项，
			item.queryCondition = () => {
				return {
					isDataPowerEnable: true,
					DataPowerOperationCode: 'SCMDefault'
				};
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
		} else if (item.attrcode == 'pk_praybill_b.pk_employee') {
			//采购员 根据采购组织 过滤 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(BUYINGREQ_LIST.searchId, 'pk_praybill_b.pk_purchaseorg');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: BUYINGREQ_LIST.purchaseorg };
			};
		} else if (item.attrcode == 'pk_praybill_b.pk_purchaseorg') {
			//采购组织不需要根据库存组织过滤
			// item.queryCondition = () => {
			// 	return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			// };
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
		} else if (item.attrcode == 'pk_praybill_b.cordertrantypecode') {
			// //订单类型过滤
			// item.queryCondition = () => {
			// 	return { parentbilltype: BUYINGREQ_CARD.billTypeOrder };
			// };
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
									pagecode: BUYINGREQ_LIST.cardpageid
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
		label: getLangByResId(this, '4004PRAYBILL-000028') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let state = record.fbillstatus.value;
			let buttonAry = buttonController.setRowButtons(state);
			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: BUYINGREQ_LIST_BUTTON.list_inner,
						ignoreHotkeyCode: getListDisableHotKeyBtn(),
						buttonLimit: 3,
						onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
					});
				}
			});
		}
	};
	// 将操作列添加到列表态的table中
	meta[head].items.push(porCol);
	return meta;
}
