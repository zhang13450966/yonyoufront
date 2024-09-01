/*
 * @Author: wangceb 
 * @PageInfo: 初始化代垫运费拉运输单模板
 * @Date: 2018-04-19 10:32:11 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-06 10:01:36
 */
import { buttonControl } from '../viewController/buttonController';
import { REF4804_CONST } from '../const';
import { referEvent } from '../events';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props, callback = () => {}) {
	props.createUIDom(
		{
			pagecode: REF4804_CONST.transPageId, //卡片页面编码
			appcode: REF4804_CONST.appcode //应用编码
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
				callback && callback(props);
			}
		}
	);
}

function modifierMeta(props, meta) {
	let billcodeData = {
		pkfield: REF4804_CONST.pk_head,
		billcodefield: REF4804_CONST.vbillcode,
		billtype: '4804'
	};
	meta[REF4804_CONST.singleTableId].items.map((item, key) => {
		transferSkipToSrcBillUtil.call(this, props, item, billcodeData);
	});
}
