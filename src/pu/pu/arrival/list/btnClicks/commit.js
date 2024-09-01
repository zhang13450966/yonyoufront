import { URL, FIELD, PAGECODE, AREA } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function commit(props, record, index, assign) {
	// 获取选中行
	// 执行提交操作
	let dataRows = [];
	let indexs = [];
	if (record && record.pk_arriveorder) {
		let info = {
			pk: record.pk_arriveorder.value,
			ts: record.ts.value
		};
		dataRows.push(info);
		indexs.push(index);
	} else {
		let rows = this.props.table.getCheckedRows(AREA.head);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004ARRIVAL-000043') /* 国际化处理： 请选择需要提交的数据！*/
			});
			return;
		}

		rows.map((item) => {
			let info = {
				pk: item.data.values.pk_arriveorder.value,
				ts: item.data.values.ts.value
			};
			dataRows.push(info);
			indexs.push(item.index);
		});
	}

	// 拼装json
	let data = {
		pkTsParams: dataRows,
		pageid: PAGECODE.head
	};
	//指派
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: URL.commit,
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
				if (record && record.pk_arriveorder) {
					toast({ color: 'success', content: getLangByResId(this, '4004ARRIVAL-000017') }); /* 国际化处理： 提交成功*/
					updateCacheDataForList(this.props, AREA.head, 'pk_arriveorder', res.data, index);
				} else {
					showBatchOprMessage(null, res.data, getLangByResId(this, '4004ARRIVAL-000060'));
					updateCacheDataForList(this.props, AREA.head, 'pk_arriveorder', res.data);
				}

				// initButtons.call(this, props);
			}
			this.onSelect();
		}
	});
}
