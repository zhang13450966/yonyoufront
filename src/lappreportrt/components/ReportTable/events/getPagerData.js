import { toast } from "nc-lightapp-front";
import { tableRender, clearTotalNumber } from "./methods";
import Utils from "@public/utils";
import { turnPageRequest } from "@public/utils/requests";
const { langCheck } = Utils;

//获取分页数据
export default async function getPagerData(way) {
    const { pager } = this.state;
    const { noDropdownPrint } = this.initParams;
    const { condition } = this.pageParams;
    let { pageSize, pageIndex, allRowCount } = pager;
    if (+pageSize < 10) {
        pager.pageSize = 10;
        toast({
            content: langCheck("reportMultiLang", "100301-000017"),
            color: "warning",
        }); /* 国际化处理： 每页行数应在10—5000之间。*/
    }
    if (+pageSize > 50000) {
        pager.pageSize = 50000;
        toast({
            content: langCheck("reportMultiLang", "100301-000017"),
            color: "warning",
        }); /* 国际化处理： 每页行数应在10—50000之间。*/
    }

    //没有查询只设值不请求
    if (!this.isClickSearchBtn || noDropdownPrint) {
        return this.setState({
            pager: {
                ...pager,
                pageSize,
            },
        });
    }

    pageIndex = way === "pager" ? pageIndex : 1;
    let data = {
        allRowCount: allRowCount.toString(),
        pageInfo: {
            pageIndex: (pageIndex && pageIndex.toString()) || "",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
        ...this.commonParams,
    };

    const result = await turnPageRequest(data);

    this.sendSearchParams.pageInfo.pageIndex = pageIndex.toString();
    this.sendSearchParams.pageInfo.pageSize = pager.pageSize.toString();
    tableRender(this, result);
    clearTotalNumber();
    const dom = document.getElementsByClassName("wtHolder")[0];
    dom && dom.scrollTo && dom.scrollTo(0, 0);
}
