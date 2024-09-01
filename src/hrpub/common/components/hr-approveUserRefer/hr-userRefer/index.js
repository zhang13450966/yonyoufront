/*
 * @Descripttion: 审批流改派人参照
 * @version: 
 * @Author: hukai
 * @Date: 2020-03-24 15:20:18
 * @LastEditors: hukai
 * @LastEditTime: 2020-03-24 16:19:28
 */
import React, { Component } from 'react';
import HrReferLoader from '../../hr-refer/ReferLoader';

const refCode = 'nccloud/uap/refer/riart/userRefer/index'

class HrUserRefer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <HrReferLoader
                    ref="hr-refer-loader"
                    className="hr-refer-loader"
                    refcode={refCode}
                >
                </HrReferLoader>
            </div>
        )
    }

}

export default HrUserRefer