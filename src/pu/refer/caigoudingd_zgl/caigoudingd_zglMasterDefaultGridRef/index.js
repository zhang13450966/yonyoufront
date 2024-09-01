
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'pu',
            currentLocale: 'zh-CN',
            moduleId: 'TRH10202zgl_DefaultGridRef',
        },
        refType: 'grid',
        refName: 'refer-TRH10202zgl-000001',
        placeholder: 'refer-TRH10202zgl-000001',
        columnConfig: [{name: ['refer-TRH10202zgl-000002', 'refer-TRH10202zgl-000003'], code: ['refcode', 'refname']}],
        refCode: 'pu.caigoudingd_zgl.Caigoudingd_zglMasterDefaultGridRefAction',
        queryGridUrl: '/nccloud/pu/caigoudingd_zgl/Caigoudingd_zglMasterDefaultGridRefAction.do',
    };

    return <Refer {...conf} {...props} />
}