/*
 * @Author: fangmj7
 * @PageInfo: 提交按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-04 15:00:18
 */
import { AREA, URL, FIELD, PAGECODE } from '../../constance';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController';
export default function clickCommitBtn(props, record, index, assign) {
	let numberindex = record.numberindex.value;
	let pk = record.pk_planconfirm.value;
	let ts = record.ts.value;
	// 保存页面提交数据的数组，用于提交之后比对（通过主键），然后将对应的单据状态修改为最新的状态，数组中每个对象只存id和index即可
	let map = new Map();
	map.set(pk, numberindex);

	let delRows = [];
	let datas = {
		pk: pk,
		ts: ts
	};
	delRows.push(datas);
	// 拼装json
	let data = {
		billInfo: delRows,
		pagecode: PAGECODE.list
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: URL.commit,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.userObj.workflow == 'workflow')
			) {
				//缓存当前数据
				this.commitInfo = {
					isBatch: false,
					record: record,
					index: index
				};
				this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				if (res.data && res.data.data && res.data.data[AREA.head] && res.data.data[AREA.head].rows) {
					let resultRows = res.data.data[AREA.head].rows;
					// 提交之后比对（通过主键），然后将对应的单据状态修改为最新的状态
					resultRows.map((item, index) => {
						// 获取对应下标
						let changeIndex = map.get(item.values.pk_planconfirm.value);
						// 获取单据状态
						let ts = item.values.ts;
						let billflagData = item.values.fbillstatus;
						// 修改列表态表格的单据状态字段的值
						props.table.setValByKeyAndIndex(AREA.head, changeIndex - 1, FIELD.fbillstatus, billflagData);
						props.table.setValByKeyAndIndex(AREA.head, changeIndex - 1, FIELD.ts, ts);
						props.table.selectTableRows(AREA.head, changeIndex - 1, false);
					});
				}
				showSuccessInfo(getLangByResId(this, '4004planconfirm-000006')); /* 国际化处理： 提交成功！*/
				buttonController.call(this, this.props);
			} else {
				showErrorInfo(getLangByResId(this, '4004planconfirm-000028')); /* 国际化处理： 提交失败！*/
			}
		}
	});
}
