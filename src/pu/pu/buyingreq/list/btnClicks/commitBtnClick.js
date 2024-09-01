/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-29 11:01:43
 */
import { BUYINGREQ_LIST, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickCommitBtn(props, record, index, assign) {
    
    let _props = props;
    let _this = this;
    let numberindex = record.numberindex.value;
    let pk = record.pk_praybill.value;
    let ts = record.ts.value;
    let fbillstatus = record.fbillstatus.value;
    // if (fbillstatus != FBILLSTATUS.free && fbillstatus != FBILLSTATUS.unapproved) {
    // 	toast({
    // 		color: 'warning',
    // 		content: '请选择状态为自由的数据！'
    // 	});
    // 	return;
    // }
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
        success: res => {
            
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
                updateCacheDataForList(props, BUYINGREQ_LIST.formId, ATTRCODE.pk_praybill, res.data, numberindex - 1);
                showSuccessInfo(getLangByResId(_this, '4004PRAYBILL-000029')); /* 国际化处理： 提交成功！*/
                buttonController.setListButtonVisiable(this.props, true);
            } else {
                showErrorInfo(getLangByResId(_this, '4004PRAYBILL-000048')); /* 国际化处理： 提交失败！*/
            }
        }
    });
}
