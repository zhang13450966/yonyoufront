import React, { Component } from 'react';
// from nc
import { base, high } from 'nc-lightapp-front';
// css
import './index.less';
// components
import DateRange from 'src/hrkq/statistics/common/components/DateRange';

import { getCurMonthEndTs, getCurMonthStartTs, padDateTime } from 'src/hrkq/statistics/common/utils';

let { NCDatePicker, NCButton, NCModal } = base;
let { Refer } = high;

export default class extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            dateRanger: {
                beginValue: getCurMonthStartTs(),
                endValue: getCurMonthEndTs()
            }
        };

        ['onBeginValueChange', 'onEndValueChange'].forEach(fun => {
            if (typeof this[fun] == 'function') {
                this[fun] = this[fun].bind(this);
            }
        })
    }

    onBeginValueChange = (date) => {
        date = padDateTime(date)
        date = new Date(date).getTime();

        this.setState((state, props) => {
            let {
                dateRanger
            } = state;
            let {
                beginValue = dateRanger['beginValue'],
                endValue = dateRanger['endValue']
            } = props;

            beginValue = date;

            if (!endValue
                || endValue < beginValue) {
                endValue = beginValue;
            }

            props.onChange && props.onChange({
                beginValue,
                endValue
            });

            return {
                dateRanger: {
                    beginValue,
                    endValue
                }
            }
        });
    }

    onEndValueChange = (date) => {
        date = padDateTime(date, '1')
        date = new Date(date).getTime();

        this.setState((state, props) => {
            let { 
                dateRanger
            } = state;
            let {
                beginValue = dateRanger['beginValue'],
                endValue = dateRanger['endValue']
            } = props;

            endValue = date;

            if (!beginValue
                || beginValue > endValue) {
                beginValue = endValue;
            }

            props.onChange && props.onChange({
                beginValue,
                endValue
            });

            return {
                dateRanger: {
                    beginValue,
                    endValue
                }
            }
        });
    }

    //平台突然不支持传getTime的日期了，这块特殊处理一下，等平台支持了再去掉
    dateFormat = (date, format, locale) => {
        if (date === null || date === undefined) return '';
        if (isNaN(Number(date))) return date;
        date = new Date(Number(date));
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };
        if (/(Y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return format;
    };

    componentDidMount(){
        const { 
            state: {
                dateRanger
            }, 
            props:{
                onChange,
                beginValue = dateRanger['beginValue'],
                endValue = dateRanger['endValue']
        }} = this;

        onChange && onChange({
            beginValue,
            endValue
        });
    }

    render() {
        const {
            props,
            state: {
                dateRanger
            },
            props: {
                lang,
                format = 'YYYY-MM-DD',
                startPlaceholder = lang['hrkq-000002'],
                endPlaceholder = lang['hrkq-000003'],
                showTime = false,
                beginValue = dateRanger['beginValue'],
                endValue = dateRanger['endValue'],
                style = {},
            },
            state,
        } = this;


        return (
            <div class="date-range">
                <NCDatePicker
                    style={style}
                    showTime={showTime}
                    format={format}
                    value={this.dateFormat(beginValue, format)}
                    placeholder={startPlaceholder}
                    onChange={this.onBeginValueChange}
                />

                <span class="separator"></span>

                <NCDatePicker
                    style={style}
                    showTime={showTime}
                    format={format}
                    value={this.dateFormat(endValue, format)}
                    placeholder={endPlaceholder}
                    onChange={this.onEndValueChange}
                />
            </div>
        );
    }
}
