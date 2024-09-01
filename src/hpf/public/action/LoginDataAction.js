/**
 * 公共登录信息获取action
 * @author zhangchxc
 * */
import {COMMON_PARAM_TYPE} from "../enum";
import {ajax} from 'nc-lightapp-front';
/**
 * 获取当前登陆人信息
 * */
export function getUser(){
    return getData(COMMON_PARAM_TYPE.USER);
}

/**
 * 获取当前登录人所属业务单元
 * */
export function getOrg(){
    return getData(COMMON_PARAM_TYPE.ORG);
}

/**
 * 获取当前登陆人所属集团
 * */
export function getGroup(){
    return getData(COMMON_PARAM_TYPE.GROUP);
}

/**
 * 获取当前登陆人所属部门
 * */
export function getDept(){
    return getData(COMMON_PARAM_TYPE.DEPT);
}

/**
 * 获取登录信息
 * @param {String} type 参数类型
 * */
function getData(type){
    let reqParam=new Object();
    reqParam.type=type;
    return new Promise((resolve, reject)=>{
        ajax({
            url: '/nccloud/hpf/pub/loginData.do',
            data: reqParam,
            success: (res) => {
                resolve(res);
            },
            error:(error)=>{
                reject(error);
            }
        });
    });

}