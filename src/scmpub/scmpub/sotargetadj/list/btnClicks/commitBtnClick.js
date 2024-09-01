/*
 * @Author: zhangchangqing
 * @PageInfo: 行提交按钮
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:06:45
 */
import { TARGETADJ_LIST, ATTRCODE } from '../../siconst';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickCommitBtn(props, record, index, assign) {
	let _this = this;
	let numberindex = record.numberindex.value;
	let pk = record.pk_targetadj.value;
	let ts = record.ts.value;
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
		pageid: TARGETADJ_LIST.listpageid
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: TARGETADJ_LIST.commitURL,
		data: data,
		success: (res) => {
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.userObj.workflow == 'workflow')
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
				updateCacheDataForList(props, TARGETADJ_LIST.formId, ATTRCODE.pk_targetadj, res.data, numberindex - 1);
				showSuccessInfo(getLangByResId(_this, '4001TARGETADJ-000029')); /* 国际化处理： 提交成功！*/
				buttonController.setListButtonVisiable(this.props, true);
			} else {
				showErrorInfo(getLangByResId(_this, '4001TARGETADJ-000048')); /* 国际化处理： 提交失败！*/
			}
		}
	});
}
