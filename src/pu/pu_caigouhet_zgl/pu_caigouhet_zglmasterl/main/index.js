
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//=============导入高阶组件区=============
//1导入高阶组件,公共部分
import {createPage, base, ajax, high, toast, promptBox, deepClone} from 'nc-lightapp-front';
//2导入高阶组件, UIExtend的部分
import {Utils} from './Utils';

import NCUploader from 'uap/common/components/NCUploader';  // 附件管理组件

//=============导入基础组件区=============
//1基础组件,公共部分
const {NCDiv, NCAffix, NCTabs, NCScrollElement} = base;
//2导入基础组件. UIExtend部分


//=============基本变量定义区=============
//1 基础常用变量声明部分
const EMPTY_FN = function(){}; //空函数

const URLS = {  // 请求路径
    loadUrl: '/nccloud/pu/pu_caigouhet_zgl/LoadPu_caigouhet_zglMasterVOAction.do'
};

const ACTIONS = {  // 按钮编码
    ATTACHMENT: 'Attachment',  //附件
    REFRESH: 'Refresh',  //刷新
}

const FIELDS = {  // 字段编码
    APPROVESTATUS : 'approvestatus',
    BILLTYPE : 'billtype',
    TRANSTYPEPK: 'transtypepk',
    TRANSTYPE: 'transtype',
    BUSITYPE: 'busitype',
    CODE: 'code',
    PRIMARYKEY: 'pk_caigouhet_zglmaster'
}

//2 编辑模式变量
const EDITMODE_EDIT = 'edit';
const EDITMODE_BROWSE = 'browse';

//3 页面显示模式
//3.1 当前UIExtend需要定义的状态
const SHOWMODE_CARD = 'card';


const CARDTABLE_SUFFIX = 'Sub';  //卡片表格区域编码后缀

const BILLTYPE = 'puzgl';

/****************************************************************************************************
 * 整体介绍：
 *      目前的这种写法是 单页应用的写法，多页面应用，页面切换时，采用的是“安装-卸载”的方式体现在render方法
 *      目前的这种写法，我们不需要再关注this指针的问题,也不需要在调用方法时使用call来切换指针并执行，直接"方法()"即可
 *      目前的这种写法，采用的是MVVM的架构模式，把state看做是VM，所以我们需要把目光集中在state
* 
*      本页面为联查页面，如单据联查、单据追溯联查。
 ****************************************************************************************************/

export class ApplicationPage extends Component{
	/**
	* 构造方法,js要求的必须方法,构造整个页面对象，
	* 此方法构造时，会定义全局配置，this.config,方便其他方法取用,
	* 同时，也处理了加载模板,按钮，设置模板按钮功能，最终通过调用
	* pageReady(此方法可以加入你的业务逻辑)完成第一次页面.
	* 此方法中,会调用initButton,initMeta来初始化模板和按钮,
	* initButton,initMeta,pageReady仅在页面打开时调用一次.
	* 其他时候不再调用
	*/
    constructor(props) {
        super(props); //构造
        
       // 节点全局变量定义
       //包含 页面编码定义,应用编码定义,标题定义,模块组件名定义
       //配置的获取方式，优先取平台定义,其次取传入配置定义, 最后默认
        this.config = {
            pagecode: props.getSearchParam('p')   || props.appcode || 'pagecode未定义', //页面编码定义
            appcode: props.getSearchParam('c')    || props.appcode || 'appcode未定义',  //应用编码定义
            title: this.props.getSearchParam('n') || props.title   || 'Demo主从表',     //表体定义
            moduleId: props.appcode,  //多语资源目录id
            domainName: 'pu' //模块域名
        }
        /**
         * 创建state,并构造节点模型,其结构与渲染时是一致的.
         * 可参照顶端代码注释的详细解释
         */
        this.state = this.createState();
        
         /**
         * 适配版本变化,2105及其以后版本必须的调用, 2之前版本不需要
         */
        this.props.use.form('pu_caigouhet_zglMasterForm');
        this.props.use.cardTable('pu_caigouhet_zglSlave0Sub');
        
        /**
         * 加载NCC资源,
         * 1,包含单据模板,按钮,等平台定义的功能
         * 2,加载多语资源文件,
         * 3,加载需要在代码总用到参照js
         */
        Utils.loadNCCResource({
            props: props,
            referObjs: [],
            /**
             * 导入全局配置,加载资源时 appcode,pagecode,modulename等信息,
             * 需要用到,全局配置中包含所有它需要用到的参数,
             */
            ...this.config,
            //导入全局配置,
            callback: (data) => {
                let {context, template, button, lang, refer = {}} = data;
                /**
                 * 初始化模板,修改模板相关配置
                 * 初始化按钮,修改按钮相关配置,
                 * 并将模板配置,按钮配置输入到平台,通过setMeta,setButtons输入.
                 * 让平台进行初始化.当平台初始化完成后,通过then继续后续的工作
                 */
                template = this.initMeta(template); //更新模板
                button = this.initButton(button);
                Promise.all([//合并处理 模板 和 多语
                    new Promise(resolve => this.props.meta.setMeta(template, () => resolve(true))),
                    new Promise(
                        resolve => this.props.button.setButtons(button, () => resolve(true)))
                ]).then(() => {
                    this.setState({isPageReady: true}, () => {  //标记自己页面已经完成,并进行第一次的渲染
                        (this.pageReady || EMPTY_FN)();
                    });
                }).catch((e) => {
                    throw new ReferenceError(e);
                });
            }
        });
    }
    
    /**
     * pageReady方法为页面已经完全设置完毕，
     * 可以初始化一些初始的功能，比如查询下列表并显示数据等
     */
    pageReady = () => {
    	let scene = this.props.getUrlParam("scene");
        let id = this.props.getUrlParam("id");
        let status = this.props.getUrlParam("status");
        let allpks = id instanceof Array ? id:[id];
        if(!id){
        	toast({content: "系统错误，未传递联查pk！", color: 'danger'});
        	return;
        }
        this.state.allpks = allpks;
        this.state.currentId = allpks[0];
        this.setState(this.state, () =>  this.queryCardById({id:this.state.currentId}));
    }
    
    /**
      * 初始化平台定义的单据模板
      * 触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
      * 功能：对加载完的模板进行个性化调整
      * 可实现举例功能:
      * 1.参照表单联动过滤, 参见[Demo1] 
      * 2.处理表格操作列,   参见[Demo2]
      */
    initMeta = (meta) => {
        // 添加卡片行操作列
        meta['pu_caigouhet_zglSlave0Sub'].items.push({
            attrcode: 'opr', // 列标识, 固定
            itemtype:'customer', // 列类型, 固定
            label: '操作', // 列名
            width: 200, // 列宽度
            className : 'table-opr', // 样式
            fixed: 'right', // 悬浮方向
            visible: true, // 是否可见
            render: (text, record, index) => { // 渲染方法
                let {showmode, editmode, card: {copiedRows}} = this.state;
                //获得符合条件按钮的key（编码）的集合
                let oprButtons = [];
                if (editmode != EDITMODE_BROWSE) {
                    oprButtons.push('pu_caigouhet_zglSlave0_Opr_DelLine');
                    oprButtons.push('pu_caigouhet_zglSlave0_Opr_CopyLine');
                }
                oprButtons.push('pu_caigouhet_zglSlave0_Opr_ExpandLine');
                if (editmode != EDITMODE_BROWSE && copiedRows['pu_caigouhet_zglSlave0Sub']) {
                    oprButtons = ['pu_caigouhet_zglSlave0_Opr_PastNextLine'];
                }
                // 创建操作列API
                return this.props.button.createOprationButton(oprButtons, {
                    area: 'pu_caigouhet_zglSlave0_Opr', // 按钮区域编码
                    buttonLimit: 3, // 允许的按钮最多显示数量
                    onButtonClick: (props, btncode) => this.onBtnClickFormlist(props, btncode, 'pu_caigouhet_zglSlave0Sub', {data: record, index}) // 点击按钮
                });
            }
        });
        // 交易类型参照过滤
        meta['pu_caigouhet_zglMasterForm'].items.find(item => item.attrcode == FIELDS.TRANSTYPEPK).queryCondition = () => ({
            parentbilltype: BILLTYPE
        });
        // 业务类型参照过滤
        meta['pu_caigouhet_zglMasterForm'].items.find(item => {
            if (item.attrcode == FIELDS.BUSITYPE) {
                item.queryCondition = () => {
                    let transtype = this.props.form.getFormItemsValue('pu_caigouhet_zglMasterForm', FIELDS.TRANSTYPE).value;
                    return {
                        billtype: BILLTYPE,
                        transtype,
                        GridRefActionExt: 'nccloud.web.codeplatform.framework.action.base.sqlbuilder.BusitypeSqlBuilder'
                    }
                };
                return true;
            }
        });
        
        return meta;
    }
    /**
     * initButton方法 功能介绍：
     * 触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
     * 功能简介：对加载完的按钮数据进行个性化调整
     * 举例功能：
     * 1、禁用某按钮 参见Demo1
     */
    initButton = (button) => {
        /**
         * Demo1 处理按钮
         * 场景描述： 有时需要在按钮数据加载之后进行一些处理
         * 达成效果： 按钮不可见，并且禁用
         * 写法解释： 迭代所有按钮，找到Save按钮，设置按钮的可见性和禁用型
         * 代码示例:
         */
        //buttons.find(btn=>{//迭代buttons
        //  if(btn.key == 'Save'){//找到button的key为Save的按钮
        //      btn.disabled = true;//设置按钮禁用
        //      btn.visible = false;//设置按钮隐藏
        //  }
        //})
        return button;
    }
    /**
     * 创建state模型，具体方法功能介绍参考主应用里面的注释介绍。
     */
    createState = () => {
        let state = {
        	scene : 'link',
        	currentId : '',
        	allpks : [],//所有联查的pk
            isPageReady: false, // 页面是否可以渲染
            showmode: SHOWMODE_CARD, // 页面当前的显示模型
            editmode: EDITMODE_BROWSE, // 页面当前编辑模式
            head: {  // 节点标题栏
                title: this.config.title, // 标题
                initShowBackBtn: false, // 是否显示返回按钮 
            },
            headBtn: { // 头部按钮区
                area: 'common', // 区域编码
                onButtonClick: this.onBtnClickHead // 点击按钮
            },
            card: { // 卡片页面
                form: { // 表单
                    area: 'pu_caigouhet_zglMasterForm', // 区域编码
                    onBeforeEvent: this.onBeforeEditForm, // 编辑前事件
                    onAfterEvent: this.onAfterEditForm, // 编辑后事件
                },
                tabs: {
                    activeKey: 'pu_caigouhet_zglSlave0Sub',
                    onTabClick: (key) => {
                        this.state.card.tabs.activeKey = key;
                        this.setState(this.state);
                    },
                    tabPanes: [
                        {
                            key: 'pu_caigouhet_zglSlave0Sub',
                            name: '子实体0',
                        }
                    ]
                },
                formlist: { // 子表表格
                    'pu_caigouhet_zglSlave0Sub'/*区域编码*/: {
                        area: 'pu_caigouhet_zglSlave0Sub', // 区域编码
                        showIndex: true, // 是否显示行序号
                        showCheck: true, // 是否显示多选框
                        adaptionHeight: true, // 是否自适应浏览器高度
                        onAfterEvent: this.onAfterEditFormlist, // 编辑后事件
                        onBeforeEvent: this.onBeforeEditFormlist, // 编辑前事件
                        onSelected: this.onSelectedChangeFormlist, // 点击选择框
                        onSelectedAll: this.onSelectedChangeFormlist, // 点击全选框
                        selectedChange: this.onSelectedChangeFormlist, // 选择框的选中行改变
                        hideModelSave: true,//隐藏整单保存按钮
                        hideAdd:true,//隐藏侧拉增行按钮
                        hideDel:true,//隐藏侧拉删行按钮
                        tableHead: () => this.state.card.formlist['pu_caigouhet_zglSlave0Sub'].button.render(), // 肩部渲染，主要用于渲染肩部操作按钮，调用肩部按钮的渲染方法
                        button: { // 肩部按钮
                            area: 'pu_caigouhet_zglSlave0', // 区域编码
                            onButtonClick: (props, btnCode) => this.onBtnClickFormlist(props, btnCode, 'pu_caigouhet_zglSlave0Sub'), // 点击按钮
                            render: () => { // 渲染方法
                                return (
                                    <div className="shoulder-definition-area">
                                        <div className="btn-group">
                                            {/*按钮*/}
                                            {this.props.button.createButtonApp(this.state.card.formlist['pu_caigouhet_zglSlave0Sub'].button)}
                                        </div>
                                    </div>
                                );
                            }
                        },
                    }
                },
                copiedRows: {},
                cardPagniation: { // 翻页组件
                    visible: false, // 是否显示
                    handlePageInfoChange: this.onBtnClickCardPagniation // 点击翻页器按钮
                }
            }
        };
        
        // 附件管理
        Utils.apply(state, {
            uploader: { // 附件管理配置
                visible: false, // 是否可见
                billId: undefined, // 选中单据id
                onHide: this.onHideUploader, // 关闭附件管理回调
                //联查页面禁用修改、删除等按钮，只能查看和下载。
                disableButton:["fs_group_add","fs_heigh_meter", "fs_upload_url", "fs_group_edit", "fs_group_delete", "fs_upload","fs_rename","fs_edit", "fs_move","fs_delete"]
            }
        });
		
        return state;
    }
    //4 渲染方法
    render() {
        let {isPageReady, showmode, head, headBtn, list, card} = this.state;
        if(!isPageReady) return ''; //页面资源加载完成后才能渲染页面
    	// 渲染卡片
        const renderCardPage = () => {
            let {form, tabs, formlist, cardPagniation} = card;
            let {tabPanes, ...tabOthers} = tabs;
            if (showmode != SHOWMODE_CARD) {
                return '';
            }
            // cardtable存在bug，拷贝使用的是Object.assign()，会修改当前state
            let newFormlist = deepClone(formlist);
            let {'pu_caigouhet_zglSlave0Sub' : tableConfig, ...other} = newFormlist;
            return showmode == SHOWMODE_CARD ? (
                <div className='nc-bill-card'>
                    <div className="nc-bill-top-area">
                        <NCAffix>
                            <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            	<NCDiv areaCode={NCDiv.config.Title} className='header-title-search-area'>
                                    {this.props.BillHeadInfo.createBillHeadInfo(head)}
                                </NCDiv>
                                <div className="header-button-area">
                                    {this.props.button.createButtonApp(headBtn)}
                                </div>
                                <NCDiv areaCode={NCDiv.config.TABS} className='header-cardPagination-area' style={cardPagniation.visible ? {} : {display: 'none'}}>
                                    {this.props.cardPagination.createCardPagination(cardPagniation)}
                                </NCDiv>
                            </NCDiv>
                        </NCAffix>
                        <NCDiv areaCode={NCDiv.config.FORM} className="nc-bill-form-area">
                                {this.props.form.createForm(form.area, form)}
                        </NCDiv>
                    </div>
                    <div className="nc-bill-bottom-area">
                        <NCDiv areaCode={NCDiv.config.TABLE} className="nc-bill-table-area">
                            {this.props.cardTable.createCardTable(tableConfig.area, {...tableConfig, multiConfig: other})}
                        </NCDiv>
                    </div>
                </div>
            ) : '';
        };
        
        // 附件组件
        const renderUploader = () => {
            let {uploader,uploader:{visible}} = this.state;
            return  visible ? (
                <NCUploader {...uploader}/>
            ) : '';
        }
        
      	return [ renderCardPage(),renderUploader() ];
      
      }//render
    
    //=============功能性方法区=============
    // 修改按钮状态
    // callback  回调
    updateBtnStatus = ({callback = EMPTY_FN} = {}) => {
        let {showmode, editmode, card: {formlist, copiedRows}} = this.state;
        let isBrowse = editmode == EDITMODE_BROWSE;

        // 按钮可见性初始化
        let btnVisible = {
        	[ACTIONS.ATTACHMENT]: isBrowse,
            [ACTIONS.REFRESH]: isBrowse,
        }

        let btnDisabled = { 
        	[ACTIONS.ATTACHMENT]: !this.state.currentId,
            [ACTIONS.REFRESH]: false,
        }
        
        let formlistBtnArea = Object.values(formlist).map(table => table.button.area);
        formlistBtnArea.forEach(btnAreaCode => {
            // 卡片子表按钮可见性
            let copymode = Boolean(copiedRows[btnAreaCode + CARDTABLE_SUFFIX]);
            btnVisible[btnAreaCode + '_AddLine'] = !isBrowse && !copymode;
            btnVisible[btnAreaCode + '_CopyLine'] = !isBrowse && !copymode;
            btnVisible[btnAreaCode + '_DelLine'] = !isBrowse && !copymode;
            btnVisible[btnAreaCode + '_PastEndLine'] = !isBrowse && copymode;
            btnVisible[btnAreaCode + '_CopyCancelLine'] = !isBrowse && copymode;

            // 卡片子表按钮可用性
            let cardTableCheckedRows = this.props.cardTable.getCheckedRows(btnAreaCode+CARDTABLE_SUFFIX);
            btnDisabled[btnAreaCode + '_AddLine'] = false;
            btnDisabled[btnAreaCode + '_CopyLine'] = !(cardTableCheckedRows && cardTableCheckedRows.length > 0);
            btnDisabled[btnAreaCode + '_DelLine'] = !(cardTableCheckedRows && cardTableCheckedRows.length > 0);
            btnDisabled[btnAreaCode + '_PastEndLine'] = false;
            btnDisabled[btnAreaCode + '_CopyCancelLine'] = false;
        });
		
		this.props.button.setButtonVisible(btnVisible);
        this.props.button.setButtonDisabled(btnDisabled);
		// 设置卡片翻页器是否可见
        this.state.card.cardPagniation.visible =  editmode == EDITMODE_BROWSE;
        this.setState(this.state, callback);
    }
    
    updateCardStatus = ({areaInfo, editmode, callback = EMPTY_FN} = {}) => {
        // 设置卡片主表单为编辑态
        this.props.form.setFormStatus(areaInfo.formId, editmode);
        // 设置卡片子表表格为编辑态
        areaInfo.tableId.forEach(id => {
            this.props.cardTable.setStatus(id, editmode == EDITMODE_BROWSE ? EDITMODE_BROWSE : EDITMODE_EDIT);
        });
        setTimeout(callback, 0);
    }
    
    // 查询卡片数据
    // data  查询参数
    // callback  回调
    queryCard = ({data, callback = EMPTY_FN} = {}) => {
        // pk pageCode formId 不能为空
        if (!(data && data.pk && data.pageCode && data.formId)) {
            return;
        }
        // 查询请求
        ajax({
            url: URLS.loadUrl,
            data: data,
            success: (res) => {
                let {data: {data} = {}} = res;
                callback(data);
            },
        });
    }
    
    /**
    *根据参数id查询数据、填充数据 
    *减少重复代码
    */
    queryCardById = ({id,callback = EMPTY_FN} = {}) => {
        // 获取卡片区域编码
        let area = this.getCardAreaCode();
        // 调用卡片查询方法，通过回调处理查询结果
        this.queryCard({
            data: { // 查询参数
                pageCode: this.config.pagecode, // pagecode
                pk: id, // 主键
                ...area // 卡片区域编码
            },
            callback: (data) => { // data为查询结果
                // 填充卡片数据或清空卡片数据
                data ? this.fillCardData({data}) : this.clearCardData();
                // 更新按钮状态
                this.updateBtnStatus();
                callback();
            }
        });
    }

    // 填充卡片数据
    // data  卡片数据，格式参考后端ExtBillCard类
    // callback  回调，无参数
    fillCardData = ({data, callback = EMPTY_FN} = {}) => {
        // 获取卡片区域编码
        let area = this.getCardAreaCode();
        // 设置主表单数据
        this.props.form.setFormItemsValue(area.formId, data && data.head && data.head[area.formId] && data.head[area.formId].rows[0].values || {});
        // 设置子表表格数据
        area.tableId.forEach(id => {
            if (data && data.bodys && data.bodys[id]) {
                this.props.cardTable.setTableData(id, data.bodys[id], () => {
                });
            } else { // 子表没值则清空
                this.props.cardTable.setTableData(id, {rows: []});
            }
        });
        setTimeout(callback);
    }

    // 清空卡片数据
    // callback  回调，无参数
    clearCardData = ({callback = EMPTY_FN} = {}) => {
        // 获取卡片区域编码
        let area = this.getCardAreaCode();
        // 清空主表单数据
        this.props.form.EmptyAllFormValue(area.formId);
        // 清空子表表格数据
        area.tableId.forEach(id => {
            this.props.cardTable.setTableData(id, {rows: []});
        });
        setTimeout(callback);
    }
    

    // 初始化卡片翻页器
    initCardPaginationWithAllpks = () => {
        let {allpks} = this.state.allpks;
        // 设置卡片翻页器的allpks，当调用cardPagination组件的API新增、删除pk时，allpks会同步更新
        this.props.cardPagination.setCardPaginationAllpks(allpks);
    }

    // 获取卡片数据
    getCardData = () => {
        // 获取卡片区域编码
        let area = this.getCardAreaCode();
        // 获取卡片界面数据（主表单、子表表格）
        let cardData = this.props.createExtCardData(this.config.pagecode, area.formId, area.tableId);
        
        return cardData;
    }

    // 获取卡片区域编码，包括主表单（formId）子表格（tableId），单表时没有tableId
    // 返回格式：{formId: '', tableId: ['']}
    getCardAreaCode = () => {
        return {
            tableId: Object.keys(this.state.card.formlist),
            formId: this.state.card.form.area
        }
    }
    
    
    /**
     * 按钮点击事件
     * @param props
     * @param btnCode  按钮id
     * @param param  列表操作列参数，适配操作列按钮
     */
    onBtnClickHead = (props, btnCode, param = {}) => {
        switch (btnCode) {
            
            case ACTIONS.ATTACHMENT: // 点击附件管理
                this.onAttachment();
                break;
            case ACTIONS.REFRESH: // 点击刷新
                this.onRefresh();
                break;
            default:
                break;
        }
    }
    
    /**
     * 点击刷新按钮
     */
    onRefresh = () => {
        // 获取主键
        let billId = this.state.currentId;
        this.queryCardById({id:billId,callback:()=>{
        	// 提示
            toast({color: 'success', content: '刷新成功'});
        }});
        
    }
    
    /**
     * 卡片翻页
     * @param props
     * @param nextId  下一个单据id
     */
    onBtnClickCardPagniation = (props, nextId) => {
        this.setState({currentId:nextId},this.queryCardById({id:nextId}));
    }
    
    /**
     * 附件管理
     */
    onAttachment = () => {
        // 获取主键，选中多行取第一行
        let billId = this.state.currentId;
        // 设置显示附件管理组件
        this.state.uploader.visible = true;
        // 设置附件管理组件的主键
        this.state.uploader.billId = billId;
        this.setState(this.state);
    }
    /**
     * 隐藏附件管理
     */
    onHideUploader = () => {
        // 设置不显示附件管理
        this.state.uploader.visible = false;
        this.setState(this.state);
    }
    
    
   /**
     * 方法功能：
     * 卡片子表表肩按钮事件
     * @param props
     * @param btnCode  按钮id
     * @param tableId  表格id
     */
    onBtnClickFormlist = (props, btnCode, tableId, row) => {
        // 卡片子表表肩符合以_AddLine结尾的规范，根据后缀判断时什么按钮
        let code = btnCode.split('_');
        switch (code[code.length - 1]) {
            case 'ExpandLine':
            case 'RetractLine':
                this.onCardTableExpandLine(tableId, row);
                break;
            default:
                break;
        }
    }
    /**
     * 方法功能：
     *      卡片孙表选择框发生改变事件
     */
    onSelectedChangeGrandson = () => {
        // 更新按钮状态
        this.updateBtnStatus();
    }
    
    /**
    *子表展开
    */
    onCardTableExpandLine = (tableId, row) => {
        let {editmode} = this.state;
        let status = editmode == EDITMODE_BROWSE ? EDITMODE_BROWSE : EDITMODE_EDIT;
        this.props.cardTable.openModel(tableId, status, row.data, row.index);
    }
    
    
}

const config = {
    title: '采购合同_zgl联查',
    pagecode: 'TRH10201zglL_pu_caigouhet_zglMasterL',
    appcode: 'TRH10201zglL',
    domainName: 'pu',
    version: 2207
};
ApplicationPage = createPage({
    initTemplate:{},
    billinfo: {
        billtype: 'extcard',
        pagecode: 'TRH10201zglL_pu_caigouhet_zglMasterL',
        headcode: 'pu_caigouhet_zglMasterForm',
        bodycode: ['pu_caigouhet_zglSlave0Sub']
    }
})(ApplicationPage);

ReactDOM.render(<ApplicationPage {...config}/>, document.querySelector("#app"));

