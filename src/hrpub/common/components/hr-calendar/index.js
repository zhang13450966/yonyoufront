/**
 * Created by hukai on 2019/11/05.
 */
import React, {Component} from 'react';
import {base,ajax,pageTo} from 'nc-lightapp-front'
import './index.less'

export default class HRCalendar extends Component {
    constructor(props) {
        super(props)
        this.state ={
            successArr: [],
            warningArr: [],
            errorArr: [],
            nextsuccessArr: [],
            nextwarningArr: [],
            nexterrorArr: [],
            preerrorArr: [],
            selectYear: new Date().getFullYear(),
            selectMonth: new Date().getMonth() +1,
        }
    }

    componentDidMount(){
        let data ={
            year: this.state.selectYear,
            month: this.state.selectMonth,
            pk_org: this.props.pk_org
            // responsible: this.props.responsible
        }
        this.getPayplan(data)
    }


    getPayplan =(data)=>{
        ajax({
            url: '/nccloud/hrwa/payplan/PayCalendarAction.do',
            data: data,
            success: ((res)=>{
                let data = res.data
                if(data){
                    this.setState({
                        successArr: data['green'],
                        warningArr: data['yellow'],
                        errorArr: data['red'],
                        nextsuccessArr: data['nextMonthGreen'],
                        nextwarningArr: data['nextMonthYellow'],
                        nexterrorArr: data['nextMonthRed'],
                        preerrorArr: data['lastMonthRed']
                    })
                }
            })
        })
    }


    onSelect =(value)=>{
        // window.parent.openNew({appcode:'60131000'})
        pageTo.openTo('/nccloud/resources/hrwa/wapayment/account/main/index.html?',{
            appcode: '60131000',
            pagecode: '60131001p',
            pk_org: this.props.pk_org
        })
    }

    onChange =(opt)=>{
        let date = new Date(opt._d)
        let month = date.getMonth() +1
        let year = date.getFullYear()
        this.setState({
            selectYear: year,
            selectMonth: month,
        },()=>{
            let data = {
                year: year,
                month: month,
                pk_org: this.props.pk_org
                // responsible: this.props.responsible
            }
            this.getPayplan(data)
        })
    }


    render() {
        const {NCCalendar} = base
        const {successArr,warningArr,errorArr,selectYear,selectMonth,preerrorArr,nextsuccessArr,nextwarningArr,nexterrorArr} = this.state

        const dateCellContentRender = (e)=>{
            let data = new Date(e._d)
            let day = data.getDate()
            let month = data.getMonth() +1
            let year = data.getFullYear()
            let className = ''
            // console.log(year,month,day,selectYear,selectMonth)
            // console.log(successArr,warningArr,errorArr,preerrorArr,nextsuccessArr,nextwarningArr,nexterrorArr)
            if(year === selectYear &&　month === selectMonth){
                if(successArr && successArr.indexOf(day.toString()) >-1){
                    className = 'success-div'
                }else if(warningArr && warningArr.indexOf(day.toString())>-1){
                    className = 'warning-div'
                }else if(errorArr && errorArr.indexOf(day.toString())>-1){
                    className = 'error-div'
                }
            }
            if((selectMonth === 1 && year === selectYear - 1 &&　month === 12) || (selectMonth !== 1 && year === selectYear && month === selectMonth -1)){
                if(preerrorArr && preerrorArr.indexOf(day.toString())>-1){
                    className = 'error-div'
                }
            }
            if((selectMonth === 12 && year === selectYear +1  &&　month === 1) || (selectMonth !== 12 && year === selectYear && month === selectMonth +1)){
                if(nextsuccessArr && nextsuccessArr.indexOf(day.toString()) >-1){
                    className = 'success-div'
                }else if(nextwarningArr && nextwarningArr.indexOf(day.toString())>-1){
                    className = 'warning-div'
                }else if(nexterrorArr && nexterrorArr.indexOf(day.toString())>-1){
                    className = 'error-div'
                }
            }
            return (
                <div className={className}>
                    {day}
                </div>
            )             
        }

        return (
            <div className ={this.props.className} >
                <NCCalendar
                    fullscreen = {true}
                    defaultType = {'date'}
                    onSelect = {this.onSelect}
                    onChange = {this.onChange}
                    dateCellContentRender ={(e)=>dateCellContentRender(e)}
                ></NCCalendar>
            </div>
        )
    }
}