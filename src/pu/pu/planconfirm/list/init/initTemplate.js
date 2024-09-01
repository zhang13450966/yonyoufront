/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，列表初始化页面
 * @Date: 2021-11-19 11:06:19 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-31 17:41:20
 */
import { PAGECODE, FIELD, AREA, URL, UISTATE, BTNID, BILLSTATUS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';
import { buttonController, btnClickController } from '../viewController';
import { pageInfoClick } from '../btnClicks';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.list
		},
		(data) => {
			if (data.template) {
				let meta = data.template;
				//meta =
				modifier.call(this, props, meta);
				props.meta.setMeta(meta); // 里程碑看板跳转
				let srcpk = this.props.getUrlParam(FIELD.pk);
				if (srcpk) {
					let srcpks = [];
					srcpks.push(srcpk);
					pageInfoClick.call(this, this.props, null, srcpks);
				}
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				props.button.setPopContent(
					BTNID.Delete,
					getLangByResId(this, '4004planconfirm-000001')
				); /* 国际化处理：  确认删除？*/
			}
			buttonController.call(this, this.props);
		}
	);
}

/**
 * 页面扩展
 * @param {*} props 
 * @param {*} meta 
 * @returns 
 */
function modifier(props, meta) {
	meta[AREA.search].items.map((item) => {
		// 默认都显示组织切换组件
		//item.isShowUnit = true;
		if (item.attrcode == FIELD.pk_org) {
			item.isShowUnit = false;
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctranstypeid) {
			item.queryCondition = () => {
				return { parentbilltype: PAGECODE.billType };
			};
		} else if (item.attrcode == 'pk_planconfirm_b.cmaterialid') {
			// 过滤物料
			//item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(AREA.search, FIELD.pk_org);
				return {
					pk_org: pk_org ? pk_org.value.firstvalue : null, //组织过滤
					isDataPowerEnable: true,
					DataPowerOperationCode: 'SCMDefault'
				};
			};
		} else {
			// 其他字段默认通过主组织过滤
			item.queryCondition = () => {
				//item.isShowUnit = true;
				// 根据pk_org过滤
				item.queryCondition = () => {
					let data = props.search.getSearchValByField(AREA.search, FIELD.pk_org);
					data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
					return {
						pk_org: data
					};
				};
			};
		}
		/**
         * 如果不是人员，则该设置无效
         * 人员参照显示离职人员
         * 人员参照显示离职人员显示停用
         */
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});

	// 列表态编码列扩展，修改为超链接
	let tableTemp = meta[AREA.head];
	tableTemp.items = tableTemp.items.map((item) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record[FIELD.hid] && record[FIELD.vbillcode]) {
					return (
						<BillCodeHyperLink
							value={((record || {})[FIELD.vbillcode] || {}).value}
							onClick={() => {
								this.props.pushTo(URL.card, {
									status: UISTATE.browse,
									pagecode: PAGECODE.card,
									id: ((record || {})[FIELD.hid] || {}).value
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});

	// 从meta中可以获取上面方法中获取的“搜索域”和“表格域”的元素，这里需要在表格中添加操作列，所以取tableArea
	let operation = {
		attrcode: 'opr',
		label: getLangByResId(this, '4004planconfirm-000000') /* 国际化处理： 操作*/,
		visible: true,
		width: '200px',
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [];
			let fbillstatus = record[FIELD.fbillstatus].value;
			switch (fbillstatus) {
				case BILLSTATUS.free:
					buttonAry = [ BTNID.Commit, BTNID.Edit, BTNID.Delete, BTNID.ApproveDetail ];
					break;
				case BILLSTATUS.approving:
				case BILLSTATUS.approve:
					buttonAry = [ BTNID.ApproveDetail ];
					break;
				case BILLSTATUS.nopass:
					buttonAry = [ BTNID.Edit, BTNID.ApproveDetail ];
					break;
			}
			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: AREA.listInnerBtnArea,
						buttonLimit: 3,
						onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index),
						ignoreHotkeyCode: getListDisableHotKeyBtn()
					});
				}
			});
		}
	};
	tableTemp.items.push(operation); // 将操作列添加到列表态的table中

	return meta;
}
