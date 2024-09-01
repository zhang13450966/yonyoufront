/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-物流组织-路由跳转  
 * @Date: 2020-01-17 09:45:52 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-02-12 14:53:54
 */
import {RenderRouter} from 'nc-lightapp-front';
import routes from './router';

(function main(routers,htmlTagid){
  RenderRouter(routers,htmlTagid);
})(routes,"app");
