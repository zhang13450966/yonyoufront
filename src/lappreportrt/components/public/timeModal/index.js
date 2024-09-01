import React, { Component } from "react";
import { base, ajax, toast, pageTo, getMultiLang } from "nc-lightapp-front";
const { NCButton, NCModal, NCPopconfirm } = base;
import TaskForm from "./form";
import { getCurrentTime } from "./methods";
import TimeChooseModel from "./timeModal";
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");

export default class TimeModal extends Component {
    constructor(props) {
        super(props);
        this.prevPageTask = ""; //记录一下上一个点击的节点，取消时用
        this.pk_timingshare_task = ""; //对应的点击id
        this.appName =
            pageTo.getUrlParam("n") || pageTo.getSearchParam("n") || "";
        this.isDirty = false;
        this.state = {
            keyboard: true,
            timingList: [], //左侧列表
            status: "preview", //编辑态：'edit'  浏览态：''
            operType: "add",
            pageData: {
                taskName: "", //任务名称
                taskNote: "", //说明
                timeConfig: {}, //定时设置
                receivers: [], //接收人
                fileType: "0", //附件类型
                push_type: ["1"], //推送方式
                maxRowDataIsZeroSend: false, //无数据不发送
                taskExecRoom: {
                    isCurUser: "0", //用户 //当前用户0 or 接收人1
                    exectimezone: {}, //时区
                    execlanguage: {}, //语种
                },
                msgTitle: "", //消息标题
                msgVars: [], //消息标题下面的checkbox
                msgText: langCheck("reportTimeMultiLang", "100303-000087"), //消息正文
                instance_type: "5,0,4,", //实例命名方式
                instance_period: "7", //实例数据保留时间
            },
            copyPageData: {
                taskName: "", //任务名称
                taskNote: "", //说明
                timeConfig: {}, //定时设置
                receivers: [], //接收人
                fileType: "0", //附件类型
                push_type: ["1"], //推送方式
                maxRowDataIsZeroSend: false, //无数据不发送
                taskExecRoom: {
                    isCurUser: "0", //用户 //当前用户0 or 接收人1
                    exectimezone: {}, //时区
                    execlanguage: {}, //语种
                },
                msgTitle: "", //消息标题
                msgVars: [], //消息标题下面的checkbox
                msgText: langCheck("reportTimeMultiLang", "100303-000087"), //消息正文
                instance_type: "5,0,4,", //实例命名方式
                instance_period: "7", //实例数据保留时间
            }, //副本，取消时使用
        };
    }

    componentWillMount() {
        let callback = (json) => {
            window.reportTimeMultiLang = json;
        };
        getMultiLang({
            moduleId: 100303,
            currentLocale: "zh-CN",
            domainName: "lappreportrt",
            callback,
        });
    }

    componentDidMount() {
        const taskId = document.getElementById("taskNameRef");
        if (taskId) {
            setTimeout(() => {
                taskId.focus();
                taskId.select();
            }, 300);
        }

        this.getCurrentData();
    }

    getCurrentData = async () => {
        const timingList = await this.getListData();
        const defaultUnitValue = await getCurrentTime();
        const firstItem = timingList[0];

        this.state.defaultUnitValue = defaultUnitValue;

        if (firstItem) {
            this.pk_timingshare_task = firstItem.pk_timingshare_task;
            this.state.timingList = timingList;
            this.state.status = "preview";
            this.getPageData();
        } else {
            this.setState({
                status: "edit",
                operType: "add",
            });
        }
    };

    getPageData = () => {
        //获取右侧数据
        ajax({
            url: "/nccloud/report/widget/timingsharequerydataaction.do",
            data: {
                pk_timingshare_task:
                    this.pk_timingshare_task || this.prevPageTask,
            },
            success: (res) => {
                res.data.msgVars =
                    res.data && res.data.msgVars && res.data.msgVars.split(",");
                this.setState({
                    pageData: {
                        //...this.state.pageData,
                        ...res.data,
                    },
                });
            },
        });
    };

    getListData = () => {
        //获取列表数据
        return new Promise((resolve) => {
            ajax({
                url: "/nccloud/report/widget/timingsharequeryaction.do",
                data: {
                    pk_report: this.props.commonParams.pk_report,
                },
                success: (res) => {
                    let { taskList = [] } = res.data;
                    resolve(taskList);
                },
            });
        });
    };

    emptyFun = () => {
        //清空pageData
        this.state.pageData.taskName = "";
        this.state.pageData.taskNote = "";
        this.state.pageData.timeConfig = {};
        this.state.pageData.receivers = [];
        this.state.pageData.fileType = "0";
        this.state.pageData.msgTitle = "";
        this.state.pageData.msgVars = [];
        this.state.pageData.msgText = langCheck(
            "reportTimeMultiLang",
            "100303-000087"
        );
        this.state.pageData.instance_type = "5,0,4,";
        this.state.pageData.instance_period = "7";
        this.state.pageData.push_type = ["1"];
        this.state.pageData.querycondition = {};
        this.state.pageData.taskExecRoom.isCurUser = "0";
        this.state.pageData.taskExecRoom.exectimezone = {};
        this.state.pageData.taskExecRoom.execlanguage = {};
        this.refs.timeChooseModal &&
            this.refs.timeChooseModal.setTimeDataNull();
    };

    onSaveAndAdd = () => {
        //确定并新增
        this.saveData("saveAndAdd");
    };

    onSaveInfo = () => {
        //确定
        this.saveData("save");
    };

    saveData = (way) => {
        //保存逻辑
        let { operType, pageData, defaultUnitValue } = this.state;
        if (pageData.taskName == "")
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000040"),
                color: "warning",
            });
        if (!pageData.timeConfig.occurType)
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000041"),
                color: "warning",
            });
        if (pageData.receivers.length < 1)
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000042"),
                color: "warning",
            });

        if (!pageData.push_type || pageData.push_type.length < 1)
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000085"),
                color: "warning",
            });

        if (pageData.push_type && Array.isArray(pageData.push_type))
            pageData.push_type = pageData.push_type.join(",");
        if (pageData.msgvars && Array.isArray(pageData.msgvars))
            pageData.msgvars = pageData.msgvars.join(",");

        if (!pageData.oid && operType === "add") {
            pageData = {
                ...pageData,
                ...this.props.pageParams.queryInfo,
            };
        }

        if (!pageData.taskExecRoom.exectimezone.refcode) {
            pageData.taskExecRoom.exectimezone = {
                ...pageData.taskExecRoom.exectimezone,
                ...defaultUnitValue,
            };
        }

        let pageParams = Object.assign({}, pageData);
        pageParams.receivers = [];

        pageData.receivers.map((item) => {
            pageParams.receivers.push({
                refname: item.refname,
                refpk: item.refpk,
            });
        });
        if (
            pageParams.taskExecRoom.exectimezone &&
            pageParams.taskExecRoom.exectimezone.values
        )
            delete pageParams.taskExecRoom.exectimezone.values;
        if (
            pageParams.taskExecRoom.execlanguage &&
            pageParams.taskExecRoom.execlanguage.values
        )
            delete pageParams.taskExecRoom.execlanguage.values;
        let querycondition =
            pageParams.querycondition &&
            pageParams.querycondition.conditions &&
            pageParams.querycondition.conditions.length
                ? pageParams.querycondition
                : this.props.pageParams.queryInfo &&
                  this.props.pageParams.queryInfo.querycondition;
        if (!querycondition) {
            if (!this.searchAreaIsClick) {
                return toast({
                    content: langCheck("reportTimeMultiLang", "100303-000088"),
                    color: "warning",
                });
            }
            querycondition = { logic: "and", conditions: [] };
        }
        let data = {
            ...this.props.commonParams,
            appName: this.appName,
            operType,
            maxrow: this.props.maxrow,
            ...pageParams,
            querycondition,
            timeZones: -new Date().getTimezoneOffset(),
        };
        ajax({
            url: "/nccloud/report/widget/timingshareaction.do",
            data,
            success: async (res) => {
                toast({
                    content: langCheck("reportTimeMultiLang", "100303-000043"),
                    color: "success",
                });
                if (way == "save") {
                    this.pk_timingshare_task = res.data.pk_timingshare_task;
                    this.state.status = "preview";
                } else {
                    this.pk_timingshare_task = "";
                    this.prevPageTask = res.data.pk_timingshare_task;
                    this.state.operType = "add";
                    this.emptyFun();
                }
                const timingList = await this.getListData();
                this.setState({
                    timingList,
                });
            },
        });
    };

    onCancel = () => {
        //取消
        const { timingList } = this.state;
        if (!timingList.length) {
            if (!this.isDirty) {
                this.onHide();
                return;
            }
            this.setState({
                pageData: {
                    ...this.state.copyPageData,
                },
            });
            this.isDirty = false;
            return;
        }
        this.isDirty = false;
        this.state.operType = "update";
        this.state.status = "preview";
        this.getPageData();
    };

    addTask = () => {
        //新增任务
        this.searchAreaIsClick = false;
        this.emptyFun();
        this.state.operType = "add";
        this.setState({
            status: "edit",
        });
    };

    onEdit = (e, pk_timingshare_task) => {
        //编辑
        e.stopPropagation();
        this.searchAreaIsClick = true;
        this.pk_timingshare_task = pk_timingshare_task;
        this.state.status = "edit";
        this.state.operType = "update";
        this.getPageData();
    };

    onDelete = (e, pk_timingshare_task) => {
        //删除
        e.stopPropagation();
        ajax({
            url: "/nccloud/report/widget/timingsharedeleteaction.do",
            data: {
                pk_timingshare_task,
            },
            success: async (res) => {
                toast({
                    content: langCheck("reportTimeMultiLang", "100303-000044"),
                    color: "success",
                });
                this.state.status = "none";
                const timingList = await this.getListData();
                this.setState({
                    timingList,
                });
            },
        });
    };

    changeLi = (pk_timingshare_task, index) => {
        //切换右侧数据
        this.prevPageTask = this.pk_timingshare_task;
        if (this.pk_timingshare_task == pk_timingshare_task) return;
        this.state.status = "preview";
        this.pk_timingshare_task = pk_timingshare_task;
        this.emptyFun();
        this.getPageData();
    };

    onChange = (way, val) => {
        this.isDirty = true;
        switch (way) {
            case "isCurUser":
            case "exectimezone":
            case "execlanguage":
                this.setState({
                    pageData: {
                        ...this.state.pageData,
                        taskExecRoom: {
                            ...this.state.pageData.taskExecRoom,
                            [way]: val,
                        },
                    },
                });
                break;
            default:
                this.setState({
                    pageData: {
                        ...this.state.pageData,
                        [way]: val,
                    },
                });
                break;
        }
    };

    onSearchChange = (queryInfo) => {
        this.searchAreaIsClick = true;
        if (!queryInfo) return;
        this.setState({
            pageData: {
                ...this.state.pageData,
                ...queryInfo,
            },
            status: "edit",
        });
    };

    showTimeModal = () => {
        this.refs.timeChooseModal.onOpen(this.state.pageData);
    };

    onTimeModalEnter = (data) => {
        this.setState({
            pageData: {
                ...this.state.pageData,
                timeConfig: data,
            },
        });
    };

    onHide = () => {
        this.props.onTimeModalHide();
        this.isDirty = false;
    };

    render() {
        const { parentProps, ownReportParams, pageParams, show, commonParams } =
            this.props;
        if (!show) return null;
        const { DragWidthCom } = parentProps;
        const {
            timingList,
            pageData,
            status,
            operType,
            keyboard,
            defaultUnitValue,
        } = this.state;
        let disabledClass = status == "edit" ? "disabled" : "";
        return (
            <React.Fragment>
                <NCModal
                    fieldid="timer"
                    keyboard={keyboard}
                    size="lg"
                    show={show}
                    onHide={this.onHide}
                    //height={status == "preview" ? "528px" : "484px"}
                    className={`time-modal ${
                        status == "preview" ? "modal-padding" : ""
                    }`}
                >
                    <NCModal.Header className="report-modal-header" closeButton>
                        <NCModal.Title
                            fieldid={langCheck(
                                "reportTimeMultiLang",
                                "100303-000024"
                            )}
                        >
                            {langCheck("reportTimeMultiLang", "100303-000024")}
                            {/* 国际化处理： 定时分享*/}
                        </NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body
                        className={
                            status == "preview"
                                ? "has-resize-icon report-modal-body"
                                : "report-modal-body"
                        }
                    >
                        <DragWidthCom
                            leftDom={
                                <React.Fragment>
                                    <h4
                                        className={`nc-theme-area-bgc nc-theme-common-font-c add-task ${disabledClass}`}
                                        onClick={() => this.addTask()}
                                    >
                                        {langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000025"
                                        )}
                                        {/* 国际化处理： 任务列表*/}
                                        <span className="icon iconfont icon-tree-close" />
                                    </h4>
                                    {timingList.length > 0 && (
                                        <ul className="task-list">
                                            {timingList.map((item, index) => {
                                                return (
                                                    <li
                                                        className={`nc-theme-area-bgc nc-theme-area-split-bc task-list-item ${disabledClass} ${
                                                            this
                                                                .pk_timingshare_task ==
                                                            item.pk_timingshare_task
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span
                                                            title={
                                                                item.task_name
                                                            }
                                                            className="task-name"
                                                            onClick={() =>
                                                                this.changeLi(
                                                                    item.pk_timingshare_task,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            {item.task_name}
                                                        </span>
                                                        {status != "edit" && (
                                                            <span
                                                                className="icon iconfont icon-bianji"
                                                                onClick={(e) =>
                                                                    this.onEdit(
                                                                        e,
                                                                        item.pk_timingshare_task
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        {status != "edit" && (
                                                            <NCPopconfirm
                                                                onClose={(e) =>
                                                                    this.onDelete(
                                                                        e,
                                                                        item.pk_timingshare_task
                                                                    )
                                                                }
                                                                rootClose="true"
                                                                trigger="click"
                                                                placement="right"
                                                                content={langCheck(
                                                                    "reportTimeMultiLang",
                                                                    "100303-000045"
                                                                )}
                                                            >
                                                                {/* 国际化处理： 确定要删除吗？*/}
                                                                <span className="icon iconfont icon-shanchu" />
                                                            </NCPopconfirm>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </React.Fragment>
                            } //左侧区域dom
                            rightDom={
                                <React.Fragment>
                                    {status == "preview" ? (
                                        <React.Fragment>
                                            <TaskForm
                                                ownReportParams={
                                                    ownReportParams
                                                }
                                                commonParams={commonParams}
                                                status={status}
                                                pageData={pageData}
                                                onChange={this.onChange}
                                                onSearchChange={
                                                    this.onSearchChange
                                                }
                                                operType={operType}
                                                addQuerycondition={
                                                    pageParams.queryInfo
                                                }
                                                defaultUnitValue={
                                                    defaultUnitValue
                                                }
                                                parentProps={parentProps}
                                            />
                                        </React.Fragment>
                                    ) : status == "edit" ? (
                                        <React.Fragment>
                                            <TaskForm
                                                ownReportParams={
                                                    ownReportParams
                                                }
                                                commonParams={commonParams}
                                                showTimeModal={
                                                    this.showTimeModal
                                                }
                                                status={status}
                                                pageData={pageData}
                                                onChange={this.onChange}
                                                onSearchChange={
                                                    this.onSearchChange
                                                }
                                                operType={operType}
                                                addQuerycondition={
                                                    pageParams.queryInfo
                                                }
                                                defaultUnitValue={
                                                    defaultUnitValue
                                                }
                                                parentProps={parentProps}
                                            />
                                        </React.Fragment>
                                    ) : (
                                        <h1 className="task-perch">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000046"
                                            )}
                                            {/* 国际化处理： 请新增任务*/}
                                        </h1>
                                    )}
                                </React.Fragment>
                            } //右侧区域dom
                            defLeftWid="150px"
                        />
                    </NCModal.Body>
                    {status != "preview" && (
                        <NCModal.Footer className="report-modal-footer">
                            {status == "edit" && (
                                <React.Fragment>
                                    <NCButton
                                        style={{
                                            borderTopRightRadius: "0px",
                                            borderBottomRightRadius: "0px",
                                        }}
                                        fieldid="time_confirm"
                                        colors="primary"
                                        size="large"
                                        onClick={() => this.onSaveInfo()}
                                    >
                                        {langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000081"
                                        )}
                                    </NCButton>
                                    <NCButton
                                        style={{
                                            marginLeft: "0px",
                                            borderTopLeftRadius: "0px",
                                            borderBottomLeftRadius: "0px",
                                        }}
                                        fieldid="time_confirm"
                                        size="large"
                                        onClick={() => this.onSaveAndAdd()}
                                    >
                                        {langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000021"
                                        )}
                                    </NCButton>
                                    <NCButton
                                        fieldid="time_close"
                                        colors="second"
                                        size="large"
                                        onClick={() => this.onCancel()}
                                    >
                                        {langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000023"
                                        )}
                                    </NCButton>{" "}
                                </React.Fragment>
                            )}
                        </NCModal.Footer>
                    )}
                </NCModal>
                <TimeChooseModel
                    timingSet={pageData.timeConfig}
                    ref="timeChooseModal"
                    onTimeModalEnter={this.onTimeModalEnter}
                />
            </React.Fragment>
        );
    }
}
