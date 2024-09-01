import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE } from '../../constance';
import searchBtnClick from './searchBtnClick';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function sendToIABtnClick(props) {
	let datas = props.table.getCheckedRows(PAGECODE.tableId);
	let settleBillInfo = datas.map((item) => {
		return { id: item.data.values.pk_settlebill.value, ts: item.data.values.ts.value };
	});
	let data = { pagecode: PAGECODE.pagecode, settleBillInfo };
	// let data = record.pk_settlebill;
	// let rowid = record.rowid;
	ajax({
		url: '/nccloud/pu/settlebill/sendToIA.do',
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					// let sarchval = this.state.searchVal;
					// setTimeout(() => {
					//     searchBtnClick.call(this, sarchval);
					// }, 0);
					// toast({ color: 'success', content: '传成本成功！' });
					// updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data);
					if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
						// 成功的index
						let sucIndex = [];
						datas.forEach((element, index) => {
							if (!res.data.errorMessageMap[index]) {
								sucIndex.push(index);
							}
							updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data);
						});
					} else {
						//
						let succIndex = [];
						datas.forEach((element, index) => {
							succIndex.push(index);
						});
						updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data);
					}
					showBatchOprMessage(null, res.data);
					this.toggleShow();
				}
			}
		}
	});
}
