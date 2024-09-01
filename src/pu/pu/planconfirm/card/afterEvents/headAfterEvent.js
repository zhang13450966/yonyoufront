import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, AREA } from '../../constance';
import { processBillCardHeadEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let bodyids = [ PAGECODE.cardbody ];
let headCommonCloumn = [
	'ctranstypeid',
	'dbilldate',
	'corigcurrencyid',
	'cconfirmdeptid',
	'cconfirmpsnid',
	'nexchangerate',
	'cratetype',
	'ngroupexchgrate',
	'nglobalexchgrate'
];

export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	//表头编辑后事件：
	if (headCommonCloumn.includes(key)) {
		if (value.value != changedrows.value) {
			let data = props.createHeadAfterEventData(
				PAGECODE.card,
				PAGECODE.head,
				PAGECODE.body,
				moduleId,
				key,
				value
			);

			getAfterData.call(this, props, URL.cardHeadAfterEvent, data, moduleId);
		}
	}
}

/**
 * 编辑后事件请求
 * @param {*} props
 * @param {*} url
 * @param {*} aggvo
 */
function getAfterData(props, url, aggvo, moduleId, key) {
	ajax({
		url: url,
		data: aggvo,
		method: 'POST',
		async: false, //同步
		success: (res) => {
			processBillCardHeadEditResult(props, AREA.head, AREA.body, res.data);
			this.setState({});
		}
	});
}

function addOneNowRow(props, tableId) {
	props.cardTable.addRow(tableId, 0, { crowno: { display: '10', value: '10' } }, false);
}
