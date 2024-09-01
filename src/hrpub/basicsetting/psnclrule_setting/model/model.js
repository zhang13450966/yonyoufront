import CommonModel from 'src/hrpub/common/model/index'
import proFetch from '../../../../hrpub/common/utils/project-fetch'
import { languageCreateUIDOM } from '../../../../hrpub/common/utils/utils'


class Model extends CommonModel{

    name = 'main'

    data ={
        json: {}, //多语文件
        status: 'browse', //界面状态  默认浏览态
        orgValue: null, //组织参照 默认值为null
        selectedKeys: null, //左树选中的值 默认值为根节点
        treeData: [], //左树数据 默认数据为[]
        checked: false, //右边多选框是否选中 默认false
        modalShow: false, //弹窗是否展示  默认false
        modalOrgValue: null, //复制弹窗组织参照  默认值为null
        modalPsnclValue: null, //复制弹窗人员类别参照  默认值为null
        tableInfo: [], //右表信息集合
        tableData: [], //右表数据集合
        promptModalShow: false, //保存提示弹窗
        promptInfo: null, //保存弹窗提示信息
        psnclValue: null,
        psnclName: null,
        checkDisable: true,
        checkValue: false, //是否继承上级人员类别的信息配置
        mustEntryFlag: false, //子集必录
        sysDataSet: [], //子集必录不可修改的表集合
        forFileSysData: [],//针对附件的
        sysData: [],  //不可修改的系统项集合
        metadata: null, //左树的表名
        isEdit: false, //是否继承上级人员类别的信息配置 多选框是否可编辑
        mustCheckDisable: true, //子集必录的多选框是否可编辑
        selectedIndex: 0,
        isneedfile: false,
        needCheckDisable: true // 附件必传的多选框是否可编辑
    }

    sync = {
        ...this.sync
    }


    async = {

        //获取模版和多语
        getTempAndLange(dispatch, getstate, data) {
            const callback = languageCreateUIDOM(data)
            return callback(data.appConfig, data.langConfig, data.callback)
        },

        getTreeData(dispattch,getstate,data){
            return proFetch({
                url: '/nccloud/hrhi/psndoc/PsndocTreePsnclAction.do',
                body: data
            }) 
        },

        saveData(dispatch,getstate,data){
            return proFetch({
                url: '/nccloud/hrpub/psnclrule/PsnclruleSaveDoAction.do',
                body: data
            })
        },

        saveCheck(dispatch,getstate,data){
            return proFetch({
                url: '/nccloud/hrpub/psnclrule/PsnclruleSaveCheckAction.do',
                body: data
            })
        },

        getTableData(dispatch,getstate,data){
            return proFetch({
                url: '/nccloud/hrpub/psnclrule/PsnclruleInitAction.do',
                body: data
            })
        },

        copyData(dispatch,getstate,data){
            return proFetch({
                url: '/nccloud/hrpub/psnclrule/PsnclruleCopyAction.do',
                body: data
            })
        },

        // 复制前校验
        validateCopy(dispatch, getstate, data){
            return proFetch({
                url: '/nccloud/hrpub/psnclrule/PsnclruleCopyCheckAction.do',
                body: data
            })
        }
    }

}

export default new Model()