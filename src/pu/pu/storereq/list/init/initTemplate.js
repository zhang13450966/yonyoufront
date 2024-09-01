/*
 * @Author: zhangchangqing
 * @PageInfo: 初始化查询
 * @Date: 2018-05-04 16:47:42
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:22:40
 */

import { base, ajax } from 'nc-lightapp-front';
import { STOREREQ_LIST, STOREREQ_LIST_BUTTON, ATTRCODE, FBILLSTATUS } from '../../siconst';
import { hasListCache, getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { initButtons } from '../afterEvents';
import commonSerach from '../btnClicks/commonSearch';
import { buttonController, btnClickController } from '../viewControl';
import { listLinkQuery } from './linkInitData';
let head = STOREREQ_LIST.formId;

export default function(props) {
	let linkkey = props.getUrlParam('pulinkkey');
	//查询按钮使用
	this.props.createUIDom(
		{
			pagecode: STOREREQ_LIST.listpageid //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					let meta = templedata.template;
					transtypeUtils.initQuery.call(this, props, meta, STOREREQ_LIST.searchId, ATTRCODE.ctrantypeid);
					meta = modifierMeta.call(this, this.props, meta);
					console.log(meta);
					this.props.meta.setMeta(meta);
				}
				if (templedata.button) {
					let button = templedata.button;
					//this.props.button.hideButtonsByAreas([ STOREREQ_LIST.searchId ]);
					this.props.button.setButtons(button);
					// 初始化按钮状态
					//initButtons.call(this, this.props, STOREREQ_LIST.toCommit);
					buttonController.setListButtonVisiable(this.props, STOREREQ_LIST.toCommit);
					props.button.setPopContent(
						STOREREQ_LIST_BUTTON.deleteRow,
						getLangByResId(this, '4004STOREREQ-000028')
					); /* 国际化处理： 确定要删除吗?*/
				}
				if (!hasListCache(this.props, STOREREQ_LIST.dataSource)) {
					if (linkkey) {
						let config = {
							areacode: STOREREQ_LIST.formId,
							pagecode: STOREREQ_LIST.listpageid,
							url: STOREREQ_LIST.queryPageURL
						};
						listLinkQuery.call(this, this.props, config);
					} else {
						commonSerach.bind(this, STOREREQ_LIST.toCommit)(); // 调用查询方法
					}
				} else {
					this.forceUpdate();
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	meta[head].status = STOREREQ_LIST.browse;

	meta[STOREREQ_LIST.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == ATTRCODE.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.ctrantypeid) {
			//设置表头物资需求申请类型参照过滤 根据单据类型
			item.queryCondition = () => {
				return { parentbilltype: STOREREQ_LIST.billType };
			};
		} else if (item.attrcode == 'pk_storereq_b.pk_appdept') {
			//申请部门 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, STOREREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, busifuncode: STOREREQ_LIST.storereq };
			};
		} else if (item.attrcode == 'pk_storereq_b.pk_apppsn') {
			//申请人 业务人员来源
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, STOREREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				let pk_appdept = props.search.getSearchValByField(STOREREQ_LIST.searchId, 'pk_storereq_b.pk_appdept');
				pk_appdept =
					pk_appdept != null
						? pk_appdept.value.firstvalue.includes(',') ? null : pk_appdept.value.firstvalue
						: null;
				return { pk_org: data, pk_dept: pk_appdept, busifuncode: STOREREQ_LIST.storereq };
			};
		} else if (item.attrcode == 'approver') {
			//用户档案的人，不需要显示业务单元
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, STOREREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'billmaker') {
			//用户档案的人，不需要显示业务单元
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, STOREREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else {
			//参照过滤 根据pk_org 过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(STOREREQ_LIST.searchId, STOREREQ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[head].items = meta[head].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == STOREREQ_LIST.vbillcode) {
			item.render = (text, record, index) => {
				if (text) {
					return (
						<span
							className="code-detail-link"
							onClick={(e) => {
								e.stopPropagation();
								props.pushTo(STOREREQ_LIST.cardUrl, {
									status: STOREREQ_LIST.browse,
									id: record.pk_storereq.value,
									pagecode: STOREREQ_LIST.cardpageid
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
		label: getLangByResId(this, '4004STOREREQ-000017') /* 国际化处理： 操作*/,
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
						area: STOREREQ_LIST_BUTTON.list_inner,
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
