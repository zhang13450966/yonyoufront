/*
 * @Author: 王龙华 
 * @PageInfo: 模板初始化  
 * @Date: 2018-04-11 15:48:38 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-04-23 18:25:59
 */
import { toast } from 'nc-lightapp-front';
import { INVSOURCE_CONST, INVSOURCE_BUTTONS } from '../../const';
import initLineButton from './initLineButton';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import buttonController from '../viewController/buttonController';
import { setTableButtonEnable } from '../viewController/buttonController';

export default function(props) {
	props.createUIDom(
		{
			pagecode: INVSOURCE_CONST.PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let _this = this;
					let meta = data.template;
					modifierMeta.bind(_this)(props, meta);
					filterRefer.bind(_this)(meta);
					props.meta.setMeta(meta);
					buttonController.call(_this, props, INVSOURCE_CONST.BROWSER_STATUS);
				}
				if (data.button) {
					let _this = this;
					let button = data.button;
					mofifierBtn.call(_this, props);
					props.button.setButtons(button);
				}
			}
		}
	);
}

function mofifierBtn(props) {
	let _this = this;
	let config = {
		name: 'file',
		action: INVSOURCE_CONST.IMPORT_URL,
		headers: {
			authorization: 'authorization-text'
		},
		onChange: (info) => {
			if (info.file.status === 'done') {
				let res = info.file.response;
				if (res.error) {
					toast({
						color: 'danger',
						content: res.error.message
					});
					return;
				} else if (res.success) {
					if (res.data) {
						toast({
							color: 'success',
							content:
								getLangByResId(_this, '4001INVSOURCE-000017') +
								res.data[INVSOURCE_CONST.TABLEID].rows.length +
								getLangByResId(_this, '4001INVSOURCE-000018') /* 国际化处理： 成功导入,条数据！*/
						});
					} else {
						toast({
							color: 'warning',
							content: getLangByResId(_this, '4001INVSOURCE-000023') /* 国际化处理： 导入数据不能为空*/
						});
					}
				}
				if (res.data) {
					props.editTable.setTableData(INVSOURCE_CONST.TABLEID, res.data[INVSOURCE_CONST.TABLEID]);
					setTableButtonEnable.call(this, props);
				}
			}
		}
	};
	props.button.setUploadConfig(INVSOURCE_BUTTONS.Import, config);
}
function modifierMeta(props, meta) {
	let _this = this;
	meta[INVSOURCE_CONST.TABLEID].items.push({
		attrcode: 'opr',
		label: getLangByResId(_this, '4001INVSOURCE-000019') /* 国际化处理： 操作*/,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 130,
		render: (text, record, index) => {
			return initLineButton.bind(_this, props, record, index)();
		}
	});
	return meta;
}

function filterRefer(meta) {
	let filterFileds = [ 'pk_stockorgreq', 'pk_marbasclass', 'pk_stockorgsup' ];
	meta[INVSOURCE_CONST.SEARCHID].items.map((item) => {
		setRefShowDisabledData(item);
		if (filterFileds.includes(item.attrcode)) {
			item.isMultiSelectedEnabled = true;
		}
	});
	return meta;
}
