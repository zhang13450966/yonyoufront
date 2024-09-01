/*
 * @Author: zhangchangqing
 * @PageInfo: 初始化查询
 * @Date: 2018-05-04 16:47:42
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:02:43
 */

import { TARGETADJ_LIST, TARGETADJ_LIST_BUTTON, ATTRCODE } from '../../siconst';
import commonSerach from '../btnClicks/commonSearch';
import { transtypeUtils, setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { hasListCache, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { buttonController, btnClickController } from '../viewControl';
import { listLinkQuery } from './linkInitData';
let head = TARGETADJ_LIST.formId;
let pageId = TARGETADJ_LIST.listpageid;

export default function(props) {
	let linkkey = props.getUrlParam('pulinkkey');
	let callbackFun = (data) => {
		if (data) {
			transtypeUtils.init.call(this, data.context);
			if (data.template) {
				let meta = data.template;
				transtypeUtils.initQuery.call(this, props, meta, TARGETADJ_LIST.searchId, ATTRCODE.ctrantypeid);
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				props.button.setPopContent(
					TARGETADJ_LIST_BUTTON.deleteRow,
					getLangByResId(this, '4001TARGETADJ-000037')
				); /* 国际化处理： 确认删除？*/
				// ---------end-----------------
				// 初始化按钮状态
				buttonController.setListButtonVisiable(this.props, TARGETADJ_LIST.toCommit);
			}
			if (data.context && data.context.paramMap) {
				//缓存交易类型,拉单使用
				setDefData(TARGETADJ_LIST.dataSource, 'transtype', data.context.paramMap.transtype);
			}
			if (!hasListCache(this.props, TARGETADJ_LIST.dataSource)) {
				if (linkkey) {
					let config = {
						areacode: TARGETADJ_LIST.formId,
						pagecode: TARGETADJ_LIST.listpageid,
						url: TARGETADJ_LIST.queryPageURL
					};
					listLinkQuery.call(this, this.props, config);
				} else {
					commonSerach.bind(this, TARGETADJ_LIST.toCommit)(); // 调用查询方法
				}
			} else {
				this.forceUpdate();
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
	meta[head].status = TARGETADJ_LIST.browse;

	meta[TARGETADJ_LIST.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		//设置主组织过过滤
		if (item.attrcode == ATTRCODE.pk_org) {
			//主组织过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'pk_targetadj_b.ccustomerid') {
			//客户
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(TARGETADJ_LIST.searchId, TARGETADJ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'billmaker') {
			//制单人
			item.queryCondition = () => {
				//用户档案的人，不需要显示业务单元
				let data = props.search.getSearchValByField(TARGETADJ_LIST.searchId, TARGETADJ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == ATTRCODE.ctargetid) {
			//销售指标表
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TARGETADJ_LIST.searchId, TARGETADJ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, fmaintainflag: '1' };
			};
		} else if (item.attrcode == 'pk_targetadj_b.cmarsetid') {
			//物料维度
			item.queryCondition = () => {
				//根据指标表字段过滤
				let data = props.search.getSearchValByField(TARGETADJ_LIST.searchId, ATTRCODE.ctargetid);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { TARGETID: data };
			};
		} else {
			//参照过滤 根据pk_org 过滤
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TARGETADJ_LIST.searchId, TARGETADJ_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	meta[head].items = meta[head].items.map((item, key) => {
		if (item.attrcode == TARGETADJ_LIST.vbillcode) {
			item.render = (text, record, index) => {
				if (text) {
					return (
						<span
							className="code-detail-link"
							onClick={(e) => {
								e.stopPropagation();
								props.pushTo(TARGETADJ_LIST.cardUrl, {
									status: TARGETADJ_LIST.browse,
									id: record.pk_targetadj.value,
									pagecode: TARGETADJ_LIST.cardpageid
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
		label: getLangByResId(this, '4001TARGETADJ-000028') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let state = record.fstatusflag.value;
			let buttonAry = buttonController.setRowButtons(state);
			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: TARGETADJ_LIST_BUTTON.list_inner,
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
