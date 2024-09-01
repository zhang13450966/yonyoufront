import React, { Component } from "react";
import { base, high, createPage, toast } from "nc-lightapp-front";
const { NCFormControl, NCRadio, NCCheckbox, NCIcon } = base;
const NCCheckboxGroup = NCCheckbox.CheckboxGroup;
const { Refer } = high;
const { ReferLoader } = Refer;
import UseridsRefer from "../../../public/uap/index.js";
import Utils from "@public/utils";
const { langCheck, sortNumber, chkstrlen } = Utils;
import { getExampleText, getInstanceText } from "./methods";
import Instance from "./Instance";
import CreateSearchContent from "../../ReportTable/components/CreateSearchContent";
require("./index.less");

class TaskForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onShowSearch = () => {
        const { meta, search, parentProps } = this.props;

        const cache = parentProps.meta.getMeta();
        if (cache && cache.light_report && cache.light_report.items.length) {
            meta.setMeta(cache, () => {
                search.openAdvSearch("light_report", true);
            });
        } else {
            toast({
                content: langCheck("reportMultiLang", "100301-000288"),
                color: "warning",
            });
        }
    };

    //高级查询确定事件
    clickSearchBtn = (props, items, type, queryInfo) => {
        if (items === "userControl" && window.keyReportParamWeb) {
            const { oid, queryAreaCode, querytype } = this.props.commonParams;

            const keys = Object.keys(window.keyReportParamWeb);

            const conditions = [
                {
                    field: "not_search",
                    value: {
                        firstvalue: "",
                        secondvalue: "",
                    },
                },
            ];
            if (window.keyReportParamWeb["pk_org"]) {
                conditions.unshift({
                    field: "pk_org",
                    value: {
                        firstvalue: window.keyReportParamWeb["pk_org"].value,
                        secondvalue: "",
                    },
                });
            }

            const displayArray = keys.filter((key) => key !== "pk_org");

            const queryconditionDisplay = displayArray.map((key) => {
                return {
                    def5: window.keyReportParamWeb[key].name,
                    display:
                        window.keyReportParamWeb[key].display ||
                        window.keyReportParamWeb[key].value,
                    field: key,
                    oprtype: "=",
                    value: {
                        firstvalue:
                            window.keyReportParamWeb[key].value ||
                            window.keyReportParamWeb[key].display,
                        secondvalue: "",
                    },
                };
            });

            if (window.userdefObj) {
                window.userdefObj.queryconditionDisplay = queryconditionDisplay;
            } else {
                window.userdefObj = {};
            }

            let obj = {
                oid,
                queryAreaCode,
                querytype,
                querycondition: { logic: "and", conditions },
                //hr报表特殊处理
                transSaveObject: "",
                userdefObj: window.userdefObj,
            };
            this.props.onSearchChange(obj);
            window.keyReportParamWeb = null;
            window.userdefObj = null;
            const dom = document.querySelector(".NC_searchAdvModalBox");
            if (dom) dom.classList.add("hideAdvModal");
        } else {
            this.props.onSearchChange(queryInfo);
        }
    };

    createConditions = () => {
        const { addQuerycondition, pageData } = this.props;
        const { querycondition, userdefObj = {} } = pageData;
        let dom,
            conditions = [];

        if (userdefObj.queryconditionDisplay) {
            //hr报表
            conditions = userdefObj.queryconditionDisplay;
        } else {
            if (
                querycondition &&
                querycondition.conditions &&
                querycondition.conditions.length > 0
            ) {
                conditions = querycondition.conditions.filter(
                    (item) => item.field !== "not_search"
                );
            } else if (addQuerycondition && addQuerycondition.querycondition) {
                let list = addQuerycondition.querycondition.conditions.filter(
                    (item) => item.field !== "not_search"
                );
                conditions = list;
            }
        }

        if (conditions.length) {
            dom = (
                <div className="time-info nc-theme-gray-area-bgc nc-theme-bbr-bc">
                    {conditions.map((item) => {
                        if (item.def5 || item.label) {
                            return (
                                <p>
                                    {item.def5 || item.label}：{item.display}
                                </p>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            );
        }
        return dom;
    };

    render() {
        const { status, pageData, defaultUnitValue } = this.props;
        const {
            taskName,
            taskNote,
            timeConfig,
            receivers,
            fileType,
            taskExecRoom,
            msgTitle,
            msgVars,
            msgText,
            instance_type,
            instance_period,
            push_type,
            maxRowDataIsZeroSend,
        } = pageData;
        let receiversText = "";
        receivers &&
            typeof receivers != "string" &&
            receivers.map((item) => {
                if (item && item.refname) {
                    receiversText += `${item.refname},`;
                }
            });
        let intervalStr = "";
        timeConfig.occuroccurDaySelect &&
            timeConfig.occuroccurDaySelect
                .split(",")
                .sort(sortNumber)
                .map((item) => {
                    if (timeConfig.occurType == "4") {
                        if (item == "0")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000014"
                                ) +
                                ",";
                        if (item == "1")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000056"
                                ) +
                                ",";
                        if (item == "2")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000057"
                                ) +
                                ",";
                        if (item == "3")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000058"
                                ) +
                                ",";
                        if (item == "4")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000059"
                                ) +
                                ",";
                        if (item == "5")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000060"
                                ) +
                                ",";
                        if (item == "6")
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000062"
                                ) +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000061"
                                ) +
                                ",";
                        if (item == "all")
                            intervalStr += langCheck(
                                "reportTimeMultiLang",
                                "100303-000055"
                            );
                    } else {
                        if (item == "0") {
                            intervalStr +=
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000039"
                                ) + ",";
                        } else {
                            intervalStr +=
                                item +
                                langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000066"
                                ) +
                                ",";
                        }
                    }
                });
        return (
            <div className="task-form" fieldid="time_form-area">
                <div style={{ display: "none" }}>
                    {CreateSearchContent.call(this, {
                        parentProps: this.props,
                        clickSearchBtn: this.clickSearchBtn,
                        statusChangeEvent: this.statusChangeEvent,
                        searchBtnName: langCheck(
                            "reportTimeMultiLang",
                            "100303-000022"
                        ),
                        isInTimeShare: true,
                    })}
                </div>
                <Instance
                    ref="instanceModal"
                    instance_type={instance_type}
                    onInstanceInsert={(val) =>
                        this.props.onChange("instance_type", val)
                    }
                />
                <div className="box large">
                    <span fieldid="taskName" className="lable">
                        {status == "edit" && (
                            <NCIcon type="uf-mi" className="mast" />
                        )}
                        {langCheck("reportTimeMultiLang", "100303-000000")}:
                    </span>{" "}
                    {/**任务名称 */}
                    {status == "edit" ? (
                        <NCFormControl
                            id="taskNameRef"
                            fieldid="taskName"
                            value={taskName}
                            onChange={(val) => {
                                if (chkstrlen(val) > 55) return;
                                this.props.onChange("taskName", val);
                            }}
                        />
                    ) : (
                        <span>{taskName}</span>
                    )}
                </div>

                <div className="box large">
                    <span fieldid="taskNote" className="lable">
                        {langCheck("reportTimeMultiLang", "100303-000001")}:
                        {/**说明 */}
                    </span>
                    {status == "edit" ? (
                        <NCFormControl
                            fieldid="taskNote"
                            value={taskNote}
                            onChange={(val) => {
                                if (chkstrlen(val) > 200) return;
                                this.props.onChange("taskNote", val);
                            }}
                        />
                    ) : (
                        <span>{taskNote}</span>
                    )}
                </div>

                <div className="box settings" style={{ padding: 0 }}>
                    <div className="title">
                        {status == "edit" && (
                            <NCIcon type="uf-mi" className="mast" />
                        )}
                        {langCheck("reportTimeMultiLang", "100303-000071")}
                    </div>
                    {status == "edit" && (
                        <span
                            onClick={this.onShowSearch}
                            style={{ cursor: "pointer", color: "#0073e1" }}
                        >
                            {langCheck("reportTimeMultiLang", "100303-000067")}
                        </span>
                    )}
                </div>

                {this.createConditions()}

                <div className="title settings">
                    {langCheck("reportTimeMultiLang", "100303-000006")}
                </div>
                {/**执行环境设置 */}
                <div className="box">
                    <div className="info">
                        <span className="lable" fieldid="exectimezone">
                            {langCheck("reportTimeMultiLang", "100303-000007")}:
                        </span>
                        {/**时区 */}
                        {status == "edit" ? (
                            <ReferLoader
                                fieldid="exectimezone"
                                refcode="uapbd/refer/pubinfo/TimezoneDefaultGridRef/index"
                                value={
                                    taskExecRoom.exectimezone.refname
                                        ? taskExecRoom.exectimezone
                                        : defaultUnitValue
                                }
                                onChange={(val) =>
                                    this.props.onChange("exectimezone", val)
                                }
                            />
                        ) : (
                            <span>
                                {taskExecRoom.exectimezone &&
                                    taskExecRoom.exectimezone.refname}
                            </span>
                        )}
                    </div>
                    <div className="info">
                        <span className="lable" fieldid="execlanguage">
                            {langCheck("reportTimeMultiLang", "100303-000008")}:
                        </span>
                        {/**语种 */}
                        {status == "edit" ? (
                            <ReferLoader
                                fieldid="execlanguage"
                                refcode="uap/refer/riart/multiLangDefaultTableRef/index"
                                value={taskExecRoom.execlanguage}
                                onChange={(val) =>
                                    this.props.onChange("execlanguage", val)
                                }
                            />
                        ) : (
                            <span>
                                {taskExecRoom.execlanguage &&
                                    taskExecRoom.execlanguage.refname}
                            </span>
                        )}
                    </div>
                </div>

                <div className="box settings" style={{ padding: 0 }}>
                    <div className="title">
                        {status == "edit" && (
                            <NCIcon type="uf-mi" className="mast" />
                        )}
                        {langCheck("reportTimeMultiLang", "100303-000003")}
                        {/*定时设置*/}
                    </div>
                    {status == "edit" && (
                        <span
                            style={{ cursor: "pointer", color: "#0073e1" }}
                            onClick={this.props.showTimeModal}
                        >
                            {langCheck("reportTimeMultiLang", "100303-000067")}
                        </span>
                    )}
                    {/**设置 */}
                </div>

                {timeConfig.occurType && (
                    <div className="time-info nc-theme-area-bgc nc-theme-area-split-bc">
                        <p className="time-info-p">
                            <span className="lable">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000063"
                                )}
                                :
                            </span>
                            {timeConfig.occurType == "3" && (
                                <span>
                                    {timeConfig.occurInterval}
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000050"
                                    )}
                                </span>
                            )}
                            {timeConfig.occurType == "4" && (
                                <span>
                                    {timeConfig.occurInterval}
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000035"
                                    )}{" "}
                                    - {intervalStr}
                                </span>
                            )}
                            {timeConfig.occurType == "5" && (
                                <span>
                                    {timeConfig.occurInterval}
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000015"
                                    )}{" "}
                                    - {intervalStr}
                                </span>
                            )}
                        </p>
                        <p className="time-info-p">
                            <span className="lable">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000028"
                                )}
                                :
                            </span>
                            {timeConfig.preDayFrequency == "RunOnce" && (
                                <span>
                                    {timeConfig.runOnceTime}（
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000068"
                                    )}
                                    ）{/**一次 */}
                                </span>
                            )}
                            {timeConfig.preDayFrequency == "RunCycle" && (
                                <span>
                                    {timeConfig.runCycleBeginTime} -{" "}
                                    {timeConfig.runCycleEndTime}（
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000069"
                                    )}
                                    {timeConfig.runCycleInterrval}
                                    {timeConfig.runCycleUnit == "2"
                                        ? langCheck(
                                              "reportTimeMultiLang",
                                              "100303-000037"
                                          )
                                        : langCheck(
                                              "reportTimeMultiLang",
                                              "100303-000038"
                                          )}
                                    ）
                                </span>
                            )}
                        </p>
                        <p className="time-info-p">
                            <span className="lable">
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000064"
                                )}
                                :
                            </span>
                            <span>
                                {timeConfig.expireBegin ||
                                    timeConfig.expireBeginDate}{" "}
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000065"
                                )}{" "}
                                {timeConfig.expireEnd ||
                                    timeConfig.expireEndDate ||
                                    "-"}
                            </span>
                        </p>
                    </div>
                )}

                {/* <div className="box settings" style={{ padding: 0 }}>
                    <div className="title">
                        {langCheck("reportTimeMultiLang", "100303-000072")}
                    </div>
                    <NCCheckbox
                        disabled={status !== "edit"}
                        checked={maxRowDataIsZeroSend}
                        onChange={val =>
                            this.props.onChange("maxRowDataIsZeroSend", val)
                        }
                    >
                        {langCheck("reportTimeMultiLang", "100303-000086")}
                    </NCCheckbox>
                </div> */}

                <div className="box">
                    <span className="lable" fieldid="receivers">
                        {status == "edit" && (
                            <NCIcon type="uf-mi" className="mast" />
                        )}
                        {langCheck("reportTimeMultiLang", "100303-000004")}:
                    </span>{" "}
                    {/**接收人 */}
                    {status == "edit" ? (
                        <UseridsRefer
                            queryCondition={{
                                isAllUserVisible: true,
                                showSysAdmin: "true",
                                showGroupAdmin: "true",
                            }}
                            fieldid="receivers"
                            value={receivers}
                            onChange={(val) =>
                                this.props.onChange("receivers", val)
                            }
                        />
                    ) : (
                        <span>{receiversText}</span>
                    )}
                </div>

                <div className="box">
                    <span className="lable" fieldid="isCurUser">
                        {langCheck("reportTimeMultiLang", "100303-000009")}:
                    </span>
                    <NCRadio.NCRadioGroup
                        name="isCurUser"
                        selectedValue={taskExecRoom.isCurUser}
                        onChange={(val) =>
                            this.props.onChange("isCurUser", val)
                        }
                    >
                        <NCRadio disabled={status !== "edit"} value={"0"}>
                            {langCheck("reportTimeMultiLang", "100303-000010")}
                        </NCRadio>
                        <NCRadio disabled={status !== "edit"} value={"1"}>
                            {langCheck("reportTimeMultiLang", "100303-000004")}
                        </NCRadio>
                    </NCRadio.NCRadioGroup>
                </div>

                <div className="box large">
                    <span className="lable" fieldid="msgTitle">
                        {langCheck("reportTimeMultiLang", "100303-000011")}:
                    </span>
                    {/**消息标题 */}
                    {status == "edit" ? (
                        <NCFormControl
                            fieldid="msgTitle"
                            value={msgTitle}
                            onChange={(val) => {
                                if (chkstrlen(val) > 200) return;
                                this.props.onChange("msgTitle", val);
                            }}
                        />
                    ) : (
                        <span>{msgTitle}</span>
                    )}
                </div>

                <div className="box checkbox-list">
                    <span className="lable" />
                    <NCCheckboxGroup
                        value={
                            Array.isArray(msgVars)
                                ? msgVars
                                : msgVars && msgVars.split(",")
                        }
                        onChange={(val) => this.props.onChange("msgVars", val)}
                    >
                        <NCCheckbox value="0" disabled={status !== "edit"}>
                            {langCheck("reportTimeMultiLang", "100303-000018")}
                            {/* 国际化处理： 报表名称*/}
                        </NCCheckbox>
                        <NCCheckbox value="1" disabled={status !== "edit"}>
                            {langCheck("reportTimeMultiLang", "100303-000000")}
                            {/* 国际化处理： 任务名称*/}
                        </NCCheckbox>
                        <NCCheckbox value="2" disabled={status !== "edit"}>
                            {langCheck("reportTimeMultiLang", "100303-000074")}
                            {/* 国际化处理： 实例名称*/}
                        </NCCheckbox>
                    </NCCheckboxGroup>
                </div>

                <div className="box large">
                    <span className="lable" fieldid="msgText">
                        {langCheck("reportTimeMultiLang", "100303-000020")}:
                    </span>
                    {/**消息正文 */}
                    {status == "edit" ? (
                        <NCFormControl
                            fieldid="msgText"
                            value={msgText}
                            onChange={(val) => {
                                if (chkstrlen(val) > 200) return;
                                this.props.onChange("msgText", val);
                            }}
                        />
                    ) : (
                        <span>{msgText}</span>
                    )}
                </div>

                <div className="box">
                    <span className="lable">
                        {status == "edit" && (
                            <NCIcon type="uf-mi" className="mast" />
                        )}
                        {langCheck("reportTimeMultiLang", "100303-000082")}
                    </span>
                    <NCCheckboxGroup
                        value={
                            Array.isArray(push_type)
                                ? push_type
                                : push_type && push_type.split(",")
                        }
                        onChange={(val) =>
                            this.props.onChange("push_type", val)
                        }
                    >
                        <NCCheckbox value="0" disabled={status !== "edit"}>
                            {langCheck("reportTimeMultiLang", "100303-000083")}
                        </NCCheckbox>
                        <NCCheckbox value="1" disabled={status !== "edit"}>
                            {langCheck("reportTimeMultiLang", "100303-000084")}
                        </NCCheckbox>
                    </NCCheckboxGroup>
                </div>

                <div className="box">
                    <span className="lable" fieldid="fileType">
                        {langCheck("reportTimeMultiLang", "100303-000005")}:
                    </span>
                    {/**附件类型 */}
                    {status == "edit" ? (
                        <NCRadio.NCRadioGroup
                            name="fileType"
                            selectedValue={fileType}
                            onChange={(val) =>
                                this.props.onChange("fileType", val)
                            }
                        >
                            <NCRadio value={"0"}>Excel</NCRadio>
                            <NCRadio value={"1"}>PDF</NCRadio>
                            <NCRadio value={"2"}>CSV</NCRadio>
                        </NCRadio.NCRadioGroup>
                    ) : (
                        <span>
                            {fileType == 0
                                ? "Excel"
                                : fileType == 1
                                ? "PDF"
                                : fileType == 2
                                ? "CSV"
                                : ""}
                        </span>
                    )}
                </div>

                <div className="title settings">
                    {langCheck("reportTimeMultiLang", "100303-000073")}
                </div>
                {/**实例设置 */}

                <div
                    className="box"
                    style={{ minHeight: "30px", height: "auto" }}
                >
                    <span className="lable" fieldid="instance_type">
                        {langCheck("reportTimeMultiLang", "100303-000075")}:
                    </span>
                    {status !== "edit" ? (
                        <p>{getInstanceText(instance_type)}</p>
                    ) : (
                        <div className="instance-box">
                            <div>{getInstanceText(instance_type)}</div>
                            <span
                                style={{
                                    cursor: "pointer",
                                    color: "#0073e1",
                                    marginLeft: "5px",
                                }}
                                onClick={() => {
                                    this.refs.instanceModal.openModal();
                                }}
                            >
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000067"
                                )}
                                {/* 国际化处理： 设置*/}
                            </span>
                        </div>
                    )}
                </div>

                <div className="box">
                    <span className="lable">
                        {langCheck("reportTimeMultiLang", "100303-000076")}:
                    </span>
                    <p className="instance-box">
                        {getExampleText(getInstanceText(instance_type)).text}
                    </p>
                </div>

                <div className="box">
                    <span className="lable">
                        {langCheck("reportTimeMultiLang", "100303-000077")}:
                    </span>
                    {status !== "edit" ? (
                        <p>
                            {instance_period}
                            {langCheck("reportTimeMultiLang", "100303-000050")}
                        </p>
                    ) : (
                        <div
                            className="instance-box"
                            style={{ flexWrap: "initial" }}
                        >
                            <NCFormControl
                                onChange={(val) => {
                                    val =
                                        val.length < 500 &&
                                        val.replace(/^(0+)|[^\d]+/g, "");
                                    this.props.onChange("instance_period", val);
                                }}
                                value={instance_period}
                            />
                            <span style={{ marginLeft: "5px" }}>
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000050"
                                )}
                            </span>
                            {/* 国际化处理： 天*/}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

TaskForm = createPage({})(TaskForm);
export default TaskForm;
