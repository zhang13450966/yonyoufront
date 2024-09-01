import { PAGECODE, URL, FIELD } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { initButtons } from '../afterEvents';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function commitBtnClick(props, record, index, assign) {
	// 获取选中行
	// 执行提交操作
	let dataRows = [];
	let indexs = [];
	if (record && record.pk_pricesettle) {
		let info = {
			pks: record.pk_pricesettle.value,
			ts: record.ts.value
		};
		dataRows.push(info);
		indexs.push(record.numberindex && record.numberindex.value - 1);
	} else {
		let rows = props.table.getCheckedRows(PAGECODE.tableId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004PRICESTL-000020') /* 国际化处理： 请选择要提交的数据*/ /* 国际化处理： 请选择需要提交的数据！*/
			});
			return;
		}
		rows.map((item) => {
			let info = {
				pks: item.data.values.pk_pricesettle.value,
				ts: item.data.values.ts.value
			};
			dataRows.push(info);
			indexs.push(item.index);
		});
		//批量处理需把索引号置空
		indexs = null;
	}
	// 拼装json
	let data = {
		closedto: dataRows,
		pagecode: PAGECODE.listcode,
		extstr: ''
	};
	//指派
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: URL.gridcommit,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				this.commitInfo = {
					index: index,
					record: record
				};
				this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_pricesettle, res.data, indexs);
				// showBatchOprMessage(null, res.data);
				// updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_pricesettle, res.data, null);
				// initButtons.call(this, props);
				buttonController.initButtons.call(this, props);
				if (record && record.pk_pricesettle) {
					showSuccessInfo(getLangByResId(this, '4004PRICESTL-000021')); /* 国际化处理： 提交成功*/
				} else {
					//批量
					showBatchOprMessage(
						null, // getLangByResId(this, '4004POORDER-000097'),
						res.data,
						{},
						null
					);
				}
			}
		}
	});
}
