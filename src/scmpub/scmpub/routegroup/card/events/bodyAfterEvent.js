/*
 * @Author: 王勇 
 * @PageInfo: 卡片-编辑后事件  
 * @Date: 2020-01-17 09:41:25 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-22 09:47:43
 */
import { ROUTEVOINFO, CARDTEMPLATEINFO } from '../../const/index';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import innerAddLineBtnClick from '../btnClicks/innerAddLineBtnClick';
export default function bodyAfterEvent(props, moduleId, key, value, changedrows, i) {
	switch (key) {
		case ROUTEVOINFO.caddrdocid:
			let data = props.cardTable.getVisibleRows(moduleId);
			let pk = value.refpk;
			let num = 0;

			data.forEach((element) => {
				num = num + 1;
				let tempk = element.values.caddrdocid.value;
				if (tempk === pk && i !== num - 1) {
					props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, ROUTEVOINFO.caddrdocid, {
						value: null,
						display: null
					});
					props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, 'caddrdocid.name', {
						value: null,
						display: null
					});
					showErrorInfo(null, getLangByResId(this, '4001ROUTE-000020')); /* 线路中已经存在相同站点，请修改！*/
				}
			});
			autoAddline(props, i, moduleId);
			break;
		case ROUTEVOINFO.space:
			if (value > 0) {
				if (i > 0) {
					let data = props.cardTable.getVisibleRows(moduleId);
					for (let j = 1; j < data.length; j++) {
						//不修改最后的空行的里程
						if (
							j != data.length - 1 ||
							(j == data.length - 1 &&
								props.cardTable.getValByKeyAndIndex(moduleId, j, ROUTEVOINFO.caddrdocid).value)
						) {
							const tmpSpace = props.cardTable.getValByKeyAndIndex(moduleId, j, ROUTEVOINFO.space).value;
							const tmpNmileage = props.cardTable.getValByKeyAndIndex(
								moduleId,
								j - 1,
								ROUTEVOINFO.nmileage
							).value;
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
				}
			} else {
				props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, ROUTEVOINFO.space, {
					value: null,
					display: null
				});
				const num = i + 1;
				showErrorInfo(
					null,
					getLangByResId(this, '4001ROUTE-000021') + num + getLangByResId(this, '4001ROUTE-000022')
				); /* 第i行的间距不能小于等于0！*/
			}
			autoAddline(props, i, moduleId);
			break;
		case ROUTEVOINFO.nmileage:
			if (value > 0) {
				const beforeNmileage = props.cardTable.getValByKeyAndIndex(moduleId, i - 1, ROUTEVOINFO.nmileage).value;
				let afterNmileage = null;
				let len = props.cardTable.getVisibleRows(moduleId).length;
				if (i < len - 1) {
					afterNmileage = props.cardTable.getValByKeyAndIndex(moduleId, i + 1, ROUTEVOINFO.nmileage).value;
				}

				const num = i + 1;
				if (beforeNmileage !== null && beforeNmileage !== '' && Number(beforeNmileage) >= Number(value)) {
					props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, ROUTEVOINFO.nmileage, {
						value: null,
						display: null
					});
					showErrorInfo(
						null,
						getLangByResId(this, '4001ROUTE-000021') +
							num +
							getLangByResId(this, '4001ROUTE-000024') +
							i +
							getLangByResId(this, '4001ROUTE-000025')
					); /* 第i行的里程不能小于等于第i-1行的里程！*/
				} else if (afterNmileage !== null && afterNmileage !== '' && Number(afterNmileage) <= Number(value)) {
					props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, ROUTEVOINFO.nmileage, {
						value: null,
						display: null
					});
					showErrorInfo(
						null,
						getLangByResId(this, '4001ROUTE-000021') +
							num +
							getLangByResId(this, '4001ROUTE-000036') +
							(i + 2) +
							getLangByResId(this, '4001ROUTE-000025')
					); /* 第i行的里程不能大于等于第i+1行的里程！*/
				} else {
					if (beforeNmileage !== null && beforeNmileage !== '' && !Number.isNaN(Number(beforeNmileage))) {
						props.cardTable.setValByKeysAndIndex(moduleId, i, {
							space: {
								value: Number(value) - Number(beforeNmileage),
								display: null
							}
						});
					}
					spaceNmileageChange.call(this, props, i);
				}
			} else {
				props.cardTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, ROUTEVOINFO.nmileage, {
					value: null,
					display: null
				});
				const num = i + 1;
				showErrorInfo(
					null,
					getLangByResId(this, '4001ROUTE-000021') + num + getLangByResId(this, '4001ROUTE-000023')
				); /* 第i行的里程不能小于等于0！*/
			}
			autoAddline(props, i, moduleId);
			break;
	}
}

function autoAddline(props, i, moduleId) {
	/**
     * 路线说明自动改变---
     */
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
	const len = props.cardTable.getNumberOfRows(CARDTEMPLATEINFO.bodyAreaCode);
	if (i == len - 1 && props.cardTable.getValByKeyAndIndex(moduleId, i, ROUTEVOINFO.caddrdocid).value) {
		innerAddLineBtnClick.call(this, props);
	}
}

//更新指定行以下所有行的里程
function spaceNmileageChange(props, index) {
	let moduleId = CARDTEMPLATEINFO.bodyAreaCode;
	let data = props.cardTable.getVisibleRows(CARDTEMPLATEINFO.bodyAreaCode);
	for (let j = index + 1; j < data.length; j++) {
		const tmpSpace = props.cardTable.getValByKeyAndIndex(moduleId, j, ROUTEVOINFO.space).value;
		const tmpNmileage = props.cardTable.getValByKeyAndIndex(moduleId, j - 1, ROUTEVOINFO.nmileage).value;
		//不修改最后的空行的里程
		if (
			j != data.length - 1 ||
			(j == data.length - 1 && props.cardTable.getValByKeyAndIndex(moduleId, j, ROUTEVOINFO.caddrdocid).value)
		) {
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
}
