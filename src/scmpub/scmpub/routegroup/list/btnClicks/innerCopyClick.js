/*
 * @Author: 王勇 
 * @PageInfo: 表体复制操作  
 * @Date: 2020-03-24 19:01:15 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-03-26 10:36:39
 */
import { ROUTEURL,VIEWINFO,CARDTEMPLATEINFO} from '../../const/index';

export default function innerCopyClick(props,record){
    let id = record.crouteid.value;
    let pk = id;
	props.pushTo(ROUTEURL.Card_URL, {
        pagecode: CARDTEMPLATEINFO.templateCode,
		status: VIEWINFO.EDIT_STATUS,
		id: pk,
        copyFlag: true,
        checked: this.state.checked,
        queryFlag: this.state.queryFlag,
	});
}