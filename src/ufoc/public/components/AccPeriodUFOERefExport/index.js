/**
 * @file 会计期间组件形式
 * @author mafq-->Mendege
 *
 */
 import React from 'react';
 import {createPage} from 'nc-lightapp-front';
import {AccPeriodUFOERefRefer} from "./Com/IRefer";

/**
 * 选中节点触发事件
 * @param {object} props    [参照其他属性（事件，默认值）]
 * 需要增加参数 - 任务参照上取值
 * 表传参：pk_accperiodscheme--和树保持一致 pk_keygroup:关键字组合pk（从任务中获取pk_keygroup）
    queryCondition: {
        pk_accperiodscheme: '', // 任务有必传 对应 pk_accscheme
        pk_keygroup: '', // 任务有必传 对应 pk_keygroup
    }
 */
export default  function (props = {}) {
    
    let refName = 'refer_lang-000006'; // 会计期间
    let code = 'refer_lang-000001'; // 编码
    let beginDateName = 'refer_lang-000009'; // 开始月份
    let endDateName = 'refer_lang-000010'; // 结束月份

    let conf = {
        multiLang: {domainName: 'ufoe', currentLocale: 'zh-CN', moduleId: 'refer_lang'},
        refType: 'gridTree',
        queryGridUrl: '/nccloud/uapbd/pub/AccperiodMonthGridRef.do',
        queryTreeUrl: '/nccloud/uapbd/pub/AccperiodYearTreeRef.do',
        isShowUnit: false,
        onlyLeafCanSelect: true,
        rootNode: {refname: refName, refpk: 'root'},
        treeConfig: {name: [code, refName], code: ['refcode', 'refname']},
        columnConfig: [{name: [code, refName, beginDateName, endDateName], code: ['refcode', 'refname', 'begindate', 'enddate']}],
        refName,
        placeholder: "",
        isCacheable: false,
    }
    return <AccPeriodUFOERefRefer {...conf} {...props} />
}
// class AccPeriodUFOERefBox extends React.Component{
//     render(){
//         return AccPeriodUFOERefExport(this.props)
//     }
// }
// export default (AccPeriodUFOERefBox = createPage({})(AccPeriodUFOERefBox));
