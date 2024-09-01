
import {high} from 'nc-lightapp-front';

const {Refer} = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'pu',
            currentLocale: 'zh-CN',
            moduleId: 'TRH10201zgl_DefaultGridRef',
        },
        refType: 'grid',
        refName: 'refer-TRH10201zgl-000001',
        placeholder: 'refer-TRH10201zgl-000001',
        columnConfig: [{name: ['refer-TRH10201zgl-000002', 'refer-TRH10201zgl-000003'], code: ['refcode', 'refname']}],
        refCode: 'pu.pu_caigouhet_zgl.Pu_caigouhet_zglMasterDefaultGridRefAction',
        queryGridUrl: '/nccloud/pu/pu_caigouhet_zgl/Pu_caigouhet_zglMasterDefaultGridRefAction.do',
    };

    return <Refer {...conf} {...props} />
}