/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线输出  
 * @Date: 2020-01-17 09:39:48 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-07 10:29:59
 */
import { CARDTEMPLATEINFO,TEMPLATEINFO,REQUESTURL,APPINFO,ROUTEVOINFO } from '../../const/index';
import { output } from 'nc-lightapp-front';
export default function outputBtnClick(props) {

    let pk = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode,ROUTEVOINFO.crouteid);
    let ids = [pk.value];
    output({
        url: REQUESTURL.printRouteUrl,
        data: {
            funcode: APPINFO.appCode,
            nodekey: TEMPLATEINFO.nodeKey,
            oids: ids, 
            outputType: TEMPLATEINFO.outputType,
        }
    });
}
