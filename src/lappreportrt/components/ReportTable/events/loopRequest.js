import {
    getShareStatusData,
    getNotReadMessageCount,
} from "@public/utils/requests";
import { toast } from "nc-lightapp-front";
import Utils from "@public/utils";
const { langCheck } = Utils;
const finallyList = ["7", "9"];

function getResult({ params1, params2 }) {
    return Promise.all([
        getShareStatusData({ data: params1 }),
        getNotReadMessageCount({ data: params2 }),
    ]);
}

export function loopRequest() {
    const fn = onRequest.call(this);
    fn();
}

//循环调用分享接口，刷新数据，并提醒用户
export function onRequest() {
    let prevParams,
        prevCount = "0",
        allParams = [];

    const sendRequest = async () => {
        const [params, count] = await getResult({
            params1: this.commonParams,
            params2: this.commonParams,
        });

        if (prevCount != count) {
            //如果未读消息变更了，要更新显示值
            this.setState({ notReadCount: count });
            prevCount = count;
        }

        const { showSidebox, sideboxStatus } = this.state;

        let addShareList = [];
        if (allParams.length) {
            addShareList = params.filter(
                item =>
                    finallyList.includes(item.status) &&
                    !allParams.includes(item.id),
            );
        }

        if ((prevParams && prevParams.length) || addShareList.length) {
            //找出上一次非终态数据，与此次数据对比，是否变更为终态，如是，则弹窗进行提示

            const diffStatusList = params.filter(
                item =>
                    finallyList.includes(item.status) &&
                    prevParams.includes(item.id),
            );

            const diffStatus = [...diffStatusList, ...addShareList]
                .map(
                    item =>{
                        let info = langCheck("reportMultiLang","100301-000274")
                        info = info.replace('{0}', item.createTime)
                                   .replace('{1}', item.subject)
                        return `${info} \n`
                    }
                )
                .join("");
            if (diffStatus) {
                toast({
                    content: diffStatus,
                    color: "success",
                    duration: 10,
                });

                //如果实时分享状态侧边栏为打开状态，要更新数据
                if (showSidebox && sideboxStatus === "status") {
                    this.setState({ sideboxData: params });
                }
            }
        }

        prevParams = params
            .filter(item => !finallyList.includes(item.status))
            .map(item => item.id);

        allParams = params.map(item => item.id);
    };

    sendRequest();

    return () => {
        setInterval(async () => {
            sendRequest();
        }, 120000);
    };
}
