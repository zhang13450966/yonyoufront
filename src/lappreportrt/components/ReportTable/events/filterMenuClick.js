import { tableRender } from "./methods";
import { detailOrCountRequest } from "@public/utils/requests";
import { checkTreeData } from "./treeFun";

//明细汇总
export const filterMenuClick = async function (type) {
    let isOnlyShowDetail,
        data = this.sendSearchParams;
    if (type.key == "detail") {
        isOnlyShowDetail = true;
    } else {
        isOnlyShowDetail = false;
    }
    data.isOnlyShowDetail = isOnlyShowDetail;
    data.keyIsExecDrill = this.commonParams.keyIsExecDrill;
    const ret = await detailOrCountRequest(data);
    checkTreeData.call(this, ret, true);
    tableRender(this, ret);
};
