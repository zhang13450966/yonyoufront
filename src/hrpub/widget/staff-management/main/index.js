/**
 * Created by wanghongxiang on 2018/3/22.
 */
import React, {Component} from 'react';
import Img from './download.svg';
import { high, createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front'
import './index.css'
// import {
//         widgetId,
//         widgetName,
//         serviceCode,
//         serviceType,
// } from 'widgetInstance';
// import {dispatch} from 'widgetTool';
// import {locale} from 'widgetContext';
const locale = 'zh_CN'
const serviceCode = ''
const serviceType = ''

class Attend extends Component {
    constructor() {
        super();
        this.state = {
            staffNumber : '10',
            entryNum : '1',
            personMan: {
                zh_CN: '人员管理',
                zh_TW: '人員管理',
                en_US: 'Personnel Management'
            },
            employeeCnt: {
                zh_CN: '在职员工数量',
                zh_TW: '在職員工數量',
                en_US: 'Employees'
            },
            entryCnt: {
                zh_CN: '待入职人数',
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
        } else if(num<=999999){
          return (num).toString().replace(new RegExp(`(\\d)(?=(?:\\d{3})+$)`, 'g'), '$1,');
        }else{
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
                let data = ''
                if (type === 'staffNumber') {
                    data = getStatus.data;
                } else {
                    data = getStatus.data.count;
                }
                data = this.toThousands(data)
                if (type === 'staffNumber') {
                    this.setState({
                        staffNumber : data,
                      })
                } else {
                    this.setState({
                        entryNum : data,
                      })
                }
            }else {
                if (type === 'staffNumber') {
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
        // this.getErrCount('http://hrcloud.yyuap.com/corehr-staff-mgr/corehr/staff/queryTeamStaffCount', "staffNumber")
        // this.getErrCount('http://hrcloud.yyuap.com/corehr-staff-process/corehr/entry/queryTeamEntryCount', "entryNum")
        // this.getErrCount('https://hr.diwork.com/corehr-staff-mgr/corehr/staff/queryTeamStaffCount', "staffNumber")
        // this.getErrCount('https://hr.diwork.com/corehr-staff-process/corehr/entry/queryTeamEntryCount', "entryNum")
    }
    clickHandler(e) {
        e.preventDefault();
        window.open('https://workbench-daily.yyuap.com/#/service/HRPA020/HRPA020')     
    }
    reRreshPage (e) {
        e.preventDefault();
        e.stopPropagation();
        // this.getErrCount('http://hrcloud.yyuap.com/corehr-staff-mgr/corehr/staff/queryTeamStaffCount', "staffNumber")
        // this.getErrCount('http://hrcloud.yyuap.com/corehr-staff-process/corehr/entry/queryTeamEntryCount', "entryNum")
        // this.getErrCount('https://hr.diwork.com/corehr-staff-mgr/corehr/staff/queryTeamStaffCount', "staffNumber")
        // this.getErrCount('https://hr.diwork.com/corehr-staff-process/corehr/entry/queryTeamEntryCount', "entryNum")
    }
    render() {
        return (
            <div className="wrap" onClick={this.clickHandler}>
                <div className="titleContainer">
                    <div className="title">
                    {this.state.personMan[locale]}
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
