/*
 * 模板初始化
 * @Author: CongKe
 * @Date: 2018-06-07 12:45:19
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-10-20 11:00:45
 */
import { ARRIVEPLAN, LIST_BUTTON, STATUS, APPCODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from '../viewController/index';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function(props) {
	let _this = this;
	this.props.createUIDom(
		{
			appcode: APPCODE.orderAppCode,
			pagecode: ARRIVEPLAN.PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifier.call(this, meta, props);
					// 订单行号排序
					columnSortUtils.numberSort(meta, ARRIVEPLAN.TABLEID, 'crownobb1');
					this.props.meta.setMeta(meta, () => {});
				}
				if (data.button) {
					let button = data.button;
					this.props.button.setButtons(button);
				}
				buttonController.togglePageShow.call(this, props, STATUS.browse);
			}
		}
	);
}

/**
 * 列表数据后处理修饰
 * @param  meta
 * @param {*} props
 */
function modifier(meta, props) {
	let material_event = {
		label: getLangByResId(this, '4004POORDER-000008') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, mindex) => {
			let buttonAry =
				props.editTable.getStatus(ARRIVEPLAN.TABLEID) === STATUS.browse ? [] : [ LIST_BUTTON.CopyLine ];
			return props.button.createOprationButton(buttonAry, {
				area: ARRIVEPLAN.TABLEINNER,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClickController.call(this, props, key, text, record, mindex)
			});
		}
	};
	meta[ARRIVEPLAN.TABLEID].items.push(material_event);
	return meta;
}
