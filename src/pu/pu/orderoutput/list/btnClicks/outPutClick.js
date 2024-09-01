/*
* @Author: jiangfw 
* @PageInfo: 输出
* @Date: 2019-03-15 11:14:14 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-10 10:06:44
*/
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, AREA } from '../../constance/constance';
import buttonController from '../viewController/buttonController';
import commonSerach from './commonSearch';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickAddBtn() {
	let selectRows = this.props.insertTable.getCheckedRows(AREA.head);
	let selectRowIndexs = getSelectRowIndex(selectRows);
	let bills = getIdTs(selectRows);
	let outputInfos = {
		idTsPairs: bills
	};

	ajax({
		url: URL.output,
		data: outputInfos,
		success: (res) => {
			if (res) {
				this.props.insertTable.changeCheck(AREA.head, [ 0 ], false);
				// this.props.insertTable.deleteTableRowsByIndex(AREA.head, selectRowIndexs);
				commonSerach.call(this, true, false, true); // 调用查询方法
				//buttonController.call(this);

				//showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000001' /* 国际化处理：  输出成功*/));
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
	for (let row of selectRows) {
		let bill = {
			id: row.data.values.pk_order.value,
			ts: row.data.values.ts.value
		};
		idTs.push(bill);
	}
	return idTs;
}
