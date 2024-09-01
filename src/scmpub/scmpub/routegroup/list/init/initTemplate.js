/*
 * @Author: 王勇 
 * @PageInfo: 列表-模版初始化  
 * @Date: 2020-01-17 09:52:43 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:09:00
 */
import { QUERYAREAINFO, ROUTEVOINFO, APPINFO, TEMPLATEINFO, BUTTONINFO, VIEWINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import { innerBtnClicks } from '../btnClicks/index';
import { referEvent } from '../events/index';
import { setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {FILED} from "../../../vehicle/constance";
export default function(props, callback) {
	props.createUIDom(
		{
			pagecode: APPINFO.pageCode //页面编码
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// props.button.setPopContent(BUTTONINFO.copyBtnCode,getLangByResId(this, '4001ROUTE-000046')/**确认要复制吗？ */);

					props.button.setPopContent(
						BUTTONINFO.delBtnCode,
						getLangByResId(this, '4001ROUTE-000041') /**确认要删除吗？ */
					);

					props.button.setPopContent(
						FILED.StartUse,
						getLangByResId(this, '4001ROUTE-000051')
					); /* 国际化处理：确定要启用吗? */
					props.button.setPopContent(
						FILED.StopUse,
						getLangByResId(this, '4001ROUTE-000052')
					); /* 国际化处理：确定要停用吗?*/


				}
				if (data.template) {
					let template = data.template;
					//分页
					template[TEMPLATEINFO.listAreaCode].pagination = true;
					//添加列表 操作按钮
					template = modifier.call(this, props, template);
					props.meta.setMeta(template);
					buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
					props.table.selectAllRows(TEMPLATEINFO.listAreaCode, false);
					filterRefer.call(this, template);
					referEvent.call(this, props, template);
					if (props.getUrlParam('queryFlag')) {
						this.setState({ queryFlag: true });
					}
					callback && callback(props);
				}
			}
		}
	);
}

function modifier(props, template) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001ROUTE-000028') /**操作 */,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry;
			if (record.bsealflag.value) {
				buttonAry = [
					BUTTONINFO.editBtnCode,
					BUTTONINFO.delBtnCode,
					BUTTONINFO.copyBtnCode,
					BUTTONINFO.StartUse
				];
			} else {
				buttonAry = [
					BUTTONINFO.editBtnCode,
					BUTTONINFO.delBtnCode,
					BUTTONINFO.copyBtnCode,
					BUTTONINFO.StopUse
				];
			}
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONINFO.innerAreaCode,
				buttonLimit: 3,
				onButtonClick: innerBtnClicks.bind(this, record, index)
			});
		}
	};
	template[TEMPLATEINFO.listAreaCode].items.push(event);
	return template;
}

function filterRefer(meta) {
	let filterFileds = [
		ROUTEVOINFO.cvehicleid,
		ROUTEVOINFO.ctrantypeid,
		ROUTEVOINFO.queryCaddrdocid,
		ROUTEVOINFO.ccarrierid
	];
	meta[QUERYAREAINFO.areaCode].items.map((item) => {
		setRefShowDisabledData(item);
		if (filterFileds.includes(item.attrcode)) {
			item.isMultiSelectedEnabled = true;
		}
	});
	return meta;
}

// function modifierMeta(props, meta) {
// 	meta[TEMPLATEINFO.listAreaCode].items.map((item, index) => {
// 		if (item.attrcode == ROUTEVOINFO.bsealflag) {
// 			item.itemtype = 'customer';
// 			item.render = (text, record, index) => {
// 				return (
// 					<div
// 						onClick={(e) => {
// 							//阻止冒泡。要不然行就被勾选上了
// 							if (e && e.stopPropagation) {
// 								//非IE
// 								e.stopPropagation();
// 							} else {
// 								//IE
// 								window.event.cancelBubble = true;
// 							}
// 						}}
// 					>
// 						<NCSwitch checked={record.bsealflag.value} onChange={onChange.bind(this, index)} />
// 					</div>
// 				);
// 			};
// 		}
// 	});
// 	return meta;
// }

// function onChange(index, value) {
// 	//只有浏览态可以点击开关
// 	let state = VIEWINFO.BROWSER_STATUS;
// 	if (state == VIEWINFO.BROWSER_STATUS) {
// 		innerEnableChangeClick.call(this, this.props, value, index);
// 	}
// }
