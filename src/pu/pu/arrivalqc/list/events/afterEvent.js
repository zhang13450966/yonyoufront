/*
 * @Author: ligangt 
 * @PageInfo: 到货单检验编辑后事件  
 * @Date: 2018-05-12 09:27:49 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-26 16:24:37
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// switch (key) {
	// 	case 'nchecknum': //本次报检数量
	// 	case 'nwillelignum': //合格主数量
	// 	case 'nwillnotelignum': //不合格主数量
	// 		let nwillelignum = record.values.nwillelignum.value; // 合格主数量
	// 		let nchecknum = record.values.nchecknum.value; // 本次报检数量
	// 		let naccumchecknum = record.values.naccumchecknum.value; // 累计报检主数量
	// 		let nnum = record.values.nnum.value; // 到货数量
	// 		if (nchecknum < 0 || nwillelignum < 0) {
	// 			props.editTable.setValByKeyAndIndex(moduleId, index, 'nchecknum', { value: 0 });
	// 			props.editTable.setValByKeyAndIndex(moduleId, index, 'nwillelignum', { value: 0 });
	// 			toast({ content: '报检数量和合格主数量不能为负数', color: 'warning' });
	// 			return;
	// 		}
	// 		if (nchecknum + naccumchecknum - nnum > 0) {
	// 			props.editTable.setValByKeyAndIndex(moduleId, index, 'nchecknum', {
	// 				value: nnum - naccumchecknum,
	// 				display: null
	// 			});
	// 			props.editTable.setValByKeyAndIndex(moduleId, index, 'nwillelignum', {
	// 				value: nnum - naccumchecknum,
	// 				display: null
	// 			});
	// 			toast({ content: '数量关系错：本次报检 + 累计报检主数量 > 到货数量', color: 'warning' });
	// 			return;
	// 		}
	// 		if (!(key === 'nchecknum')) {
	// 			if (nwillelignum - nchecknum > 0) {
	// 				props.editTable.setValByKeyAndIndex(moduleId, index, 'nwillelignum', {
	// 					value: nchecknum,
	// 					display: null
	// 				});
	// 				toast({ content: ' 数量关系错：合格主数量 > 本次报检数量', color: 'warning' });
	// 				return;
	// 			}
	// 		}
	// 		if (key === 'nchecknum') {
	// 			props.editTable.setValByKeyAndIndex(moduleId, index, 'nwillelignum', {
	// 				value: nchecknum,
	// 				display: null
	// 			});
	// 			nwillelignum = props.editTable.getValByKeyAndIndex(moduleId, index, 'nwillelignum');
	// 		}
	// 		// 不合格主数量= 本次报检数量-合格主数量
	// 		let nwillnotelignum = nchecknum - nwillelignum;
	// 		props.editTable.setValByKeyAndIndex(moduleId, index, 'nwillnotelignum', {
	// 			value: nwillnotelignum,
	// 			display: null
	// 		});
	// 		break;
	// 	default:
	// 		break;
	// }

	switch (key) {
		case 'nchecknum': //本次报检数量
		case 'nwillelignum': //合格主数量
		case 'nwillnotelignum': //不合格主数量
			let nwillelignum_e = record.values.nwillelignum.value; // 合格主数量
			let nchecknum_e = record.values.nchecknum.value; // 本次报检数量
			let naccumchecknum_e = parseFloat(record.values.naccumchecknum.value); // 累计报检主数量
			let nnum_e = parseFloat(record.values.nnum.value); // 到货数量

			if (!nwillelignum_e || !nchecknum_e) {
				showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000006') /* 国际化处理： 本次报检数量或合格主数量不能清空！*/);
				let oldvalue = changedrows[0].oldvalue.value; // add by huoyzh 在到货单检验中，清空本次报检主数量后，进行提示，和返回原来的值
				//props.editTable.setValByKeyAndIndex(moduleId, index, key, { value: oldvalue, display: oldvalue });
				props.editTable.setValByKeyAndRowId(moduleId, changedrows[0].rowid, key, {
					value: oldvalue,
					display: oldvalue
				});
				return;
			}

			let nwillelignum = parseFloat(nwillelignum_e); // 合格主数量
			let nchecknum = parseFloat(nchecknum_e); // 本次报检数量
			let naccumchecknum = parseFloat(naccumchecknum_e); // 累计报检主数量
			let nnum = parseFloat(nnum_e); // 到货数量

			if (nchecknum < 0 || nwillelignum < 0) {
				showWarningInfo(null, getLangByResId(this, '4004ARRIVALQC-000007') /* 国际化处理： 报检数量和合格主数量不能为负数！*/);
			}
			if (nchecknum + naccumchecknum - nnum > 0) {
				showWarningInfo(
					null,
					getLangByResId(this, '4004ARRIVALQC-000008') /* 国际化处理： 数量关系错：本次报检 + 累计报检主数量 > 到货数量*/
				);
			}
			if (!(key === 'nchecknum')) {
				if (nwillelignum - nchecknum > 0) {
					showWarningInfo(
						null,
						getLangByResId(this, '4004ARRIVALQC-000009') /* 国际化处理： 数量关系错：合格主数量 > 本次报检数量*/
					);
				}
			}
			break;
		default:
			break;
	}

	const { getAllRows, setTableData } = props.editTable;
	// 原本应该传所有数据,但是这个节点的数据太太太太...多了, 所以只传了编辑行的数据, 将 index 置为 0
	let AllData = getAllRows(moduleId);

	// 编辑行是否勾选
	let isSelect = false;
	let selectRows = props.editTable.getCheckedRows(AREA.list);
	selectRows.map((row) => {
		if (row.index == index) {
			isSelect = true;
		}
	});

	ajax({
		url: URL.afterEdit,
		data: {
			attrcode: key,
			changedrows: changedrows,
			index: 0,
			grid: {
				model: {
					areacode: moduleId,
					areaType: 'table',
					pageInfo: {},
					rows: [ AllData[index] ]
				},
				pageid: PAGECODE.list,
				userjson: '{}' // 这里后台没有判空, 所以必须要传一个json格式的字符串
			}
		},
		mode: 'normal',
		success: (res) => {
			if (res && res.data && res.data.data && res.data.data && res.data.data.grid[moduleId].rows) {
				AllData[index] = res.data.data.grid[moduleId].rows[0];
				setTableData(moduleId, { rows: AllData });
				// 设置勾选状态
				props.editTable.selectTableRows(moduleId, index, isSelect);
			}
		}
	});
}
