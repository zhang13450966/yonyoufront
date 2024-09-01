import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE } from '../../constance';
import searchBtnClick from './searchBtnClick';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function cancelToIABtnClick(props) {
	let datas = this.props.table.getCheckedRows(PAGECODE.tableId);
	let settleBillInfo = datas.map((item) => {
		return {
			id: item.data.values.pk_settlebill.value,
			ts: item.data.values.ts.value
		};
	});
	let data = { pagecode: PAGECODE.pagecode, settleBillInfo };
	// let data = record.pk_settlebill;
	// let rowid = record.rowid;
	ajax({
		url: '/nccloud/pu/settlebill/cancelToIA.do',
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
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
					// updateCacheDataForList(this.props, PAGECODE.tableId, 'pk_settlebill', res.data);
					// toast({ color: 'success', content: '取消传成本成功！' });
				}
			}
		}
	});
}
