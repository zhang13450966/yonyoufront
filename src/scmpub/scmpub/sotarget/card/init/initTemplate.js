/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置模板初始化   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-29 18:06:34
*/
import { TARGET_CARD, TARGET_CARD_BUTTON } from '../../siconst';
import { viewController } from '../viewControl';
import { queryByPk } from '../dataManange/dataManange';
import headReferFilter from '../referFilter/headReferFilter';
import bodyReferFilter from '../referFilter/bodyReferFilter';
import { btnClickController } from '../viewControl';
import addButtonClick from '../btnClicks/addBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function (props) {
	props.createUIDom(
		{
			pagecode: TARGET_CARD.cardpageid //页面id
		},
		(data) => {
			if (data) {
				if (data.context.pk_org) {
					this.pk_org = { value: data.context.pk_org, display: data.context.org_Name };
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					let status = props.getUrlParam(TARGET_CARD.status);
					meta[TARGET_CARD.formId].status = status;
					props.meta.setMeta(meta, () => {
						let id = props.getUrlParam(TARGET_CARD.id);
						if (id) {
							queryByPk.call(this, props, id);
							// addDoubleClick.call(this, props, meta);
							viewController.call(this, props, status);
						} else {
							addButtonClick.call(this, props);
						}
					});
				}
				//初始进来编辑态

				// //设置联查按钮不可用
				// setDrillButtonDisabled.call(this, props, true);
			}
		}
	);
}

function modifierMeta(props, meta) {
	//表单参照过滤
	headReferFilter(props, meta);
	bodyReferFilter(props, meta);

	//添加表格操作列
	//基本信息，销售组织列不需要行内删行
	// addOprationButton.call(
	// 	this,
	// 	props,
	// 	meta,
	// 	TARGET_CARD.target_org,
	// 	[ TARGET_CARD_BUTTON.InnerDelLine_org ],
	// 	TARGET_CARD.buttonArea.target_org_inner
	// );
	addOprationButton.call(
		this,
		props,
		meta,
		TARGET_CARD.target_mar,
		[TARGET_CARD_BUTTON.InnerDelLine_mar],
		TARGET_CARD.buttonArea.target_mar_inner
	);
	addOprationButton.call(
		this,
		props,
		meta,
		TARGET_CARD.target_item,
		[TARGET_CARD_BUTTON.InnerDelLine_item],
		TARGET_CARD.buttonArea.target_item_inner
	);
	let rows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
	let namesoptions = [{ value: '00001', display: ' ' }];
	rows.map((row, i) => {
		if (
			row.values[TARGET_CARD.fitemtypeflag].value == 3 &&
			row.values[TARGET_CARD.vtargetname].value != null
		) {
			namesoptions.push({
				//value必须有值
				value: row.values[TARGET_CARD.pk_target_item].value
					? row.values[TARGET_CARD.pk_target_item].value
					: 'temp' + row.values['citemrowno'].value, //行号
				display: row.values[TARGET_CARD.vtargetname].value //指标项名称
			});
		}
	});
	meta[TARGET_CARD.target_ratio].items.map((item) => {
		if (item.attrcode == TARGET_CARD.clinkyearitemid) {
			item.datatype = '203';
			item.itemtype = 'select';
			item.options = namesoptions;
		}
	});
}

function addOprationButton(props, meta, areaCode, buttonAry, btnArea) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001TARGET-000003'),/* 国际化处理： 操作*/
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			return props.button.createOprationButton(buttonAry, {
				area: btnArea,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[areaCode].items.push(event);
}

//添加物料维度物料组合单元格行双击事件
// function addDoubleClick(props, meta) {
// 	//props['selectedData'] =
// 	meta[TARGET_CARD.target_mar].items[8].render = () => {
// 		return (onDoubleClick = () => {
// 			console.log('123123123');
// 			console.log(meta);
// 		});
// 	};
// }
