/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线输出  
 * @Date: 2020-01-17 09:50:00 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-07 10:35:52
 */
import { TEMPLATEINFO,APPINFO,ROUTEVOINFO,REQUESTURL } from '../../const/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo} from '../../../pub/tool/messageUtil';
import { output } from 'nc-lightapp-front';
export default function outputBtnClick(props) {
    let allroutes = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
    if (allroutes.length == 0) {
        showWarningInfo(null,getLangByResId(this,'4001ROUTE-000011')); /**请选择要输出的数据 */
        return;
    }
    let pks = [];
    allroutes.forEach((row) => {
        let id = row.data.values[ROUTEVOINFO.crouteid].value;
        pks.push(id);
    });

    output({
        url: REQUESTURL.printRouteUrl,
        data: {
            funcode: APPINFO.appCode,
            nodekey: TEMPLATEINFO.nodeKey,
            oids: pks, 
            outputType: TEMPLATEINFO.outputType,
        }
    });
}
