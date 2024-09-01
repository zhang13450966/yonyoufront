import React, { Component } from "react";
import { base, toast } from "nc-lightapp-front";
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");
import MonthCalendar from "./monthCalendar.js";
import moment from "moment";
import zhCN from "rc-calendar/lib/locale/zh_CN";

const {
    NCButton,
    NCModal,
    NCSelect,
    NCRadio,
    NCDatePicker,
    NCInputNumber,
    NCTimepicker,
    NCIcon,
    NCCheckbox,
} = base;
const NCOption = NCSelect.NCOption;
const format = "YYYY-MM-DD HH:mm:ss";
const formatHour = "HH:mm:ss";

//const optionChildren = [];

class TimeChooseModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChooseModel: false, //显示隐藏模态框
            maxOccurInterval: 7, //最大间隔
            runOnceTime: moment().format(formatHour), //发生一次时间时间点
            preDayFrequency: "RunOnce",
            occurType: "3", //间隔单位
            occurInterval: 1, //间隔单位数字
            occuroccurDaySelect: 1, //间隔频率 //'0,3,5'
            occuroccurWeek: [], //周间隔频率(前端展示用)
            occuroccurMonth: [], //月间隔频率(前端展示用)
            runCycleInterrval: "1", //一天内周期发生的频率数值
            runCycleUnit: "2", //一天内周期发生的频率单位 （小时2 分钟1）
            runCycleBeginTime: moment().format(formatHour), //周期开始时间
            runCycleEndTime: moment().format(formatHour), //周期结束时间
            expireBegin: moment().format("YYYY-MM-DD HH:mm:ss"), //有效期开始日期(前台展示使用)
            expireEnd: moment(
                new Date(
                    new Date(
                        new Date().getFullYear() +
                            "/" +
                            (new Date().getMonth() + 1) +
                            "/" +
                            new Date().getDate()
                    ).getTime() +
                        24 * 60 * 60 * 1000 -
                        1
                )
            ).format("YYYY-MM-DD HH:mm:ss"), //有效期结束日期(前台展示使用)
            expireBeginDate: "", // 有效期开始日期
            expireBeginTime: "", // 有效期开始时间
            expireEndDate: moment().format("YYYY-MM-DD HH:mm:ss"), // 有效期结束日期(永久有效为空)
            expireEndTime: "", // 有效期结束时间
            expireForever: false,
            json: {},
            inlt: null,
            optionChildren: [],
        };
        this.weekData = [];
        this.optionChildrenTrans = [];
    }

    setExpireEnd(timingSet) {
        if (timingSet.expireForever) {
            return "";
        } else {
            return timingSet.expireEnd
                ? `${timingSet.expireEnd}`
                : moment(
                      new Date(
                          new Date(
                              new Date().getFullYear() +
                                  "/" +
                                  (new Date().getMonth() + 1) +
                                  "/" +
                                  new Date().getDate()
                          ).getTime() +
                              24 * 60 * 60 * 1000 -
                              1
                      )
                  ).format("YYYY-MM-DD HH:mm:ss");
        }
    }
    setTimeDataNull() {
        this.setState({
            runOnceTime: moment().format(formatHour), //发生一次时间时间点
            preDayFrequency: "RunOnce",
            occurType: "3", //间隔单位
            occurInterval: 1, //间隔单位数字
            occuroccurDaySelect: 1, //间隔频率 //'0,3,5'
            occuroccurWeek: [], //周间隔频率(前端展示用)
            occuroccurMonth: [], //月间隔频率(前端展示用)
            runCycleInterrval: "1", //一天内周期发生的频率数值
            runCycleUnit: "2", //一天内周期发生的频率单位 （小时2 分钟1）
            runCycleBeginTime: moment().format(formatHour), //周期开始时间
            runCycleEndTime: moment().format(formatHour), //周期结束时间
            expireBegin: moment().format("YYYY-MM-DD HH:mm:ss"), //有效期开始日期(前台展示使用)
            expireEnd: moment(
                new Date(
                    new Date(
                        new Date().getFullYear() +
                            "/" +
                            (new Date().getMonth() + 1) +
                            "/" +
                            new Date().getDate()
                    ).getTime() +
                        24 * 60 * 60 * 1000 -
                        1
                )
            ).format("YYYY-MM-DD HH:mm:ss"), //有效期结束日期(前台展示使用)
            expireBeginDate: "", // 有效期开始日期
            expireBeginTime: "", // 有效期开始时间
            expireEndDate: moment().format("YYYY-MM-DD HH:mm:ss"), // 有效期结束日期(永久有效为空)
            expireEndTime: "", // 有效期结束时间
            expireForever: false,
        });
    }
    handleInterval(value) {
        //修改间隔单位前数字
        this.setState({ occurInterval: value });
    }
    handleChange(value, val) {
        this.setState({ value1: value });
    }

    handleSelDay(value) {
        //天数增减
        this.setState({ occurInterval: value });
    }

    handleIntervalTime(value) {
        //间隔时间单位
        this.setState({
            occurType: value,
            occurInterval: 1,
            occuroccurWeek: [],
        });
        if (value == "3" || value == "4") {
            this.setState({ maxOccurInterval: 7 });
        }
        if (value == "5") {
            this.setState({ maxOccurInterval: 12 });
        }
    }

    handleHappenFrequency(value) {
        //发生频率
        this.setState({ preDayFrequency: value });
    }

    handleEndForever(value) {
        //截止时间永久有效
        this.setState(
            {
                expireEnd: value ? "" : moment().format("YYYY-MM-DD HH:mm:ss"),
                expireForever: !!value,
            },
            () => {
                this.render();
            }
        );
    }

    handleCycleBeginTime(value) {
        //设置周期开始
        this.setState({ runCycleBeginTime: value });
    }

    handleCycleEndTime(value) {
        //设置周期结束时间
        this.setState({ runCycleEndTime: value });
    }
    onChangeEndTime(value) {
        this.setState({ expireEnd: value });
    }
    onChangeStartTime(value) {
        this.setState({ expireBegin: value });
    }
    saveModelInfo() {
        //保存模板信息
        let {
            expireBegin,
            expireEnd,
            preDayFrequency,
            runOnceTime,
            runCycleBeginTime,
            runCycleEndTime,
        } = this.state;
        if (expireBegin && expireBegin.indexOf(" ") < 0)
            this.state.expireBegin += " 00:00:00";
        if (expireEnd && expireEnd.indexOf(" ") < 0)
            this.state.expireEnd += " 23:59:59";
        if (!expireBegin)
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000070"),
                color: "warning",
            });
        if (preDayFrequency === "RunOnce" && !runOnceTime)
            return toast({
                content: langCheck("reportTimeMultiLang", "100303-000070"),
                color: "warning",
            });
        if (preDayFrequency === "RunCycle") {
            if (!runCycleEndTime || !runCycleBeginTime)
                return toast({
                    content: langCheck("reportTimeMultiLang", "100303-000070"),
                    color: "warning",
                });
        }
        this.state.maxOccurInterval =
            this.state.maxOccurInterval &&
            this.state.maxOccurInterval.toString();
        this.state.occurInterval =
            this.state.occurInterval && this.state.occurInterval.toString();
        let subModel = Object.assign({}, this.state, {
            occuroccurDaySelect:
                this.state.occurType == "4"
                    ? this.state.occuroccurWeek.join(",")
                    : this.state.occuroccurMonth.join(","),
            expireBeginDate: this.state.expireBegin.split(" ")[0],
            expireBeginTime: this.state.expireBegin.split(" ")[1],
            expireEndDate: this.state.expireEnd
                ? this.state.expireEnd.split(" ")[0]
                : "",
            expireEndTime: this.state.expireEnd
                ? this.state.expireEnd.split(" ")[1]
                : "",
            runCycleBeginTime: this.state.runCycleBeginTime, //.format(formatHour),
            runCycleEndTime: this.state.runCycleEndTime, //.format(formatHour),
            runOnceTime: this.state.runOnceTime, //.format(formatHour),
            expireForever: this.state.expireForever,
        });
        if (
            (this.state.occurType == "4" || this.state.occurType == "5") &&
            subModel.occuroccurDaySelect.length <= 0
        ) {
            toast({
                content: langCheck("reportTimeMultiLang", "100303-000051"),
                color: "warning",
            }); //'当发生频率为周/月时,必须至少指定一个发生日'
            return;
        }
        var cycleStartTime = new Date(Date.parse(this.state.runCycleBeginTime));
        var cycleEndTime = new Date(Date.parse(this.state.runCycleEndTime));
        if (+cycleEndTime <= +cycleStartTime) {
            toast({
                content: langCheck("reportTimeMultiLang", "100303-000052"),
                color: "warning",
            }); //周期截止时间不能早于开始时间
            return;
        }
        var startTime = new Date(Date.parse(this.state.expireBegin));
        var endTime = new Date(Date.parse(this.state.expireEnd));
        if (endTime <= startTime) {
            toast({
                content: langCheck("reportTimeMultiLang", "100303-000053"),
                color: "warning",
            }); //生效截止时间不能早于开始时间
            return;
        }

        this.props.onTimeModalEnter(subModel);
        this.onClose();
    }

    onClose = () => {
        this.setState({ showChooseModel: false });
    };

    onOpen = (data) => {
        const { timeConfig } = data;
        let timingSet = timeConfig;
        if (timingSet && Object.keys(timingSet).length) {
            this.state = Object.assign({}, timingSet, {
                occuroccurWeek:
                    timingSet.occurType == 4 &&
                    timingSet.occuroccurDaySelect.indexOf(",") != -1
                        ? timingSet.occuroccurDaySelect.split(",")
                        : timingSet.occuroccurDaySelect == null ||
                          timingSet.occuroccurDaySelect == ""
                        ? []
                        : [timingSet.occuroccurDaySelect],
                occuroccurMonth:
                    timingSet.occurType == 5 &&
                    timingSet.occuroccurDaySelect.indexOf(",") != -1
                        ? timingSet.occuroccurDaySelect.split(",")
                        : timingSet.occuroccurDaySelect == null ||
                          timingSet.occuroccurDaySelect == ""
                        ? []
                        : [timingSet.occuroccurDaySelect],
                expireBegin: timingSet.expireBegin
                    ? `${timingSet.expireBegin}`
                    : moment().format("YYYY-MM-DD HH:mm:ss"),
                expireEnd: this.setExpireEnd(timingSet),
                runCycleBeginTime:
                    timingSet.runCycleBeginTime || moment().format(formatHour),
                //runCycleBeginTime: moment().hour(9).minute(0),
                runCycleEndTime:
                    timingSet.runCycleEndTime || moment().format(formatHour),
                runOnceTime:
                    timingSet.runOnceTime || moment().format(formatHour),
                expireForever: timingSet.expireForever,
            });
            this.setState(this.state);
        } else if (timingSet && !Object.keys(timingSet).length) {
            this.setTimeDataNull();
        }
        this.setState({ showChooseModel: true });
    };

    handleHanppenOnce(value) {
        //发生一次时间点修改
        this.setState({ runOnceTime: value });
    }

    handleCycleDate(value) {
        //周期发生频率数字修改
        this.setState({ runCycleInterrval: value });
    }

    handleCycleUnit(value) {
        //周期发生频率单位修改
        this.setState({ runCycleUnit: value });
    }

    handleSelWeekInfo(value) {
        //间隔频率 周时间设置
        if (value == "all") {
            let transArr = [];
            this.weekData.map((item) => {
                transArr.push(item.value);
            });
            this.setState({ occuroccurWeek: transArr });
        } else {
            const transArr = this.state.occuroccurWeek;
            this.state.occuroccurWeek.includes(value)
                ? transArr.splice(transArr.indexOf(value), 1)
                : transArr.push(value);
            this.setState({ occuroccurWeek: transArr });
        }
    }

    handleDeSelWeekInfo(value) {
        //间隔频率 取消周时间选中项
        const initArr = this.state.occuroccurWeek;
        this.state.occuroccurWeek.includes(value) &&
            initArr.splice(initArr.indexOf(value), 1);
        this.setState({ occuroccurWeek: initArr });
    }

    setExpireLast(val) {
        //周期时间选中最后一天
        const date = new Date();
        this.setState({
            [val]: new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            ).toString("yyyyMMdd"),
        });
    }

    ensureMonthChooose(value) {
        //月份时间选中确实
        this.setState({ occuroccurMonth: value });
    }

    render() {
        let {
            occuroccurWeek,
            occurType,
            occuroccurMonth,
            showChooseModel,
            occurInterval,
            maxOccurInterval,
            preDayFrequency,
            runOnceTime,
            runCycleInterrval,
            runCycleUnit,
            runCycleBeginTime,
            runCycleEndTime,
            expireBegin,
            expireEnd,
            expireForever,
        } = this.state;

        if (!showChooseModel) return null;

        let optionChildrenTrans = [
            <NCOption value="all">
                {langCheck("reportTimeMultiLang", "100303-000055")}
            </NCOption>,
        ]; /* 国际化处理： 全部*/
        this.weekData = [
            {
                label: langCheck("reportTimeMultiLang", "100303-000014"),
                value: "0",
            },
            {
                label: langCheck("reportTimeMultiLang", "100303-000056"),
                value: "1",
            },
            {
                label: langCheck("reportTimeMultiLang", "100303-000057"),
                value: "2",
            },
            {
                label: langCheck("reportTimeMultiLang", "100303-000058"),
                value: "3",
            },
            ,
            {
                label: langCheck("reportTimeMultiLang", "100303-000059"),
                value: "4",
            },
            {
                label: langCheck("reportTimeMultiLang", "100303-000060"),
                value: "5",
            },
            {
                label: langCheck("reportTimeMultiLang", "100303-000061"),
                value: "6",
            },
        ]; /* 国际化处理： 日,一,二,三,四,五,六*/
        this.weekData.map((item) => {
            optionChildrenTrans.push(
                <NCOption
                    key={item.toString()}
                    value={item.value}
                >{`${langCheck("reportTimeMultiLang", "100303-000062")}${
                    item.label
                }`}</NCOption>
            ); /* 国际化处理： 星期*/
        });

        let intervalTime = null;
        if (occurType == "3") {
            //天
            intervalTime = (
                <div className="form-input form-day">
                    {langCheck("reportTimeMultiLang", "100303-000036")}
                </div>
            );
        } else if (occurType == "4") {
            //周
            intervalTime = (
                <div className="form-input" style={{ width: 203 }}>
                    <NCSelect
                        fieldid="week_select"
                        fieldid="week_select"
                        multiple
                        // defaultValue={this.state.occuroccurWeek}
                        value={occuroccurWeek}
                        style={{ width: "100%" }}
                        onSelect={this.handleSelWeekInfo.bind(this)}
                        onDeselect={this.handleDeSelWeekInfo.bind(this)}
                        showClear={false}
                    >
                        {optionChildrenTrans}
                    </NCSelect>
                </div>
            );
        } else if (occurType == "5") {
            //月
            intervalTime = (
                <div
                    className="form-input"
                    style={{ width: 490, height: "auto" }}
                >
                    <MonthCalendar
                        selectedDay={occuroccurMonth}
                        onChange={this.ensureMonthChooose.bind(this)}
                    />
                </div>
            );
        }
        return (
            <div>
                <NCModal
                    fieldid="time"
                    size="lg"
                    show={showChooseModel}
                    className="prealert-time-choose-modal"
                >
                    <NCModal.Header>
                        <NCModal.Title>
                            <span
                                fieldid={`${langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000024"
                                )}_title`}
                            >
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000024"
                                )}
                            </span>
                            {/**定时分享 */}
                        </NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body
                        className="nc-theme-common-font-c time-modal-content"
                        fieldid="time_form-area"
                    >
                        <div className="form-item">
                            <p
                                fieldid="occurInterval"
                                className="form-label nc-theme-form-label-c"
                            >
                                <NCIcon type="uf-mi" className="mast" />
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000026"
                                )}
                                :
                            </p>
                            {/**间隔单位 */}
                            <div className="form-input">
                                <div
                                    className="form-input"
                                    style={{
                                        width: "120px",
                                        marginRight: "12px",
                                    }}
                                >
                                    <NCInputNumber
                                        fieldid="occurInterval"
                                        value={occurInterval}
                                        onChange={this.handleInterval.bind(
                                            this
                                        )}
                                        max={maxOccurInterval}
                                        min={1}
                                    />
                                </div>
                                <div className="form-input">
                                    <NCSelect
                                        fieldid="occurType_select"
                                        value={occurType}
                                        style={{ width: 70 }}
                                        onChange={this.handleIntervalTime.bind(
                                            this
                                        )}
                                        showClear={false}
                                        autofocus
                                    >
                                        <NCOption value="3">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000050"
                                            )}
                                        </NCOption>
                                        {/**天 */}
                                        <NCOption value="4">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000035"
                                            )}
                                        </NCOption>
                                        {/**周 */}
                                        <NCOption value="5">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000015"
                                            )}
                                        </NCOption>
                                        {/**月 */}
                                    </NCSelect>
                                </div>
                            </div>
                        </div>
                        <div className="form-item">
                            <p className="form-label nc-theme-form-label-c">
                                <NCIcon type="uf-mi" className="mast" />
                                {langCheck(
                                    "reportTimeMultiLang",
                                    "100303-000027"
                                )}
                                :
                            </p>
                            {/**间隔频率 */}
                            {intervalTime}
                        </div>
                        <div className="seper-region nc-theme-area-bgc nc-theme-area-split-bc">
                            <div className="form-item">
                                <p
                                    fieldid="preDayFrequency"
                                    className="form-label nc-theme-form-label-c"
                                >
                                    <NCIcon type="uf-mi" className="mast" />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000028"
                                    )}
                                    :
                                </p>
                                {/**发生方式 */}
                                <div className="form-input">
                                    <NCRadio.NCRadioGroup
                                        fieldid="preDayFrequency"
                                        selectedValue={preDayFrequency}
                                        onChange={this.handleHappenFrequency.bind(
                                            this
                                        )}
                                    >
                                        <NCRadio value="RunOnce">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000029"
                                            )}
                                        </NCRadio>
                                        {/**发生一次 */}
                                        <NCRadio value="RunCycle">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000030"
                                            )}
                                        </NCRadio>
                                        {/**周期发生 */}
                                    </NCRadio.NCRadioGroup>
                                </div>
                            </div>
                            <div className="form-item">
                                <p
                                    fieldid="time"
                                    className="form-label nc-theme-form-label-c"
                                >
                                    <NCIcon type="uf-mi" className="mast" />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000029"
                                    )}
                                    :
                                </p>
                                {/**发生一次 */}
                                <div className="form-input">
                                    <NCTimepicker
                                        fieldid="time"
                                        placeholder={langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000054"
                                        )}
                                        disabled={preDayFrequency != "RunOnce"}
                                        onChange={this.handleHanppenOnce.bind(
                                            this
                                        )}
                                        value={runOnceTime}
                                        format={formatHour}
                                    />
                                </div>
                            </div>
                            <div className="form-item">
                                <p
                                    fieldid="runCycleInterrval"
                                    className="form-label nc-theme-form-label-c"
                                >
                                    <NCIcon type="uf-mi" className="mast" />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000030"
                                    )}
                                    :
                                </p>
                                {/**周期发生 */}
                                <div
                                    className="form-input"
                                    style={{
                                        width: "120px",
                                        marginRight: "12px",
                                    }}
                                >
                                    <NCInputNumber
                                        fieldid="runCycleInterrval"
                                        min={1}
                                        value={runCycleInterrval}
                                        onChange={this.handleCycleDate.bind(
                                            this
                                        )}
                                        defaultValue={runCycleInterrval}
                                        disabled={preDayFrequency == "RunOnce"}
                                    />
                                </div>
                                <div className="form-input">
                                    <NCSelect
                                        fieldid="runCycleUnit"
                                        value={runCycleUnit}
                                        style={{ width: 90 }}
                                        onChange={this.handleCycleUnit.bind(
                                            this
                                        )}
                                        disabled={preDayFrequency == "RunOnce"}
                                        showClear={false}
                                        autofocus
                                    >
                                        <NCOption value="2">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000037"
                                            )}
                                        </NCOption>
                                        {/**小时 */}
                                        <NCOption value="1">
                                            {langCheck(
                                                "reportTimeMultiLang",
                                                "100303-000038"
                                            )}
                                        </NCOption>
                                        {/**分钟 */}
                                    </NCSelect>
                                </div>
                            </div>
                            <div className="form-item">
                                <p className="form-label nc-theme-form-label-c">
                                    <NCIcon type="uf-mi" className="mast" />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000031"
                                    )}
                                    :
                                </p>
                                <div
                                    className="form-input"
                                    style={{ width: 180 }}
                                >
                                    <NCTimepicker
                                        fieldid="cycleBeginTime"
                                        placeholder={langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000054"
                                        )}
                                        value={runCycleBeginTime}
                                        onChange={this.handleCycleBeginTime.bind(
                                            this
                                        )}
                                        disabled={preDayFrequency == "RunOnce"}
                                        format={formatHour}
                                    />
                                </div>
                                &nbsp; &nbsp; - &nbsp; &nbsp;
                                <div
                                    className="form-input"
                                    style={{ width: 180 }}
                                >
                                    <NCTimepicker
                                        fieldid="cycleEndTime"
                                        placeholder={langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000054"
                                        )}
                                        value={runCycleEndTime}
                                        onChange={this.handleCycleEndTime.bind(
                                            this
                                        )}
                                        disabled={preDayFrequency == "RunOnce"}
                                        format={formatHour}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="seper-region nc-theme-area-bgc nc-theme-area-split-bc"
                            style={{ flex: 1 }}
                        >
                            <div className="form-item">
                                <p className="form-label nc-theme-form-label-c">
                                    <NCIcon type="uf-mi" className="mast" />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000032"
                                    )}
                                    :
                                </p>
                                {/**生效开始时间 */}
                                <div
                                    className="form-input"
                                    style={{ width: 180 }}
                                >
                                    <NCDatePicker
                                        fieldid="expireBegin"
                                        className="time-setting"
                                        locale={zhCN}
                                        placeholder={langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000054"
                                        )}
                                        format={format}
                                        defaultValue={expireBegin}
                                        value={expireBegin}
                                        onChange={this.onChangeStartTime.bind(
                                            this
                                        )}
                                        renderFooter={() => {
                                            return (
                                                <span
                                                    onClick={this.setExpireLast.bind(
                                                        this,
                                                        "expireBegin"
                                                    )}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {langCheck(
                                                        "reportTimeMultiLang",
                                                        "100303-000039"
                                                    )}
                                                    {/**最后一天 */}
                                                </span>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-item">
                                <p className="form-label nc-theme-form-label-c">
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "16px",
                                            height: "16px",
                                        }}
                                    />
                                    {langCheck(
                                        "reportTimeMultiLang",
                                        "100303-000033"
                                    )}
                                    :
                                </p>
                                {/**生效截止时间 */}
                                <div
                                    className="form-input"
                                    style={{
                                        width: "180px",
                                        marginRight: "12px",
                                    }}
                                >
                                    <NCDatePicker
                                        fieldid="expireEnd"
                                        className="time-setting"
                                        locale={zhCN}
                                        placeholder={langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000054"
                                        )}
                                        format={format}
                                        value={expireEnd}
                                        disabled={this.state.expireForever}
                                        onChange={this.onChangeEndTime.bind(
                                            this
                                        )}
                                        renderFooter={() => {
                                            return (
                                                <span
                                                    onClick={this.setExpireLast.bind(
                                                        this,
                                                        "expireEnd"
                                                    )}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {langCheck(
                                                        "reportTimeMultiLang",
                                                        "100303-000039"
                                                    )}
                                                    {/**最后一天 */}
                                                </span>
                                            );
                                        }}
                                    />
                                </div>
                                <div
                                    className="form-input"
                                    style={{ paddingTop: "5px" }}
                                >
                                    <NCCheckbox
                                        fieldid="expireForever"
                                        style={{ marginLeft: "10px" }}
                                        defaultChecked={expireForever}
                                        checked={expireForever}
                                        onChange={this.handleEndForever.bind(
                                            this
                                        )}
                                    >
                                        {langCheck(
                                            "reportTimeMultiLang",
                                            "100303-000034"
                                        )}
                                        {/**永久生效 */}
                                    </NCCheckbox>
                                </div>
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton
                            fieldid="time_confirm"
                            colors="primary"
                            size="large"
                            onClick={this.saveModelInfo.bind(this)}
                        >
                            {langCheck("reportTimeMultiLang", "100303-000022")}
                        </NCButton>

                        <NCButton
                            fieldid="time_close"
                            colors="second"
                            size="large"
                            onClick={this.onClose}
                        >
                            {langCheck("reportTimeMultiLang", "100303-000023")}
                        </NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        );
    }
}

export default TimeChooseModel;
