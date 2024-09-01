/**
 * 模块配置文件
 * @author rongqb@yonyou.com
 * @date 20190520
 */
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()
const name = 'leave', 
    pk = 'pk_leave',
    domainName = 'hrkq';

export default {
    pk,
    name,
    domainName,
    cardId: `${name}_card`,
    tableId: `${name}_list`,
    queryId: `${name}_query`,
    appcode,
    pagecode,
    mutilLang: {
        moduleId: "hrkq0522",
        domainName: "hrkq"
    },
    queryAction: `/nccloud/hrkq/${name}/QueryListAction.do`,
    exportAction: `/ncchr/${name}/apply/exportLeaveApply`,
    hrCreateCard: 'hr_leave_card',
    leaveOffCard: 'leaveoff_card'
}