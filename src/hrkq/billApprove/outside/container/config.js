/**
 *
 * container组件的配置文件
 *
 */

// actions
import MainAction from '../actions/main';
import FormAction from '../actions/turnToFormPage';
import BtnAction from '../actions/btn';

// 本节点组件
import AddPage from '../components/AddPage';
import FileManager from '../components/Uploader';

// 公用组件
import Layout from '../../../../hrpub/common/components/Layout';

// 框架方法
import {createPage} from 'nc-lightapp-front';
import {render} from '../../../../hrpub/common/frame';

export default {
    actions: {
        mainAct: MainAction,
        formAct: FormAction,
        btnAct: BtnAction
    },
    components: {
        AddPage,
        Layout,
        FileManager
    },
    methods: {
        createPage,
        render
    }
}