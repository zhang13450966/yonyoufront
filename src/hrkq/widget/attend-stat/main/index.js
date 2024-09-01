/**
 * @desc: 部门假勤统计
 */
import React, {Component} from 'react';
import {createPage} from 'nc-lightapp-front';
import Axios from "axios";
//import style, {sticker, title, hrfont, echartContainer, worktimeTitle} from './index.less';
// import echarts from 'echarts'
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
import './index.less'
import {debounce} from "../../../../hrpub/common/utils/utils";

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [0, 0, 0, 0, 0],
            period: this.generatePeriod(),
            trend: {
                zh_CN: '平均工时变动趋势',
                zh_TW: '平均工時變動趨勢',
                en_US: 'Avg. Work Hrs Trend'
            },
            mounthI18n: {
                english: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            json: {},
            locale: 'simpchn'
        }
    }

    componentDidMount() {
        let locale = this.getCookie('langCode') || 'simpchn'
        this.setState({
            locale
        });
        this.echartLine = echarts.init(document.getElementById('attend_echart_line'));
        this.getLanguage(() => {
            this.getData();
            this.renderEchart();
        });
        window.addEventListener("resize", debounce(this.resizeEchart));
    }

    resizeEchart = () => {
        const ele = document.getElementById('attend_echart_line')
        this.echartLine.resize({
            width: ele.clientWidth,
            height: ele.clientHeight
        });
        this.renderEchart();
    }

    getCookie = (name) => {
        //匹配字段
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

        if ((arr = document.cookie.match(reg))) {
            return arr[2];
        } else {
            return null;
        }
    }
    generatePeriod = () => {
        let currentMonth = new Date().getMonth()
        let data = []
        let beginMonth = new Date(new Date().setMonth(currentMonth - 4)).getMonth()
        data.push(beginMonth + 1)
        for (let i = 1; i < 5; i++) {
            let value = new Date(new Date().setMonth(beginMonth + i)).getMonth() + 1
            data.push(value)
        }
        return data
    }
    getData = () => {
        Axios({
            url: '/ncchr/attendqueryRpt/queryAttendCtieRptVO',
            method: 'GET'
        }).then(res => {
            if (res.data) {
                if (res.data.data) {
                    let data = res.data.data
                    let period = []
                    let value = []
                    Object.keys(data).forEach(key => {
                        period.push(key)
                        value.push(data[key])
                    })
                    this.setState({
                        period,
                        data: value
                    })
                    this.renderEchart();
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    clickHandler(e) {
        e.preventDefault();
        window.top.openNew({appcode: '60656010'});
    }

    reRreshPage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.getData();
    }

    getGridWH = () => {
        let ele = document.getElementById('app');
        return {
            width: ele.clientWidth - 40,
            height: ele.clientHeight - 100
        }
    }

    renderEchart = () => {
        const {locale, mounthI18n, json} = this.state;
        let {width, height} = this.getGridWH();
        this.echartLine.setOption({
            title: {
                show: false,
            },
            toolbox: {
                show: false,
            },
            tooltip: {
                show: false,
            },
            grid: {
                left: '20px',
                right: '20px',
                bottom: '18px',
                top: '18px',
                containLabel: true,
                width: width,
                height: height
            },
            color: ['#4A5A69',],
            axisPointer: {triggerTooltip: false, triggerOn: 'none'},
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {show: false},
                axisLabel: {
                    formatter: function (value, index) {
                        if (locale === 'simpchn' || locale === 'tradchn') {
                            return value + json['widget-000016'] //'月'
                        } else {
                            return mounthI18n[locale] && mounthI18n[locale][value - 1]
                        }

                    }
                },
                axisLine: {lineStyle: {color: '#888888'},},
                data: this.getxAxisData(),
            },
            yAxis: {
                show: true,
                type: 'value',
                axisTick: {show: false},
                axisLabel: {
                    show: false
                },
                axisPointer: {triggerTooltip: false},
                // splitLine: {
                //     lineStyle: {
                //         color: '#ccc'
                //     },
                // },
                axisLine: {
                    show: false,
                    // lineStyle: {color: '#ccc'}
                },
            },
            series: [
                {
                    name: '部门假勤',
                    type: 'line',
                    smooth: false,
                    data: this.state.data,
                    areaStyle: {
                        normal: {
                            // 右下左上
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(74,90,105,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(207,241,255,0)'
                            }])
                        }
                    }
                }
            ]
        });
    }
    getxAxisData = () => {
        return this.state.period.map((value, index) => {
            let obj = {
                textStyle: {
                    fontSize: 12,
                    color: '#888888',
                }
            }
            obj['value'] = value;
            if (index === 0) {
                obj.textStyle['align'] = 'left';
            } else if (index + 1 === this.state.period.length) {
                obj.textStyle['align'] = 'right';
            }
            return obj;
        })
    }
    // 获取多语
    getLanguage = (cb) => {
        const {MultiInit} = this.props;
        MultiInit.getMultiLang({
            moduleId: 'hr-widget',
            domainName: 'hrkq',
            callback: (json, status, init) => {
                this.setState({
                    json: json
                })
                typeof (cb) === 'function' && cb();
            }
        });

    };

    render() {
        return (
            <div className={'sticker'} onClick={this.clickHandler}>
                <div className={'title'}>
                    {this.state.json['widget-00003']}{/* 部门假勤统计 */}
                </div>
                <div id={'attend_echart_line'} className={'echartContainer'}></div>
                <div>
                    <a>
                        <i className={'hrfont'} onClick={this.reRreshPage}>&#xe7d1;</i>
                        <span className={'worktimeTitle'}>{this.state.json['widget-00004']}{/* 平均工时变动趋势 */}</span>
                    </a>
                </div>
            </div>
        );
    }
}

let AttendStat = createPage({appAutoFocus: false})(Container)
ReactDOM.render(<AttendStat/>, document.querySelector('#app'));
