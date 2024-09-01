/*
 * @Author: 刘奇 
 * @PageInfo: 初始化模板  
 * @Date: 2018-04-27 13:31:12 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2022-04-21 19:27:41
 */

import { AREA, BUTTON } from '../constance';
import { onBody_BtnClick } from '../btnClicks';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { setRefShowDisabledData } from '../../../pub/tool/refUtils';
import { buttonControl } from '../viewController/buttonController';
export default function(props) {
	props.createUIDom(
		{
			pagecode: AREA.pageArea
		},
		(data) => {
			if (data) {
				if (data.template) {
					if (data.button) {
						let button = data.button;
						props.button.setPopContent(BUTTON.stopUse, getLangByResId(this, '4001BATCHCODE-000014'));
						props.button.setPopContent(BUTTON.startUse, getLangByResId(this, '4001BATCHCODE-000015'));
						props.button.setButtons(button);
					}
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						// setTimeout(() => {
						this.props.button.hideButtonsByAreas([ BUTTON.list_head ]);
						this.props.button.setButtonVisible(
							[ BUTTON.add, BUTTON.edit, BUTTON.delete, BUTTON.print, BUTTON.refresh ],
							true
						);
						this.props.button.setButtonVisible([ BUTTON.save, BUTTON.cancel ], false);
						this.props.button.setDisabled({
							[BUTTON.delete]: true,
							[BUTTON.print]: true,
							[BUTTON.output]: true,
							[BUTTON.refresh]: true,
							[BUTTON.edit]: true,
							[BUTTON.add]: false
						});
						// }, 0);
						buttonControl.call(this);
					});
				}
			}
		}
	);
}
function modifierMeta(props, meta) {
	//修改列渲染样式
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		if (item.attrcode == 'bseal') {
			item.onPopconfirmCont = getLangByResId(this, '4001BATCHCODE-000014'); /* 国际化处理： 确定要停用吗？*/
			item.offPopconfirmCont = getLangByResId(this, '4001BATCHCODE-000015'); /* 国际化处理： 确定要启用吗？*/
		}
		return item;
	});

	let _this = this;

	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001BATCHCODE-000013') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTON.deleteLine ];
			let status = props.editTable.getStatus(_this.tableId);
			if (status === 'browse') {
				if (record.values.bseal && record.values.bseal.value) {
					buttonAry = [ BUTTON.deleteLine, BUTTON.startUse ];
				} else {
					buttonAry = [ BUTTON.deleteLine, BUTTON.stopUse ];
				}
			}

			return props.button.createOprationButton(buttonAry, {
				area: BUTTON.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => onBody_BtnClick.call(_this, props, key, record, index)
			});
		}
	};
	meta[AREA.searchArea].items.map((item) => {
		//所有参照都增加启用停用按钮
		setRefShowDisabledData(item);
		if (item.attrcode == 'cmaterialoid') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				return {
					scm_wholemanaflag: 'Y',
					GridRefActionExt: 'nccloud.web.scmpub.ref.MaterialoidRefFilterUtils'
				};
			};
		}
	});
	meta[AREA.tableArea].items.push(event);
	return meta;
}
