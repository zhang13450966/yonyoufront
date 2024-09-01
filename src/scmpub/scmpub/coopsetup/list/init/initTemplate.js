/*
 * @Author: yechd5 
 * @PageInfo: 协同设置列表模板
 * @Date: 2018-04-16 13:19:06 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2020-03-12 09:07:11
 */
import { COOPSETUP_CONST, ROWBTNS } from '../../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import rowButtonClick from './rowButtonClick';
import buttonController from '../viewController/buttonController';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: COOPSETUP_CONST.PAGEID_LIST // 列表页面编码
		},
		callbackFun.bind(this)
	);

	function callbackFun(data) {
		if (data) {
			if (data.template) {
				let meta = data.template;
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button, () => {
					props.button.setPopContent(
						'Delete',
						getLangByResId(this, '4001COOPSETUP-000024')
					); /* 国际化处理： 确认要删除吗？*/
					// 按钮控制
					buttonController.call(this, props);
				});
			}
		}
	}
}

function modifierMeta(props, meta) {
	let _this = this;
	// 添加表格操作列
	let event = {
		label: getLangByResId(this, '4001COOPSETUP-000025') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 250,
		render(text, record, index) {
			let buttons = ROWBTNS;
			return props.button.createOprationButton(buttons, {
				onButtonClick: (props, key) => {
					rowButtonClick.call(_this, props, key, record, index);
				},
				area: COOPSETUP_CONST.LIST_INNER,
				buttonLimit: 3,
				ignoreHotkeyCode: getListDisableHotKeyBtn()
			});
		}
	};

	// 查询条件过滤
	meta[COOPSETUP_CONST.SEARCHID].items.map((item) => {
		// 1.所有的参照都支持多选
		if (item.itemtype == 'refer') {
			item.isMultiSelectedEnabled = true;
		}

		// 2.根据“源单据类型”过滤“源单据交易类型 ”；单选时才过滤，多选和不选时不过滤
		if (item.attrcode == 'ctrantypeid_src') {
		}

		// 3.根据“目的单据类型”过滤“目的单据交易类型 ”；单选时才过滤，多选和不选时不过滤
		if (item.attrcode == 'ctrantypeid_dest') {
		}

		// 4.根据“源单据类型”过滤“源购销组织 ”；单选时才过滤，多选和不选时不过滤
		if (item.attrcode == 'pk_org_src') {
			// 添加“显示停用”
			item.isShowDisabledData = true;
			// 隐藏“包含下级”
			item.isRunWithChildren = false;
		}

		// 5.根据“目的单据类型”过滤“目的购销组织 ”；单选时才过滤，多选和不选时不过滤
		if (item.attrcode == 'pk_org_dest') {
			// 添加“显示停用”
			item.isShowDisabledData = true;
			// 隐藏“包含下级”
			item.isRunWithChildren = false;
		}

		// 6.查询区对财务组织进行过滤
		if (item.attrcode == 'pk_financeorg_src' || item.attrcode == 'pk_financeorg_dest') {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: 'nccloud.web.scmpub.ref.FinanceOrgTreeRefFilterUtils'
				};
			};
			// 添加“显示停用”
			item.isShowDisabledData = true;
			// 隐藏“包含下级”
			item.isRunWithChildren = false;
		}
	});

	meta[COOPSETUP_CONST.FORMID].items.push(event);
	return meta;
}
