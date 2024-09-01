/*
 * @Author: zhangchangqing
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-29 11:05:54
 */
import { BUYINGREQ_LIST } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function clickDelBtn(props, record) {
    
    // // 弹出确认删除的框
    // showWarningDialog(getLangByResId(this, '4004PRAYBILL-000057'), getLangByResId(this, '4004PRAYBILL-000037'), {
    // 	/* 国际化处理： 确认要删除吗？*/
    // 	beSureBtnClick: backtotransfer.bind(this, props, record)
    // });
    backtotransfer.call(this, props, record);
}
function backtotransfer(props, record) {
    //自己的逻辑
    let numberindex = record.numberindex.value;
    let pk = record.pk_praybill.value;
    let ts = record.ts.value;
    ajax({
        url: BUYINGREQ_LIST.deleteURL,
        data: {
            id: pk,
            ts: ts
        },
        success: res => {
            // 删除成功之后，前台删除数据
            props.table.deleteTableRowsByIndex(BUYINGREQ_LIST.formId, numberindex - 1);
            deleteCacheDataForList(props, BUYINGREQ_LIST.formId, pk);
            showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000015')); /* 国际化处理： 删除成功！*/
            buttonController.setListButtonVisiable(this.props, true);
        }
    });
}
