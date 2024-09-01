/*
 * @Author: CongKe 
 * @PageInfo: 采购订单提交 
 * @Date: 2018-06-20 18:23:03 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-01-03 15:27:44
 */
import { URL, FIELD, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

export default function commit(props, record, index, assign) {
	// 获取选中行
	// 执行提交操作
	let _this = this;
	let dataRows = [];
	let indexs = [];
	if (record && record.pk_order) {
		let info = {
			pks: record.pk_order.value,
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
				content: getLangByResId(this, '4004POORDER-000067') /* 国际化处理： 请选择需要提交的数据！*/
			});
			return;
		}
		rows.map((item) => {
			let info = {
				pks: item.data.values.pk_order.value,
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
				_this.commitInfo = {
					index: index,
					record: record
				};
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_order, res.data, indexs);
				buttonController.initButtons.call(this, props);
				/* 国际化处理： 提交成功！*/
				if (record && record.pk_order) {
					showSuccessInfo(getLangByResId(this, '4004POORDER-000037'));
				} else {
					//批量
					showBatchOprMessage(
						getLangByResId(this, '4004POORDER-000097'),
						res.data,
						{},
						getLangByResId(this, '4004POORDER-000097')
					);
				}
			}
		}
	});
}
