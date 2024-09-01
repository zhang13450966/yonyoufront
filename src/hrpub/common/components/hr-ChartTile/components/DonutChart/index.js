import React from "react";
import ReactEcharts from 'echarts-for-react';
import './index.less';
import {debounce} from "../../../../utils/utils";

export default class DonutChart extends React.Component {
    constructor(props) {
        super(props);
        this.more_lang = this.props.morepalceholder; //"更多"项的名称在多语环境下的具体取值 todo 写活
        this.legendItemTextLenMax = 0; //用于legendFormatter
        this.realItemNum = 0; //真正的（如有more展开，则指展开后的）数据元素个数。用于动态生成palette
        this.more_percentage = 0; //只要后端所返数据中有more属性，此值就要用，而与more是否展开无关。用于legendFormatter
    }

    onEvents = {
        legendselectchanged: (event, instance) => {
            instance.dispatchAction({
                type: 'legendSelect',
                name: event.name,
            }); //发生去选事件后立即派发选中事件来抵消其效果
            if (event.name === this.more_lang) {
                this.props.onMoreClick(instance);
            }
        }
    };

    expandMore = (data) => {
        const percentage = {
            ...data.percentage,
            ...data.percentage.more,
        };
        delete percentage.more;
        return {
            percentage,
            count: data.count
        };
    };

    calcMorePercentage = (data) => {
        const more_detail = data.percentage.more;
        let sum = 0;
        for (const i in more_detail) {
            sum += parseInt(more_detail[i]);
        }
        return sum;
    };

    restructureForEcharts = (data) => {
        const ret = [];
        const more_grouped = {
            name: this.more_lang,
            //value属性待会儿添加
        };
        for (const i in data.percentage) {
            if (i === 'more') {
                more_grouped.value = this.more_percentage;
            } else {
                ret.push({
                    name: i,
                    value: data.percentage[i]
                });
            }
        }
        if (typeof (more_grouped.value) !== 'undefined') {
            ret.push(more_grouped); //more_grouped必须位于数组seriesData的末尾
        }
        return ret;
    };

    prepareSeriesData = (data) => {
        let ret;
        if (data.percentage.more) {
            this.more_percentage = this.calcMorePercentage(data);
            if (this.props.revealMore) {
                ret = this.restructureForEcharts(this.expandMore(data));
                ret.push({
                    name: this.more_lang,
                    value: 0,
                    itemStyle: {
                        opacity: 0, //根本不绘制该弧段
                    },
                    tooltip: {
                        extraCssText: 'visibility: hidden', //根本不显示tooltip（'display: none'不管用，只能用这个）
                    }
                }); //折叠项展开后，仍然需要放回一个空的折叠项占位，否则无法与图例联动，但在视觉上要尽力隐藏它，假装不存在
            } else {
                ret = this.restructureForEcharts(data);
            }
        } else {
            ret = this.restructureForEcharts(data);
        }
        this.realItemNum = ret.length;
        return ret;
    };

    prepareLegendData = (data) => {
        const ret = [];
        for (let i in data.percentage) {
            // if(i.length > 6){
            //    i = i.substring(0,5) + '...';
            // }
            ret.push({
                name: i === 'more' ? this.more_lang : i,
                icon: 'circle'
            });


            if (i.length > this.legendItemTextLenMax) {
                this.legendItemTextLenMax = i.length;
            }
        }
        return ret;
    };

    getLegendFormatter = (data) => {
        let nothing = '...'
        let Max = 0
        for (let i in data.percentage) {
            // if (i.length > 6) {
            //     i = i.substring(0, 5) + nothing;
            // }
            if (i.length > Max) {
                Max = i.length;
            }
        }
        //   return (name) => (name === this.more_lang) ?
        //           `{more|${name}}{percentage|  |  ${this.more_percentage}%}`:
        //           `{name|${name + '   '.repeat(this.legendItemTextLenMax - name.length)}}{percentage|  |  ${data.percentage[name]}%}`;
        //除了"更多"项之外的标签名都补长到与最长的标签名一致。长度计算只考虑纯汉字的情况。
        return (name) =>
            (name === this.more_lang) ?
                `{more|${name}}{percentage|  |  ${this.more_percentage}%}` :
                `{name|${(name.length > Max) ? name.substring(0, 5) + nothing + '   '.repeat(2) : name + '   '.repeat(Max - name.length)}}{percentage|  |  ${data.percentage[name]}%}`;

    };

    getPalette = () => {
        const palette = [
            '#1890FF',
            '#13C2C2',
            '#2FC25B',
            '#FACC14',
            '#F04864',
            '#8543E0',
        ];
        for (let i = 0; i < this.realItemNum - 6; i++) {
            palette.push(palette[5]); //超出6个的部分，全都重复第6个的颜色
        }
        return palette;
    };

    getThemeColors = () => {
        //四通道颜色编码支持HEXA/RGBA，不支持AHEX
        const foreground_legend_more = 'rgba(7, 134, 255, 1)';
        return this.props.theme === 'dark' ?
            { //暗夜黑
                background: 'rgba(40,40,49,1)',
                background_tooltip: 'rgba(225,225,225,0.7)',
                foreground_title_subtext: 'rgba(255,255,255,0.85)',
                foreground_title_text: 'rgba(255,255,255,0.45)',
                foreground_legend_name: 'rgba(255,255,255, 0.65)',
                foreground_legend_percentage: 'rgba(255,255,255,0.45)',
                foreground_legend_more,
                foreground_tooltip_text: 'rgba(0, 0, 0, 0.85)',
                boxshadow_tooltip: 'rgba(255, 255, 255, 0.3)',

            } :
            { //非暗夜黑
                background: 'rgba(255,255,255,1)',
                background_tooltip: 'rgba(50,50,50,0.7)',
                foreground_title_subtext: 'rgba(0, 0, 0, 0.85)',
                foreground_title_text: 'rgba(0, 0, 0, 0.45)',
                foreground_legend_name: 'rgba(0, 0, 0, 0.65)',
                foreground_legend_percentage: 'rgba(0, 0, 0, 0.45)',
                foreground_legend_more,
                foreground_tooltip_text: 'rgba(255,255,255,0.85)',
                boxshadow_tooltip: 'rgba(0, 0, 0, 0.3)',
            }
    };

    prepareOption(data) {
        //****** 此部分依赖于特定执行顺序 ********
        let mainArr = Object.keys(data.percentage)
        let moreArr = Object.keys(data.percentage.more);
        let single = (moreArr.length + mainArr.length <= 2)
        const seriesData = this.prepareSeriesData(data);
        const palette = this.getPalette();
        //*************************************
        const legendData = this.prepareLegendData(data);
        const legendFormatter = this.getLegendFormatter(data);
        const themeColors = this.getThemeColors();
        let placeholder = this.props.placeholder;
        const {width, height} = this.getChartOpts()
        return {
            animation: true,
            title: {
                show: true,
                subtext: `{subtextStyle|${data.count}}`,
                subtextStyle: {
                    rich: {
                        subtextStyle: {
                            fontWeight: 400,
                            fontSize: 26,
                            lineHeight: 26,
                            color: themeColors.foreground_title_subtext,
                        }
                    }
                },
                text: `{textStyle|${placeholder || '总人数'}}`,
                textStyle: {
                    rich: {
                        textStyle: {
                            //fontWeight: 'normal',
                            fontSize: 14,
                            lineHeight: 22,
                            color: themeColors.foreground_title_text,
                        }
                    }
                },
                textAlign: 'center',
                left: (height * 0.85)/2 + 15,
                top: (height * 0.6)/2 - 10,
            },
            series: [{
                type: 'pie',
                hoverOffset: 9,
                minAngle: 2,
                label: {
                    normal: {show: false,},
                    emphasis: {show: false,},
                },
                itemStyle: {
                    borderColor: themeColors.background, //弧段描边颜色与背景色保持一致，以伪装成弧段缝隙
                    borderWidth: single ? 0 : 4,
                },
                emphasis: {
                    itemStyle: {
                        borderColor: themeColors.background, //强调色与非强调色保持一致
                    },
                },
                data: seriesData,
                radius: ['60%',  '85%'],
                center: [(height * 0.85)/2 + 20, '50%'],
            }],
            color: palette,
            legend: {
                show: true,
                formatter: legendFormatter,
                left: 'right',
                orient: 'vertical',
                align: 'left',
                textStyle: {
                    fontSize: 14,
                    lineHeight: 22,
                    rich: {
                        name: {
                            color: themeColors.foreground_legend_name,
                        },
                        percentage: {
                            color: themeColors.foreground_legend_percentage,
                        },
                        more: {
                            color: themeColors.foreground_legend_more,
                        }
                    },
                },
                itemGap: 16,
                selectedMode: true, //为了监听click事件，必须开启
                data: legendData,
                top: 'middle'
            },
            tooltip: {
                show: true,
                trigger: 'item', //不可改变，否则series.data中的元素没法再单独设置tooltip
                triggerOn: 'mousemove|click',
                transitionDuration: 0, //紧跟光标，别飘
                alwaysShowContent: false, //不可置true，否则再也没法消除
                hideDelay: 100,
                textStyle: {
                    color: themeColors.foreground_tooltip_text,
                },
                backgroundColor: themeColors.background_tooltip,
                extraCssText: `box-shadow: 0 0 3px ${themeColors.boxshadow_tooltip};`,
            }
        }
    }

    componentDidMount() {
        window.addEventListener("resize", debounce(this.resizeEchart));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
    }

    resizeEchart = () =>{
        this.setState({})
    }

    getChartOpts = () => {
        const ele = document.getElementById('app');
        let width = 0, height = 0;
        if (ele) {
            width = ele.clientWidth;
            height = ele.clientHeight - 65;
        }
        return {renderer: 'canvas', width: width, height: height}
    }

    render() {
        return (
            <div className={'echarts-container'} style={this.props.style}>
                <ReactEcharts
                    option={this.prepareOption(this.props.data)}
                    notMerge={false}
                    lazyUpdate={false}
                    opts={this.getChartOpts()}
                    onEvents={this.onEvents}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
        );
    }
}