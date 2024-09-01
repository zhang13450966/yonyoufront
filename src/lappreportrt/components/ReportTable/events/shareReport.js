import { toast, ajax } from "nc-lightapp-front";
import Utils from "@public/utils";
import {
    printAuthRequest,
    getShareStatusCenterData,
    getMessageCenterData,
} from "@public/utils/requests";
import { getTreeParams } from "./outputFun";
const { langCheck } = Utils;

// 点击分享function
export const shareReport = function (data) {
    let useridArr = [];
    const { pager, fileName } = this.state;
    const { key_CUR_USER_ID } = this.initParams;
    const { condition, maxrow } = this.pageParams;

    let { title, content, sendmethod, userids } = data;
    if (data == "print" && !title) {
        title = fileName;
        sendmethod = this.outputType;
        content = langCheck(
            "reportMultiLang",
            "100301-000010"
        ); /* 国际化处理： 感谢您的下载！*/
        useridArr.push(key_CUR_USER_ID);
    } else {
        if (title == "") {
            toast({
                content: langCheck("reportMultiLang", "100301-000011"),
                color: "warning",
            }); /* 国际化处理： 请输入消息标题*/
            return;
        }
        if (userids === null || userids.length < 1) {
            toast({
                content: langCheck("reportMultiLang", "100301-000012"),
                color: "warning",
            }); /* 国际化处理： 请选择用户*/
            return;
        }

        userids.forEach((item) => {
            useridArr.push(item.refpk);
        });
    }
    const { isEnable } = this.treeParams.config;
    let collapseValueArray = "[]";
    if (isEnable) {
        collapseValueArray = JSON.stringify(getTreeParams.call(this));
    }

    let shareObj = {
        title,
        content,
        sendmethod,
        userids: useridArr,
        fileName,
        maxrow,
        collapseValueArray,
        pageInfo: {
            pageIndex: (pager.pageIndex && pager.pageIndex.toString()) || "",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
        ...this.commonParams,
    };

    ajax({
        url: "/nccloud/report/widget/lightreportshareaction.do",
        data: shareObj,
        success: (res) => {
            let toastHTML = "";
            if (data == "print" && !title) {
                toastHTML =
                    res.data == "1"
                        ? langCheck("reportMultiLang", "100301-000106")
                        : langCheck("reportMultiLang", "100301-000105");
            } else {
                toastHTML =
                    res.data == "1"
                        ? langCheck("reportMultiLang", "100301-000093")
                        : langCheck("reportMultiLang", "100301-000094");
            }

            toast({ content: toastHTML, color: "success", duration: 5 });
            this.refs.shareModal.closeShareModal();
            this.refs.confirmModal.setState({ showConfirmModal: false });
        },
    });
};

export const shareMenuClick = async function (key) {
    const { isBusiShareFun } = this.props;
    const { pager, fileName, showSidebox, sideboxStatus } = this.state;
    const { key_CUR_USER_ID } = this.initParams;
    const { condition, maxrow } = this.pageParams;

    if (
        sideboxStatus === "historyInfo" &&
        key === "historyInfo" &&
        showSidebox
    ) {
        return this.setState({ showSidebox: false });
    }

    if (key == "shareNow" || key == "time") {
        const flag = await printAuthRequest({ type: "share" });
        if (!flag) return;
        if (key == "shareNow") {
            if (isBusiShareFun) {
                const { pageIndex, pageSize } = pager;

                let shareObj = {
                    fileName,
                    maxrow,
                    key_CUR_USER_ID,
                    pageInfo: {
                        pageIndex: (pageIndex && pageIndex.toString()) || "",
                        pageSize: (pageSize && pageSize.toString()) || "",
                    },
                    querycondition: condition,
                    ...this.commonParams,
                };
                isBusiShareFun(shareObj);
                return;
            }
            this.shareFun();
        } else {
            this.setState({
                showTimeModal: true,
                maxrow,
            });
        }
        return;
    }

    //分享明细查询
    const data = {
        pk_report: this.commonParams.pk_report,
        appcode: this.commonParams.appcode,
    };

    let sideboxData = [],
        msg = langCheck("reportMultiLang", "100301-000137"),
        showToast = true;

    switch (key) {
        case "status":
            //实时分享状态
            const [data3, data4] = await getShareStatusCenterData({ data });
            sideboxData = [...data3, ...data4];
            msg = langCheck("reportMultiLang", "100301-000021");
            break;
        case "historyInfo":
        case "history":
            const [data1, data2] = await getMessageCenterData({ data });
            sideboxData = [...data1, ...data2];
            if (key === "historyInfo") showToast = false;
            break;
        default:
            break;
    }

    if (showToast && !sideboxData.length) {
        return toast({
            content: msg,
            color: "warning",
        });
    }

    if (showSidebox) {
        //先清空状态
        this.setState({ showSidebox: false });
    }
    this.setState({
        sideboxData,
        showSidebox: true,
        sideboxStatus: key,
    });
};
