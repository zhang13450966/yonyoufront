/*
 * @Author: ligangt
 * @PageInfo: 查询按钮点击
 * @Date: 2018-04-18 10:39:11
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-26 16:26:57
 */
import { ajax, base, toast } from 'nc-lightapp-front';
import { URL, COMMON, AREA, PAGECODE } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

//点击查询，获取查询区数据
import commonSerach from './commonSearch';
export default function clickSerachBtn(tabCode) {
    let pageInfo = this.props.table.getTablePageInfo(AREA.head); //分页信息
    let searchVal = this.props.search.getAllSearchData(AREA.searchArea); //必输项为空时，返回值为false
    if (!searchVal) {
        return;
    }
    let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, true);
    // 将查询条件缓存
    this.setState({ searchVal: queryInfo });
    // 查询
    commonSerach.call(this, tabCode, queryInfo, false, false);
}
