/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义初始化数据
 * @Date: 2020-01-14 16:56:36
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:38:28
 */
import { PAGEID, AREA, FILED, ALLBUTTONS, BROWSEBUTTONS, HEADFILED, URL, CARRIERDATASOURCE } from '../../constance';
import { lineSelected } from '../viewController/buttonController';
import btnClickController from '../viewController/btnClickController';
import { getDefData } from '../../../pub/cache';
import { getSearchValByField } from '../../../../../scmpub/scmpub/pub/tool/SearchTool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { commonSearch } from '../btnClicks/commonSearch';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGEID.listpagecodeorg
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						if (data.context && data.context.pk_org) {
							let pk_org = {
								display: data.context.org_Name,
								value: data.context.pk_org
							};
							props.search.setSearchValByField(AREA.searchArea, HEADFILED.pk_org, pk_org);
						}
						let queryInfo = getDefData(CARRIERDATASOURCE.carrierdatasource, 'queryInfo');
						commonSearch.call(this, queryInfo, false, false);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(
						FILED.Delete,
						getLangByResId(this, '4001CARRIER-000004')
					); /* 国际化处理： 确认要删除该信息吗？*/

					props.button.setPopContent(
						FILED.StartUse,
						getLangByResId(this, '4001CARRIERGROUP-000025')
					); /* 国际化处理：确定要启用吗? */
					props.button.setPopContent(
						FILED.StopUse,
						getLangByResId(this, '4001CARRIERGROUP-000026')
					); /* 国际化处理：确定要停用吗? */


					props.button.setButtonVisible(ALLBUTTONS, false);
					props.button.setButtonVisible(BROWSEBUTTONS, true);
					lineSelected.call(this, props);
					let queryInfo = getDefData(CARRIERDATASOURCE.carrierdatasource, 'queryInfo');
					if (!queryInfo) {
						props.button.setButtonDisabled(FILED.Refresh, true);
					}
				}
			}
		}
	);
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001CARRIER-000033') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry;
			if (record.bsealflag.value) {
				buttonAry = [ FILED.Edit, FILED.Delete, FILED.StartUse ];
			} else {
				buttonAry = [ FILED.Edit, FILED.Delete, FILED.StopUse ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: AREA.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, record, index, true)
			});
		}
	};
	meta[AREA.listTable].items.push(event);
	let type = this.props.getUrlParam(FILED.type);
	meta[AREA.listTable].items.forEach((item) => {
		if (item.attrcode == 'cpsndocid') {
			//按组织过滤
			item.queryCondition = () => {
				if (type == 1) {
					item.isShowUnit = true;
					let data = this.state.pk_org;
					let returnData = {};
					if (data) {
						returnData.pk_org = data;
					}
					return returnData;
				} else {
					let data = this.state.pk_org;
					let returnData = {};
					if (data) {
						returnData.pk_org = data;
					}
					return returnData;
				}
			};
		}
	});
	meta[AREA.searchArea].items.map((item) => {
		if (item.attrcode == HEADFILED.pk_org) {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: URL.org_permissions
				};
			};
		} else if (item.attrcode == HEADFILED.csupplierid) {
			item.isShowUnit = true;
			//按组织过滤
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, AREA.searchArea, HEADFILED.pk_org);
				let returnData = {};
				if (pk_org) {
					returnData.pk_org = pk_org;
				}
				returnData.GridRefActionExt = 'nccloud.web.scmpub.ref.SupplierRefFilter';
				return returnData;
			};
		} else if (item.attrcode.startsWith('vdef') && item.itemtype == 'refer') {
			this.pk_org_filter_Fields.push(item.attrcode);
			item.queryCondition = () => {
				let pk_org = getSearchValByField(props, AREA.searchArea, HEADFILED.pk_org);
				return {
					pk_org: pk_org
				};
			};
		}
	});
	return meta;
}
