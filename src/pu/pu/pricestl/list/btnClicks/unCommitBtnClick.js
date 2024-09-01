import { URL, FIELD, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { initButtons } from '../afterEvents';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function unCommitBtnClick(props, record, uncommit) {
	let delRows = [];
	let indexs = [];
	//区分是行上面的收回，还是肩部的收回
	if (uncommit == 'uncommit') {
		//行收回
		if (record && record.pk_pricesettle) {
			let info = {
				pks: record.pk_pricesettle.value,
				ts: record.ts.value
			};
			delRows.push(info);
			indexs.push(record.numberindex && record.numberindex.value - 1);
		}
	} else {
		//肩上收回
		let rows = this.props.table.getCheckedRows(PAGECODE.tableId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004PRICESTL-000027') /* 国际化处理： 请选择需要收回的数据*/ /* 国际化处理： 请选择需要收回的数据！*/
			});
			return;
		}

		rows.map((item) => {
			let info = {
				pks: item.data.values.pk_pricesettle.value,
				ts: item.data.values.ts.value
			};
			delRows.push(info);
			// indexs.push(item.index);
		});
		//批量处理需把索引号置空
		indexs = null;
	}
	// 拼装json
	let data = {
		closedto: delRows,
		pagecode: PAGECODE.listcode,
		extstr: ''
	};
	// 发送请求
	ajax({
		url: URL.griduncommit,
		data: data,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data);
				updateCacheDataForList(this.props, PAGECODE.tableId, FIELD.pk_pricesettle, res.data, indexs);
				// initButtons.call(this, this.props);
				buttonController.initButtons.call(this, this.props);
			}
		}
	});
}
