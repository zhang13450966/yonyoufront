/*
 * @Author: 刘奇 
 * @PageInfo: 列表初始化模板
 * @Date: 2019-03-01 14:11:02 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:12:38
 */
import { ARSUB_CONST, ArsubHeadItem, BUTTON } from '../../const';
import initListRowButtons from './initListRowButtons';
import { buttonControl } from '../viewController/buttonController';
import { referEvent } from '../events';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

let head = ARSUB_CONST.formId;

export default function(props) {
	props.createUIDom(
		{
			pagecode: ARSUB_CONST.listPageId //卡片页面编码
		},
		(data) => {
			if (data) {
				transtypeUtils.init.call(this, data.context);
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					transtypeUtils.initQuery.call(this, props, meta, ARSUB_CONST.searchId, ArsubHeadItem.ctrantypeid);
					props.meta.setMeta(meta, buttonControl.bind(this, this.props));
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	referEvent.call(this, props, meta);
	meta[head].items = meta[head].items.map((item, key) => {
		if (item.attrcode == ArsubHeadItem.vbillcode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo(ARSUB_CONST.Card_URL, {
								status: ARSUB_CONST.browse,
								id: ((record || {}).carsubid || {}).value,
								pagecode: ARSUB_CONST.cardPageId
							});
						}}
					>
						{((record || {}).vbillcode || {}).value}
					</a>
				);
			};
		}
		return item;
	});
	let porCol = {
		attrcode: 'opr',
		label: getLangByResId(this, '4006ARSUB-000001') /* 国际化处理： 操作*/,
		visible: true,
		width: 150,
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			//云原生改造适配 add by huoyzh
			// return initListRowButtons.call(this, props, text, record, index);
			return props.button.createErrorButton({
				record: record,
				showBack: false, // 是否显示回退按钮
				sucessCallBack: () => {
					return initListRowButtons.call(this, props, text, record, index);
				}
			});
		}
	};
	meta[head].items.push(porCol);
	return meta;
}
