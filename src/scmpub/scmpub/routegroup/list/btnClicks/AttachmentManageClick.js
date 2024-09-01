/*
 * @Author: 王勇 
 * @PageInfo: 附件管理点击  
 * @Date: 2020-02-14 13:00:38 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-04-09 10:56:29
 */
import { TEMPLATEINFO, ROUTEVOINFO } from '../../const/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function AttachmentManageClick(props){

    const seldatas = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
    if (seldatas == null || seldatas.length == 0) {
        showWarningInfo(null, getLangByResId(this, '4001ROUTE-000007')); /* 国际化处理： 请选择要操作的单据！*/
        return;
    }
    let crouteid = seldatas[0].data.values[ROUTEVOINFO.crouteid].value;
    this.setState({
        billid: crouteid,
        showUploader: true,
    });
    changeUrlParam(props, {
        id: crouteid,
    });

}