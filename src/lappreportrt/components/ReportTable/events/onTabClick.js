import { getInitParams, getSearchData } from "@public/utils/requests";
import { afterSearchReport } from "./sendSearch";
import { getInitData } from "./getInitData";
import Utils from "@public/utils";
const { getTimeOffset } = Utils;

export async function onTabClick(key) {
    const { pager, result = {}, settings } = this.state;
    const { appcode } = this.commonParams;
    const { searchTS, querycondition } = this.sendSearchParams;
    const { queryInfo } = this.pageParams;

    const { activeKey, tabs } = this.reportTabMap;

    const currentTab = getCurrentTab(key, tabs); //当前页签

    const prevTab = getCurrentTab(activeKey, tabs); //当前页签

    prevTab.currentTabData = JSON.parse(JSON.stringify(result));
    prevTab.freezeInfo = getFreezeLine(settings); //处理冻结

    if (this.pageInfoForDimMap[key]) {
        this.commonParams.pageInfoForDim = this.pageInfoForDimMap[key];
    }

    //先请求初始化数据
    const initData = await getInitParams({
        data: {
            pk_report: key,
            appcode,
            key_time_offset: getTimeOffset(),
        },
    });

    //填充当前的冻结信息
    const { fixedRowsTop, fixedColumnsLeft } = currentTab.freezeInfo || {};
    this.state.settings = {
        ...this.state.settings,
        fixedRowsTop,
        fixedColumnsLeft,
    };

    await getInitData.call(this, initData, false, true);

    //根据searchTS，判断是否查询数据，如果pageIndex大于1时，进行分页查询数据
    if (searchTS) {
        if (currentTab.searchTS !== searchTS || !currentTab.currentTabData) {
            //当前页签与ts不匹配，要进行查询
            const resultData = await getSearchData({
                data: {
                    ...this.sendSearchParams,
                    pageInfo: {
                        //使用当前tab的分页信息
                        ...this.sendSearchParams.pageInfo,
                        pageSize: this.state.pager.pageSize,
                    },
                    ...this.commonParams,
                },
            });

            currentTab.currentTabData = resultData;
        }

        afterSearchReport.call(this, {
            resultData: JSON.parse(JSON.stringify(currentTab.currentTabData)),
            diffConditon: querycondition,
            queryInfo,
            prevTabKey: prevTab.Key,
        });
    }

    //重置页签数据
    this.reportTabMap.activeKey = key; //修改当前页签
    currentTab.searchTS = searchTS; //修改当前页签查询ts
    //给每一个tab项设置自己的pager信息
    currentTab.pager = pager;
}

//当前的tab数据
export function getCurrentTab(key, tabs) {
    if (!tabs) return null;
    return tabs.find(item => item.pk === key);
}

//处理冻结
function getFreezeLine(param) {
    const { fixedRowsTop, fixedColumnsLeft } = param;
    return { fixedRowsTop, fixedColumnsLeft };
}
