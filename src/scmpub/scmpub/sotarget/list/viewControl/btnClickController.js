/*
 * @Author: zhangchqf 
 * @PageInfo: 页面功能描述 按钮事件
 * @Date: 2020-02-11 20:39:05 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:45:27
 */

import { TARGET_LIST_BUTTON, TARGET_LIST } from '../../siconst';

import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import commonSerach from '../btnClicks/commonSearch'; //刷新
import delBatchBtnClick from '../btnClicks/delBatchBtnClick';
import addBtnClick from '../btnClicks/addBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import fileBtnClick from '../btnClicks/fileBtnClick';
export default function clickBtn(props, id, text, record, index) {
	switch (id) {
		//刷新
		case TARGET_LIST_BUTTON.Refresh:
			if (getDefData(TARGET_LIST.dataSource, 'searchVal')) {
				let commonSer = commonSerach.bind(
					this,
					this.state.currentTab,
					getDefData(TARGET_LIST.dataSource, 'searchVal'),
					true
				);
				return commonSer(props);
			}
			return;
		// 删除 record有值走行删除逻辑，没有值走批量处理逻辑
		case TARGET_LIST_BUTTON.delete:
			if (record) {
				let del = delBtnClick.bind(this, props, record, index);
				return del(props);
			} else {
				let delB = delBatchBtnClick.bind(this, props);
				return delB(props);
			}
		//附件
		case TARGET_LIST_BUTTON.File:
			fileBtnClick.call(this, props);
			return;
		case TARGET_LIST_BUTTON.deleteRow:
			let del = delBtnClick.bind(this, props, record, index);
			return del(props);
		//修改
		case TARGET_LIST_BUTTON.Edit:
			props.pushTo(TARGET_LIST.cardUrl, {
				status: TARGET_LIST.edit,
				id: record.pk_target.value,
				pagecode: TARGET_LIST.cardpageid
			});
			return;
		case TARGET_LIST_BUTTON.add:
			addBtnClick.call(this, props);
			return;
	}
}
