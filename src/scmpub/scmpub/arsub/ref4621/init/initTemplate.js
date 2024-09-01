/*
 * @Author: wangceb 
 * @PageInfo: 初始化销售订单模板
 * @Date: 2018-04-19 10:32:11 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-21 14:50:51
 */
import { buttonControl } from '../viewController/buttonController';
import { REF4621_CONST } from '../const';
import { referEvent } from '../events';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: REF4621_CONST.transPageId, //卡片页面编码
			appcode: REF4621_CONST.appcode //应用编码
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					referEvent.call(this, props, meta);
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, buttonControl.bind(this, props));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}
function modifierMeta(props, meta) {
	let billcodeData = {
		pkfield: REF4621_CONST.pk_head,
		billtype: '4621'
	};
	meta[REF4621_CONST.formId].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, billcodeData);
	});
	meta[REF4621_CONST.singleTableId].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, billcodeData);
	});
}
