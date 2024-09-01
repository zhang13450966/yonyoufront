/*
 * @Author: zhangchangqing 
 * @PageInfo: 提交按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-25 13:39:32
 */
import { STOREREQ_LIST, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonController } from '../viewControl';
let formId = STOREREQ_LIST.formId; //'head';

export default function clickDelBtn(props, assign) {
	// 获取选中行
	
	let _this = this;
	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004STOREREQ-000019') /* 国际化处理： 请选择需要提交的数据！*/
		});
		return;
	}
	// 获取待删除表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行删除操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_storereq.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: STOREREQ_LIST.listpageid
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: STOREREQ_LIST.commitURL,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				//缓存当前数据
				_this.commitInfo = {
					isBatch: true,
					record: null,
					index: null
				};
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				showBatchOprMessage(
					getLangByResId(_this, '4004STOREREQ-000020'),
					res.data,
					{},
					getLangByResId(_this, '4004STOREREQ-000045')
				); /* 国际化处理： 提交成功*/
				//更新列表上的数据
				updateCacheDataForList(props, STOREREQ_LIST.formId, ATTRCODE.pk_storereq, res.data);
				buttonController.setListButtonVisiable(props, this.state.currentTab);
			} else {
				// toast({
				// 	color: 'warning',
				// 	content: '提交失败！'
				// });
			}
		}
	});
}
