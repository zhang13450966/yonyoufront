/**
 * Created by wanghongxiang on 2018/3/22.
 */
import React, {Component} from 'react';
import Img from './download.svg';
import {createPage } from 'nc-lightapp-front'
const locale = 'zh_CN'
const serviceCode = ''
const serviceType = ''
import {wrap, titleContainer, title, conLeft, iconL, textL, textL_below, conRight, iconR, svg} from './index.css'
const httpList = {
    'workbench.yyuap.com': 'http://hrcloud.yyuap.com',
    'www.diwork.com': 'https://hr.diwork.com',
    'workbench-daily.yyuap.com': ' https://hr-daily.yyuap.com'
};
const serverUrl = window.location.href.split('/')[2];
class Attend extends Component {
    constructor() {
        super();
        this.state = {
            staffNumber : '200',
            entryNum : '30',
            employeeMan: {
                zh_CN: '员工管理',
                zh_TW: '員工管理',
                en_US: 'Employee Management'
            },
            employeeCnt: {
                zh_CN: '在职员工数量',//在职员工数量
                zh_TW: '在職員工數量',
                en_US: 'Employees'
            },
            entryCnt: {
                zh_CN: '待入职人数',//
                zh_TW: '待入職人數',
                en_US: 'Number of To-Enroll'
            }
            
        };
        this.clickHandler = this.clickHandler.bind(this);
        this.reRreshPage = this.reRreshPage.bind(this);
    }
    toThousands(num) {
        if (!num || isNaN(num)) {
            return 0
        } else if (num<=999999){
            return (num).toString().replace(new RegExp(`(\\d)(?=(?:\\d{3})+$)`,'g'), '$1,');
        } else {
            return '999,999+'
        }
      }
    getErrCount(url, type) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);//http://workbench.yyuap.com
        xhr.withCredentials = true;
        xhr.send();
        xhr.onreadystatechange = () =>{
            if(xhr.readyState === 4 && xhr.status === 200){
                let getStatus = JSON.parse(xhr.responseText);
                let data = '';
                if (type) {
                    data = getStatus.data;
                } else {
                    data = getStatus.data.count;
                }
                data = this.toThousands(data)
                if (type) {
                    this.setState({
                        staffNumber : data,
                      })
                } else {
                    this.setState({
                        entryNum : data,
                      })
                }
            }else {
                if (type) {
                    this.setState({
                        staffNumber : this.state.staffNumber,
                      })
                } else {
                    this.setState({
                        entryNum : this.state.entryNum,
                      })
                }
            }
        }
    }
    componentDidMount(){
    //     this.getErrCount(httpList[serverUrl]+'/corehr-staff-mgr/corehr/staff/queryPowerStaffCount', true)
    //     this.getErrCount(httpList[serverUrl]+'/corehr-staff-process/corehr/entry/queryEntryCount', false)
    }
    clickHandler(e) {
        e.preventDefault();
        window.open('https://workbench-daily.yyuap.com/#/service/HRPA020/HRPA020')
    }
    reRreshPage (e) {
        e.preventDefault();
        e.stopPropagation();
        // this.componentDidMount();
        // this.getErrCount(httpList[serverUrl] + '/corehr-staff-mgr/corehr/staff/queryPowerStaffCount', true)
        // this.getErrCount(httpList[serverUrl] +'/corehr-staff-process/corehr/entry/queryEntryCount', false)
        // this.getErrCount('https://hr.diwork.com/corehr-staff-mgr/corehr/staff/queryPowerStaffCount', true)
        // this.getErrCount('https://hr.diwork.com/corehr-staff-process/corehr/entry/queryEntryCount', false)
    }
    render() {
        return (
            <div className="wrap" onClick={this.clickHandler}>
                <div className="titleContainer">
                    <div className="title">
                    {this.state.employeeMan[locale]}
                    </div>
                </div>
                <div className="conLeft">
                    <div className="iconL"></div>
                    <div className="textL">{this.state.staffNumber}</div>
                    <div className="textL_below">{this.state.employeeCnt[locale]}</div>
                    <div>
                        <a onClick={this.reRreshPage}>
                            <img className="svg" src={Img} />
                        </a>
                    </div>
                </div>
                <div className="conRight">
                    <div className="iconR"></div>
                    <div className="textL">{this.state.entryNum}</div>
                    <div className="textL_below">{this.state.entryCnt[locale]}</div>
                </div>
            </div>
        )
    }

}
// export default Attend;
let TestPage = createPage({})(Attend)
ReactDOM.render(<TestPage />, document.querySelector('#app'));

