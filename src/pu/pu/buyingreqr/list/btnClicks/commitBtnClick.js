/*
 * @Author: tianzhyw 
 * @PageInfo: 列表行提交按钮
 * @Date: 2021-06-04 10:46:52 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-04 10:46:52 
 */
import { BUYINGREQ_LIST, ATTRCODE, FBILLSTATUS } from '../../siconst';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax, toast } from 'nc-lightapp-front';
import {
	updateCacheDataForList,
	updateCacheDataForListWhenChangePK
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickCommitBtn(props, record, index, assign) {
	let numberindex = record.numberindex.value;
	let pk = record.pk_praybill.value;
	let ts = record.ts.value;
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (!record) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRAYBILL-000030') /* 国际化处理： 请选择需要提交的数据！*/
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
		pageid: BUYINGREQ_LIST.listpageid
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	ajax({
		url: BUYINGREQ_LIST.commitURL,
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
				//更新列表上的数据
				//判断是否是审批中，审批通过之前主键还没换掉
				if (res.data.sucessVOs.list_head.rows[0].values.fbillstatus.value == FBILLSTATUS.approved) {
					updateCacheDataForListWhenChangePK(
						props,
						BUYINGREQ_LIST.formId,
						ATTRCODE.pk_praybill,
						ATTRCODE.pk_srcpraybill,
						res.data,
						numberindex - 1
					);
				} else {
					updateCacheDataForList(
						props,
						BUYINGREQ_LIST.formId,
						ATTRCODE.pk_praybill,
						res.data,
						numberindex - 1
					);
				}
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000031')); /* 国际化处理： 提交成功！*/
				buttonController.setListButtonVisiable(this.props);
			}
		}
	});
}
