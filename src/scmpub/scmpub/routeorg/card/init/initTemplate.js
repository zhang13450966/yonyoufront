/*
 * @Author: 王勇 
 * @PageInfo: 卡片-模版初始化  
 * @Date: 2020-01-17 09:42:03 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-14 10:09:19
 */

import { CARDTEMPLATEINFO, CARDBUTTONINFO, ROUTEVOINFO, VIEWINFO } from '../../const/index';
import { innerBtnClicks } from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, status, callback) {
	props.createUIDom(
		{
			pagecode: CARDTEMPLATEINFO.templateCode //页面编码
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					this.setState(
						{
							afterinit: true
						},
						() => {
							addFiledControll.call(this);
							callback && callback(props);
						}
					);
				}
			}
		}
	);
}

function addFiledControll() {
	if (this.state.viewStatus === VIEWINFO.ADD_STATUS) {
		// this.props.button.setButtonVisible(CARDBUTTONINFO.innerAddLineBtnCode,false);
		// this.props.button.setButtonVisible(CARDBUTTONINFO.delLineBtnCode,false);
		this.props.cardTable.setAllCheckboxAble(CARDTEMPLATEINFO.bodyAreaCode, true);
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}
}

function modifierMeta(props, meta) {
	//添加表格操作列
	let event = {
		// getLangByResId(this, '4006ARSUB-000001')
		label: getLangByResId(this, '4001ROUTE-000028') /**操作 */,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ CARDBUTTONINFO.innerDelLineBtnCode ];
			return props.button.createOprationButton(buttonAry, {
				area: CARDBUTTONINFO.cardAreaCode,
				buttonLimit: 3,
				onButtonClick: (props, key) => innerBtnClicks.call(this, props, key, text, record, index)
			});
		}
	};
	meta[CARDTEMPLATEINFO.bodyAreaCode].items.push(event);

	meta[CARDTEMPLATEINFO.headAreaCode].items.map((item, index) => {
		if (item.attrcode == ROUTEVOINFO.pk_org) {
			item.isHasDisabledData = false;
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
				};
			};
		} else if (item.attrcode == ROUTEVOINFO.pk_org_v) {
			item.queryCondition = () => {
				item.isHasDisabledData = false;
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		}
	});
	return meta;
}
