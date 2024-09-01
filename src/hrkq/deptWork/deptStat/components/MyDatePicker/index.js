import React, {Component} from 'react';
import {DatePicker} from 'tinper-bee';
import {locale} from './timer';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import 'moment/locale/en-au';
import moment from 'moment';
import './index.less';
import { localeLang } from './currentLocale';
switch (localeLang) {
    case 'simpchn':
        moment.locale('zh-cn');
        break;
    case 'english':
        moment.locale('en');
        break;
    case 'tradchn':
        moment.locale('zh-tw');
        break;
    default:
        moment.locale('zh-cn');
}

const {YearPicker, MonthPicker} = DatePicker;

export default function MyDatePicker(props){
    return <DatePicker
        locale={locale}
        {...props}
    />
}

export function MyYearPicker(props){
    return <YearPicker
        locale={locale}
        {...props}
    />
}
export function MyMonthPicker(props){
    return <MonthPicker
        locale={locale}
        {...props}
    />
}
