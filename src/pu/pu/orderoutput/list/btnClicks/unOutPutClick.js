/*
* @Author: jiangfw 
* @PageInfo: 反输出
* @Date: 2019-03-15 11:14:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-26 17:32:27
*/
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA } from '../../constance/constance';
import buttonController from '../viewController/buttonController';
import commonSerach from './commonSearch';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function clickAddBtn() {
	// let selectRows = this.props.transferTable.getTransferTableSelectedValue().head;
	let selectRows = this.props.insertTable.getInsertTableSelectedValue(AREA.head, FIELD.pk_order);
	// let selectRowIndexs = getSelectRowIndex(selectRows);
	let bills = getIdTs(selectRows);
	let outputInfos = {
		idTsPairs: bills
	};

	ajax({
		url: URL.unoutput,
		data: outputInfos,
		success: (res) => {
			if (res) {
				// this.props.editTable.deleteTableRowsByIndex(AREA.head, selectRowIndexs, true);
				this.props.insertTable.changeCheck(AREA.head, [ 0 ], false);
				commonSerach.call(this, true, true); // 调用查询方法
				//buttonController.call(this);
				//showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000002' /* 国际化处理：  反输出成功*/));
			}
		}
	});
}

function getSelectRowIndex(selectRows) {
	let selectRowIndexs = [];
	for (let row of selectRows) {
		selectRowIndexs.push(row.index);
	}
	return selectRowIndexs;
}

function getIdTs(selectRows) {
	let idTs = [];
	// for (let row of selectRows) {
	// 	let bill = {
	// 		id: row.head.head.rows[0].values[FIELD.pk_order].value,
	// 		ts: row.head.head.rows[0].values[FIELD.ts].value
	// 	};
	// 	idTs.push(bill);
	// }
	for (let row of selectRows) {
		let bill = {
			id: row.pk_order
			// ts: row.head.head.rows[0].values[FIELD.ts].value
		};
		idTs.push(bill);
	}
	return idTs;
}
