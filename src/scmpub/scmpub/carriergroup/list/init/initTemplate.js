/*
 * @Author: zhaochyu
 * @PageInfo: 车辆定义初始化数据
 * @Date: 2020-01-14 16:56:36
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:42:43
 */
import { PAGEID, AREA, FILED, HEADFILED, ALLBUTTONS, BROWSEBUTTONS, CARRIERDATASOURCE } from '../../constance';
import { lineSelected } from '../viewController/buttonController';
import { commonSearch } from '../btnClicks/commonSearch';
import btnClickController from '../viewController/btnClickController';
import { getDefData } from '../../../pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGEID.listpagecodegroup
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						let queryInfo = getDefData(CARRIERDATASOURCE.carrierdatasource, 'queryInfo');
						commonSearch.call(this, queryInfo, false, false);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(
						FILED.Delete,
						getLangByResId(this, '4001CARRIERGROUP-000002')
					); /* 国际化处理： 确认要删除吗？*/


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
		label: getLangByResId(this, '4001CARRIERGROUP-000024') /* 国际化处理： 操作*/,
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
		if (item.attrcode == HEADFILED.csupplierid) {
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.scmpub.ref.SupplierRefFilter'
				};
			};
		}
	});
	return meta;
}
