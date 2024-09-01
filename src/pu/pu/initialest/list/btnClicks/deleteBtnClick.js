/*
 * @Author: zhaochyu
 * @PageInfo: 列表态删除功能
 * @Date: 2018-04-20 14:23:06
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-26 16:11:10
 */
import { URL, PAGECODE, AREA } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import rowDeleteBtnClick from './rowDeleteBtnClick';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function(props, record, index) {
    //1.行内删除
    if (record) {
        rowDeleteBtnClick.call(this, props, record, index);
        return;
    }
    //获取选中的行
    let rows = this.props.table.getCheckedRows(AREA.listTableArea);
    //如果没有选中行，则提示并返回，不进行任何操作
    if (rows.length <= 0) {
        toast({
            color: 'warning',
            content: getLangByResId(this, '4004INITIALEST-000023') /* 国际化处理： 请选择需要删除的行！*/
        });
        return;
    }
    // 执行删除操作提示
    showWarningDialog(getLangByResId(this, '4004INITIALEST-000007'), getLangByResId(this, '4004INITIALEST-000024'), {
        /* 国际化处理： 删除,确定要删除所选数据吗？*/
        beSureBtnClick: deleteFunction.bind(this, {
            props: this.props,
            rows: rows,
            tabFlag: this.state.currentTab
        })
    });
}
// 删除 操作
function deleteFunction(param) {
    let { props, rows, tabFlag, _this } = param;
    // 获取待删除表格行的行号
    let indexs = rows.map(item => {
        return item.index;
    });
    // 执行删除操作
    let delRows = [];
    //缓冲需要的主键
    let pks = [];
    rows.map(item => {
        let id = item.data.values.pk_initialest.value;
        let data = {
            pk: item.data.values.pk_initialest.value,
            ts: item.data.values.ts.value
        };
        delRows.push(data);
        pks.push(id);
    });
    // 拼装json
    let data = {
        delRows: delRows
    };
    // 发送请求
    ajax({
        url: URL.delete,
        data: data,
        success: res => {
            if (res.success) {
                let failnums = res.data.failedNum;
                for (let b = 0; b < failnums; b++) {
                    let aa = res.data.errorMessages[b].match(/\d+/)[0] - 1;
                    indexs[aa] = null;
                    pks[aa] = null;
                }
                indexs = indexs.filter(item => item != null);
                pks = pks.filter(item => item != null);
                showBatchOprMessage(getLangByResId(this, '4004INITIALEST-000025'), res.data); /* 国际化处理： 删除成功*/
                //调用缓冲方法
                deleteCacheDataForList(props, PAGECODE.tableId, pks);
                //删除之后，刷新数据
                props.table.deleteTableRowsByIndex(PAGECODE.tableId, indexs);
                buttonController.lineSelected.call(this, props, this.state.currentTab);
            } else {
                toast({
                    color: 'warning',
                    content: getLangByResId(this, '4004INITIALEST-000010') /* 国际化处理： 删除失败！*/
                });
            }
        }
    });
}
