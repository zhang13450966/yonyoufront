/*
 * @Author: yinliang
 * @PageInfo: 卡片态，删除按钮
 * @Date: 2018-04-12 14:23:01
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-26 16:09:25
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
export default function(props, record, index) {
    let data = {
        delRows: [
            {
                pk: record.pk_initialest.value, // 主键
                ts: record.ts.value // 时间戳
            }
        ]
    };
    //要删除的Pk
    let deletepk = record.pk_initialest.value;
    ajax({
        url: URL.delete,
        data: data,
        success: res => {
            if (res.success) {
                props.table.deleteTableRowsByIndex(PAGECODE.tableId, index);
                deleteCacheDataForList(props, PAGECODE.tableId, deletepk);
                showSuccessInfo(getLangByResId(this, '4004INITIALEST-000009'));
                buttonController.lineSelected.call(this, props, this.state.currentTab);
                /* 国际化处理： 删除成功！*/
            } else {
                showSuccessInfo(getLangByResId(this, '4004INITIALEST-000010'));
                /* 国际化处理： 删除失败！*/
            }
        }
    });
}
