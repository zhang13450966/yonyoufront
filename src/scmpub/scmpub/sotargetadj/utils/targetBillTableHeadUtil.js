/*
 * @Author: zhangchqf 
 * @PageInfo: 销售指标调整单表体多表头处理
 * @Date: 2020-03-03 16:56:51 
 * @Last Modified by: wanguoyu
 * @Last Modified time: yyyy-08-Tu 09:39:28
 */
import { TARGETADJ_CARD, ATTRCODE } from '../siconst';
import { deepClone } from '../../pub/tool';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function multiDataUtil(props, data) {
	let tableId = data.tableId;
	let oldTableId = TARGETADJ_CARD.tableOldId;
	let headf = TARGETADJ_CARD.headf;
	let meta = deepClone(this.meta);

	if (data) {
		let bodyDownCloumsYear = data.bodyDownCloumsYear;
		let bodyDownCloumsOther = data.bodyDownCloumsOther;
		let bodyUpCloumsOther = data.bodyUpCloumsOther;
		let bodyUpCloumsYear = data.bodyUpCloumsYear;

		let headCloum = data.headCloum;
		let items = [];
		let ctargetid = (props.form.getFormItemsValue(headf, ATTRCODE.ctargetid) || {}).value;
		let vperiod = ATTRCODE.vperiod; //期间
		let cmarsetid = ATTRCODE.cmarsetid; //物料维度
		let newValScale = '0'; // 新指标值精度
		let oldValScale = '0'; // 旧指标值精度
		meta[tableId].items.forEach((item) => {
			if (item.attrcode == 'nnewtargetvalue') {
				newValScale = item.scale;
			}
		});
		meta[oldTableId].items.forEach((item) => {
			if (item.attrcode == 'noldtargetvalue') {
				oldValScale = item.scale;
			}
		});

		for (let headKey in headCloum) {
			let marOrPer = headCloum[headKey];
			let item_headf;
			if (marOrPer == 0) {
				//期间
				item_headf = {
					attrcode: vperiod,
					key: vperiod,
					label: getLangByResId(this, '4001TARGETADJ-000072'),
					itemtype: 'refer',
					refcode: 'scmpub/refer/targetPeriod/SaleTargetPeriodGridRefer/index.js',
					isMultiSelectedEnabled: false,
					visible: true
				};
			} else if (marOrPer == 1) {
				//物料
				item_headf = {
					attrcode: cmarsetid,
					key: cmarsetid,
					label: getLangByResId(this, '4001TARGETADJ-000073'),
					itemtype: 'refer',
					refcode: 'scmpub/refer/SaleMarterial/SaleMarterialGridRefer/index.js',
					isMultiSelectedEnabled: false,
					canBeEditedWhenBrowse: true,
					visible: true
				};
			}
			meta[headf].items.push(item_headf);
		}
		meta[tableId].items.forEach((item) => {
			item.queryCondition = () => {
				return { TARGETID: ctargetid };
			};
		});
		meta[oldTableId].items.forEach((item) => {
			item.queryCondition = () => {
				return { TARGETID: ctargetid };
			};
		});

		if (bodyUpCloumsYear) {
			//年表头
			for (let yearKey in bodyUpCloumsYear) {
				// let item_up = {
				// 	attrcode: bodyUpCloumsYear[yearKey],
				// 	key: bodyUpCloumsYear[yearKey],
				// 	label: bodyUpCloumsYear[yearKey]
				// };
				// meta[tableId].items.push(item_up);
				// meta[oldTableId].items.push(item_up);

				let c = [];
				if (bodyDownCloumsYear) {
					for (let yKey in bodyDownCloumsYear) {
						let item_down = {
							attrcode: 'changenewyear' + yKey,
							// key: yKey,
							label: bodyDownCloumsYear[yKey],
							itemtype: 'number',
							visible: true,
							scale: newValScale
						};
						let olditem_down = {
							attrcode: 'changeoldyear' + yKey,
							// key: yKey,
							label: bodyDownCloumsYear[yKey],
							itemtype: 'number',
							visible: true,
							disabled: true,
							scale: oldValScale
						};
						c.push('changenewyear' + yKey);
						c.push('changeoldyear' + yKey);
						meta[tableId].items.push(item_down);
						meta[oldTableId].items.push(olditem_down);
					}
				}
				if (JSON.stringify(bodyDownCloumsOther) != '{}') {
					items.push({
						name: bodyUpCloumsYear[yearKey] + '年',
						code: yearKey,
						children: c,
						visible: true
					});
				}
			}
		}
		if (bodyUpCloumsOther) {
			//其它表头
			for (let marKey in bodyUpCloumsOther) {
				// let item_up = {
				// 	attrcode: marKey,
				// 	key: marKey,
				// 	label: bodyUpCloumsOther[marKey]
				// };
				// meta[tableId].items.push(item_up);
				// meta[oldTableId].items.push(item_up);

				let c = [];
				if (bodyDownCloumsOther) {
					for (let othDownKey in bodyDownCloumsOther) {
						let item_down = {
							attrcode: 'changenew' + marKey + othDownKey,
							// key: 'changenew' + marKey + othDownKey,
							label: bodyDownCloumsOther[othDownKey],
							itemtype: 'number',
							visible: true,
							scale: newValScale
						};
						let olditem_down = {
							attrcode: 'changeold' + marKey + othDownKey,
							// key: 'changeold' + marKey + othDownKey,
							label: bodyDownCloumsOther[othDownKey],
							itemtype: 'number',
							visible: true,
							disabled: true,
							scale: oldValScale
						};
						c.push('changenew' + marKey + othDownKey);
						c.push('changeold' + marKey + othDownKey);
						meta[tableId].items.push(item_down);
						meta[oldTableId].items.push(olditem_down);
					}
				}
				items.push({
					name: bodyUpCloumsOther[marKey],
					code: marKey,
					children: c,
					visible: true
				});
			}
		}
		//占位行调样式
		let occupy = {
			attrcode: '',
			label: '',
			itemtype: 'label',
			visible: true,
			render: () => {}
		};
		meta[tableId].items.push(occupy);
		meta[oldTableId].items.push(occupy);

		props.meta.handleMultiple(meta, { [tableId]: items });
		props.meta.handleMultiple(meta, { [oldTableId]: items });
		props.meta.setMeta(meta);

		meta[headf].items.map((item) => {
			if (item.attrcode == 'cmarsetid' || item.attrcode == 'vperiod') {
				item.queryCondition = () => {
					let targetid = this.props.form.getFormItemsValue(headf, 'ctargetid').value;
					return {
						TARGETID: targetid,
						GridRefActionExt: 'nccloud.web.scmpub.targetadj.util.FilterTargetSqlBuilder'
					};
				};
			}
		});
	}
}
