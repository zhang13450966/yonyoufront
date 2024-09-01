/*
 * @Author: CongKe 
 * @PageInfo: 采购订单收回 
 * @Date: 2018-06-20 18:23:03 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-02 16:13:31
 */
import { URL, FIELD, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function unCommit() {
	let _this = this;
	let indexs = [];
	let rows = _this.props.table.getCheckedRows(PAGECODE.list_head);
	let map = new Map();
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ORDERREVISE-000037') /* 国际化处理： 请选择需要收回的数据！*/
		});
		return;
	}

	let delRows = [];
	rows.map((item) => {
		let info = {
			pks: item.data.values.pk_order.value,
			ts: item.data.values.ts.value
		};
		delRows.push(info);
		map.set(item.data.values.pk_order.value, item.index);
		// indexs.push(item.index);
	});
	// 拼装json
	let data = {
		closedto: delRows,
		pagecode: PAGECODE.listcode,
		extstr: '',
		skipCodes: [ 'isRevise' ]
	};

	// 发送请求
	ajax({
		url: URL.griduncommit,
		data: data,
		success: (res) => {
			if (res.success) {
				let title = getLangByResId(_this, '4004ORDERREVISE-000038');
				let btnName = getLangByResId(_this, '4004ORDERREVISE-000039');
				showBatchOprMessage(title, res.data, {}, btnName);
				updateCacheDataForList(_this.props, PAGECODE.list_head, FIELD.pk_order, res.data, null);

				let resultRows = res.data.sucessVOs[PAGECODE.list_head].rows;
				// 收回之后比对（通过主键），然后将对应的单据状态修改为最新的状态
				let changeIndexs = [];
				resultRows.map((item, index) => {
					// 获取对应下标
					let changeIndex = map.get(item.values.pk_order.value);
					let forderstatus = item.values.forderstatus.value;
					if (forderstatus != '0') {
						changeIndexs.push(changeIndex);
					}
				});
				_this.props.table.selectTableRows(PAGECODE.list_head, changeIndexs, true);

				buttonController.initButtons.call(this, _this.props);
			}
		}
	});
}
