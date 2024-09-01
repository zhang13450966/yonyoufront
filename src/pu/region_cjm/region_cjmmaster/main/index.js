/****************************************************************************************************
 * 代码目录:
 *        目录结尾不带L和P的是当前节点的目录
 *        以L结尾的是单据追溯的目录
 *        以P结尾的是审批详情的目录
 *
 * 源代码介绍：
 * 1,介绍
 *     此前端代码采用了单页应用写法, 即所有功能在一个页面中, 所以我们仅有一个前端文件(index.js) 这个前端文件表现节点
 * 的所有功能。大家可能会认为, 代码写在了一起是不是很臃肿,代码很多很乱很长，其实不然, 写在一起也是综合了各种因素权衡,
 * 主要权衡指标为 开发者前端基础, 改写代码习惯，和后端转前端的同学, 尽量避免this指针, 不用理解call调用, 能用一种整齐
 * 划一的方式，让大家理解简单，上手方便. 当你了解了代码的基本结构后, 你一定会觉得简单的不可思议。
 * 非常不建议在节点应用中使用现在的多页面模式方案。好处你一定会体会到.
 *
 * 2, 必备知识。
 * 2.1)react的运作模式.
 *    模型模型驱动视图改变, 视图被监听修改模型，再次驱动视图改变.  这种单向变化解决了节点所有功能。
 *    模型模型驱动视图改变 -> 可以理解为视图在表现模型,  在react中 state变化了, 会调用render方法重新渲染,即根据新模型
 *    重新画视图.
 *    视图被监听修改模型  -> 视图可以添加各种监听事件，(click, mourseMove)等, 事件处理时, 修改模型. 模型变化驱动了视
 *    图重新表现
 *         —————>>————————
 *        |               |
 *       模型(state)     视图(render)
 *        |               |
 *        -----<<----------
 * 2.2)平台的高阶组件
 *    平台的高阶组件是 props.组件.方法 这种调用形式的组件. 高阶组件最终底层还是 react运作模式.
 *    需要掌握高阶组件API. 平台的高阶组件会经常用到.
 *
 * 3,代码的基本结构,
 *    代码中, 最核心3方法，分别是构造方法constructor方法, 创建模型方法createState方法， 渲染方法render方法， 当然还是其
 * 他的定义，比如监听事件处理, 按钮状态控制方法，但是当你掌握了这3个最核心的方法, 你基本及掌握了整个页面的运作模式，结构模
 * 型了. 在介绍其他方法就一目了然了.
 *
 * 3.1 constructor
 *   constructor的作用为构造当前页面对象。主要职责为
 *   1) 加载NC资源，如单据模板, 按钮定义。 修正模板的一些属性。
 *   2) 调用创建模型方法createState方法，构建页面的结构(*), 核心方法。
 *   3) 保存和定义节点配置项，如节点编码，应用编码等。
 *
 * 3.2 createState方法，render方法
 *   createState方法为创建模型方法，了解createState对了解了解页面整体右至关重要的作用的.
 *   createState做了什么? createState在根据页面的组件布置情况创建对应的结构性的模型.并且
 *   模型的结构与页面的结构保持一致，这样非常方便了理解页面的整体情况，也非常变量的操作模型。
 *   我们举个简单例子[列表卡片]节点：
 *   我们先简单说明下这个节点， 这个节点包含了2个部分， 一个是列表的部分，一个是卡片的部分，
 *   并给他们起名字， 列表模式，卡片模式， 显示列表模式时，不显示卡片模式，显示卡片模式时，不显示列表模式，
 *   功能为列表卡片来回切换，列表模式中， 包含一个查询区， 一个列表区， 卡片模式中， 包含一个表单区。
 *   下面我们来构建一个state
 *    state = {
 *          showmode: 'list',   showmode表示为当前的显示模式， 是列表模式，还是卡片模式， 他可以有两个值 list,card分表表示
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数
 *             }
 *          },
 *          card:{              卡片模式的配置，包含了表单区的配置对象
 *              form:{          表单区
 *                  area:''     表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn  表单编辑前的处理函数
 *              }
 *          }
 *    }
 *    以上我们就构建一个state,从这个state中，我们可以看到我们页面的模型全貌.
 *    下面我们来看render方法，
 *    render方法的中， 主要是渲染组件到页面，我们根据什么来渲染页面，根据上面构建的state模型来渲染，
 *    render = () =>{
 *          var renderList = () =>{ //渲染列表模式的是的页面，
 *          }
 *          var renderCard = () =>{ //渲染卡片模式的是的页面，
 *          }
 *    }
 *    我们应该怎么判断渲染的是列表 还是卡片呢， 我们通过state.showmode来确定，
 *    根据showmode的当前值的状态来判断是调用 renderList还是renderCard，
 *    这样当我们重新设置模型的值(setState),就能够借助React的机制(见react的运作模式)，驱动视图变化了(setState会驱动调用render)
 *    所以我们可以这样写
 *     render = () =>{
 *          var renderList = () =>{ //渲染列表模式的是的页面，
 *          }
 *          var renderCard = () =>{ //渲染卡片模式的是的页面，
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    是不是非常简单,当我们要在列表和卡片模式中切换时， 我们只需要 setState(showmode:'list'或者'card'),
 *    就可以在列表和卡片间来回切换了， 非常便利，再也不用什么缓存了，而且切换时也不需要加载什么模板.非常快捷。
 *
 *    那么renderList方法里面是怎么写的呢，也非常简单，我们再看一下state里面list的定义
 *    我们就可以根据list里面的定义写renderList了，state结构和render结构保持了一致
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数
 *             }
 *          },
 *    renderList方法内部写法例子
 *           var renderList = () =>{ //渲染列表模式的是的页面，
 *              var {search, table } = this.state.list; //我们解构list里面的两个模型对象，就是search查询区的配置，table表格配置
 *                 return <div>
 *                  {this.props.search.NCCreateSearch(search.area, search)}
 *                   {this.props.table.createSimpleTable(table.area, table)}
 *                </div>
 *          }
 *    这样我们的列表界面就做完了，很简单 卡片模式也是和类似
 *    var renderCard = () =>{ //渲染卡片模式的是的页面，
 *           var { form } = this.card; //我们解构card里面的两个模型对象，就是search查询区的配置，table表格配置
 *          return <div>
 *                  {this.props.search.form(form.area, form)}
 *          </div>
 *    }
 *
 *    现在我们看一下完整的例子代码,并进行一些总结
 *    createState = () => {
 *      var state = {
 *          showmode: 'list',   showmode表示为当前的显示模式， 是列表模式，还是卡片模式， 他可以有两个值 list,card分表表示
 *          list: {             列表模式的配置，包含查询区配置对象，表格区配置对象
 *             search:{         查询区配置
 *                  area: ''    查询区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSearch:fn 点击查询时候的处理函数
 *             },
 *             table:{          表格区配置
 *                  area: ''    表格区的区域编码,你在模板中定义的编码是什么他就是什么
 *                  onSelect: fn 点击选中时候的处理函数
 *             }
 *          },
 *          card:{              卡片模式的配置，包含了表单区的配置对象
 *              form:{          表单区
 *                  area:''     表单区的区域编码，你在模板中定义的编码是什么他就是什么
 *                  onBeforeEdit:fn  表单编辑前的处理函数
 *              }
 *          }
 *      }
 *    }
 *    render = () => {
 *          var renderList = () =>{
 *              var {search, table } = this.state.list; //我们解构list里面的两个模型对象，就是search查询区的配置，table表格配置
 *                 return <div>
 *                  {this.props.search.NCCreateSearch(search.area, search)}
 *                   {this.props.table.createSimpleTable(table.area, table)}
 *                </div>
 *          }
 *          var renderCard = () =>{
 *               var { form } = this.card; //我们解构card里面的两个模型对象，就是search查询区的配置，table表格配置
 *                return <div>
 *                  {this.props.search.form(form.area, form)}
 *                </div>
 *          }
 *          return this.state.showmode == 'list' ? renderList() : renderCard();
 *    }
 *    总结：
 *      代码state和render渲染的模型结构上是一致，这样我们能很快构建我们的页面，并非常容易修改，
 *      我们只需要修改我们的模型，就可以操控我们的页面了， 渲染只是在表现我们的模型
 ****************************************************************************************************/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//=============导入高阶组件区=============
//1导入高阶组件,公共部分
import {createPage, base, ajax, high, toast, promptBox, deepClone, print, output} from 'nc-lightapp-front';
const {PrintOutput,BillTrack} = high;
const { NCDiv, NCAffix, NCTabs, NCScrollElement, NCCheckbox, NCToggleViewBtn } = base;
//2导入高阶组件, UIExtend的部分
import { Utils } from './Utils';
const EMPTY_FN = function(){}; 	//空函数, 获取函数是如果没有定义，则默认EMPTY_FN
import ExcelOutput from 'uap/common/components/ExcelOutput';  // 导出组件
import excelImportconfig from 'uap/common/components/excelImportconfig';  // 导入配置方法
import NCUploader from 'uap/common/components/NCUploader';  // 附件管理组件
import ApproveDetail from 'uap/common/components/ApproveDetail';  //审批详情
import ApprovalTrans from 'uap/common/components/approvalTrans';  //指派组件

//=============基本变量定义区=============
//1 基础常用变量声明部分

const URLS = {//请求路径
    enableUrl: '/nccloud/pu/region_cjm/Region_CjmMasterEnableAction.do',    //启用Url
    disableUrl: '/nccloud/pu/region_cjm/Region_CjmMasterDisableAction.do',  //停用Url
    printUrl: '/nccloud/pu/region_cjm/PrintRegion_CjmMasterVOAction.do',    //打印Url
    saveUrl : '/nccloud/pu/region_cjm/SaveRegion_CjmMasterVOAction.do',						//保存Url
    deleteUrl : '/nccloud/pu/region_cjm/DeleteRegion_CjmMasterVOAction.do',					//删除Url
    addUrl : '/nccloud/pu/region_cjm/AddRegion_CjmMasterVOAction.do',						//新增Url
    editUrl : '/nccloud/pu/region_cjm/EditRegion_CjmMasterVOAction.do',						//修改Url 
    loadUrl : '/nccloud/pu/region_cjm/LoadRegion_CjmMasterVOAction.do',				        //查询卡片Url 
    loadTreeUrl : '/nccloud/pu/region_cjm/LoadTreeRegion_CjmMasterVOAction.do',				//加载树数据Url
    copyUrl:'/nccloud/pu/region_cjm/CopyRegion_CjmMasterVOAction.do',						//复制Url 
};

const ACTIONS = { //按钮编码
    ENABLE: 'Enable',                   //启用
    DISABLE: 'Disable',                 //停用
    IMPORT: 'Import',                   //导入
    EXPORT: 'Export',                   //导出
    PRINT: 'Print',                     //打印
    OUTPUT: 'Output',                   //输出
    ATTACHMENT: 'Attachment',           //附件
    ADD : 'Add',						//新增
    DELETE : 'Delete',					//删除
    EDIT : 'Edit',						//修改
    REFRESH : 'Refresh',				//刷新
    QUERY : 'Query',					//查询
    CANCEL : 'Cancel',					//取消
    SAVE : 'Save',						//保存
    SAVEADD : 'SaveAdd',				//保存新增
    COPY : 'Copy',						//复制
    MORE: 'More'                        // 更多
};

const FIELDS = { // 字段编码
    ENABLESTATE: 'enablestate',
	PARENT_ID  :  'pid',				    //父主键属性
    PK_ORG: 'pk_org',
	PRIMARYKEY : 'pk_region_cjmmaster'		     	            //主键属性
};
//2 编辑模式变量
const EDITMODE_ADD = 'add';
const EDITMODE_EDIT = 'edit';
const EDITMODE_BROWSE = 'browse';
//3 页面显示模式
const SHOWMODE_LIST = 'list'; //列表
const SHOWMODE_CARD = 'card'; //卡片
const SHOWMODE_FETCHLIST = 'fetchlist'; //拉单列表
const SHOWMODE_FETCHCARD = 'fetchcard'; //拉单卡片
class ApplicationPage extends Component{
    /****************************************************************************************
	 * 构造方法,js要求的必须方法,构造整个页面对象，
	 * 此方法构造时，会定义全局配置，this.config,方便其他方法取用,
	 * 同时，也处理了加载模板,按钮，设置模板按钮功能，最终通过调用
	 * pageReady(此方法可以加入你的业务逻辑)完成第一次页面.
	 * 此方法中,会调用initButton,initMeta来初始化模板和按钮,
	 * initButton,initMeta,pageReady仅在页面打开时调用一次.
	 * 其他时候不再调用
	 ****************************************************************************************/
    constructor(props){
        super(props);
        this.formatPropComps(); //追加方法
        /**
	     * 节点全局变量定义
	     * 包含 页面编码定义,应用编码定义,标题定义,模块组件名定义
	     * 配置的获取方式，优先取平台定义,其次取传入配置定义, 最后默认
	     */
	    this.config = {
	        pagecode :  this.props.getSearchParam('p') || props.appcode, //页面编码定义
	        appcode :  this.props.getSearchParam('c') || props.appcode,  //应用编码定义
	        title :  this.props.getSearchParam('n') || props.title,      //应用名称
	        domainName :  'pu',                     //模块域名
	        moduleName :  'pu',					 //模块域名
	        moduleId :  '4004800H1'                          //应用编码 this.props.getSearchParam('c')
	    };
	    /** 
	     * 创建state,并构造节点模型,其结构与渲染时是一致的.
	     * 可参照顶端代码注释的详细解释
	     */
        this.state = this.createState(); //创建state中的VM模型
        /**
	     * 适配版本变化,2105及其以后版本必须的调用, 2之前版本不需要
	     */
		this.props.use.form('region_CjmMasterForm');
        /************************************************************************************************************
		 *如果你在应用注册-模板注册中新维护了一个表格区域：比方说区域编码为："showmodal-table"
         *2105版本之后的话，需要调用下面的代码：
		 *this.props.use.table('showmodal-table');==>这样注册之后，render方法中调用createSimpleTable可以创建列表页面表格
         *this.props.use.editTable('showmodal-table');==>这样注册之后，render方法中调用createEditTable可以创建编辑表格
         *this.props.use.cardTable('showmodal-table');==>这样注册之后，render方法中调用createCardTable可以创建卡片表格
         *同一表格区域编码，不要多次调用注册！！！
		 ************************************************************************************************************/
        /**
	     * 加载NCC资源
	     * 1,包含单据模板,按钮,等平台定义的功能
	     * 2,加载多语资源文件,
	     * 3,加载需要在代码总用到参照js
	     */
        Utils.loadNCCResource({//加载资源数据,模板,按钮,参照等信息
            props,
            /**
             * 动态参照路径集合
             */
            referObjs : [],
            /**
	         * 导入全局配置,加载资源时 appcode,pagecode,modulename等信息,
	         * 需要用到,全局配置中包含所有它需要用到的参数,
	         */
            ...this.config,
            /**
             * 加载NCC资源之后的回调方法
             */
            callback : ({template,button,context,lang,inlt})=>{
            	/**
	             * 初始化模板,修改模板相关配置
	             * 初始化按钮,修改按钮相关配置,
	             * 并将模板配置,按钮配置输入到平台,通过setMeta,setButtons输入.
	             * 让平台进行初始化.当平台初始化完成后,通过then继续后续的工作
	             */
                this.initMeta({meta:template,context});
                this.initButton(button);
                /**
                 * 合并处理 模板 和 按钮
                 * Promise.all就像后端开多线程，并等待所有线程回来之后再then（执行下一步）
                 * 而且可以多个then
                 */
                Promise.all([
                    new Promise(resolve=>{
                    	//通知底层设置模板
                        this.props.meta.setMeta(template,()=>{
                            resolve(true);
                        });
                    }),
                    new Promise(resolve=>{
                    	//通知底层设置按钮
                        this.props.button.setButtons(button,()=>{
                            resolve(true);
                        })
                    }),
                    new Promise(resolve=>{
                        this.setState({...this.state,context},()=>{
                            resolve(true);
                        })
                    })
                ]).then(()=>{
                    return this.pageReady();
                }).then(()=>{//初始化完成
                   /**
                    * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
                    * isPageReady:页面是否已经初始化
                    * showmode:显示模式  list|card|fetchlist|fetchcard
                    * editmode:编辑模式  browse|edit|add
                    * btn:应用肩部按钮组件配置
                    * head:应用标题组件配置
                    * dragComp:树卡应用左右拖拽组件配置
                    * execlExport:导入导出功能组件配置
                    * printOutput:打印输出功能组件配置
                    * attatchment:附件管理功能组件配置
                    */
                    let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
                   /**
                    *  moduleName:模块名称
                    *  billType:导入导出的单据类型
                    */
                    let {moduleName,billType} = execlExport;
                    let {pagecode,appcode} = this.config;
                    //设置导入按钮属性
                    this.props.button.setUploadConfig('Import', excelImportconfig(
                        this.props,
                        moduleName,
                        billType,
                        true,
                        '',
                        {pagecode,appcode},
                        this.doRefresh //回调函数执行刷新
                    ));
                }).catch((e)=>{
                    throw new ReferenceError(e);
                });
            }
        }); 
    }
   /**
     * pageReady方法 功能介绍：
     *       触发时机：loadNCCResources（模板、按钮、上下文数据等）请求完成后触发
     *       功能简介：加载必要的页面数据时使用
     *       举例功能：
     *          1、加载页面初始树数据
     *          2、加载页面初始列表数据
     *  
     */
	pageReady = ()=>{
		return new Promise(resolve=>{
			//设置state
			this.setState({isPageReady : true},()=>{
				resolve(true);
			});
		}).then(()=>{
			//获取url中的pk，判断是联查还是正常刷新
			let linkId = this.props.getUrlParam("id");
            return (linkId ? this.onLinkedQry({pk : linkId}) : this.doRefresh());
		}).then(()=>{
            //设置表单状态
	        this.setFormStatus();
	        //更新按钮状态
	        this.updateBtnStatus();
	        return Promise.resolve(true);
        });
	}
    /**
     * initMeta方法 功能介绍：
     *       触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
     *       功能简介：对加载完的模板进行个性化调整
     *       举例功能：
     *           1、表单参照过滤：参见Demo1
     *           2、处理表格操作列：simpleTable或者cardTable，如果需要带有操作列，也可以在该方法中添加  见@2
     * @param {*} meta 加载NCC资源回调方法参数中模板参数对象
     * @param {*} context 上下文信息
     */
    initMeta = ({meta,context}) => {
    	/**
    	 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
    	 * isPageReady:页面是否已经初始化
    	 * showmode:显示模式  list|card|fetchlist|fetchcard
    	 * editmode:编辑模式  browse|edit|add
    	 * btn:应用肩部按钮组件配置
    	 * head:应用标题组件配置
    	 * dragComp:树卡应用左右拖拽组件配置
    	 * execlExport:导入导出功能组件配置
    	 * printOutput:打印输出功能组件配置
    	 * attatchment:附件管理功能组件配置
    	 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
    	/**
    	 * 解构dragComp
    	 * tree:树组件配置
    	 * card:卡片组件配置
    	 * defLeftWid:默认左侧宽度
    	 * leftMinWid:左侧最小宽度
    	 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
         * 解构card
         * form:表单组件配置
         * formList:卡片表格组件配置
         */
        let {form,formList} = card;
        //解构表单 area:表单区域编码
    	let {area} = form;
    	/**
    	 * 主组织权限过滤 : 加载的是当前登录人有权限的组织
    	 */
    	meta[area].items.find(item=>{
    		if(item.attrcode == FIELDS.PK_ORG){
    			item.queryCondition = ()=>{
    				return{
    					//应用编码，注意大小写
    					AppCode : this.config.appcode,
    					//固定写法主组织过滤类，如果是表格参照，前面的key需要
    					//GridRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'//表格型参照设置主组织过滤
                        TreeRefActionExt : 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'//树型参照设置主组织过滤
    				}
    			};
    		}
    	});
       /******************************************************************************************************
	    * Demo1
	    * 场景描述： 表单上同时有部门、组织两个字段，部门受组织过滤, 部门选择时,受到选择的组织进行部门参照过滤
	    * 达成效果： 组织不选时，部门加载全部；组织选择，部门加载的数据时该组织下的部门。
	    * 写法解释： 部门的条件需要按照组织的值动态生成，queryCondition 既可以接收一个对象{}，又可以接收一个方法EMPTY_FN
	    *		 我们利用闭包的原理，把动态获取组织数据闭在queryCondition方法中，即可完成过滤条件的设置
	    * 代码示例 : 
        *  meta['cfsupplier_form'].items.find(item=>{//cfsupplier_form 是表单编码,根据自己的节点中表单的编码进行修改
        *     if(item.attrcode == 'pk_dept'){//pk_dept 是部门属性的key
        *         item.queryCondition = ()=>{//给部门item设置过滤条件
        *             let orgVal = this.props.form.getFormItemsValue('cfsupplier_form','pk_org');
        *             //确保后端 部门参照接收 pk_org 参数，这里就可以传递pk_org作为过滤条件了
        *             return {
        *                 pk_org : orgVal ? orgVal.value : -1
        *             }
        *         }
        *     }
        * });
	    *
	    * Demo2 处理表格操作列
	    * 场景描述： 高阶组件simpleTable或者cardTable需要追加操作列
	    * 达成效果： simpleTable或者cardTable,增加操作列,操作列中包含一些定义的按钮
	    * 写法解释： 拿到表格模板的items,追加自定义的列
	    * 代码示例 :
        *  meta['supprod_sub'].items.push({//supprod_sub 是卡片表格编码
        *     attrcode :  'opr',
        *     itemtype : 'customer',
        *     label :  '操作',
        *     width :  200,
        *     className  :  'table-opr',
        *     fixed :  'right',
        *     visible :  true,
        *     render :  (text, record, index) => {
        *         //获得符合条件按钮的key（编码）的集合
        *         let oprBtnKeys = (this.props.button.getButtons().filter(btn=>{
        *             //supprod_sub_opr-->按钮注册 注册的当前表格操作列按钮的区域编码
        *             if(btn.area == 'supprod_sub_opr'){
        *                return btn; 
        *             }
        *         }) || []).map(btn=>{
        *             return btn.key;
        *         }) || [];
        *         //创建操作列API
        *         return this.props.button.createOprationButton(oprBtnKeys, {
        *             area :  'supplier_baseInfo_opr',//这个值需要根据自己注册的编码设置，这里只是举例
        *             buttonLimit :  3,
        *             onButtonClick : (props,btncode)=>this.onBtnClickFormlist({btncode,record,index})
        *         });
        *     }
        * });
        *
        * 树卡型应用DEMO(LCDP供应商)扩展： 参照过滤，动态禁用启用表单项
        * 参照过滤:***选完组织参照  给供应商部门参照做过滤，只加载所选组织下的部门***
        * 先找到组织和部门两个属性的key：pk_org（组织）、pk_dept（部门）
        * 在找到表单的区域编码:从card对象中解构出form对象，form对象中的area就是表单区域编码
        * 迭代items数组，找到部门item
        * meta[area].items.forEach(item=>{
        *     if(item.attrcode == 'pk_dept'){
        *         item.disabled = true;
        *         //为部门item的queryCondition设置过滤
        *         item.queryCondition = ()=>{
        *             //获得表单组织item的值对象
        *             let orgValue = this.props.form.getFormItemsValue(area,'pk_org');
        *             //返回具体的过滤条件
        *             return {
        *                 pk_org:orgValue ? orgValue.value:-1,
        *                 TreeRefActionExt:'nccloud.web.lcdp.lcdpsupplier.lcdpsupplier.action.DeptTreeRefCustomFilter'
        *             }
        *         }
        *     }
        * });
        *
        * //禁用子表金额字段
        * meta['lcdpmarinfo_sub'].items.find(item=>{
        *     if(item.attrcode == 'money'){
        *         item.disabled = true;
        *     }
        * });
        * //禁用主表单总金额和总数量字段
        * meta[area].items.find(item=>{
        *     if(item.attrcode == 'money' || item.attrcode == 'cnum'){
        *         item.disabled = true;
        *     }
        * });
	    ******************************************************************************************************/
        //如果是云原生适配，saga开头的属性全部隐藏
        meta[area].items.filter(item=>{
            if(item.attrcode.startsWith('saga')){
                item.visible = false;
                item.disabled = true;
            }
        });
       /******************************************************************************************************
        * 找到表格要做成超链接的列
        * 在initMeta方法中
        * meta 是使用loadNCCResources请求回来的模板信息
        * 'lcdpfinance_sub' 是财务信息子表区域编码
        *
        * meta['lcdpfinance_sub'].items.find(item=>{
        *     if(item.attrcode == 'def1'){
        *         item.renderStatus = 'browse';
        *         item.render = (text,record,index)=>{
        *
        *             let url = text.value;
        *             if(!text.value.startsWith("http://") && !text.value.startsWith("https://")){
        *                 url = "http://"+url;
        *             }
        *             //使用window.open打开链接
        *             return (<a onClick={()=>{window.open(url,'_blank');}} style={{cursor:'pointer'}}>{text.value}</a>);
        *         };
        *     }
        * });
        * //某表单项做成超链接
        * meta[area].items.find(item=>{
        *     if(item.attrcode == 'memo'){
        *         item.render = (text,record,index)=>{
        *          
        *             //使用window.open打开链接
        *             return (<a 
        *                 onClick={()=>{window.open("https://react.docschina.org/docs/getting-started.html",'_blank');}} 
        *                 style={{cursor:'pointer'}}>
        *                     {text.value}
        *             </a>);
        *         }
        *     }
        * });
        ******************************************************************************************************/
    }
    /**
     *	initButton方法 功能介绍：
     *		 触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
     *       功能简介：对加载完的按钮数据进行个性化调整
     *		 举例功能：
     *			1、禁用某按钮 参见Demo1
     */
    initButton = (buttons) => {
       /**
	    * Demo1 处理按钮
	    * 场景描述： 有时需要在按钮数据加载之后进行一些处理
	    * 达成效果： 按钮不可见，并且禁用
	    * 写法解释： 迭代所有按钮，找到Save按钮，设置按钮的可见性和禁用型
	    * 代码示例 : 
        * buttons.find(btn=>{//迭代buttons
    	* 	if(btn.key == 'Save'){//找到button的key为Save的按钮
    	* 		btn.disabled = true;//设置按钮禁用
    	* 		btn.visible = false;//设置按钮隐藏
    	* 	}
    	* });
	    */
    }
    /******************************************************************************************************
     * createState方法 功能介绍：
     *       触发时机：构造函数中触发
     *       功能简介：为当前应用创建完整的VM（视图模型），通过该VM模型，可影射出节点的全貌，开发需要重点关注该模型
     *                生命周期函数render只是对该模型的一种渲染方式            
     * 	创建应用的state模型
     * 	state的模型结构与页面结构是一致的.请优先阅读开头的说明 3.2 createState方法，render方法
     * 	state中存放必须并且常用得属性
     * 	isPageReady: 页面开始渲染组件的标识，只有isPageReady的值是true，才进行真正的组件渲染
     *               React在构造函数执行完后会立即调用render方法渲染页面,此时可能模板还没有加载完成,所以通过此属来标记模板等初始化数据是否加载完成. 加载完成后,isPageReady=true.
     * 			     才开始正式得渲染页面，参考render方法这种对isPageReady的使用。
     * 	showmode：   页面当前的显示模型,SHOWMODE为前缀的常量定义,你的应用有几个页面的,就有几个SHOWMODE的常量定义 分别
     *               分别对应不同页面,比如，主从页面中(不带插件), 有列表和卡片两个页面, 则会使用到SHOWMODE_LIST
     *               SHOWMODE_CARD, render方法的中根据showmode值,来具体渲染页面.
     * 	editmode: 页面当前编辑模式,有两种状态, EDITMODE为前传的常量定义， EDITMODE_BROWSE,EDITMODE_EDIT;
     *               高阶组件的中的编辑状态与它保持一致的。当设置或改变editmode时,高阶组件的状态也要随之变化,
     *               如form formlist.
     * 	模型结构定义说明： 建议优先阅读开头的说明3.2 createState方法，render方法
     * 	这块基本模型，含义，表示是什么，起什么作用：参考3.2 create方法， 但是要结合你的模型
     * 	主子表
     * 	其他功能是如何在state中定义
     * 	插件特性模型的加入通过Utils.apply方法将其他模型(插件模型)加入到state中
     * 	可参见此方法中的具体的Utils.apply的注释
     * 	例子：
     * 	state = { //基本模型
     *      list:{} 
     *      card:{}
	 *		...
     * 	}
     * 	uploader: { //上传组件
     *      visible: false, 
     *      billId: '',
     *      onHide: this.onHideUploader
     * 	}
     * 	通过调用Utils.apply方法 Utils.apply(state, {uploader});
	 *	在结构上体现成：
	 *		state = {
	 *			list:{}
	 *			card:{}
	 *		};
	 *		Utils.apply(state,{uploader});
     * 		体现的结果为:
     * 		state = { //基本模型
     *      	list:{} 
     *      	card:{}
     *      	uploader: { //上传组件
     *         		visible: false, 
     *          	billId: '',
     *          	onHide: this.onHideUploader
     *      	}
     * 		}
     ******************************************************************************************************/
    createState = () =>{
        let state = {
            isPageReady :  false,          //页面资源是否加载完成
            editmode :  EDITMODE_BROWSE,   //页面当前的编辑模式
            showmode : SHOWMODE_CARD,      //页面的限时模式
            //头部标题组件配置
            head : {
                title : this.config.title, //标题
                initShowBackBtn : false//是否显示返回按钮
            },
            showOff: {
                disabled:false,
                checked:false,
                label:'显示停用',
                onChange:this.onShowOffChange
            },
            //肩部按钮组件配置
            btn : {
                area :  'common',//按钮组件区域编码,
                buttonLimit : 3,//限制个数（好像没用）
                onButtonClick : (props,btncode)=>{this.onBtnClickHead({props,btncode})},//按钮点击事件
            },
            //树卡左右拖拽组件配置
            dragComp : {
            	//树组件
                tree : {
                	//根配置
                    root : {
                        isleaf : false,
                        key : "root",
                        title : "大区-陈金明",//this.Lang[this.config.appcode+"-00001"]/* 国际化处理： 供应商基本分类*/,
                        id : "root",
                        innercode : "root",
                        pid : "",
                        refname : "大区-陈金明",//this.Lang[this.config.appcode+"-00001"]/* 国际化处理： 供应商基本分类*/,
                        refpk : "root",
                        nodeData:{}
                    },
                    treeId : 'region_CjmMaster_tree',	//树组件编码 
                    needSearch : true,//树组件需要查询区
                    disabledSearch : false,//禁用查询区
                    showLine : true,//显示树节点连线
                    needEdit : true,//树节点本身需要编辑
                    showModal : false,//弹出编辑树节点
                    onSelectEve : this.onTreeNodeSelect,        //选择树节点事件
                    onMouseEnterEve : this.onMouseEnter,		//鼠标停留在树节点上的回调事件
                    searchType:'filtration',//树节点过滤方式
                    onTreeExpand:this.onTreeExpand,
                    expandedKeys:[],
                    clickAddIconEve : (node)=>{this.onBtnClickHead({props:this.props,btncode:ACTIONS.ADD,selectedNode : node});},    //新增点击 回调
                    clickEditIconEve : (node)=>{this.onBtnClickHead({props:this.props,btncode:ACTIONS.EDIT,selectedNode : node});},  //编辑点击 回调
                    clickDelIconEve : (node)=>{this.onBtnClickHead({props:this.props,btncode:ACTIONS.DELETE,selectedNode : node});},    // 删除点击 回调
                    selectedNode : null								//选中的树节点 （常用）
                },
                //卡片组件配置
                card : {
                	//表单组件配置
                    form : {
                        area : 'region_CjmMasterForm',//表单区域编码,
                        onAfterEvent : this.onAfterEditForm,//表单编辑后事件
                        onBeforeEvent : this.onBeforeEditForm,//表单编辑前事件
                        cancelPSwitch : true,//取消开关切换时的气泡提示
                    }
                },
                defLeftWid : '280px',//左右拖拽组件左侧默认宽度
                leftMinWid : '280px' //左右拖拽组件左侧最小宽度
            }
        };
        //Utils.apply 与 Obejct.assign功能一致都是合并其他参数对象到第一个参数对象中，返回第一个参数对象（第一个参数对象的内容会发生改变，涉及处理地址指针的时候可能会有问题，需要Utils.apply({},a,b)不该变原始对象）
        Utils.apply(state, {
        	//合并导入导出配置对象到state
            execlExport : {
                // 导入导出组件
                moduleName : 'pu',
                billType : 'REGION_CJMMASTER_4004800H1',//导入导出的单据类型
                selectedPKS : [],//导出时选中的数据主键集合
                appcode : this.config.appcode, //应用编码
                pagecode : this.config.pagecode//页面编码
            },
        	//合并打印输出配置对象到state
        	//打印输出组件配置
        	printOutput : {
        		url : URLS.printUrl,//打印输出的url
        		data : {
        			//这里有listNodeKey(列表打印模板key)和cardNodeKey(卡片打印模板key)
        			funcode : '4004800H1',
        			nodekey : '4004800H101',
        			cardNodeKey : '4004800H102',
        			outputType : 'output',
        			oids : '[]',
        			listNodekey : '4004800H101',
        		}
        	},
			//合并附件配置对象到state   
			//附件管理组件配置
			attachment : {
				show : false,//是否显示
				billId : '',//单据主键
				onHide : () => {//关闭附件管理弹窗时的回调函数
			    	this.state.attachment.show =!this.state.attachment.show;
			    	this.setState(this.state);
			    }
			}
        });
        return state;
    }
    /**
     * render方法 功能介绍
     *       触发时机：state发生变化时，虚拟DOM与真实DOM有区别即触发
     *       功能介绍：渲染视图，state中当前应用的VM的一种视图展示
     * @returns DOM
     */
    render(){
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格组件配置
		 */
        let {form,formList,tabs} = card;
        /**
                               *    解构form
         * area 表单区域编码
         * others:其他配置，参考createState方法中form对象的配置
         */
        let {area,...others} = form;
        if(!isPageReady) return ''; //页面资源加载完成后才能渲染页面
        
        //渲染头部标题和按钮
        const renderHead = ()=>{
            return <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className="header">
                    {/* 创建标题 */}
                    <NCDiv areaCode={NCDiv.config.Title} className='header-title-search-area'>
                        {this.props.BillHeadInfo.createBillHeadInfo({...head})}
                    </NCDiv>
                    {renderShowOff()}
                    {/* 创建按钮 */}
                    <div className="btn-group">
                        {this.props.button.createButtonApp({...btn})}
                    </div>
                </div>
            </NCDiv>;
        };
        //渲染tree部分的定义
        const renderTree = () => {
        	//创建树组件
            return <div className="tree-area">
            	{this.props.syncTree.createSyncTree(tree)}
            </div>;
        };
        //渲染card部分的定义
        const renderCard = () =>{
            return  (
	             <div className='nc-bill-card'>
	                 {/* 表单 */}
	                 <NCDiv areaCode={NCDiv.config.FORM} className="nc-bill-form-area">
	                     <NCScrollElement name={area}>
	                         {this.props.form.createForm(area,{...others})}
	                     </NCScrollElement>
	                 </NCDiv>
	             </div>
            ); 
        };
        //渲染树卡的左右拖拽组件
        const renderDragComp = ()=>{
        	let conf = {
                leftDom : renderTree(),
                rightDom : renderCard(),
                defLeftWid,
                leftMinWid
            };
            return <div className="tree-card">
               <this.props.DragWidthCom {...conf}/>
            </div>;
        };
        const renderShowOff = ()=>{
            let {label,...showOffOthers} = this.state.showOff;
            return  <span className="showOff">
                <NCCheckbox {...showOffOthers}>
                    {label}
                </NCCheckbox>
            </span>
        }
            return ( 
                <div className="nc-bill-tree-card">
                    {/* 渲染页面上部 */}
	                {renderHead()}
	                {/* 渲染页面中部, 中部区域分为左右两个,左边为树渲染 */}
	                {renderDragComp()}
	                {/* 导出组件 */}
	                <ExcelOutput {...this.props} {...this.state.execlExport}/>
	        		{/* 打印输出组件 */}
	        		<PrintOutput {...this.state.printOutput}/>
			        {/* 附件组件 */}
			        {attachment.show && <NCUploader {...attachment}/>}
					{/*树卡型应用DEMO(LCDP供应商)扩展： 渲染对话框*/}
					{/*在render方法中创建弹窗*/}
                    {/* {this.props.modal.createModal('ShowModal')} */}
                </div>
            );
    }
//============================== 功能方法区 ↓==============================
    /**
     * updateBtnStatus方法 功能介绍
     *       触发时机：一般按钮动作之后需要触发更新按钮状态
     *       功能介绍：对应用的按钮状态进行控制
     * @param callback 回调函数  有需要的可以添加回调 
     */
    updateBtnStatus = ( callback = EMPTY_FN ) =>{
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
        let {paramMap} = context;
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        let {formList,copy} = card;
        let {selectedNode,root} = tree;
        let isFetchBillMode = (showmode == SHOWMODE_FETCHCARD || showmode == SHOWMODE_FETCHLIST);
        let isRoot = selectedNode && selectedNode.refpk == root.refpk;
        let treeData = this.props.syncTree.getSyncTreeValue(tree.treeId);
        
        let hasTreeData = !!treeData && !!treeData[0] &&!!treeData[0].children && treeData[0].children.length>0;
        //核心按钮
        let coreBtns = {
        	//保存按钮 编辑模式不是浏览态 && 不是拉单模式-->保存显示
            [ACTIONS.SAVE] : editmode != EDITMODE_BROWSE && !isFetchBillMode,
            //保存新增按钮 编辑模式是新增态 && 不是拉单模式-->保存新增显示
            [ACTIONS.SAVEADD] : editmode == EDITMODE_ADD && !isFetchBillMode,
            //取消按钮 编辑模式不是浏览态 && 不是拉单模式-->取消显示
            [ACTIONS.CANCEL] : editmode != EDITMODE_BROWSE && !isFetchBillMode,
            //刷新按钮 编辑模式是浏览态 && 不是拉单模式--> 刷新显示
            [ACTIONS.REFRESH] : editmode == EDITMODE_BROWSE && !isFetchBillMode,
		    [ACTIONS.COPY] : editmode == EDITMODE_BROWSE && !isRoot && selectedNode && !isFetchBillMode,
		    //树卡型应用DEMO(LCDP供应商)扩展： 控制按钮的状态
		    //'ShowModal':editmode == EDITMODE_BROWSE && !isFetchBillMode,
            [ACTIONS.MORE]:editmode == EDITMODE_BROWSE && !isFetchBillMode,
        };

        let appendSubBtns = [
                    
        ];//如果有自己添加的卡片表格按钮，可以把按钮的code放到这里面
        let subTableAreaCode = Object.keys(formList || {});
        let subBtns = [];
        (this.props.button.getButtons() || []).filter(btn=>{
            //子表的按钮编码要以对应表格的区域编码开头,这里是一个约定，希望大家遵守这个约定！！！
            //如果确实有特殊的按钮编码不能以表格区域编码开头，则可以把按钮编码手动维护到appendSubBtns这里
            let isStartWithSubArea = subTableAreaCode.find(subarea=>{return btn.key.startsWith(subarea)});
            return isStartWithSubArea || appendSubBtns.includes(btn.key);
        }).forEach(btn=>{
            if(btn.type == 'buttongroup'){
                //子表分组按钮时，拿分组的子按钮
                subBtns = [...subBtns,...btn.children];
            }else{
                //其他追加的子表按钮编码要以子表区域编码为开头
                subBtns.push(btn);
            }
        });
        //子表的按钮 经过该代码块之后返回的是一个对象({btnA:true,btnB:false})
        subBtns ={};
        //审批流相关按钮
        let pfBtns = {
        };
        let fetchBtns = {
        };  
		let enableStateBtns = {
            [ACTIONS.ENABLE]: (paramMap && paramMap.pk_transtype && !!selectedNode && selectedNode.nodeData[FIELDS.TRANSTYPEPK]!= paramMap.pk_transtype) ? false: (editmode == EDITMODE_BROWSE && hasTreeData && !isFetchBillMode),
            [ACTIONS.DISABLE]: (paramMap && paramMap.pk_transtype && !!selectedNode && selectedNode.nodeData[FIELDS.TRANSTYPEPK]!= paramMap.pk_transtype) ? false: (editmode == EDITMODE_BROWSE && hasTreeData && !isFetchBillMode)
        };
        let disabledEnableBtns = {
            [ACTIONS.ENABLE]: !(editmode == EDITMODE_BROWSE && !isRoot && !!selectedNode && !(selectedNode.nodeData[FIELDS.ENABLESTATE]==2)),
            [ACTIONS.DISABLE]:!(editmode == EDITMODE_BROWSE && !isRoot && !!selectedNode && (selectedNode.nodeData[FIELDS.ENABLESTATE]==2))
        }
        //设置禁用/启用的按钮
        let disabledBtns = {
        	//打印 有选中项 && 选中项不是根 -->打印可点击
    		[ACTIONS.PRINT] :  	!selectedNode || isRoot,
    		//输出 有选中项 && 选中项不是根 -->输出可点击
    		[ACTIONS.OUTPUT] :  	!selectedNode || isRoot,
		    //附件管理 有选中项 && 选中项不是根 -->附件管理可点击
		    [ACTIONS.ATTACHMENT] : !selectedNode || isRoot,
            //导入按钮 编辑模式是浏览态 && 不是拉单模式-->导入显示
            [ACTIONS.IMPORT] : !(editmode == EDITMODE_BROWSE && !isFetchBillMode),
            //导出按钮 编辑模式是浏览态 && 不是拉单模式-->导入显示
            [ACTIONS.EXPORT] : !(editmode == EDITMODE_BROWSE && !isFetchBillMode),
            //打印按钮 编辑模式是浏览态 && 不是拉单模式-->导入显示
    		[ACTIONS.PRINT] : !(editmode == EDITMODE_BROWSE && !isFetchBillMode && hasTreeData),
    		//输出按钮 编辑模式是浏览态 && 不是拉单模式-->导入显示
    		[ACTIONS.OUTPUT] : !(editmode == EDITMODE_BROWSE && !isFetchBillMode && hasTreeData),
		    //附件管理按钮 编辑模式是浏览态 && 不是拉单模式 && 不是根节点-->附件管理显示
		    [ACTIONS.ATTACHMENT] : !(editmode == EDITMODE_BROWSE && !isFetchBillMode && !isRoot),
        };
        //设置按钮禁用
        this.props.button.setButtonDisabled({
        	...disabledBtns,
            ...disabledEnableBtns
        });
        //设置按钮可见性
        this.props.button.setButtonVisible({
            ...coreBtns,
            ...(subBtns || {}),
            ...(pfBtns || {}),
            ...(fetchBtns || {}),
            ...(enableStateBtns || {})
        });
    }
    /**
     * loadTree方法 功能介绍
     *       功能介绍：加载树数据
     * @param {
     *           url:请求url
     *           data:请求参数对象
     *        } 
     */
    loadTree = ({url = URLS.loadTreeUrl,data = {}}) => {
        let {checked} = this.state.showOff;
        data = {...data,showOff:checked};
        return new Promise((resolve,reject)=>{
            ajax({
                url,
                data,
                success : (res)=>{
                    res.success?resolve(res) : reject(false);//todo reject
                },
                error : (e)=>{
                    toast({title : e.message,color : 'danger'});
                }
            });
        });
    }
   /**
    * fillTree方法 功能介绍
    *       功能介绍：填充树组件数据
    * @param {
    *           data:树数据参数对象
    *        } 
    */
    fillTree = ({data = []}) => {
        return new Promise(resolve=>{
            let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        	let {tree,card,defLeftWid,leftMinWid} = dragComp;
            let {treeId,root} = tree;
            this.props.syncTree.setTreeData({
                treeId,
                data : [Utils.apply(root,{children : data || []})]
            },()=>{
                resolve(data);
            });
        });
    }
    /**
     * delTree方法 删除树
     *      功能介绍：删除树节点数据
     * @param  {
     *            url:删除请求
     *            data:删除请求参数 
     *         } 
     * @returns 
     */
    delTree = ({url = URLS.deleteUrl,data = {}})=>{
        return new Promise((resolve,reject)=>{
            ajax({
                url,
                data,
                success : (res)=>{
                    res.success?resolve(res) : reject(false);
                },
                error : (e)=>{
                    toast({title : e.message,color : 'danger'});
                }
            });
        });
    }
    /**
     * loadCard方法 加载卡片
     *      功能介绍：查看卡片数据、修改卡片数据、新增卡片数据 都需要先加载卡片数据 
     * @param {*} param0 
     * @returns 
     */ 
    loadCard = ({url = URLS.loadUrl,data = {}}) =>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
         /**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格组件配置
		 */
        let {form,formList} = card;
        //结构form area:表单区域编码
        let {area} = form;
        return new Promise(resolve=>{
            ajax({
                url : url?url : URLS.addUrl,
                data : {
                	//请求数据
                    ...data,
                    //页面编码
                    pageCode : this.config.pagecode,
                    //表单区域编码
                    formId : area,
                },
                success : (res)=>{
                    resolve(res.data);
                }
            });
        });
    }
   /**
    * fillTree方法 功能介绍
    *       功能介绍：填充树组件数据
    * @param {
    *           data:树数据参数对象
    *        } 
    */
    fillCard = ({data = {}}) =>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
    	/**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //结构form area:表单区域编码
        let {area} = form; 
        //设置表单数据
        return this.fillFormData({
            formId : area,data : data && data.head
        })    }
    /**
     * fillFormData方法 功能介绍
     *       功能介绍：填充表单数据
     * @param     {
     *              data : 卡片数据参数对象
     *            }
     */
    fillFormData = ({data = {}})=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //结构form area:表单区域编码
        let {area} = form; 
        return new Promise(resolve=>{
        	//设置表单数据
            this.props.form.setFormData({formId : area,data : data || {}},()=>{
                resolve(true);
            });
        });
    }
    /**
     * saveCard方法 功能介绍
     *       功能介绍：保存卡片数据
     * @param     {
     *				 url : 保存请求url
     *               data : 保存请求参数对象
     *            } 
     */
    saveCard = ({url = URLS.saveUrl,data = {}})=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
    	/**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //结构form area:表单区域编码
        let {area} = form;
        //构造保存数据
        let billCard = data || this.buildReqParam();
        return new Promise(resolve=>{
            ajax({
                url,
                data : {
                    pageCode : this.config.pagecode,
                    formId : area,
                    billCard,
                },
                success : (res)=>{
                    resolve(res.data);
                }
            });
        });
    }
    /**
     * clearCard方法 功能介绍
     *       功能介绍：清空卡片数据
     */ 
    clearCard = ()=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form : {area},formList} = card;
        this.props.form.clearFormData(area);
        return Promise.resolve(true);
    }
    /**
     * getTreeAllPks方法 功能介绍
     *       功能介绍：获得树数据所有的数据pk集合
     * @param treeData：输数据集合
     */
    getTreeAllPks = (treeData=[]) => {
    	//返回的结果集
        let result = new Array();
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		 * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //解构tree root:树组件根节点配置
        let {root} = tree;
        //递归调用
        const loop = (treeData) => {
            (treeData || []).forEach(data => {
                if (data.refpk != root.refpk) {
                    result.push(data.refpk);
                }
                //有children，递归到children获取数据pk
                if (data.hasOwnProperty('children') && data.children && data.children.length > 0) {
                    loop(data.children);
                }
            })
        }
        //迭代树结构获得所有树节点pk
        loop(treeData);
        return result;
    }
    /**
     * onRefresh方法 功能介绍
     *       功能介绍：执行刷新
     *		 触发时机：onRefresh时、pageReady时、onFetchExit时等时机触发
     */
    doRefresh = ()=>{
    	//加载树数据
    	return this.loadTree({
    		url:URLS.loadTreeUrl,
    		data:{}
    	}).then(res=>{
            //填充树数据
            return this.fillTree({data : res.data});
        }).then((data)=>{
        	/**
			 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
			 * isPageReady:页面是否已经初始化
			 * showmode:显示模式  list|card|fetchlist|fetchcard
			 * editmode:编辑模式  browse|edit|add
			 * btn:应用肩部按钮组件配置
			 * head:应用标题组件配置
			 * dragComp:树卡应用左右拖拽组件配置
			 * execlExport:导入导出功能组件配置
			 * printOutput:打印输出功能组件配置
			 * attatchment:附件管理功能组件配置
			 */
            let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
            /**
			 * 解构dragComp
			 * tree:树组件配置
			 * card:卡片组件配置
			 * defLeftWid:默认左侧宽度
			 * leftMinWid:左侧最小宽度
			 */
            let {tree,card,defLeftWid,leftMinWid} = dragComp;
            /**
             * 解构树组件
             * root: 根节点配置
             * treeId: 树组件编码
             * selectedNode: 选中的树节点
             */
            let {root,treeId,selectedNode} = tree;
            this.disableTree(treeId,false);
            //展开根节点
            this.props.syncTree.openNodeByPk(treeId, root.refpk);
            //当前选中数据
            let curNode = false;
            if(selectedNode && selectedNode.refpk!=root.refpk){
                curNode = this.props.syncTree.getSyncTreeValue(treeId,selectedNode.refpk);
            }
            if(!curNode && data && data.length>0){
                curNode = data[0];
            }
            if(!curNode){
                curNode = root;
            }
            if(curNode){//存在选中数据
            	//当前选中节点 设置 选中样式
                this.selectTreeNode(curNode.refpk);
                //同步state的选中项
                this.state.dragComp.tree.selectedNode = curNode;
                return new Promise((resolve)=>{
                    this.setState(this.state,()=>{resolve(true);});
                }).then(()=>{
                	//清空卡片信息
                    return this.clearCard();
                }).then(()=>{
                	//加载卡片信息
                    return curNode.refpk == root.refpk ? Promise.resolve(true) : this.loadCard({data : {pk : curNode.refpk},url : URLS.loadUrl});
                }).then((res)=>{
                    //填充卡片信息
                    return curNode.refpk == root.refpk ? Promise.resolve(true) : this.fillCard({data : res.data});
                });
            }else{
            	return Promise.resolve(true);
            }
        });
    }
    /**
     * disableTree方法 功能介绍
     *       功能介绍：禁用树节点
     *		 触发时机：界面进入编辑态时触发禁用，恢复浏览态时触发启用
     * @param {*} treeId 树id
     * @param {*} bool 是否禁用  禁用：true；不禁用：false
     * @param {*} nodePk 某个树节点的pk，如果为空,则禁用整个树或不禁用整个树
     */
    disableTree = (treeId,bool,nodePk = null) => {
    	//设置树节点禁用或者启用
        this.props.syncTree.setNodeDisable(treeId,bool,nodePk);
    }
    /**
     * disableTree方法 功能介绍
     *       功能介绍：根据pk选中对应的树节点
     *		 触发时机：点击树节点时触发
     * @param {*} pk 选中树节点的主键
     */
    selectTreeNode = (pk)=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
	     * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //结构tree treeId: 树组件编码
        let {treeId} = tree;
        //设置选中
        this.props.syncTree.setNodeSelected(treeId,pk);
    }
    /**
     * setFormStatus方法 功能介绍
     *       功能介绍：设置表单的状态
     *		 触发时机：页面状态切换时触发
     */
    setFormStatus = ()=>{
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
	     * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //结构form area:表单区域编码
        let {area} = form; 
        //设置表单状态
        this.props.form.setFormStatus(area,editmode);
    }
    /**
     * buildReqParam方法 功能介绍
     *       功能介绍：构造保存时卡片界面上的数据参数对象
     *		 触发时机：保存时触发
     */
    buildReqParam = ()=>{
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
	     * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */
        let {form,formList} = card;
        //解构form area: 表单区域编码
        let {area} = form;
        //表格区域编码集合
        let tableIds = formList ? Object.keys(formList) : [];
        //获取卡片上 表单和所有表格的数据
        return this.props.createExtCardData(this.config.pagecode, area,tableIds );//卡片所有数据
    }
    /**
     * validateToSave方法 功能介绍
     *       功能介绍：验证公式校验
     *		 触发时机：执行onSave方法时触发
     */
    validateToSave = ({data,areas : {formId,tables}})=>{
    	return new Promise((resolve)=>{
	        this.props.validateToSave(
	        	data,//卡片数据
	        	()=>{resolve(true);},//回调函数
	        	{
	        		[formId] : 'form',//表单类型配置
	        		...tables //table对象  tableAreaCode:'cardTable'
	        	},
	        	'extcard' //固定写法
	        );
    	});
    }
//============================== 功能方法区 ↑==============================

//============================== Action动作派发区 ↓==============================
    /*******************************************************
     * 列表、卡片、拉单列表、拉单卡片 页面右上角按钮点击事件
     * 
     * props:由于this.props可以取到，所以参数props，可以不必要
     * 如果想把方法体的逻辑挪到单独的js文件中,可能props是必要的参数
     * btncode:所点击按钮的编码
     * selectedNode:树节点上点击新增、修改、删除 时给出的选中节点对象
     *******************************************************/
    onBtnClickHead = ({props,btncode,selectedNode}) =>{
        switch (btncode) {
            case ACTIONS.ADD :              //新增
                this.onAdd({node:selectedNode});
                break;
            case ACTIONS.EDIT :             //修改
                this.onEdit({node:selectedNode});
                break;
            case ACTIONS.COPY :             //复制
                this.onCopy();
                break;
            case ACTIONS.DELETE :           //删除
                this.onDelete({node:selectedNode});
                break;
            case ACTIONS.REFRESH :          //刷新
                this.onRefresh();
                break;
            case ACTIONS.CANCEL :           //取消
                this.onCancel(); 
                break;
            case ACTIONS.SAVE :             //保存
                this.onSave();
                break;
            case ACTIONS.SAVEADD :          //保存新增
                this.onSaveAdd();
                break;
            case ACTIONS.ENABLE:            // 点击启用
            case ACTIONS.DISABLE:           // 点击停用
                this.onEnableOrDisable({isEnable: ACTIONS.ENABLE == btncode});
                break;
            case ACTIONS.EXPORT :           //导出  
                this.onExport();
                break;
            case ACTIONS.PRINT :            //打印
                this.onPrint();
                break;
            case ACTIONS.OUTPUT :           //输出
                this.onOutput();
                break;
		    case ACTIONS.ATTACHMENT :       //附件
                this.onAttachment();
                break;
            default:break;
        }
    }
    /*******************************************************
     *  子表区域右上角按钮点击事件
     *  子表按钮编码组成： 表格区域编码+"_"+具体操作名+"Line"/"LineOpr"
     *  如：lcdpfinanceSub_DelLine(表格肩部删除按钮)  lcdpfinanceSub_DelLineOpr（表格行操作删除按钮）
     *******************************************************/
    onBtnClickFormlist = ({props,btncode,index,record})=>{
        let lastIndex = btncode.lastIndexOf("_");
        let areacode = btncode.substr(0,lastIndex);
        let btnCode = btncode.substr(lastIndex+1);
        switch(btnCode){
            case ACTIONS.ADDLINE:           //增行
                this.onAddLine({areacode,index,record});
                break;
            case ACTIONS.DELLINE:           //删行
            case ACTIONS.DELLINEOPR:
                this.onDelLine({areacode,index,record});
                break;
            case ACTIONS.COPYLINE:          //复制行
            case ACTIONS.COPYLINEOPR:
                this.onCopyLine({areacode,index,record});
                break;
            case ACTIONS.PASTENDLINE:       //粘贴行
            case ACTIONS.PASTNEXTLINEOPR:
                this.onPasteLine({areacode,index,record,isEndLine:btnCode == ACTIONS.PASTENDLINE});
                break;
            case ACTIONS.COPYCANCELLINE:    //取消复制行
                this.onCopyCancelLine({areacode,index,record});
                break;
            case ACTIONS.EXPANDLINEOPR:     //侧拉展开
                this.onExpandLine({areacode,index,record});
                break;
            default:break;
        }
    }
//============================== Action动作派发区 ↑==============================

//============================== Action功能流程方法区 ↓==============================
	//树卡型应用DEMO(LCDP供应商)扩展： 点击按钮弹出对话框，显示列表并且加载数据
	// onShowModal = ()=>{
    //     ajax({
    //         url:'/nccloud/lcdp/lcdpsupplier/LoadCustomUserAction.do',
    //         data:{
    //             //页面编码
    //             pageCode : this.config.pagecode,
    //             //表单区域编码
    //             areacode : 'showmodal-table',
    //         },
    //         success:(res)=>{
    //             //弹出对话框
    //             this.props.modal.show('ShowModal',{
    //                 title:'用户列表',
    //                 content:this.props.table.createSimpleTable('showmodal-table',{})
    //             });
    //             //这里modal.show方法没有回调，只能认为modal.show是同步方法
    //             //给对话框中的表格赋值
    //             this.props.table.setAllTableData('showmodal-table',
    //                 res.data['showmodal-table']?{rows:res.data['showmodal-table'].rows}:{rows:[]});
    //         }
    //     })
    // }
    /**
     * linkedQry方法 功能介绍：
     *       触发时机：其他单据引用当前单据数据时，联查跳转到当前页面时触发
     *       功能简介：加载联查的数据
     * @param {*} {pk:联查的数据主键} 
     */
    onLinkedQry = ({pk})=>{
        if(!pk){
            return Promise.resolve(true);
        }
        //场景 审批、联查、追溯等场景
        let scene = this.props.getUrlParam("scene");
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
	     * 解构dragComp
		 * tree:树组件配置
		 * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
		 * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //解构tree treeId: 树组件编码
        let {treeId} = tree;
        this.loadTree({//加载树数据
        	url:URLS.loadTreeUrl,//请求url
            data:{}//参数对象
    	}).then(res=>{
    		//填充树数据
    		//res 加载返回的树数据
            return this.fillTree({data : res.data}).then(()=>{return Promise.resolve(res.data)});
        }).then(()=>{//设置当前选中的节点
        	//获得某个树节点数据
            let treeNode = this.props.syncTree.getSyncTreeValue(treeId,linkId);
            //同步选中当前树节点
            this.state.dragComp.tree.selectedNode = treeNode;
            return new Promise((resolve)=>{
                this.setState(this.state,()=>{
                    resolve(treeNode);
                });
            });
        }).then((treeNode)=>{//设置树节点选中，展开层级
            //展开父节点
            this.props.syncTree.openNodeByPk(treeId, treeNode.pid);
            //选中当前节点
            this.props.syncTree.setNodeSelected(treeId, treeNode.refpk);
            return Promise.resolve(true);
        }).then(()=>{//加载卡片信息
            return this.loadCard({
                url : URLS.loadUrl,//加载卡片url
                data : {pk : linkId}//参数对象
            });
        }).then((res)=>{//填充卡片信息
            return this.fillCard({
                data : res.data //卡片数据
            });
        });
    }
    /***
     * 低版本可能需要
     * 聚焦首个可聚焦的表单项
     * 注意！！！： 如果模板调整或者拆分或者代码中有对模板顺序等调整，需要自己再处理该方法
     */
    focusFirstItem = ()=>{
        // let {dragComp} = this.state;
        // let {card} = dragComp;
        // let {form} = card;
        // let {area} = form;
        // //业务开发应该能明确哪个属性可以聚焦，所以这里应该不需要循环查询
        // //但是从低代码层面是无法确定的，所以只能循环查找
        // (this.props.meta.getMeta()[area].items || []).find(item=>{
        //     if(!item.disabled && item.visible){
        //         this.props.form.setFormItemFocus(area,item.attrcode);
        //         return true;
        //     }
        // })
    }
    /**
     * onAdd方法 功能介绍
     *       功能介绍：新增功能
     *		 触发时机：点击数节点新增图标触发
     * @param node : 树节点数据
     */
    onAdd = ({node})=>{
    	//禁用树组件查询区
        this.state.dragComp.tree.disabledSearch = true;
        this.state.showOff.disabled = true;
        //记录当前选中树节点
        this.state.dragComp.tree.selectedNode = node;
        //编辑模式：新增态
        this.state.editmode = EDITMODE_ADD;
        this.setState(this.state,()=>{
			/**
			 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		     * isPageReady:页面是否已经初始化
			 * showmode:显示模式  list|card|fetchlist|fetchcard
			 * editmode:编辑模式  browse|edit|add
			 * btn:应用肩部按钮组件配置
			 * head:应用标题组件配置
			 * dragComp:树卡应用左右拖拽组件配置
			 * execlExport:导入导出功能组件配置
			 * printOutput:打印输出功能组件配置
			 * attatchment:附件管理功能组件配置
			 */
          	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
        	/**
		     * 解构dragComp
			 * tree:树组件配置
			 * card:卡片组件配置
			 * defLeftWid:默认左侧宽度
			 * leftMinWid:左侧最小宽度
			 */
        	let {tree,card,defLeftWid,leftMinWid} = dragComp;
        	/**
			 * 解构card
			 * form:表单组件配置
			 * formList:卡片表格区域编码
			 */
            let {form,formList} = card;
            //解构form area: 表单区域编码
            let {area} = form;
            /**
             * 解构tree
             * treeId: 树组件编码
             * disabledSearch:树组件查询区禁用
             */
            let {treeId,disabledSearch} = tree;
            //禁用树
            this.disableTree(treeId,disabledSearch);
            //选中当前节点
           	this.selectTreeNode(node.refpk);
           	//清空卡片信息
           	this.clearCard(
           	).then(()=>{
           		let billCard = this.buildReqParam();
           		//加载卡片信息
	           	return this.loadCard({
	                url:URLS.addUrl,
	                data : {
	                    parentId : node.refpk,//父节点pk
	                    billCard,
	                    userJson : {
	                    	//parentKey:父属性的field，parentPk:父节点pk
	                        data : {parentKey : FIELDS.PARENT_ID,parentPk : node.refpk}
	                    }
	                }
	            });
           	}).then((res)=>{
           		//res : 加载的卡片数据
           		//填充卡片数据
           		return this.fillCard({data : res.data}).then(()=>{return Promise.resolve(res);});
            }).then((res)=>{
            	//res : 编码规则返回结果
            	//设置表单状态
                this.setFormStatus();
                this.focusFirstItem();
                //更新按钮状态
                this.updateBtnStatus();
                // 如果存在组织属性，并且个性化设置-业务设置那设置了组织，则默认在新增时把组织字段在界面上
                context && context.pk_org && this.props.form.setFormItemsValue(area, {[FIELDS.PK_ORG]: {display: context.org_Name, value: context.pk_org}});
            });
        });
    }
    /**
     * onEdit方法 功能介绍
     *       功能介绍：修改功能
     *		 触发时机：点击数节点修改图标触发
     * @param node : 树节点数据
     */
    onEdit = ({node})=>{
    	//禁用树组件查询区
        this.state.dragComp.tree.disabledSearch = true;
        this.state.showOff.disabled = true;
        //记录当前选中树节点
        this.state.dragComp.tree.selectedNode = node;
        //编辑模式：新增态
        this.state.editmode = EDITMODE_EDIT;
        this.setState(this.state,()=>{
        	/**
			 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		     * isPageReady:页面是否已经初始化
			 * showmode:显示模式  list|card|fetchlist|fetchcard
			 * editmode:编辑模式  browse|edit|add
			 * btn:应用肩部按钮组件配置
			 * head:应用标题组件配置
			 * dragComp:树卡应用左右拖拽组件配置
			 * execlExport:导入导出功能组件配置
			 * printOutput:打印输出功能组件配置
			 * attatchment:附件管理功能组件配置
			 */
            let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
            /**
		     * 解构dragComp
			 * tree:树组件配置
			 * card:卡片组件配置
			 * defLeftWid:默认左侧宽度
			 * leftMinWid:左侧最小宽度
			 */
        	let {tree,card,defLeftWid,leftMinWid} = dragComp;
            let {form} = card;
            let {area} = form;
        	/**
             * 解构tree
             * treeId: 树组件编码
             * disabledSearch:树组件查询区禁用
             */
            let {treeId,disabledSearch}= tree;
            //设置选中树节点
            this.selectTreeNode(node.refpk);
            //禁用树组件
            this.disableTree(treeId,disabledSearch);
            //加载卡片信息
            this.loadCard({
                url : URLS.editUrl, //请求url
                data : {pk : node.refpk}//请求参数对象 pk:选中的树节点pk
            }).then((res)=>{
            	//res:树节点信息返回结果
            	//填充卡片数据
                return this.fillCard({data : res.data}).then(()=>{return Promise.resolve(res)});
            }).then((res)=>{
            	//设置表单状态
                this.setFormStatus();
                this.focusFirstItem();
                //更新按钮状态
                this.updateBtnStatus();
                //更新按钮状态
                this.updateBtnStatus();
            });
        })
    }
    onCopy = ()=>{
    	//禁用树组件查询区
        this.state.dragComp.tree.disabledSearch = true;
        this.state.showOff.disabled = true;
        //记录当前选中树节点
        //this.state.dragComp.tree.selectedNode = node;
        //编辑模式：新增态
        this.state.editmode = EDITMODE_ADD;
        this.setState(this.state,()=>{
        	/**
			 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
		     * isPageReady:页面是否已经初始化
			 * showmode:显示模式  list|card|fetchlist|fetchcard
			 * editmode:编辑模式  browse|edit|add
			 * btn:应用肩部按钮组件配置
			 * head:应用标题组件配置
			 * dragComp:树卡应用左右拖拽组件配置
			 * execlExport:导入导出功能组件配置
			 * printOutput:打印输出功能组件配置
			 * attatchment:附件管理功能组件配置
			 */
            let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
            /**
		     * 解构dragComp
			 * tree:树组件配置
			 * card:卡片组件配置
			 * defLeftWid:默认左侧宽度
			 * leftMinWid:左侧最小宽度
			 */
        	let {tree,card,defLeftWid,leftMinWid} = dragComp;
            let {form} = card;
            let {area} = form;
        	/**
             * 解构tree
             * treeId: 树组件编码
             * disabledSearch:树组件查询区禁用
             */
            let {treeId,disabledSearch,selectedNode}= tree;
            //设置选中树节点
            this.selectTreeNode(selectedNode.refpk);
            //禁用树组件
            this.disableTree(treeId,disabledSearch);
            //加载卡片信息
            this.loadCard({
                url : URLS.copyUrl, //请求url
                data : {pk : selectedNode.refpk}//请求参数对象 pk:选中的树节点pk
            }).then((res)=>{
            	//res:树节点信息返回结果
            	//填充卡片数据
                return this.fillCard({data : res.data}).then(()=>{return Promise.resolve(res)});
            }).then((res)=>{
            	//设置表单状态
                this.setFormStatus();
                this.focusFirstItem();
                //更新按钮状态
                this.updateBtnStatus();
            });
        })
    }
    /**
     * 方法功能：
     *      点击停用或启用按钮
     *      isEnable: true点击启用按钮, false点击停用按钮
     */
    onEnableOrDisable = ({isEnable}) => {
       /**
        * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
        * isPageReady:页面是否已经初始化
        * showmode:显示模式  list|card|fetchlist|fetchcard
        * editmode:编辑模式  browse|edit|add
        * btn:应用肩部按钮组件配置
        * head:应用标题组件配置
        * dragComp:树卡应用左右拖拽组件配置
        * execlExport:导入导出功能组件配置
        * printOutput:打印输出功能组件配置
        * attatchment:附件管理功能组件配置
        */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
       /**
        * 解构dragComp
        * tree:树组件配置
        * card:卡片组件配置
        * defLeftWid:默认左侧宽度
        * leftMinWid:左侧最小宽度
        */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
        * 解构tree
        * treeId: 树组件编码
        * disabledSearch:树组件查询区禁用
        */
        let {treeId,selectedNode,root,expandedKeys} = tree;
        if(!selectedNode){
            toast({title:'请选中需要停用的树节点',color:'warning'});
            return;
        }
        if(selectedNode.refpk == root.refpk){
            toast({title:'根节点不可停用',color:'warning'});
            return;
        }
        ajax({
            url: isEnable ? URLS.enableUrl : URLS.disableUrl,
            data: {pks:[selectedNode.refpk],isEnable},
            success: (res) => {
                if(res.success){
                    this.doRefresh().then(()=>{
                        this.updateBtnStatus();
                        //展开树节点
                        this.props.syncTree.openNodeByPk(treeId,expandedKeys);
                    })
                }
            }
        })
    }
    onTreeExpand = (expandKeys)=>{
        this.state.dragComp.tree.expandedKeys = expandKeys;
        this.setState(this.state);
    }
    /**
     * 显示停用复选框选中改变事件
     */
    onShowOffChange = (value)=>{
        this.state.showOff.checked = value;
        this.setState(this.state,()=>{
            this.doRefresh().then(()=>{
                this.updateBtnStatus();
            });
        })
    }
    /**
     * onDelete方法 功能介绍
     *       功能介绍：删除功能
     *		 触发时机：点击数节点删除图标触发
     * @param node : 树节点数据
     */
    onDelete = ({node})=>{
    	//存在子节点的数据不允许删除
    	if(node && node.children && node.children.length>0){
            toast({title : '当前树节点数据存在子节点数据，不允许删除！',color : 'danger'});
            return;
        }
        promptBox({				//删除对话框提示
            color : 'warning',
            title : '确认删除', /* 国际化处理： 确认删除*/
            content : '是否确认要删除?', /* 国际化处理： 是否确认要删除?*/
            beSureBtnClick  :  () => {
            	/**
				 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
			     * isPageReady:页面是否已经初始化
				 * showmode:显示模式  list|card|fetchlist|fetchcard
				 * editmode:编辑模式  browse|edit|add
				 * btn:应用肩部按钮组件配置
				 * head:应用标题组件配置
				 * dragComp:树卡应用左右拖拽组件配置
				 * execlExport:导入导出功能组件配置
				 * printOutput:打印输出功能组件配置
				 * attatchment:附件管理功能组件配置
				 */
                let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
                /**
			     * 解构dragComp
				 * tree:树组件配置
				 * card:卡片组件配置
				 * defLeftWid:默认左侧宽度
				 * leftMinWid:左侧最小宽度
				 */
                let {tree,card,defLeftWid,leftMinWid} = dragComp;
                /**
	             * 解构tree
	             * treeId: 树组件编码
	             * disabledSearch:树组件查询区禁用
	             */
                let {treeId,selectedNode} = tree;
                //构造请求参数
                let tsMap = new Map([
                    [node.refpk,node.nodeData.ts]
                ]);
                //删除树节点
                this.delTree({
                    url : URLS.deleteUrl,//请求url
                    data : {tsMap}//请求参数对象
                }).then((res)=>{
                    //删除树上该节点
                    this.props.syncTree.delNodeSuceess(treeId,node.refpk);
                    return Promise.resolve(true);
                }).then(()=>{
                     //原选中树节点与删除的节点时同一节点，需要清除选中，清空卡片
                        this.state.dragComp.tree.selectedNode = null;
                        return new Promise(resolve=>{
                            this.setState(this.state,()=>{
                                resolve(true);
                            });
                        })
                }).then(()=>{
                    //清空卡片
                    return this.clearCard();
                }).then(()=>{
                    //更新按钮状态
                    this.updateBtnStatus();
                    return Promise.resolve(true);
                }).then(()=>{
                    //删除提示：删除成功！
                    toast({title : '删除成功！', color : 'success'});
                });
            }
        });
    }
    /**
     * onSave方法 功能介绍
     *       功能介绍：删除功能
     *		 触发时机：点击保存按钮触发
     */
    onSave = ()=>{
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
	     * 解构tree
	     * treeId: 树组件编码
	     * disabledSearch:树组件查询区禁用
	     * root: 树根节点
	     */        
        let {treeId,selectedNode,root} = tree;
		/**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */        
        let {form,formList} = card;
        //解构form area：表单区域编码
        let {area} = form;
        //表单校验
        if (!this.props.form.isCheckNow(area)) {
            return;
        }
        let tables = {};
        let ispass = this.validateBeforeSave();
        if(!ispass){
            return;
        }
        //获取保存的请求参数
        let data = this.buildReqParam();
        this.validateToSave({//验证公式
        	data,
        	areas : {formId : area,tables}
        }).then(()=>{
        	return this.saveCard({url : URLS.saveUrl,data});//保存卡片
        }).then((res)=>{
            return this.fillCard({data : res.data.data}).then(()=>{return Promise.resolve(res)});//填充卡片
        }).then((data)=>{
            let {editmode,dragComp} = this.state;
            let {selectedNode,treeId} = dragComp.tree;
            if(editmode == EDITMODE_ADD){
                this.props.syncTree.addNodeSuccess(treeId, data.treeNode[0]);
            }else if(editmode == EDITMODE_EDIT){
                this.props.syncTree.editNodeSuccess(treeId, data.treeNode[0]);
            }
            return Promise.resolve(data.treeNode[0]);
        })
        .then((curNode)=>{
            //设置树查询框状态
            this.state.dragComp.tree.disabledSearch = false;
            this.state.showOff.disabled = false;
            //设置当前页面状态
            this.state.editmode = EDITMODE_BROWSE;
            //表单上的数据主键
            let pkItem = this.props.form.getFormItemsValue(area,FIELDS.PRIMARYKEY);
            //选中的树数据主键
            //let curNode = this.props.syncTree.getSyncTreeValue(tree.treeId,pkItem.value);
            let curFormPk = pkItem.value;
            //展开父节点
            this.props.syncTree.openNodeByPk(treeId, curFormPk == selectedNode.refpk ? 
                (selectedNode.refpk == root.refpk?curNode.refpk : curNode.pid) : curFormPk);
            //选中当前节点
            this.selectTreeNode(curFormPk);
            this.state.dragComp.tree.selectedNode = curNode;
            //解除禁用
            this.disableTree(treeId, false);
            //更新state
            this.setState(this.state,()=>{
            	//设置表单状态
                this.setFormStatus();
		        //更新按钮状态
		        this.updateBtnStatus();
                toast({title :  '保存成功！', color :  'success'});
            });
        });
    }
    /**
     * onSaveAdd方法 功能介绍
     *       功能介绍：保存新增功能
     *		 触发时机：点击保存新增按钮时触发
     */
    onSaveAdd = ()=>{
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
	     * 解构tree
	     * treeId: 树组件编码
	     * disabledSearch:树组件查询区禁用
	     * root: 树根节点
	     */  
        let {treeId,selectedNode} = tree;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */   
        let {form,formList} = card;
        //解构form area：表单区域编码
        let {area} = form;
        //表单校验
        if (!this.props.form.isCheckNow(area)) {
            return;
        }
        let tables = {};
        let ispass = this.validateBeforeSave();
        if(!ispass){
            return;
        }
        let data = this.buildReqParam();//待保存的数据
        this.validateToSave({//验证公式
        	data,
        	areas : {formId : area,tables}
        }).then(()=>{
        	//保存卡片
        	return this.saveCard({url : URLS.saveUrl,data});
        }).then((res)=>{
            return Promise.resolve(res);
        }).then((data)=>{
            let {editmode,dragComp} = this.state;
            let {selectedNode,treeId} = dragComp.tree;
            this.props.syncTree.addNodeSuccess(treeId, data.treeNode[0]);
            //选中的树数据主键
            let curNode = this.props.syncTree.getSyncTreeValue(tree.treeId,selectedNode.refpk);
            this.state.dragComp.tree.selectedNode = curNode;
            return new Promise(resolve=>{
                this.setState(this.state,()=>{
                    resolve(data.treeNode[0]);
                });
            });
        }).then(()=>{
            return this.clearCard();
        }).then(()=>{
            let {selectedNode} = this.state.dragComp.tree;
            let billCard = this.buildReqParam();
            //加载卡片信息
            return this.loadCard({
                url:URLS.addUrl,
                data : {
                    parentId : selectedNode.refpk,//父节点pk
                    billCard,
                    userJson : {
                        //parentKey:父属性的field，parentPk:父节点pk
                        data : {parentKey : FIELDS.PARENT_ID,parentPk : selectedNode.refpk}
                    }
                }
            });
        }).then((res)=>{
            //res : 加载的卡片数据
            //填充卡片数据
            return this.fillCard({data : res.data}).then(()=>{return Promise.resolve(res);});
        }).then((res)=>{
            //res : 编码规则返回结果
            //设置表单状态
            this.setFormStatus();
            //更新按钮状态
            this.updateBtnStatus();
            // 如果存在组织属性，并且个性化设置-业务设置那设置了组织，则默认在新增时把组织字段在界面上
            context && context.pk_org && this.props.form.setFormItemsValue(area, {[FIELDS.PK_ORG]: {display: context.org_Name, value: context.pk_org}});
        });
    }
    /**
     * onCancel方法 功能介绍
     *       功能介绍：取消操作功能
     *		 触发时机：点击取消按钮时触发
     */
    onCancel = ()=>{
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
	     * 解构tree
	     * treeId: 树组件编码
	     * disabledSearch:树组件查询区禁用
	     * root: 树根节点
	     */ 
        let {treeId,selectedNode,root} = tree;
        /**
		 * 解构card
		 * form:表单组件配置
		 * formList:卡片表格区域编码
		 */   
        let {form,formList} = card;
        let {area : formId} = form;
        promptBox({
            color : 'warning',
            title :  '确认取消', /* 国际化处理： 确认取消*/
            content :  '是否确认要取消?', /* 国际化处理： 是否确认要取消?*/
            beSureBtnClick : () => {
                this.state.dragComp.tree.disabledSearch = false;//启用树查询框
                this.state.showOff.disabled = false;
                this.state.editmode = EDITMODE_BROWSE;//页面恢复浏览态
                //设置当前state
                this.setState(this.state,()=>{
                    //启用树
                    this.disableTree(treeId,false);
                    //设置表单状态
                    this.setFormStatus();
                    if(selectedNode){
                    	this.selectTreeNode(selectedNode.refpk);//设置选中树节点
                    	//清空卡片数据
                        this.clearCard(
                        ).then(()=>{
                        	//加载卡片信息
                            return selectedNode.refpk == root.refpk ? Promise.resolve(true) : this.loadCard({url : URLS.loadUrl,data : {pk : selectedNode.refpk}});
                        }).then((res)=>{
                        	//填充卡片信息
                        	return selectedNode.refpk == root.refpk ? Promise.resolve(true) : this.fillCard({data : res.data});
                        }).then(()=>{
                        	//更新按钮状态
                        	this.updateBtnStatus();
                        });
                    }
                });
            }
        })
    }
    /**
     * onRefresh方法 功能介绍
     *       功能介绍：刷新操作功能
     *		 触发时机：点击刷新按钮时触发
     */
    onRefresh = ()=>{
    	//执行刷新
        this.doRefresh(
        ).then(()=>{
        	//更新按钮状态
        	this.updateBtnStatus();
        	toast({title : '刷新成功！',color : 'success'});
        });
    }
    validateBeforeSave = ()=>{
        let {editmode} = this.state;
        let {tree,card} = this.state.dragComp;
        let {treeId,selectedNode,root} = tree;
        let {form,formList} = card;
        let {area} = form;
        if(editmode!=EDITMODE_ADD){
            return true;
        }
       
        let parent = this.props.form.getFormItemsValue(area,FIELDS.PARENT_ID);

        if(!parent || !parent.value){
            return true;
        }

        let parentNode = this.props.syncTree.getSyncTreeValue(treeId,parent.value);
        if(parentNode && parentNode.refpk == 'root'){
            return true;
        }
        if(parentNode && parentNode.nodeData){

            let parentEnable = parentNode.nodeData[FIELDS.ENABLESTATE];
            if(parentEnable && (parentEnable == 2 || parentEnable == '2')){
                return true;
            }
            toast({title:'上级已停用不能为其增加下级!',color:'warning'});
            return false;
        }
        return true;
    }     
    /**
     * onMouseEnter方法 功能介绍
     *       功能介绍：鼠标经过树节点触发事件，可根据不同树节点显示不同的节点图标
     *		 触发时机：鼠标经过树节点时触发
     * @param {*} key 当前树节点对应VO对象的主键
     * @param {*} node 当前树节点对象
     */
    onMouseEnter = (key,node)=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment,context} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
	     * 解构tree
	     * treeId: 树组件编码
	     * disabledSearch:树组件查询区禁用
	     * root: 树根节点
	     */
        let {disabledSearch,root,treeId} = tree;
        //解构node nodeData:追加的数据
        let {nodeData} = node;
        let {paramMap} = context;
        //设置树节点 新增、修改、删除图标是否显示
        this.props.syncTree.hideIcon(treeId, key, {
        	//删除图标：根节点时不显示；非根节点时 带审批流的 只有自由态的可以删除
        	delIcon : key == root.refpk ? false:(
               paramMap && paramMap.pk_transtype && nodeData[FIELDS.TRANSTYPEPK]!= paramMap.pk_transtype ? false:!(node.children && node.children.length>0)),
        	//修改图标：根节点时不显示；非根节点时 带审批流的 只有自由态的可以删除
        	editIcon : key == root.refpk ? false:(paramMap && paramMap.pk_transtype && nodeData[FIELDS.TRANSTYPEPK]!= paramMap.pk_transtype ? false:true),
        	//新增图标：全显示
        	addIcon : key == root.refpk ? (true && !disabledSearch):true
        });
    }
    /**
     * onMouseEnter方法 功能介绍
     *       功能介绍：树节点选中触发的动作
     *		 触发时机：鼠标左键选中树节点时触发
     * @param {*} value 选中树节点的pk 
     * @param {*} custParam 自定义参数对象 Object
     */
    onTreeNodeSelect = (value,custParam = {})=>{
   		/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        /**
	     * 解构tree
	     * treeId: 树组件编码
	     * root: 树根节点
	     */
        let {root,treeId} = tree;
        this.props.syncTree.cancelSelectedNode(treeId);
        let curNode = this.props.syncTree.getSyncTreeValue(treeId,value);
        //设置当前选中的树节点
        this.state.dragComp.tree.selectedNode = curNode;
        this.selectTreeNode(curNode.refpk);
        return new Promise(resolve=>{
            this.setState(this.state,()=>{resolve(true);});
        }).then(()=>{
        	//清空卡片信息
            return this.clearCard();
        }).then(()=>{
        	//加载卡片信息
            return value == root.refpk ? Promise.resolve(true) : this.loadCard({data : {pk : value},url : URLS.loadUrl});
        }).then((res)=>{
        	//填充卡片信息
            return value == root.refpk ? Promise.resolve(true) : this.fillCard({data : res.data});
        }).then(()=>{
            //更新按钮状态
            this.updateBtnStatus();
        });
    }
    /**
     * onAfterEditForm方法 功能介绍
     *       功能介绍：表单编辑后事件
     *		 触发时机：编辑表单上的属性之后触发
     * @param {*} props  当前对象的props
     * @param {*} moduleId 所编辑表单的区域编码
     * @param {*} key 所编辑表单项的编码
     * @param {*} value 编辑后的值 是一个对象
     * @param {*} oldValue 编辑前的旧值
     */
    onAfterEditForm = (props, moduleId, key, value,oldValue)=>{
    }
    /**
     * onAfterEditForm方法 功能介绍
     *       功能介绍：表单编辑前事件
     *		 触发时机：鼠标聚焦到表单上某属性上之后触发
     *		 方法举例：
     *				1、编辑前利用界面上现有数据给当前要编辑的属性进行参照过滤条件设置，参见案例【1】
     *				2、编辑前利用界面上的现有数据到后台查询某些数据之后给当前要编辑的属性进行参照过滤条件设置，参见案例【2】
     * @param {*} props 当前对象的props
     * @param {*} moduleId 所编辑表单的区域编码
     * @param {*} key 所编辑表单项的编码
     * @param {*} value 当前表单项的值
     * @param {*} data 当前表单数据
     * @return true/false  编辑前事件有默认的返回值 true：表单所有属性都可操作（不含模板控制不允许编辑的属性）;false:表单所有属性都不可以编辑
     */
    onBeforeEditForm = (props, moduleId, key, value,data)=>{
        // return new Promise((resolve,reject)=>{
        //     /**
        //      * 有的朋友可能会问，为什么要把以下这种操作放在编辑前事件中，为什么不放在A或者C的编辑后事件中处理B和D的条件
        //      * 因为：不管是setMeta还是ajax都是异步操作，如果放在编辑后事件中处理，当编辑B或D的时候，异步操作可能还没有
        //      * 真正完成，后端就拿不到对应的条件参数，引发异常，写在编辑前事件中最保险。
        //      */
        //     if(key == 'B'){
        //			******************案例【1】******************
        //         //如表单上有A、B两个参照字段,B参照需要A字段选择的值作为过滤条件！！
        //         //那在编辑B字段之前，需要先给B参照传递条件
        //         let meta = props.meta.getMeta();//获得模板
        //         meta[moduleId].items.find(item=>{//找到Bitem
        //             if(item.attrcode == 'B'){
        //                 let Avalue = props.form.getFormItemsValue(moduleId,'A');
        //                 item.queryCondition = ()=>{//设置B参照的过滤条件
        //                     return {//pk_A只是个demo，具体参数key，需要根据实际情况而定
        //                         pk_A : Avalue.value || Avalue.refpk
        //                     }
        //                 }
        //             }
        //         });
        //         props.meta.setMeta(meta,()=>{
        //             resolve(true);
        //         });
        //     }else if(key == 'D'){
        //         ******************案例【2】******************
        //         //如表单上有C、D两个参照字段，D参照需要‘X’作为D的过滤条件，而‘X’需要通过C参照的值去后台查询出来
        //         //这时的处理方式
        //         let Cvalue = props.form.getFormItemsValue(moduleId,'C');
        //         ajax({//查询X的值
        //             url : '/nccloud/领域/模块/queryXAction.do',
        //             data : {pk_C : Cvalue.value||Cvalue.refpk},
        //             success : (res)=>{
        //                 let meta = props.meta.getMeta();//获得模板
        //                 meta[moduleId].items.find(item=>{//找到Ditem
        //                     if(item.attrcode == 'D'){
        //                         item.queryCondition = ()=>{//设置D参照的过滤条件
        //                             return {//pk_X只是个demo，具体参数key，需要根据实际情况而定
        //                                 pk_X : res.data.X
        //                             }
        //                         }
        //                     }
        //                 });
        //                 props.meta.setMeta(meta,()=>{
        //                     resolve(true);
        //                 });
        //             }
        //         })
        //     }else{
        //         //其他情况均返回true
        //         resolve(true); 
        //     }
        // })
        //编辑前事件 默认返回值
        return true;
    }
    /**
     * onAfterEditFormlist方法 功能介绍
     *       功能介绍：表格编辑后事件
     *		 触发时机：编辑完表格某单元格之后触发
     * @param {*} props 当前对象的props
     * @param {*} moduleId 所编辑表单的区域编码
     * @param {*} key 所编辑表单项的编码
     * @param {*} value 当前表单项的值
     * @param {*} changedrows 当前改变的行数据
     * @param {*} index 当前改变的行号
     * @param {*} record 当前表格行数据
     * @param {*} type 当前单元格对应的列的属性类型
     */
    onAfterEditFormlist = (props, moduleId, key, value, changedrows, index, record,type)=>{
    	//树卡型应用DEMO(LCDP供应商)扩展： 根据子表数量动态统计主表单总数量
    	// function FloatAdd(arg1,arg2){
        //     var r1,r2,m;
        //     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        //     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        //     m=Math.pow(10,Math.max(r1,r2));
        //     return (arg1*m+arg2*m)/m;
        // }
        // if(moduleId == 'lcdpmarinfo_sub' && key == 'cnum'){//编辑的是供应商供货信息表格的货物数量列
        //     let tableRows = this.props.cardTable.getAllRows(moduleId);//获得当前表格所有数据
        //     let sum = parseFloat(0);
        //     (tableRows || []).forEach(row=>{
        //         if(row.status != '3' && !!row.values.cnum.value){//不是删除的行数据，统计求和
        //             sum = FloatAdd(sum,parseFloat(row.values.cnum.value))
        //         }
        //     });
        //     //给表单上总数量属性赋值
        //     this.props.form.setFormItemsValue('lcdpsupplier_form',{
        //         'cnum':{
        //             display:sum,
        //             value:sum
        //         }
        //     })
        // }
        
        //编辑供应商货物信息子表格的数量和价格字段时
        //自动计算行金额和表单的总金额同时计算表单的总数量
        // if(moduleId == 'lcdpmarinfo_sub'){
        //     if(key == 'cnum' || key == 'price'){
        //         var money = Utils.FloatMultiple(parseFloat(record.values['cnum'].value),parseFloat(record.values['price'].value));
        //         record.values['money'] = {
        //             display:money,
        //             value:money
        //         }
        //         //计算表单总金额
        //         let tableRows = this.props.cardTable.getAllRows(moduleId);//获得当前表格所有数据
        //         let summoney = parseFloat(0);
        //         let sumcnum = parseFloat(0);
        //         //迭代计算总金额和总数量
        //         (tableRows || []).forEach(row=>{
        //             if(row.status != '3' && !!row.values.money.value){//不是删除的行数据，统计求和
        //                 summoney = Utils.FloatAdd(summoney,parseFloat(row.values.money.value))
        //             }
        //             if(row.status != '3' && !!row.values.cnum.value){//不是删除的行数据，统计求和
        //                 sumcnum = Utils.FloatAdd(sumcnum,parseFloat(row.values.cnum.value))
        //             }
        //         });
        //         //给表单上总数量和总金额属性赋值
        //         this.props.form.setFormItemsValue('lcdpsupplier_form',{
        //             money:{
        //                 display:summoney,
        //                 value:summoney
        //             },
        //             cnum:{
        //                 display:sumcnum,
        //                 value:sumcnum
        //             }
        //         });
        //     }
        // }
    }
    /**
     * onBeforeEditFormlist方法 功能介绍
     *       功能介绍：表格编辑前事件
     *		 触发时机：鼠标聚焦到表格上某单元格上之后触发
     *		 方法举例：
     *				与表单编辑前的案例基本一致，这里只需要注意对应的index（行）即可
     * @param {*} props 当前对象的props
     * @param {*} moduleId 所编辑表格的区域编码
     * @param {*} key 所编辑表格列的编码
     * @param {*} value 当前表格单元格的值
     * @param {*} index 当前操作的表格行号
     * @param {*} record 当前表格行数据
     * @param {*} status 当前表格状态
     * @return true/false  编辑前事件有默认的返回值 效果与表单编辑前事件一致
     */
    onBeforeEditFormlist = (props, moduleId, key, value,  index, record,status)=>{
    	return true;
    }
    /**
     * onPrint方法 功能介绍
     *       功能介绍：打印功能
     */
    onPrint = ()=>{
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //解构tree treeId: 树组件编码
        let {treeId} = tree;
        //获得当前树数据
        let treeData = this.props.syncTree.getSyncTreeValue(treeId);
        //同步oids
        printOutput.data.oids = this.getTreeAllPks(treeData);
        if(printOutput.data.oids.length == 0){
            toast({content :  '没有打印的数据！', color :  "warning"});
            return;
        }
        new Promise(resolve=>{
        	this.setState(this.state,()=>{return resolve(true);});
        }).then(()=>{
        	/**
			 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
			 * printOutput:打印输出功能组件配置
			 */
        	let {printOutput} = this.state;
        	/**
        	 * 解构printOutput
        	 * outputType:输出类型  'output':输出,不传递该属性即为打印
        	 */
    		let {data : {outputType,...others},url} = printOutput;
    		print('pdf', url, {...others});
        });
    }
    /**
     * onOutput方法 功能介绍
     *       功能介绍：输出功能
     */
    onOutput = () => {
    	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //解构tree treeId: 树组件编码
        let {treeId} = tree;
        //获得当前树数据
        let treeData = this.props.syncTree.getSyncTreeValue(treeId);
        //同步oids
        printOutput.data.oids = this.getTreeAllPks(treeData);
        if(printOutput.data.oids.length == 0){
            toast({content :  '没有输出的数据！', color :  "warning"});
            return;
        }
        new Promise(resolve=>{
        	//更新state
        	this.setState(this.state,()=>{return resolve(true);});
        }).then(()=>{
        	let {printOutput} = this.state;
    		let {data,url} = printOutput;
    		//输出
    		output({url,data});
        });
    }
    /**
     * onExport方法 功能介绍
     *       功能介绍：导出功能
     */
    onExport = () => {
       	/**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
        let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
        /**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //解构tree selectedNode:选中的树节点
        let {selectedNode} = tree;
        //同步选中的树节点pk
        this.state.execlExport.selectedPKS = selectedNode ? [selectedNode.refpk] : [];
        new Promise(resolve=>{
        	//更新state
        	this.setState(this.state,()=>{return resolve(true);});
        }).then(()=>{
        	//弹出导出窗口
        	this.props.modal.show('exportFileModal');
        });
    }
    /**
     * onAttachment方法 功能介绍
     *       功能介绍：附件管理功能
     */
    onAttachment = () => {
        /**
		 * 解构state(解构的意思请移步ES6文档查看【https://es6.ruanyifeng.com/】)
	     * isPageReady:页面是否已经初始化
		 * showmode:显示模式  list|card|fetchlist|fetchcard
		 * editmode:编辑模式  browse|edit|add
		 * btn:应用肩部按钮组件配置
		 * head:应用标题组件配置
		 * dragComp:树卡应用左右拖拽组件配置
		 * execlExport:导入导出功能组件配置
		 * printOutput:打印输出功能组件配置
		 * attatchment:附件管理功能组件配置
		 */
    	let {isPageReady, showmode,editmode, btn,head,dragComp,execlExport,printOutput,attachment} = this.state;
    	/**
		 * 解构dragComp
		 * tree:树组件配置
	     * card:卡片组件配置
		 * defLeftWid:默认左侧宽度
	     * leftMinWid:左侧最小宽度
		 */
        let {tree,card,defLeftWid,leftMinWid} = dragComp;
        //解构tree selectedNode:选中的树节点
    	let {selectedNode} = tree;
    	//同步选中的树节点pk
        this.state.attachment.billId = selectedNode && selectedNode.refpk;
        //是否显示附件管理
        this.state.attachment.show =!this.state.attachment.show;
        this.setState(this.state);
    }
//============================== Action功能流程方法区 ↑==============================
	/**
     * formatPropComps方法 功能介绍
     *       功能介绍：对常用的一些组件对象的api进行封装，因为原有的api有些不太合适，有的方法没有回调，有的方法参数是一个一个的
     */
    formatPropComps = ()=>{
        let {syncTree,table,cardTable,editTable,form} = this.props;
        Object.assign(this.props.syncTree,{
            /**
            * 设置树数据
            * @param {*} data 
            */
            setTreeData : ({treeId,data},callback = EMPTY_FN)=>{
                const dealTreeData = (data)=>{
                    let deleteDataChildrenProp = function(node){
                        node.iconBox = {
                            addIcon : false,
                            editIcon : false,
                            delIcon : false
                        };
                        if(!node.children || node.children.length == 0) {
                            delete node.children;
                        }
                        else{
                            node.isLeaf = false;
                            node.children.forEach( (e) => {
                                deleteDataChildrenProp(e);
                            });
                        }
                    };
                    data.forEach( (e) => {
                        deleteDataChildrenProp(e);
                    });
                    return data;
                }
                syncTree.setSyncTreeData(treeId , dealTreeData(data));
                setTimeout(callback,0);
            }
        });
        Object.assign(this.props.table,{
            /**
             * 设置简单表格数据
             * @param {*} param
             *              tableId : 表格区域编码，
             *              data : {rows : [],pageInfo : {}}
             *              isTop : 数据是否置顶，默认是true 置顶
             * @param {*} callback 回调函数
             */
            setSimpleTableData : ({tableId,data,isTop = true},callback = EMPTY_FN)=>{
                table.setAllTableData(tableId,data,isTop);
                setTimeout(callback,0);
            }
        });
        Object.assign(this.props.form,{
            /**
            * 设置表单数据
            * @param {*} param
            *              formId : 表单区域编码，
            *              data : {rows : []}
            * @param {*} callback 回调函数  
            */
            setFormData : ({formId,data},callback = EMPTY_FN)=>{
                if(data && data[formId]){
                    form.setAllFormValue({ [formId] : data[formId] });
                }else{
                    form.clearFormData(formId);
                    // form.setAllFormValue({ [formId] : {rows : []} });
                }
                setTimeout(callback,0);
            },
            /**
             * 清空表单数据
             * @param {*} formId 
             */
            clearFormData : (formId)=>{
                form.EmptyAllFormValue(formId);
            }
        });
        Object.assign(this.props.cardTable,{
            /**
             * 卡片表格增行
             * @param {*} param0 
             * @param {*} callback 
             */
            addCardTableRow : ({tableId, index = -1, data = {}, autoFocus = true},callback = EMPTY_FN)=>{
                cardTable.addRow(tableId, index, data,autoFocus,callback);
            },
            /**
            * 设置卡片表格数据
            * @param {*} param
            *              tableId : 表格区域编码，
            *              data : {rows : []}
            *              isCache : 是否保存原始数据，默认是true(保存),
            *              isTop : 数据是否置顶，默认是true 置顶
            * @param {*} callback 回调函数  
            */
            setCardTableData : ({tableId,data,isCache = true,isTop = false},callback = EMPTY_FN)=>{
                cardTable.setTableData(tableId,data,isCache,isTop);
                setTimeout(callback,0);
            }
        });
        Object.assign(this.props.editTable,{
            /**
            * 编辑表格增行
            * @param {*} param0 
            * @param {*} callback 
            */
            addEditTableRow : ({tableId, index = -1, data = {},autoFocus = true},callback = EMPTY_FN) =>{
                editTable.addRow(tableId, index,autoFocus,data);
                setTimeout(callback,0);
            },
            /**
            * 设置编辑表格数据
            * @param {*} param
            *              tableId : 表格区域编码，
            *              data : {rows : []}
            *              isCache : 是否保存原始数据，默认是true(保存),
            *              isTop : 数据是否置顶，默认是true 置顶
            * @param {*} callback 回调函数 
            */
            setEditTableData : ({tableId,data,isCache = true,isTop = false},callback = EMPTY_FN)=>{
                editTable.setTableData(tableId,data,isCache,isTop);
                setTimeout(callback,0);
            }
        });
    }
}
//当前应用接收的初始参数配置对象
let config = {
	pagecode : '4004800H1_region_CjmMaster',
	appcode : '4004800H1',
	domain : 'pu',
	version : 2207
};
/**
 * 应用的入口createPage
 * 前端底层，通过createPage方法，把各个对象插入到当前应用的props中
 * initTemplate : 目的是初始化模板，目前已经在constructor中使用Utils.loadNCCResource方法获取模板
 * billInfo : 目的是为公式准备，具体可以到nccdev.yonyou.com上搜索公式查看
 */
ApplicationPage = createPage({
    initTemplate : {},
    //编辑公式 必须配置该billinfo
    billinfo : {
    	billtype: 'extcard',
        pagecode: '4004800H1_region_CjmMaster',
        headcode: 'region_CjmMasterForm',
        bodycode: []
    },
    orderOfHotKey:['region_CjmMasterForm',]
})(ApplicationPage);
//ReactDom将当前组件渲染到dom中
ReactDOM.render(<ApplicationPage/>,document.querySelector("#app"));