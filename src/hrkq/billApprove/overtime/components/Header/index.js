
import React from 'react';
import './index.less';


import {render, connect} from '../../../../../hrpub/common/frame';

import {base} from 'nc-lightapp-front';

import HeaderAction from './actions/index';

const {
    NCSelect,
    NCDatePicker
} = base;

const {NCRangePicker} = NCDatePicker;

const {NCOption} = NCSelect;

const Wrapper = render({
    actions: {
        headerAct: HeaderAction
    }
})(({props, state, action}) => {

    const {overtime} = props;
    const statusList = action.headerAct.getOrderStatusList();
    const timeRangeList = action.headerAct.getOrderTimeRangeList();

    let timerRangeValue = (overtime.orderBeginTime && overtime.orderEndTime) ? [overtime.orderBeginTime, overtime.orderEndTime] : [];

    return (
        <div className="employing-header-middle-content">
            <span 
                className="header-middle-item-wrapper"
                style={{
                    width: '160px'
                }}
            >
                <NCSelect
                    multiple={true}
                    style={{
                        width: '160px'
                    }}
                    placeholder="单据状态"
                    onChange={action.headerAct.changeOrderStatus}
                    value={overtime.orderStatus}
                >
                    {statusList.map((item) => {
                        return (
                            <NCOption
                                key={item.key}
                            >
                                {item.label}
                            </NCOption>
                        );
                    })}
                </NCSelect>
            </span>
            <span className="header-middle-item-wrapper">
                <NCSelect
                    style={{
                        width: '140px'
                    }}
                    value={overtime.orderTimeRange}
                    onChange={action.headerAct.changeOrderRange}
                >
                    {Object.keys(timeRangeList).map((key) => {
                        return (
                            <NCOption
                                key={key}
                            >
                                {timeRangeList[key]}
                            </NCOption>
                        );
                    })}
                    
                </NCSelect>
            </span>
            <If condition={overtime.orderTimeRange === 'custom'}>
                <span 
                    className="header-middle-item-wrapper"
                    style={{
                        width: '213px'
                    }}
                >
                    <NCRangePicker
                        placeholder={'开始日期 - 结束日期'}
                        onChange={action.headerAct.changeOrderTime}
                        value={timerRangeValue}
                    />
                </span>
            </If>
        </div>
    );

});


export default connect(Wrapper);