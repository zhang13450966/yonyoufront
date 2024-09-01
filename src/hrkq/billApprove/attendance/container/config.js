/** 
 * 
 * container组件的配置文件
 * 
 */

// actions
import MainAction from '../actions/main';
import ButtonAction from '../actions/btn';
import FormAction from '../actions/turnToFormPage';

// 本节点组件
import AddPage from '../components/AddPage';
import FileManager from '../components/Uploader';

// 公用组件
import Layout from '../../../../hrpub/common/components/Layout';
import EmptyPage from '../../../../hrpub/common/components/emptyImg';

// 框架方法
import {createPage, high} from 'nc-lightapp-front';
import {render} from '../../../../hrpub/common/frame';

export default {
    actions: {
        mainAct: MainAction,
        btnAct: ButtonAction,
        formAct: FormAction,
    },
    components: {
        AddPage,
        FileManager,
        Layout,
        EmptyPage
    },
    methods: {
        createPage,
        high,
        render
    }
}