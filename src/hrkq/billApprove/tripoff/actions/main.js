import Constant from './constant';
import HrPubCommon from '../../../../hrpub/common/actions';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()
export default class MainAction extends HrPubCommon {
    constructor(comp) {
        super();
        this.comp = comp;
    }

    extend = [Constant]

    appConfig = {
        pagecode,
        appcode
    }

    update = async (obj) => {
        const {props} = this.comp;
        const {dispatch} = props;

        await dispatch({
            type: 'tripoff/update',
            payload: obj
        });
    }
    // 处理模版
    processTemplate = (res) => {
        return this.selfProcessTemplate(res);
    }

    // 获取多语
    getCurrentLanguage = () => {
        this.getLanguage('hrkq-approve', 'hrkq').then((json,status, init) => {
            this.update({
                language: json
            })
        });
    }

    // 获取模版信息
    getTemplate = () => {
        this.getMultiTemplate(this.reqData)
            .then((res) => {
                this.update({
                    context: res.context
                });
                // this.afterGetTemplate();
            });
    }

    // 当模版获取并设置完成之后的回调函数
    afterGetTemplate = () => {
        this.getFormData();
    }
    // 处理模版数据
    selfProcessTemplate = (res) => {
        res.template['tripoff_approve_card'].items.forEach(item => {
            if (item.attrcode === 'tripday' || item.attrcode === 'tripoffday') {
                item.itemtype = 'input'
            }
        })           
        
        return res.template
    }
    // 初始化
    didMount = () => {
        this.getTemplate();
        this.getCurrentLanguage();
    }

    /**
     * @desc: 根据id查询详情
     * @param {type} 
     * @return: 
     */
    getFormData = async () => {
        const {props, action} = this.comp;
        const {getUrlParam} = props;

        let scene = getUrlParam('scene');
        let id = getUrlParam('id');
        let status = getUrlParam('status');

        let methodsName = status === 'browse' ? 'toBrowsePage' : 'toEditPage'
        
        action.formAct[methodsName](id);
    }
}