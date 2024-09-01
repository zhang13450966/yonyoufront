/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-03 16:00:36
 */
import { STOREREQ_LIST, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonController } from '../viewControl';
export default function clickCommitBtn(props, record, index, assign) {
	
	let _this = this;
	let numberindex = record.numberindex.value;
	let pk = record.pk_storereq.value;
	let ts = record.ts.value;
	let fbillstatus = record.fbillstatus.value;
	if (fbillstatus != FBILLSTATUS.free && fbillstatus != FBILLSTATUS.unapproved) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004STOREREQ-000010') /* 国际化处理： 请选择状态为自由的数据！*/
		});
		return;
	}
	// 执行操作
	let delRows = [];
	let datas = {
		id: pk,
		ts: ts
	};
	delRows.push(datas);
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: STOREREQ_LIST.listpageid
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
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
					isBatch: false,
					record: record,
					index: index
				};
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.success) {
				//更新列表上的数据
				updateCacheDataForList(props, STOREREQ_LIST.formId, ATTRCODE.pk_storereq, res.data, numberindex - 1);
				buttonController.setListButtonVisiable(props, this.state.currentTab);
				showSuccessInfo(getLangByResId(_this, '4004STOREREQ-000020')); /* 国际化处理： 提交成功！*/
			} else {
				showErrorInfo(getLangByResId(_this, '4004STOREREQ-000036')); /* 国际化处理： 提交失败！*/
			}
		}
	});
}
