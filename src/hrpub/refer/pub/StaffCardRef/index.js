
import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = { multiLang: { domainName: 'hrpub', currentLocale: 'zh-CN',  moduleId: 'cardview'},
        refType: 'grid',
        refName: 'cardview-00005',/* 国际化处理： 人员卡片*/
        placeholder: 'cardview-00005',/* 国际化处理： 人员卡片*/
        refCode: 'hrhi.refer.PsnCardGridRef',
        queryGridUrl: '/nccloud/hrhi/ref/ReportDefineGridRef.do',
        columnConfig: [{
            // 人员编码=> 卡片编码
            name: ['cardview-00012', 'cardview-00007'],/* 国际化处理： 人员编码, 名称*/
            code: ['hr_rpt_def.rpt_code', 'hr_rpt_def.rpt_name']
        }],
        isMultiSelectedEnabled: false,
        isAlwaysEmitOnChange: true
    };

    return <Refer {...Object.assign(conf, props)} />
}
