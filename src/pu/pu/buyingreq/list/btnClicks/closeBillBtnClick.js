/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-29 11:08:18
 */
import { BUYINGREQ_LIST, FBILLSTATUS, ATTRCODE } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { showBatchOprMessage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
let formId = BUYINGREQ_LIST.formId; //'head';

export default function clickBtn(props, record, index) {
    // 拼装json
    let numberindex = record.numberindex.value;
    let delRows = [];
    let data = {
        id: record.pk_praybill.value,
        ts: record.ts.value
    };
    delRows.push(data);
    // 发送请求
    ajax({
        url: BUYINGREQ_LIST.closeBillURL,
        data: {
            deleteInfos: delRows,
            pageid: BUYINGREQ_LIST.listpageid
        },
        success: res => {
            
            if (res.success) {
                //showBatchOprMessage(getLangByResId(this, '4004PRAYBILL-000029'), res.data); /* 国际化处理： 提交成功*/
                showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000054')); /* 国际化处理： 整单关闭成功！*/
                //更新列表上的数据
                updateCacheDataForList(props, BUYINGREQ_LIST.formId, ATTRCODE.pk_praybill, res.data, numberindex - 1);
                buttonController.setListButtonVisiable(this.props, true);
            }
        }
    });
}
