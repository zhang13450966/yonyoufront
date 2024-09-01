import { ajax } from 'nc-lightapp-front';
import { PAGECODE, BUTTON } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function delBtnClick(props) {
	let datas = this.props.table.getCheckedRows(PAGECODE.tableId);
	let settleBillInfo = datas.map((item) => {
		return {
			id: item.data.values.pk_settlebill.value,
			ts: item.data.values.ts.value
		};
	});
	let data = {
		pagecode: PAGECODE.pagecode,
		settleBillInfo
	};
	// let data = record.pk_settlebill;
	// let rowid = record.rowid;
	showWarningDialog(getLangByResId(this, '4004SETTLEBILL-000001'), getLangByResId(this, '4004SETTLEBILL-000002'), {
		beSureBtnClick: () => {
			ajax({
				url: '/nccloud/pu/settlebill/del.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						//存在失败的数据
						if (JSON.stringify(res.data.errorMessageMap || res.data.errorMessages || {}) != '{}') {
							// 成功的index
							let sucIndex = [];
							datas.forEach((element, index) => {
								if (!res.data.errorMessageMap[index]) {
									sucIndex.push(element.index);
								}
								deleteCacheDataForList(
									this.props,
									PAGECODE.tableId,
									element.data.values.pk_settlebill.value
								);
							});
							this.props.table.deleteTableRowsByIndex(PAGECODE.tableId, sucIndex);
						} else {
							//
							let succIndex = [];
							datas.forEach((element, index) => {
								deleteCacheDataForList(
									this.props,
									PAGECODE.tableId,
									element.data.values.pk_settlebill.value
								);
								succIndex.push(element.index);
							});
							this.props.table.deleteTableRowsByIndex(PAGECODE.tableId, succIndex);
						}
						showBatchOprMessage(null, res.data);
					}
					//处理按钮可用性
					this.onSelect();
				}
			});
		}
	});
	// this.props.modal.show(BUTTON.del, {
	// 	title: getLangByResId(this, '4004SETTLEBILL-000001') /* 国际化处理： 确认删除*/,
	// 	content: getLangByResId(this, '4004SETTLEBILL-000002') /* 国际化处理： 确认删除选中的数据?*/,
	// 	beSureBtnClick: () => {
	// 		ajax({
	// 			url: '/nccloud/pu/settlebill/del.do',
	// 			data: data,
	// 			success: res => {
	// 				let { success, data } = res;
	// 				if (success) {
	// 					//存在失败的数据
	// 					if (JSON.stringify(res.data.errorMessageMap || res.data.errorMessages || {}) != '{}') {
	// 						// 成功的index
	// 						let sucIndex = [];
	// 						datas.forEach((element, index) => {
	// 							if (!res.data.errorMessageMap[index]) {
	// 								sucIndex.push(element.index);
	// 							}
	// 							deleteCacheDataForList(
	// 								this.props,
	// 								PAGECODE.tableId,
	// 								element.data.values.pk_settlebill.value
	// 							);
	// 						});
	// 						this.props.table.deleteTableRowsByIndex(PAGECODE.tableId, sucIndex);
	// 					} else {
	// 						//
	// 						let succIndex = [];
	// 						datas.forEach((element, index) => {
	// 							deleteCacheDataForList(
	// 								this.props,
	// 								PAGECODE.tableId,
	// 								element.data.values.pk_settlebill.value
	// 							);
	// 							succIndex.push(element.index);
	// 						});
	// 						this.props.table.deleteTableRowsByIndex(PAGECODE.tableId, succIndex);
	// 					}
	// 					showBatchOprMessage(null, res.data);
	// 				}
	// 				//处理按钮可用性
	// 				this.onSelect();
	// 			},
	// 		});
	// 	},
	// 	cancelBtnClick: () => {},
	// });
}
