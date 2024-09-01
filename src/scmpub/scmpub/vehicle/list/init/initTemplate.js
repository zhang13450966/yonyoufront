/*
 * @Author: zhaochyu 
 * @PageInfo: 车辆定义初始化数据
 * @Date: 2020-01-14 16:56:36 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-22 14:39:25
 */
import { PAGEID, AREA, URL, FILED, ALLBUTTONS, BROWSEBUTTONS } from '../../constance';
import { getMainOrgAfter } from '../../../pub/tool/vehicleTools/getOrgAfter';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import btnClickController from '../viewController/btnClickController';
import { base, ajax } from 'nc-lightapp-front';
import { setDeleteStatus } from '../viewController/buttonController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCSwitch } = base;
export default function(props) {
	let _this = this;
	let type = this.props.getUrlParam(FILED.type);
	props.createUIDom(
		{
			pagecode: type == 0 ? PAGEID.pagecodeorg : PAGEID.pagecodegroup
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					_this.setState({
						pageid: data.template.pageid
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setButtonVisible(ALLBUTTONS, false);
					props.button.setButtonVisible(BROWSEBUTTONS, true);
					props.button.setPopContent(
						FILED.Delete,
						getLangByResId(this, '4001VEHICLE-000004')
					); /* 国际化处理： 确认要删除吗？*/
					props.button.setPopContent(
						FILED.StartUse,
						getLangByResId(this, '4001VEHICLE-000012')
					); /* 国际化处理：确定要启用吗? 4001VEHICLE-000012*/
					props.button.setPopContent(
						FILED.StopUse,
						getLangByResId(this, '4001VEHICLE-000016')
					); /* 国际化处理：确定要停用吗?*/
					setDeleteStatus.call(this);
					let disable = {};
					ALLBUTTONS.map((v) => {
						disable[v] = true;
					});
					props.button.setDisabled(disable);
				}
				if (data.context && data.context.pk_org) {
					_this.setState(
						{
							mainOrg: {
								refpk: data.context.pk_org,
								refname: data.context.org_Name
							},
							pk_org: type == 0 ? data.context.pk_org : null
						},
						() => {
							if (type == 0) {
								_this.refs.mainorg.onChange({
									refpk: data.context.pk_org,
									refname: data.context.org_Name
								});
							}
						}
					);
				}
				if (type == 1) {
					getMainOrgAfter.call(_this, AREA.listTable, URL.orgChange, null, PAGEID.pagecodegroup, 'group');
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
		label: getLangByResId(this, '4001VEHICLE-000021') /* 国际化处理： 操作*/ /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '150px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry;
			if (record.values.bsealflag.value) {
				buttonAry = [ FILED.Delete, FILED.StartUse ];
			} else {
				buttonAry = [ FILED.Delete, FILED.StopUse ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: AREA.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, true, record, index)
			});
		}
	};
	meta[AREA.listTable].items.push(event);
	//修改车辆定义页面长、宽、高、容积、载重等列字段名称
	metaUiData(meta);
	columnSortUtils.numberSort(meta, AREA.listTable, 'crowno');
	return meta;
}
function metaUiData(meta) {
	ajax({
		url: URL.uidata,
		async: false,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					meta[AREA.listTable].items.forEach((item) => {
						if (item.attrcode == 'nload') {
							item.label = item.label + '(' + data.T + ')';
						} else if (item.attrcode == 'ncubage') {
							item.label = item.label + '(' + data.V + ')';
						} else if (
							item.attrcode == 'nlength' ||
							item.attrcode == 'nwidth' ||
							item.attrcode == 'nheight'
						) {
							item.label = item.label + '(' + data.L + ')';
						}
					});
				}
			}
		}
	});
}
