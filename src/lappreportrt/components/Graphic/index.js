/**
 * 初始化时候：
 *  1.参数传appcode则使用appcode，传pk_storyboard则使用pk_storyboard，都传则使用pk_storyboard
 *  2.参数pk_params有则传，没有则不传
 *  3.isInitData是true则请求渲染数据，false或者不传则请求默认展示的数据（接口不同）
 *
 */

import React, { Component } from "react";
import { ajax, pageTo, getMultiLang, getTheme, toast, base } from "nc-lightapp-front";
const { NCLoading } = base;
import Utils from "@public/utils";
const { getTimeOffset } = Utils;
import EmptyComponent from "../public/components/EmptyComponent";
import PropTypes from 'prop-types';
require("./index.less");

const VTOKEN = "V-Token";

class GraphicReport extends Component {
    constructor(props) {
        super(props);
        this.urlPrefix =
            top.location.origin +
            "/iuap-data-common/ucf-wh/intelliv/index.html#";
        this.graphicRef = null;
        let appcode =
            (window.location.search && window.location.search.split("=")[1]) ||
            "";
        this.appCode =
            appcode ||
            pageTo.getUrlParam("appcode") ||
            pageTo.getSearchParam("c") ||
            "";
        this.theme = "";
        this.state = {
            loadingStatus: false,
            iframeUrl: "",
            pk_storyboard: "",
            isLessThanLicense: "true",
            licenseMultiLang: {},
            prevParams: {},
            toggleFlag: false,
        };
        this.timer = null;
        console.time("数据分析图形化NCC前端页面耗时");
    }

    componentWillMount() {
        let callback = (json) => {
            this.setState({ licenseMultiLang: json });
        };
        getMultiLang({
            moduleId: 100304,
            currentLocale: "zh-CN",
            domainName: "lappreportrt",
            callback,
        });
    }

    async componentDidMount() {
        const { noTheme } = this.props.params || {};
        if (!noTheme) {
            const theme = await getTheme();
            if (theme === "black") {
                this.theme = "426b827f-8100-4d12-87aa-774404e823da";
            } else {
                this.theme = "d611e8fa-2ba0-4940-88b1-ee8b4e2e1ef3";
            }
        }

        if (this.props.params && this.props.params.pk_storyboard) {
            this.getParams(
                this.props.params.pk_storyboard,
                this.appCode,
                this.props.params,
                "init"
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        this.forceUpdateGraphic(nextProps);
    }

    forceUpdateGraphic = (props = this.props) => {
        this.getParams(props.params.pk_storyboard, this.appCode, props.params);
    };

    resetState = () => {
        this.setState({ iframeUrl: "" });
    };

    getParams = (pk_storyboard = "", appCode = "", params = {}, isInit) => {
        let self = this;
        let isWidget = params.appType === "widget";
        let analysis_params = params.analysis_params || {}; //分析型参数
        let search_params = params.search_params || {}; //查询区参数
        let reportRowData = params.reportRowData;
        let hideTopBarFromBusi = params.hideTopBar;
        let hideChangeGraphFromBusi = params.hideChangeGraph;
        let hideAllChangeFromBusi = params.hideAllChange;
        const hbParams = params.hbParams ? `${params.hbParams},` : "";
        const needRefreshWhenClickRowData = params.needRefreshWhenClickRowData;
        let refreshKey = params.refreshKey;

        const openType = params.openType || false; //判断是刚打开还是查询时，打开：false  查询：true
        //如果条件不变，则不刷新图表

        if (
            isInit !== "init" &&
            !params.isInitIfNoPK && //适配智能化分析集成小应用
            !needRefreshWhenClickRowData &&
            pk_storyboard === this.props.params.pk_storyboard &&
            JSON.stringify(analysis_params) ===
                JSON.stringify(this.props.params.analysis_params) &&
            JSON.stringify(search_params) ===
                JSON.stringify(this.props.params.search_params) &&
            reportRowData === this.props.params.reportRowData &&
            refreshKey === this.props.params.refreshKey
        ) {
            //console.log("相同条件，图表不进行刷新操作");
            return;
        }

        let { iframeUrl } = this.state;
        // 当数据分析对象的pk_storyboard改变，需要重新初始化url，或者当url没有的时候去初始化
        let isFirstLoad =
            pk_storyboard !== this.props.params.pk_storyboard || !iframeUrl;

        const time_offset = getTimeOffset();
        if (!iframeUrl) {
            this.setState({
                loadingStatus: true
            })
        }
        ajax({
            url: "/nccloud/report/graphic/storyboardpreviewaction.do",
            loading: false,
            data: {
                pk_storyboard,
                appCode,
                time_offset,
                analysis_params,
                reportRowData,
                ...search_params,
                isFirstLoad,
                nccToken: this.state.prevParams.nccToken,
                // 下面三个是嵌入式分析新增的参数
                mdid: params.mdid || "",
                client_url: top.location.origin,
                pk_apppage: params.pk_apppage || "",
                pkcode: params.pkcode || [],
                associated_object: params.associated_object || [],
                associate_application: !!params.associate_application, // 是否是关联应用的条件
            },
            success: (res) => {
                if (isInit === "init")
                    console.timeEnd("数据分析图形化NCC前端页面耗时");
                const data = res.data;
                if (data.showHideNCCTopBarButton) this.showFullScreen();
                const params = { ...this.state.prevParams, ...data };
                let {
                    urlPrefix,
                    cloudMark,
                    dataId,
                    nccToken,
                    sysTenantId,
                    analysis_params,
                    usercode,
                    dsname,
                    hideTopBar,
                    hideChangeGraph,
                    webmodel_url,
                    language,
                    isShowPDFAndEXCEL,
                    hideAllChange,
                    locale,
                    isLessThanLicense,
                    mark,
                    Cookie,
                    pagecs,
                    cookiets,
                    key_time_offset,
                } = params;
                let preUrl = cloudMark ? this.urlPrefix : urlPrefix;
                let mobile = mark === "mobile" ? "mobile/" : "";
                if (isLessThanLicense == "false") {
                    //判断数据库超出许可时，false超出
                    this.setState({ isLessThanLicense });
                    this.handleAjaxError();
                    return;
                }
                let hdtopbar =
                    hideTopBarFromBusi == true || hideTopBarFromBusi == "true"
                        ? "hdtopbar&"
                        : hideTopBar == true
                        ? "hdtopbar&"
                        : "";
                let a_change_type =
                    hideChangeGraphFromBusi == true ||
                    hideChangeGraphFromBusi == "true"
                        ? ",a_change_type"
                        : hideChangeGraph == true
                        ? ",a_change_type"
                        : "";
                let a_change =
                    hideAllChangeFromBusi == true ||
                    hideAllChangeFromBusi == "true"
                        ? ",a_change"
                        : hideAllChange == true
                        ? ",a_change"
                        : "";
                let exportStr =
                    isShowPDFAndEXCEL == true
                        ? ""
                        : ",export,a_print,export_pdf,export_excel,batch_export,batch_print";
                let webmodel = "";
                if (webmodel_url) {
                    webmodel = `&webmodel_url=${webmodel_url}`;
                }
                let lang_type = "";
                if (language) {
                    lang_type = `&lang=${language}`;
                }
                let locale_type = "";
                if (locale) {
                    locale_type = `&locale=${locale}`;
                }

                let theme = "";
                if (this.theme) {
                    theme = `&theme=${this.theme}`;
                }

                if (isFirstLoad) {
                    this.setState({ toggleFlag: false });
                    setTimeout(() => {
                        this.setState({
                            toggleFlag: true,
                            pk_storyboard,
                            prevParams: params,
                            iframeUrl: `${preUrl}/analysis/${mobile}${dataId}?Cookie=${Cookie}&cookiets=${cookiets}${theme}&pagecs=${pagecs}&${hdtopbar}hb=${hbParams}new_report,share,edit,casebtn,close,a_edit,a_full,a_merge,a_tset${a_change_type}${a_change}${exportStr}&nccToken=${nccToken}&dataId=${dataId}&usercode=${usercode}&dsname=${dsname}&${VTOKEN}=${params[VTOKEN]}&sysTenantId=${sysTenantId}&${analysis_params}${webmodel}${lang_type}${locale_type}&openType=${openType}&keyTimeOffset=${key_time_offset}`,
                        });
                    }, 500);
                } else {
                    setTimeout(() => {
                        this.graphicRef &&
                            this.graphicRef.contentWindow &&
                            this.graphicRef.contentWindow.postMessage(
                                {
                                    type: "refresh",
                                    nccToken,
                                    [VTOKEN]: params[VTOKEN],
                                    sysTenantId,
                                    search_params: JSON.parse(
                                        JSON.stringify(search_params)
                                    ),
                                    analysis_params,
                                    language,
                                    webmodel_url,
                                    hb: `${hbParams}new_report,share,edit,close,a_edit,a_merge,a_full,a_tset,casebtn${a_change_type}${exportStr}${a_change}`,
                                    hdtopbar: hdtopbar == "" ? "false" : "true",
                                    openType,
                                    Cookie,
                                    pagecs,
                                    cookiets,
                                    nccFilterFlag: true,
                                    keyTimeOffset: key_time_offset,
                                },
                                preUrl
                            );

                        this.setState({
                            pk_storyboard,
                            prevParams: params,
                        });
                    }, 200);
                }

                if (isWidget) {
                    let refresh_time = data.refresh_time || 30;
                    if (refresh_time < 30) refresh_time = 30;
                    if (refresh_time > 1440) refresh_time = 1440;

                    self.timer && clearInterval(self.timer);
                    self.timer = setInterval(() => {
                        try {
                            this.graphicRef &&
                                this.graphicRef.contentWindow &&
                                this.graphicRef.contentWindow.postMessage(
                                    {
                                        type: "refresh",
                                        nccToken,
                                        [VTOKEN]: params[VTOKEN],
                                        sysTenantId,
                                        search_params: JSON.parse(
                                            JSON.stringify(search_params)
                                        ),
                                        language,
                                        webmodel_url,
                                        analysis_params,
                                        locale,
                                        hb: `${hbParams}new_report,share,edit,close,a_edit,casebtn,a_full,a_merge,a_tset${a_change_type}${exportStr}${a_change}`,
                                        hdtopbar:
                                            hdtopbar == "" ? "false" : "true",
                                        openType,
                                        Cookie,
                                        pagecs,
                                        cookiets,
                                        nccFilterFlag: true,
                                    },
                                    preUrl
                                );
                        } catch (e) {
                            throw new Error(e);
                        }
                    }, refresh_time * 60 * 1000);
                }
            },
            error: this.handleAjaxError
        });
    };

    showFullScreen = () => {
        const $nav = window.top.document.querySelector(
            ".nc-workbench-top-container"
        );
        const $app = document.getElementById("app");
        const $theme = document.querySelector(".nc-no-theme");

        if ($nav && $app && $theme) {
            if ($nav.style.display == "none") return;
            $nav.style.display = "none";
            $app.style["max-width"] = "100%";
            $theme.style.padding = "0";
        }
    };

    handleIfameLoaded = () => {
        this.setState({
            loadingStatus: false
        })
        let { iframeLoaded } = this.props.params;
        if (typeof iframeLoaded === "function") {
            iframeLoaded(false);
        }
    };

    handleAjaxError = (res, url) => {
        this.handleIfameLoaded();
        if (!res) return;
        console.error(res.type, res, url);
        let msgContent = JSON.stringify(res.message);
        const colors = ["danger", "warning", "info", "success"];
        let color = colors.indexOf(res.type) != -1 ? res.type : "danger";
        toast({ color, content: msgContent, mark: msgContent + url });
    };

    renderIframe = () => {
        const { iframeUrl, isLessThanLicense, toggleFlag } = this.state;
        if (isLessThanLicense == "false" || !toggleFlag) return null;
        return (
            <iframe
                onLoad={this.handleIfameLoaded}
                fieldid="graphic_iframe"
                ref={(r) => (this.graphicRef = r)}
                src={iframeUrl}
                style={{ width: "100%", height: "100%" }}
                allowFullScreen="true"
                sandbox
            />
        );
    };

    getElement = () => {
		return document.querySelector('#graphicAppContainer');
	}

    render() {
        const { isLessThanLicense, loadingStatus } = this.state;
        const {needLoading} = this.props
        return (
            <div className="graphic-app" id="graphicAppContainer">
                {isLessThanLicense == "false" ? (
                    <EmptyComponent
                        message={this.state.licenseMultiLang["100304-000000"]}
                    />
                ) : null}
                <React.Fragment>
                    {this.renderIframe()}
                    {needLoading && <NCLoading
                        size="md"
                        showBackDrop={true}
                        container={this.getElement}
                        show={loadingStatus}
                    />}
                </React.Fragment>
            </div>
        );
    }
}

GraphicReport.propTypes = {
    needLoading: PropTypes.bool
}
GraphicReport.defaultProps = {
    needLoading: true // 默认需要loading
}
export default GraphicReport;
