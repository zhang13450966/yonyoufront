/*
 * @Descripttion: 审批流加签人参照
 * @version: 
 * @Author: hukai
 * @Date: 2020-03-24 15:20:18
 * @LastEditors: hukai
 * @LastEditTime: 2020-03-24 16:19:17
 */
import React, { Component } from 'react';
import HrReferLoader from '../../hr-refer/ReferLoader';

const refCode = 'nccloud/uap/refer/riart/userReferWithDeptAndOrg/index'

class HrAddUserRefer extends Component {
    constructor(props) {
        super(props)
        this.state = {value:null}
    }
    
    render() {
        return (
            <div>
                <HrReferLoader
                    ref="hr-refer-loader"
                    className="hr-refer-loader"
                    refcode={refCode}
                    value={this.state.value}
                    onChange = {(org)=>{
                        this.setState({
                            value:org
                        })
                    }}
                >
                </HrReferLoader>
            </div>
        )
    }

}

export default HrAddUserRefer