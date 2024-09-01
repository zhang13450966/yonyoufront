/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线-删行  
 * @Date: 2020-01-17 09:38:50 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 11:27:05
 */
import { CARDTEMPLATEINFO, VIEWINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function innerDelLineClick(props, index) {
	if ((index instanceof Array && index[0] != 0) || (!(index instanceof Array) && index != 0)) {
		props.cardTable.delRowsByIndex(CARDTEMPLATEINFO.bodyAreaCode, index);
		describeChange.call(this, props);
		spaceNmileageChange.call(this, props);
		buttonController.call(this, props, VIEWINFO.EDIT_STATUS);
	} else {
		const title = getLangByResId(this, '4001ROUTE-000026');
		const content = getLangByResId(this, '4001ROUTE-000027'); //"确定删除起始站点？"
		showWarningDialog(title, content, {
			beSureBtnClick: beSureBtnClick.bind(this, props, index)
		});
	}
}

function beSureBtnClick(props, index) {
	props.cardTable.delRowsByIndex(CARDTEMPLATEINFO.bodyAreaCode, index);
	describeChange.call(this, props);
	props.cardTable.setValByKeyAndIndex(CARDTEMPLATEINFO.bodyAreaCode, 0, ROUTEVOINFO.space, {
		value: 0,
		display: null
	});
	props.cardTable.setValByKeyAndIndex(CARDTEMPLATEINFO.bodyAreaCode, 0, ROUTEVOINFO.nmileage, {
		value: 0,
		display: null
	});
	props.cardTable.setEditableByIndex(
		CARDTEMPLATEINFO.bodyAreaCode,
		0,
		[ [ ROUTEVOINFO.space ], [ ROUTEVOINFO.nmileage ] ],
		false
	);

	spaceNmileageChange.call(this, props);
	buttonController.call(this, props, VIEWINFO.EDIT_STATUS);
}

function describeChange(props) {
	let data = props.cardTable.getVisibleRows(CARDTEMPLATEINFO.bodyAreaCode);
	let describle = '';
	for (let i = 0; i < data.length; i++) {
		let address = data[i].values['caddrdocid.name'].display;
		if (address !== '' && address !== null) {
			if (describle === '') {
				describle = describle + address;
				continue;
			}
			describle = describle + '-' + address;
		}
	}
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.vroutedescribe]: {
			value: describle,
			display: null
		}
	});
}

function spaceNmileageChange(props) {
	let moduleId = CARDTEMPLATEINFO.bodyAreaCode;
	let data = props.cardTable.getVisibleRows(CARDTEMPLATEINFO.bodyAreaCode);
	for (let j = 1; j < data.length; j++) {
		const tmpSpace = props.cardTable.getValByKeyAndIndex(moduleId, j, ROUTEVOINFO.space).value;
		const tmpNmileage = props.cardTable.getValByKeyAndIndex(moduleId, j - 1, ROUTEVOINFO.nmileage).value;
		if (tmpNmileage !== null && tmpNmileage !== '' && !Number.isNaN(Number(tmpNmileage))) {
			props.cardTable.setValByKeysAndIndex(moduleId, j, {
				nmileage: {
					value: Number(tmpSpace) + Number(tmpNmileage),
					display: null
				}
			});
		}
	}
}
