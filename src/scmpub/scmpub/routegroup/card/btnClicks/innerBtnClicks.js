/*
 * @Author: 王勇 
 * @PageInfo: inner操作按钮控制  
 * @Date: 2020-02-08 00:03:04 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-08 00:05:50
 */
import { CARDBUTTONINFO } from '../../const/index';
import innerDelLineBtnClick from './innerDelLineBtnClick';
export default function innerBtnClicks(props, id, text, record, index){
    switch (id){
        case CARDBUTTONINFO.innerDelLineBtnCode:
            innerDelLineBtnClick.call(this,props,index);
            break;
    }
}