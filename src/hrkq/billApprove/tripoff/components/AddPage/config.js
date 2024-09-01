/**
 * 
 * 
 * 编辑页面配置文件
 * 
 */

 // actions
import MainAction from './actions/main';
import FormAction from '../../actions/turnToFormPage';

// 方法
import {render, connect} from '../../../../../hrpub/common/frame';

// 组件
import Layout from '../../../../../hrpub/common/components/Layout';

 export default {
     actions: {
        mainAct: MainAction,
        formAct: FormAction,
     },
     methods: {
        render,
        connect
     },
     components: {
        Layout
     }
 }