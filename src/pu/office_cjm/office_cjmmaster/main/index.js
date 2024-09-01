
/****************************************************************************************************
 *
 * 代码目录:
 *      目录结尾不带L和P的是当前节点的目录
 *      以L结尾的是单据追溯的目录
 *      以P结尾的是审批详情的目录
 *
 * 源代码介绍：
 *
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * +		友情提醒：																						 +
 * +		当你想改动以下的代码前，如果对React、ES6、NCC不熟悉，请移步对应网站进行学习：					 +
 * +			ES6: https://es6.ruanyifeng.com/															 +
 * +			React: https://react.docschina.org/docs/getting-started.html								 +
 * +		    NCC学习: https://nccdev.yonyou.com/															 +
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
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

//=//=============导入高阶组件区=============
//1导入高阶组件,公共部分
import {createPage, base, ajax, high, toast, promptBox, deepClone, print, output} from 'nc-lightapp-front';
const {PrintOutput, BillTrack} = high;
const {NCDiv, NCAffix, NCTabs, NCScrollElement, NCTooltip, NCToggleViewBtn} = base;
//2导入高阶组件, UIExtend的部分
import {Utils} from './Utils';
const EMPTY_FN = function(){}; //空函数

import ExcelOutput from 'uap/common/components/ExcelOutput';  // 导出组件
import excelImportconfig from 'uap/common/components/excelImportconfig';  // 导入配置方法
import NCUploader from 'uap/common/components/NCUploader';  // 附件管理组件
import ApproveDetail from 'uap/common/components/ApproveDetail';  //审批详情
import ApprovalTrans from 'uap/common/components/approvalTrans';  //指派组件

const URLS = {
	saveUrl: '/nccloud/pu/office_cjm/SaveOffice_CjmMasterVOAction.do',						   //保存 请求路径
	deleteUrl: '/nccloud/pu/office_cjm/DeleteOffice_CjmMasterVOAction.do',					   //删除 请求路径
	listUrl: '/nccloud/pu/office_cjm/ListOffice_CjmMasterVOAction.do',						   //列表查询 请求路径
	addUrl: '/nccloud/pu/office_cjm/AddOffice_CjmMasterVOAction.do',							   //新增 请求路径
	loadtreeUrl: '/nccloud/pu/office_cjm/LoadTreeRegion_CjmMasterVOAction.do',				   //树加载 请求路径
    loadUrl: '/nccloud/pu/office_cjm/LoadOffice_CjmMasterVOAction.do',						   //加载卡片数据 请求路径
    editUrl: '/nccloud/pu/office_cjm/EditOffice_CjmMasterVOAction.do',						   //修改 请求路径
	copyUrl: '/nccloud/pu/office_cjm/CopyOffice_CjmMasterVOAction.do',								   //复制 url
    printUrl: '/nccloud/pu/office_cjm/PrintOffice_CjmMasterVOAction.do',         //打印 请求路径
};

const ACTIONS = {  						// 按钮编码
    IMPORT: 'Import',  					//导入
    EXPORT: 'Export',  				    //导出
    PRINT: 'Print',  					//打印
    OUTPUT: 'Output',  				    //输出
    ATTACHMENT: 'Attachment',  		    //附件
    ADD: 'Add',  						//新增
    DELETE: 'Delete',  					//删除
    EDIT: 'Edit',  						//修改
    REFRESH: 'Refresh',  				//刷新
    QUERY: 'Query',  					//查询
    CANCEL: 'Cancel',  					//取消
    SAVE: 'Save',  						//保存
    SAVEADD: 'SaveAdd',  			    //保存新增
    COPY: 'Copy',  						//复制
    MORE: 'More'  						//更多
}

const FIELDS = {  // 字段编码
    PK_ORG: 'pk_org',
    PRIMARYKEY: 'pk_office_cjmmaster'
}

const EXCELBILLTYPE = 'OFFICE_CJMMASTER_4004800M1';  // 导入导出单据类型

const PRINTNODEKEY_LIST = '4004800M101';  // 列表打印模板标识
const PRINTNODEKEY_CARD = '4004800M102';  // 卡片打印模板标识




//页面状态模式(要求变量名前缀需要一致,后面根据需要编写，如EDITMODE_EDIT, 前缀为EDITMODE )
const EDITMODE_EDIT = 'edit';		   //编辑态
const EDITMODE_BROWSE = 'browse';	   //浏览态
const EDITMODE_ADD = 'add';			   //新增态

//页面显示模式(要求变量名前缀需要一致,后面根据需要编写，如SHOWMODE_LIST, 前缀为SHOWMODE )
const SHOWMODE_LIST = 'list';		   //列表
const SHOWMODE_CARD = 'card';		   //卡片

/****************************************************************************************************
 * 整体介绍：
 *      目前的这种写法是 单页应用的写法，多页面应用，页面切换时，采用的是“安装-卸载”的方式体现在render方法
 *      目前的这种写法，我们不需要再关注this指针的问题,也不需要在调用方法时使用call来切换指针并执行，直接"方法()"即可
 *      目前的这种写法，采用的是MVVM的架构模式，把state看做是VM，所以我们需要把目光集中在state
 *
 ****************************************************************************************************/
class ApplicationPage extends Component {

    /**
 	 * 构造方法,js要求的必须方法,构造整个页面对象，
 	 * 此方法构造时，会定义全局配置，this.config,方便其他方法取用,
 	 * 同时，也处理了加载模板,按钮，设置模板按钮功能，最终通过调用
 	 * pageReady(此方法可以加入你的业务逻辑)完成第一次页面.
 	 * 此方法中,会调用initButton,initMeta来初始化模板和按钮,
 	 * initButton,initMeta,pageReady仅在页面打开时调用一次.
 	 * 其他时候不再调用
 	 */
    constructor(props) {

        super(props);
		/*
     	 * 节点全局变量定义
     	 * 包含 页面编码定义,应用编码定义,标题定义,模块组件名定义
     	 * 配置的获取方式，优先取平台定义,其次取传入配置定义, 最后默认
     	 */
        this.config = {
        	pagecode: props.getSearchParam('p')   || props.appcode || 'pagecode未定义', //页面编码定义
        	appcode: props.getSearchParam('c')    || props.appcode || 'appcode未定义',  //应用编码定义
        	moduleId: '4004800M1',  							    //应用编码定义
            domainName: 'pu',			//模块域名
            moduleName: 'pu'
        };

		/** 
     	 * 创建state,并构造节点模型,其结构与渲染时是一致的.
     	 * 可参照顶端代码注释的详细解释
     	 */
        this.state = this.createState();

		/**
     	 * 适配版本变化,2105及其以后版本必须的调用, 之前版本不需要
     	 */
        this.props.use.search('office_CjmMasterQuery');
        this.props.use.form('office_CjmMasterForm');
        this.props.use.table('office_CjmMasterList');
        /**
     	 * 加载NCC资源,
     	 * 1,包含单据模板,按钮,等平台定义的功能
     	 * 2,加载多语资源文件,
     	 * 3,加载需要在代码总用到参照js
     	 */
        Utils.loadNCCResource({
            props: props,
            referObjs : [],
			/**
         	 * 导入全局配置,加载资源时 appcode,pagecode,modulename等信息,
         	 * 需要用到,全局配置中包含所有它需要用到的参数,
         	 */
        	...this.config, 
			//导入全局配置,
            callback: (data) => {
                let { context, template, button, lang, refer = {} } = data;
				//多语言    
				this.lang = lang;   
                /**
             	 * 初始化模板,修改模板相关配置
             	 * 初始化按钮,修改按钮相关配置,
             	 * 并将模板配置,按钮配置输入到平台,通过setMeta,setButtons输入.
             	 * 让平台进行初始化.当平台初始化完成后,通过then继续后续的工作
             	 */
                template = this.initMeta(template,context);
				//初始化按钮
                button = this.initButton(button);
				Promise.all([//合并处理 模板 和 多语
					new Promise(resolve => this.props.meta.setMeta(template,() => resolve(true))),
					new Promise(resolve => this.props.button.setButtons(button,()=>resolve(true))),
					new Promise(resolve => this.setState({...this.state,context},()=>resolve(true)))
				]).then(()=>{
					this.setState({isPageReady:true},()=>{  //标记自己页面已经完成,并进行第一次的渲染
						let {moduleName,billType} = this.state.execlExport; //此处简化解构,一遍能够代码清晰
						this.props.button.setUploadConfig('Import', excelImportconfig(this.props, moduleName,  billType,true,'', this.config,this.onImportRefresh));
						(this.pageReady || EMPTY_FN)();
					});
				}).catch((e)=>{
					throw new ReferenceError(e);
				})
            }
        });
    }

   /**
    * pageReady方法为页面已经完全设置完毕，
    * 可以初始化一些初始的功能，比如查询下列表并显示数据等
    */
    pageReady = () => {
	
		//参数解构
		let {context} = this.state;
		//初始先更新一遍按钮，防止加载数据慢时，按钮全部显示出来
		this.updateBtnStatus();
		//加载树数据
		this.loadTree({callback: (treedata) => {
				//填充树数据
				this.fillTree({data: treedata, callback: () => {
						//初始化树状态
						this.initTreeStatus();
					}
				});
			}
		})
		//请求列表数据
		//this.listTableData({callback: (data) => {
		//		//列表数据填充
		//		this.fillListData({data: data, callback: () => {}});
		//	}
		//})
		//设置查询区默认组织数据
        this.props.search.setSearchValByField('office_CjmMasterQuery', FIELDS.PK_ORG, {display: context.org_Name, value: context.pk_org});
    }

   /**
 	* 初始化平台定义的单据模板
 	* 触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
 	* 功能：对加载完的模板进行个性化调整
 	* 可实现举例功能:
 	* 1.参照表单联动过滤, 参见[Demo1] 
 	* 2.处理表格操作列,   参见[Demo2]
 	*/
    initMeta = (meta,context) => {

        let { head,headBtn,list,card,tree,showmode,editmode } = this.state;

	   /**
        *  Demo[1]参照过滤
    	* 参照过滤
    	* 场景描述： 表单上同时有部门、组织两个字段，部门受组织过滤, 部门选择时,受到选择的组织进行部门参照过滤
    	* 达成效果： 组织不选时，部门加载全部；组织选择，部门加载的数据时该组织下的部门。
    	* 写法解释： 写法解释： 见下面代码注释,
    	* 代码示例:
        */
 
		//let dept_meta = meta[card.form.area].items.find(item => item.attrcode === 'pk_dept')
		// dept_meta ? dept_meta.queryCondition = () => {
		//     let pk_org = this.props.form.getFormItemsValue(card.form.area, 'pk_org');
		//     return {
		//         pk_org: pk_org || ''
		//     };
		// } : ""


		//demo  树表移动到审批状态处，自定义增加悬浮信息
		// let overlay = <span><p>{'输入长度小于20'}</p><p>{'1 XXXX'}</p><p>{'2 XXXX'}</p></span>
		// let approve = meta[card.form.area].items.find(item=> item.attrcode == FIELDS.APPROVESTATUS)
		// approve.label = <NCTooltip overlay={overlay} placement="top" trigger="hover" inverse>
		// 					<div title = ''>{approve.label}</div>
		// 				   </NCTooltip>


		

    	/**
    	 * 主组织权限过滤 : 加载的是当前登录人有权限的组织
    	 */
		[list.search.area,card.form.area].forEach(area => {
			meta[area].items.find(item=>{
				if(item.attrcode == "pk_org"){
					item.queryCondition = ()=>{
						return{
							//appcode 编码
							AppCode : this.props.getSearchParam('c') || this.config.appcode,
							//参照类型
							TreeRefActionExt : 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
						}
					};
				}
			});
		})

		
		
		//form  云原生适配
		meta[card.form.area].items.filter(item => {
			if(item.attrcode.startsWith('saga')){
				item.visible = false;
				item.disabled = true;
			}
		})

        meta['office_CjmMasterList'].pagination = true; //显示分页器
        meta['office_CjmMasterList'].status = 'browse'; //默认浏览态
        meta['office_CjmMasterList'].items.push({	   //添加行操作按钮
            attrcode: 'opr',
            label: this.lang['000001'],
            width: 200,
            fixed: 'right',
            className: 'table-opr',
            itemtype: 'customer',
            visible: true,
            render: (text, record, index) => {
				//表格行按钮
            	let btnArray = [ACTIONS.EDIT,ACTIONS.DELETE];
                return this.props.button.createOprationButton(
                    btnArray,
                    {
                        area: 'tablebtn', //表格列表操作按钮区域
                        onButtonClick: (props, id) => this.onBtnClickHead.call(this, id, { props, record, index, text }), //表格列按钮点击事件
                    }
                )
            }
        })

        // 添加卡片行操作列

        /**
         * Demo[2]处理表格操作列
         * 场景描述： 高阶组件simpleTable或者cardTable需要追加操作列
         * 达成效果： simpleTable或者cardTable,增加操作列,操作列中包含一些定义的按钮
         * 写法解释： 见代码注释
         * 代码示例:
         */
        // meta[list.table.area].items.push({
        //     attrcode: 'opr', 				  // 列标识, 固定
        //     itemtype:'customer', 			  // 列类型, 固定
        //     label: '操作', 					  // 列名
        //     width: 200, 						  // 列宽度
        //     className : 'table-opr', 		  // 样式
        //     fixed: 'right', 					  // 悬浮方向
        //     visible: true, 					  // 是否可见
        //     render: (text, record, index) => { // 渲染方法
        // 		   //oprButtons中的出现的按钮需要在initButton方法中将此按钮从所有按钮中过滤出来，复制一份新的按钮给表格用
        //         let oprButtons = [ACTIONS.BILLTRACK];
        //         return this.props.button.createOprationButton(oprButtons, { // 调用表肩按钮创建API
        //             area: 'tablebtn',
        //             onButtonClick:  (props, id) => this.onBtnClickFormlist.call(this, id, { props, record, index, text }),
        //         });
        //     }
        // });


        return meta;
    }

     /**
     *  initButton方法 功能介绍：
     *       触发时机：执行loadNCCResource,加载完模板、多语、等初始化信息之后触发
     *       功能简介：对加载完的按钮数据进行个性化调整
     *       举例功能：
     *          1、禁用某按钮 参见Demo1
     */
    initButton = (button) => {

	   /**
        * Demo1 处理按钮
        * 场景描述： 有时需要在按钮数据加载之后进行一些处理
        * 达成效果： 按钮不可见，并且禁用
        * 写法解释： 迭代所有按钮，找到Save按钮，设置按钮的可见性和禁用型
        * 代码示例:
        */
        //button.find(btn=>{//迭代buttons
        //  if(btn.key == 'Save'){//找到button的key为Save的按钮
        //      btn.disabled = true;//设置按钮禁用
        //      btn.visible = false;//设置按钮隐藏
        //  }
        //})
		
		return [...button || []];
    }

	/**
      * 创建state模型
      * state的模型结构于页面结构是一致的.请优先阅读开头的说明 3.2 createState方法，render方法
      * state中得必有并且常用得属性
      * isPageReady: 页面是否可以进行渲染，构造函数会异步请求模板,所以构造函数执行完成后,
      *              React在构造函数执行完后会立即调用render方法渲染页面,此时可能模板还没有加载完成,
      *              所以通过此属来标记模板等初始化数据是否加载完成. 加载完成后,isPageReady=true.
      *              才开始正式得渲染页面，参考render方法这种对isPageReady的使用。
      * showmode：   页面当前的显示模型,SHOWMODE为前缀的常量定义,你的应用有几个页面的,就有几个SHOWMODE的常量定义
      *              分别对应不同页面,比如，主从页面中(不带插件), 有列表和卡片两个页面, 则会使用到SHOWMODE_LIST
      *              SHOWMODE_CARD, render方法的中根据showmode值,来具体渲染页面.
      * editmode:    页面当前编辑模式,有两种状态, EDITMODE为前传的常量定义， EDITMODE_BROWSE,EDITMODE_EDIT;
      *              高阶组件的中的编辑状态与它保持一致的。当设置或改变editmode时,高阶组件的状态也要随之变化,
      *              如form formlist.
      * 模型结构定义说明： 建议优先阅读开头的说明3.2 createState方法，render方法
      * 这块基本模型，含义，表示是什么，起什么作用：参考3.2 create方法， 但是要结合你的模型
      * 树表
      * state = {
	  *		head:{},         //表头信息        列表卡片公用
	  *		headBtn:{},      //表头按钮信息    列表卡片公用
	  *		list:{			 //列表信息
	  *			search:{},	 //列表查询区域信息
	  * 		tree:{},	 //列表左树信息
	  *			table:{}	 //列表右表信息
	  *		},
	  *		card:{			 //卡片信息
	  *			from:{},	 //卡片Form信息
	  *			fromlist{}   //卡片FormList信息
	  *		}
 	  *	}
      *
      * 其他功能是如何在state中定义
      * 特性模型的加入通过，Utils.apply方法蒋其他模型(插件模型加入到state中)
      * 可参见此方法中的具体的Utils.apply的注释
      * 例子：
	  * state = { //基本模型
      *      list:{} 
      *      card:{}
      * }
	  * uploader: { //上传组件
      *      visible: false, 
      *      billId: '',
      *      onHide: this.onHideUploader
      * }
	  * 通过调用Utils.apply方法 Utils.apply(state, uploader);
	  * 体现的结果为:
	  * state = { //基本模型
      *      list:{} 
      *      card:{}
      *      uploader: { //上传组件
      *          visible: false, 
      *          billId: '',
      *          onHide: this.onHideUploader
      *      }
      * }
	  */
    createState = () => {
        let state = {
			isPageReady:false,						 //页面是否可以进行渲染
            editmode: EDITMODE_BROWSE,				 //编辑状态
            showmode: SHOWMODE_LIST,				 //显示界面
            head: {
                title: this.props.getSearchParam('n')   || 'Demo树表',  //标题定义
                initShowBackBtn: false,			     					//是否显示标题头部的返回按钮
                backBtnClick: this.onBackBtnClick    				    //卡片按钮返回点击事件
            },
            headBtn: {
                area: 'common',				 //表头部按钮区域
                onButtonClick: (props, btncode) => { //按钮点击事件
                    this.onBtnClickHead.call(this, btncode, { props })
                },
				//指定下拉弹窗渲染的位置，默认是body。(当按钮组放在模态框、侧拉框等内部时，
				//需要指定popContainer，否则会出现下拉弹窗被模态框遮挡，下拉弹窗随着滚动条滚动的问题
                popContainer: document.querySelector('.header-button-area'),
            },
            list: {
                search: {						           //查询区
                    area: 'office_CjmMasterQuery',			   //查询区 区域
                    clickSearchBtn: this.onQuery		   //点击查询
                },
				tree: {
					treeId:'region_CjmMaster_tree',				   // 树ID
					needSearch:false,						   // 是否需要搜索
					showLine:true,					           // 是否显示连线
					needEdit:false,							   // 是否需要编辑
					onSelectEve: this.onTreeNodeSelect,        // 选择树节点事件
					metaId:'',        					       // 弹出框中内容，树模板id（需要弹出编辑框才使用）
					getSearchVal: () => {},					   // 获取搜索框值
					clickEditIconEve: () => {}, 			   // 编辑点击 回调
                    clickAddIconEve: () => {},                 // 新增点击 回调
                    clickDelIconEve: () => {},                 // 删除点击 回调
				},
                table: {								    //列表
					allpks: [],								   //allpks
                    area: 'office_CjmMasterList',			    //区域
                    showCheck: true,					    //是否显示勾选
                    showIndex: true,					    //是否显示index
					crossPageSelect:true,					//跨页全选
                    onRowDoubleClick: this.onRowDoubleClick,//行双击事件
                    onSelected: this.updateBtnStatus,		//单选行事件
                    onSelectedAll: this.updateBtnStatus,	//全选行事件
                    handlePageInfoChange: () =>{
						//请求列表数据
						this.listTableData({callback: (data) => {
								//列表数据填充
								this.fillListData({data: data, callback: () => {
										//根据界面重新更新按钮状态
										this.updateBtnStatus();
									}
								});
							}
						})
					}
                }
            },
            card: {
                form: {
                    area: 'office_CjmMasterForm',				//form区域
                    onBeforeEvent: this.onBeforeEditForm,   //编辑前事件
                    onAfterEvent: this.onAfterEditForm,     //编辑后事件
					cancelPSwitch:true,					    //取消开关切换时的气泡提示
                },
				cardPagniation: {
					handlePageInfoChange: this.cardPagination    //卡片分页信息
				}
            }

        }

		//插件
		Utils.apply(state, {
            execlExport:{
                moduleName:this.config.domainName,				//模块名
                billType:EXCELBILLTYPE,					//单据类型
                selectedPKS: undefined,						    //选中的pks
                appcode:this.config.appcode,					//appcode
                pagecode:this.config.pagecode,					//pagecode
                ...Object.assign(this.props)					//其他属性
            }
		});
		Utils.apply(state, {
        	print:{
        		ref:'printOutput',
        		url:URLS.printUrl,
        		data:{
        			funcode: this.config.appcode,				//appcode
                    oids: [],								 	//数据的pks
                    nodekey: undefined,						    //默认输出模板的key
                    outputType: undefined						//如果是输出的画需要设为output,不是输出就置空
        		}
        	}
		});
		Utils.apply(state, {
			attachment:{
				show:false,								//是否显示
				billId: undefined,					    //单据id
				onHide:() => {                          //关闭事件
					this.state.attachment.show = false; //修改是否显示为false
					this.setState(this.state);			//更新state
				}
			}
		});



        return state;   //返回state解构

    }

    //4 渲染方法
    //UIExtend需要提供基本UIExtend特点的渲染并和createState对应
    //Plugin可以在任何位置插入页面渲染的对象(前提必须判断插件是否存在)
    render() {
        //解构须按照state方式逐层来,在需要的地方解构需要的数据,如下 state中的tree在renderTree中解构,
        var { isPageReady, showmode } = this.state;

        if (!isPageReady) return ''; //页面资源加载完成后才能渲染页面

        //渲染tree部分的定义
        let renderTree = () => {

			//参数解构
            let { head,headBtn,list,card,showmode,editmode } = this.state;

            return <NCDiv className="tree-area">
                {this.props.syncTree.createSyncTree(list.tree)}
            </NCDiv>;

        };

        // 打印输出组件
        const renderPrintOutput = () => {

			//参数解构
			let { head,headBtn,list,card,showmode,editmode,print } = this.state;
            return (
                <PrintOutput {...print}/>
            );
        }



        // 导入导出组件
        const renderExcelOutput = () => {

			//参数解构
			let { head,headBtn,list,card,showmode,editmode } = this.state;
            return (
                <ExcelOutput
                    {...this.state.execlExport}
                />
            );
        }

        // 附件组件
        const renderUploader = () => {

			//参数解构
            let { head,headBtn,list,card,showmode,editmode,attachment } = this.state;
            return attachment.show && (<NCUploader {...attachment}/>);
        }




        //渲染list部分的定义
        let renderList = () => {

			//参数解构
            let { head,headBtn,list,card,tree,showmode,editmode } = this.state;
			if(showmode != SHOWMODE_LIST) return '';
			//动态获取查询区域得高度，=> 重新计算table得高度
			let searchheight = document.querySelector('#search') && document.querySelector('#search').getBoundingClientRect() &&
                               document.querySelector('#search').getBoundingClientRect().bottom || 84;
            return (
                <div className='nc-bill-list' style={{ height: '100%' }}>
                    <NCDiv fieldid="head" className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                        <div className="header-title-search-area">
                            {this.props.BillHeadInfo.createBillHeadInfo(head)}
                        </div>
                        <div className="header-button-area  header-button-area-use">
                            {this.props.button.createButtonApp(headBtn)}
                        </div>
                    </NCDiv>
                    <div id = "search"  className="nc-bill-search-area border">
                        {this.props.search.NCCreateSearch(list.search.area, list.search)}
                    </div>
                    <NCDiv className="tree-table" style={{ height: 'calc(100% - ' + searchheight + 'px)'}}>
                        <this.props.DragWidthCom
                            defLeftWid='20%'  // 默认左侧区域宽度，px/百分百
                            leftMinWid='280px'
                            leftDom={renderTree()}
                            rightDom={
                                <div className="nc-bill-list">
                                    <NCDiv fieldid='indi' areaCode={NCDiv.config.ListItem} className='nc-bill-table-area'>
                                        {this.props.table.createSimpleTable(list.table.area, list.table)}
                                    </NCDiv>
                                </div>
                            }
                        />
                    </NCDiv>
                </div>
            )
        }

        //渲染card部分的定义
        let renderCard = () => {

			//参数解构
            let { head,headBtn,list,card,showmode,editmode } = this.state;
			if(showmode != SHOWMODE_CARD) return '';

            // cardtable存在bug，拷贝使用的是Object.assign()，会修改当前state
            let newFormlist = deepClone(card.formlist);
            let {...other} = newFormlist;

            return (
                <div className='nc-bill-card'>
                    <div className="nc-bill-top-area" style={{height:'100%'}} >
                        <NCAffix>
                            <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                                <NCDiv areaCode={NCDiv.config.Title} className='header-title-search-area'>
                                    {this.props.BillHeadInfo.createBillHeadInfo({ ...head, showBackBtn: editmode == EDITMODE_BROWSE, initShowBackBtn: editmode == EDITMODE_BROWSE })}
                                </NCDiv>
                                <div className="header-button-area">
                                    {this.props.button.createButtonApp(headBtn)}
                                </div>
                                <NCDiv areaCode={NCDiv.config.TABS} className='header-cardPagination-area'>
                                    {this.props.cardPagination.createCardPagination(card.cardPagniation)}
                                </NCDiv>
                            </NCDiv>
                        </NCAffix>
                        <NCDiv areaCode={NCDiv.config.FORM} className="nc-bill-form-area" style={{ height: 'cacl(100% - 42px)'}}>
                        {this.props.form.createForm(card.form.area, card.form)}
                        </NCDiv>
                    </div>
                </div>
            );
        };


		return <div>
                    {renderList() /** 渲染列表 */}
                    {renderCard() /** 渲染卡片 */}
                    {renderPrintOutput() /** 渲染打印输出*/}
                    {renderExcelOutput() /** 渲染导入导出*/}
                    {renderUploader()    /** 渲染附件*/}
                </div>

    }

    //=============功能性方法区=========================================================================================================
	/**
	 * 功能介绍 ： 初始化树状态
	 * 参数解释 ：
	 *			callback  回调，无参数
	 */
    updateBtnStatus = ({callback = EMPTY_FN} = {}) => {

    	 //参数解构
        let { head, headBtn, list, card, showmode, editmode } = this.state;
        //构建选中的数据
        let { pks, status ,treeNode  } = this.getCheckedDatas();

        //是否禁用
        let ButtonsDisable = {
			Add: (!treeNode || treeNode.id === "root") && showmode == SHOWMODE_LIST,
			//表头修改按钮  [列表 选中的pk大于0并且审批状态为自由态]   或者  [卡片界面 && 浏览态]
        	Edit:  !((pks && pks[0]) || (showmode == SHOWMODE_CARD && editmode == EDITMODE_BROWSE && !!(pks && pks[0]))),
			//表头修改按钮  [列表 选中的pk大于0并且审批状态为自由态]   或者  [卡片界面 && 浏览态]
			Copy: !(pks && pks[0]),
			//表头删除按钮  [列表 选中的pk大于0并且审批状态为自由态]   或者  [卡片界面 && 浏览态]
            Delete: !((pks && pks[0]) || (showmode == SHOWMODE_CARD && editmode == EDITMODE_BROWSE && !!(pks && pks[0]))),
			//刷新按钮  [列表 选中的pk大于0]
            Refresh: !(list.table.allpks && list.table.allpks.length > 0 && showmode == SHOWMODE_LIST || showmode == SHOWMODE_CARD && pks && pks[0]),
			//打印按钮  [列表 选中的pk大于0] 或者 [卡片界面 && 浏览态]
			Print: !((pks && pks[0]) || (showmode == SHOWMODE_CARD && editmode == EDITMODE_BROWSE && (pks && pks[0]))),
			//输出按钮  [列表 选中的pk大于0] 或者 [卡片界面 && 浏览态]
			Output: !((pks && pks[0]) || (showmode == SHOWMODE_CARD && editmode == EDITMODE_BROWSE && (pks && pks[0]))),
			//附件按钮  [列表 选中的pk大于0] 或者 [卡片界面 && 浏览态]
			Attachment : !((pks && pks[0]) || (showmode == SHOWMODE_CARD && editmode == EDITMODE_BROWSE && (pks && pks[0]))),
			//如果是复制状态，禁用保存按钮
			Save : card.copiedRows && card.copiedRows.data && card.copiedRows.data.length != 0,
			//如果是复制状态，禁用取消按钮
			Cancel : card.copiedRows && card.copiedRows.data && card.copiedRows.data.length != 0,
        }

        //是否可见
        let ButtonsVisible = {
			 //表头新增按钮 浏览态 
            Add: editmode == EDITMODE_BROWSE,
			 //表头复制按钮 浏览态 
            Copy: editmode == EDITMODE_BROWSE,
			 //表头删除按钮   浏览态 
			Delete: editmode == EDITMODE_BROWSE,
             //表头修改按钮   浏览态 
			Edit: editmode == EDITMODE_BROWSE,
			 //表头修改按钮   浏览态 
			More: editmode == EDITMODE_BROWSE,
			 //表头新增保存按钮 卡片页面 && 新增态 
			SaveAdd: showmode == SHOWMODE_CARD && status == EDITMODE_ADD ,
			 //表头保存按钮 卡片页面 && 不是浏览态 
			Save: showmode == SHOWMODE_CARD && editmode != EDITMODE_BROWSE,
			//表头取消按钮 卡片页面 && 不是浏览态
			Cancel: showmode == SHOWMODE_CARD && editmode != EDITMODE_BROWSE,
			 //表头刷新按钮 浏览态 
			Refresh: editmode == EDITMODE_BROWSE,
			 //表头打印按钮 浏览态 
			Print: editmode == EDITMODE_BROWSE,
			 //表头附件按钮 浏览态 
			Attachment : editmode == EDITMODE_BROWSE,
			 //表头导入按钮 浏览态 
	        Import: editmode == EDITMODE_BROWSE,
			 //表头导出按钮 浏览态 
			Export: editmode == EDITMODE_BROWSE,
        }


        //设置需要禁用按钮
        this.props.button.setDisabled(ButtonsDisable);
		//设置不可见的按钮
        this.props.button.setButtonsVisible(ButtonsVisible);
        //设置卡片翻页按钮
        this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', this.state.editmode == EDITMODE_BROWSE);
    }


	/**
	 * 功能介绍 ： 初始化树状态
	 * 参数解释 ：
	 *			callback  回调 ： 无参数
	 */
    initTreeStatus = ({callback = EMPTY_FN} = {}) => {

        //参数解构
        let { head, headBtn, list, card, showmode, editmode } = this.state;

        //打开根节点
        this.props.syncTree.openNodeByPk(list.tree.treeId, 'root');
        //选中根节点
        this.props.syncTree.setNodeSelected(list.tree.treeId, 'root');

		//执行回调函数
		setTimeout(callback, 0);
    }

	/**
	 * 功能介绍 ： 加载树数据
	 * 参数解释 ：
	 *		    callback  回调， (data:查询树信息的结果) => {}
	 */
    loadTree = ({callback = EMPTY_FN} = {}) => {

		//请求
        ajax({
             url: URLS.loadtreeUrl,		//请求url
             data: {
				userJson:{
					appcode : this.config.appcode
				}
			 },							//请求数据
             success: res => callback(res)	    //带着请求结果执行回调函数
        });

    }


	/**
	 * 功能介绍 ： 填充树数据
	 * 参数解释 ：
	 * 			data  树结构数据 node
	 *			callback  回调 ： 无参数
	 */
    fillTree = ({data,callback = EMPTY_FN} = {}) => {

		//解构state参数
    	let { head, headBtn, list, card, showmode, editmode } = this.state;

		//构建根目录
        let rootdata = [{
            key: 'root',
            title: '大区-陈金明',
            refname: '大区-陈金明',
            refpk: 'root',
            id: 'root',
            name: '大区-陈金明',
            children: data && data.data
        }]

		//设置异步树 数据
        this.props.syncTree.setSyncTreeData(list.tree.treeId, rootdata);

		//执行回调函数
        setTimeout(callback, 0);
    }


	/**
	 * 功能介绍 ： 查询卡片数据
	 * 参数解释 ：
	 * 			data  查询参数
	 *			callback  回调，(data: billcard格式查询结果) => {}
	 */
    loadCardData = ({pk, callback = EMPTY_FN} = {}) => {

		//解构state参数
		let { head, headBtn, list, card, showmode, editmode } = this.state;

		//构建卡片数据
		let data = {
			 pk: pk,
			 pageCode: this.config.pagecode,
			 formId: card.form.area,
		}

		//请求
		ajax({
			//请求url
			url: URLS.loadUrl,
			//请求附带的参数
			data: data,
			//请求结果，带着请求结果 执行回调函数
			success: res => callback(res)
		})

    }

	/**
	 * 功能介绍 ： 构建新增请求参数
	 * 参数解释 ：
	 * 			callback  回调， (data:构建需要保存的参数) => {}
	 */
    getAddParam = ({callback = EMPTY_FN} = {}) => {

        //参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;

		//卡片子表区域信息
		let cardTableAreaCode = null;

        //从界面获取数据
        let data = this.props.createExtCardData(this.config.pagecode,card.form.area,cardTableAreaCode)

        //构造表单数据
        let params = {
            billCard : data,				//单据卡片数据
            pageCode: this.config.pagecode, //页面编码
            formId: card.form.area,			//卡片Form区域编码
        };

		//返回构造的数据
		return params;
    }


	/**
	 * 功能介绍 ： 返回选中的数据
	 * 参数解释 ：
	 * 			callback
     * 			构建选中的数据
     * 			返回
     * 			pks,             选中的pks
     * 			map,             选中数据的map结构 pk - ts
     * 			approvestatus,   选中数据的审批状态
     * 			status,          form的页面状态
     * 			transtype        选中数据的交易类型
	 */
    getCheckedDatas = ({ record , callback = EMPTY_FN} = {}) => {
		//state判断
    	if(!this.state){
            return;
        }

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;
    	let pks = [];           		//选中的pks
        let status = undefined;         //页面状态
		let map = new Map();

		//获取选中的树界点
		let treeNode = this.props.syncTree.getSelectNode(list.tree.treeId);
		
        if (showmode == SHOWMODE_LIST) {
            //列表数据
            let checkdata = this.props.table.getCheckedRows(list.table.area);
            if (record) {
            	//map结构 pk - ts
				map.set(record[FIELDS.PRIMARYKEY] && record[FIELDS.PRIMARYKEY].value, record['ts'] && record['ts'].value)
            	//选中的pks
				pks.push(record[FIELDS.PRIMARYKEY] && record[FIELDS.PRIMARYKEY].value)
            }else{
            	//根据选中的数据，拿到选中的pks
            	pks = checkdata && checkdata.map(data => data.data.values[FIELDS.PRIMARYKEY] && data.data.values[FIELDS.PRIMARYKEY].value);
            	//根据选中的数据，构建map
                checkdata && checkdata.forEach(data =>
                    map.set(data.data.values[FIELDS.PRIMARYKEY] && data.data.values[FIELDS.PRIMARYKEY].value,data.data.values['ts'] && data.data.values['ts'].value)
                );
            }
        } else {
            //卡片数据选中的pk
            let pk = this.props.form.getFormItemsValue(card.form.area, FIELDS.PRIMARYKEY);
			//卡片数据选中的ts
            let ts = this.props.form.getFormItemsValue(card.form.area, 'ts');
            //卡片表单状态
            status = this.props.form.getFormStatus(card.form.area);
			//添加选中的pk
            pks.push(pk && pk.value)
			//构建map 数据结构
            map.set(pk && pk.value,ts && ts.value)
        }

		//返回需要用到的所有结果
        return {pks,map,status,treeNode};

    }


	/**
	 * 功能介绍 ： 填充列表数据
	 * 参数解释 ：
	 *			 data  grid格式数据，为空则会清空
	 *			 callback  回调， (data:列表界面的数据) => {}
	 */
    fillListData = ({data, callback = EMPTY_FN} = {}) => {

        //解构state 中的参数
        let { head,headBtn,list,card,showmode,editmode } = this.state;

        //设置表格数据
        this.props.table.setAllTableData(list.table.area, data && data.data ? data.data.data[list.table.area] : { rows: [] }, true);
		list.table.allpks = data && data.data && data.data.data[list.table.area] && data.data.data[list.table.area].allpks

		//更新state数据
        this.setState(this.state,() => {
			//回调执行函数
            callback && callback(data)
        });

    }


	/**
	 * 功能介绍 ： 卡片数据填充
	 * 参数解释 ：
     *			 data  卡片数据，格式参考后端ExtBillCard类
	 *			 callback  回调， (data:卡片界面的数据) => {}
	 */
    fillCardData = ({data, callback = EMPTY_FN} = {}) => {

        //参数解构
        let { head,headBtn,list,card,showmode,editmode,context } = this.state;

        //设置表头数据 设置卡片当前页PK
        if (data && data.head[card.form.area]) {
			 //设置form 数据
            this.props.form.setFormItemsValue(card.form.area, data.head[card.form.area].rows[0].values || {})
        }else{
            //清空页面值
            this.clearCardData();
        }


		//重置复制表体行数据
		this.state.card.copiedRows = {area:undefined,data:[]};
		//执行回调函数
		setTimeout(callback(data), 0);

    }
	

	/**
	 * 功能介绍 ： 填充环境变量数据
	 * 参数解释 ：
     *			 callback  回调，无参数
	 */
	fillContextData = ({callback = EMPTY_FN} = {}) => {
	
		//解构state参数
		let { head, headBtn, list, card, showmode, editmode,context } = this.state;
		
		// 如果存在组织属性，并且个性化设置-业务设置那设置了组织，则默认在新增时把组织字段在界面上
		context && context.pk_org && this.props.form.setFormItemsValue(card.form.area, {[FIELDS.PK_ORG]: {display: context.org_Name, value: context.pk_org}});

		//执行回调函数
		setTimeout(callback, 0);
	}
	

	/**
	 * 功能介绍 ： 清空卡片页面值
	 * 参数解释 ：
     *			 callback  回调，无参数
	 */
    clearCardData = ({callback = EMPTY_FN} = {}) => {

        //参数解构
        let { card } = this.state;

        //清空form
        this.props.form.EmptyAllFormValue(card.form.area);


		//执行回调函数
		setTimeout(callback, 0);
    }

	/**
	 * 功能介绍 ： 更新页面状态
	 * 参数解释 ：
     *			 callback  回调，无参数
	 */
    updatePageStatus = ({callback = EMPTY_FN} = {}) => {

		//解构state参数
        let { head, headBtn, list, card, showmode, editmode } = this.state;
		//设置form 状态
        this.props.form.setFormStatus(card.form.area, editmode);

		//执行回调函数
		setTimeout(callback, 0);
    }


	/**
	 * 功能介绍 ： 请求数据
	 * 参数解释 ：
     *			 callback  回调， (data: grid格式查询结果) => {}
	 */
	listTableData = ({callback = EMPTY_FN} = {}) => {

		//解构state
		let { head, headBtn, list, card, showmode, editmode } = this.state;
		//获取查询区域信息
		let info = this.props.search.getQueryInfo(list.search.area, false)
		//获取pageinfo 例如：分页信息
		let pageInfo = this.props.table.getTablePageInfo(list.table.area);
		//获取选中的树界点
		let treeNode = this.props.syncTree.getSelectNode(list.tree.treeId);

		//列表 参数构造
		let tableparams = {
			formId: list.table.area,        						//表格区域编码
			queryTreeFormatVO:{										//查询参数
				oid: info.oid,										//查询oid
				appcode: this.config.appcode,						//appcode 编码
				pageCode: this.config.pagecode,						//页面编码
				querytype: 'tree',									//查询类型
				querycondition: info.querycondition,				//查询条件
				queryAreaCode: list.search.area,					//查询区域
				pageInfo: pageInfo									//page信息
			},
			pageCode:this.config.pagecode,							//页面编码
			pageInfo:pageInfo,								        //分页信息
			treeNodePk: !treeNode || treeNode.key == "root" ? null :  treeNode.key,//选中树的pk,包含下级
			pid: 'pid' //树模型的主键字段
		}

		//请求
        ajax({
            url: URLS.listUrl,     //请求url
            data: tableparams,           //请求数据
            success: res => callback(res)//带着请求结果，执行回调函数
        });

    }

	/**
	 * 功能介绍 ： 列表新增
	 * 参数解释 ：
	 *			 callback  回调， (data:新增调用后的结果) => {}
	 */
    add = (params = {}) => {

        let { callback } = params
		//state参数解构
		let { head, headBtn, list, card, showmode, editmode } = this.state;
		//获取选中的数据节点
		let treeNode = this.props.syncTree.getSelectNode(list.tree.treeId);
		//构建预保存数据
		let presavedata = this.getAddParam()
		//构建请求数据
		let data = {
			...presavedata,
			userJson: {
				pageCode: this.config.pagecode,		//页面编码
				data:{
					parentKey: 'pid',					  //树模型主键字段名称
					parentPk: treeNode && treeNode.key === "root" ?  null : treeNode && treeNode.key  //树模型主键id
				}
			}
		}

		//请求
        ajax({
            url: URLS.addUrl,       //请求url
            data ,						  //请求数据
            success: res => callback(res) //带着请求结果执行回调函数
        });

    }

	/**
	 * 功能介绍 ： 修改
	 * 参数解释 ：
	 * 			 data 需要修改的数据
	 *			 callback  回调， (data:修改调用后的结果) => {}
	 */
    edit = ({ pk , callback = EMPTY_FN} = {}) => {
	
		//解构state
		let { head,headBtn,list,card,tree,showmode,editmode } = this.state;

		let param = {
			pk: pk,				 				//需要编辑的pk
			pageCode: this.config.pagecode, 	//页面编码
			formId: card.form.area,		 	    //卡片页面form 编码
		}
		
		//请求
        ajax({
            url: URLS.editUrl,     //请求url
            data: param,				     //请求数据
            success: res => callback(res)//带着请求结果，执行回调函数
        });
    }

	/**
	 * 功能介绍 ： 删除
	 * 参数解释 ：
	 * 			 data 需要删除的数据
     *			 callback  回调， (data:删除调用后的结果) => {}
	 */
    delete = ({ data, callback = EMPTY_FN } = {}) => {

        ajax({
            url: URLS.deleteUrl,    //请求url
            data: data,					  //请求数据
            success: res => callback(res) //带着请求结果，执行回调函数
        });

    }

	/**
	 * 功能介绍 ： 复制
	 * 参数解释 ：
	 * 			 data 需要复制的数据
     *			 callback  回调， (data:删除调用后的结果) => {}
	 */
	copy = ({ pk, callback = EMPTY_FN } = {}) => {
	
		//解构state
		let { head,headBtn,list,card,tree,showmode,editmode } = this.state;
		
		let param = {
			pk: pk, 							// 主键
			pageCode: this.config.pagecode,     // pagecode
			formId: card.form.area,		 	    //卡片页面form 编码
		}
		ajax({
			url: URLS.copyUrl,    //请求url
			data: param,					  //请求数据
			success: res => callback(res) //带着请求结果，执行回调函数
		});
		
	}



	/**
	 * 功能介绍 ： 保存
	 * 参数解释 ：
	 * 			 data 需要保存的数据
     *			 callback  回调， (data:保存调用后的结果) => {}
	 */
    save = ({ callback = EMPTY_FN} = {}) => {

		//解构state
        let { head,headBtn,list,card,tree,showmode,editmode } = this.state;
		
		//卡片form 必输项校验
		let checkRes = this.props.validatePageToToast([
		{name: [card.form.area], type: 'form'},
		
		])
		if(!checkRes.allPassed){return;}

		//卡片子表区域信息
		let cardTableAreaCode = null;

        //从界面获取数据
        let data = this.props.createExtCardData(this.config.pagecode,card.form.area,cardTableAreaCode)

        //构造表单数据
        let params = {
            billCard : data,				//单据卡片数据
            pageCode: this.config.pagecode, //页面编码
            formId: card.form.area,			//卡片Form区域编码
        };
		
        //保存校验
        this.props.validateToSave(data && data.billCard,() => {
            ajax({
                url: URLS.saveUrl,      //请求url
                data: params,					  //请求数据
                success: res =>  callback(res)//带着请求结果，执行回调函数
            });
        },{[card.form.area]:'form'},'extcard')

    }


	   /**
     * 方法功能：
     *      初始化卡片翻页器,在列表切换到卡片时调用,初始化卡片翻页组件的allpks
     */
    initCardPaginationWithAllpks = () => {
	
		//解构state
        let { head,headBtn,list,card,tree,showmode,editmode } = this.state;

        // 设置卡片翻页器的allpks，当调用cardPagination组件的API新增、删除pk时，allpks会同步更新
        this.props.cardPagination.setCardPaginationAllpks(list.table.allpks);
    }
	
	

    //=============操作流程方法区===================================================================================================
    //功能性方法区的方法可以随便调用,
    //操作流程方法区之间可相互调用
    onBtnClickHead = (btncode, option = {}) => {

        let { area,record,index } = option;


        //UIExtend的基本操作流程功能,
        switch (btncode) {
            case ACTIONS.REFRESH:
                //刷新
                this.onRefresh();
                break;
            case ACTIONS.CANCEL:
                //取消功能
                this.onCancel();
                break;
			case ACTIONS.COPY:
				//复制功能
				this.onCopy();
				break;
            case ACTIONS.ADD:
                //表头新增
                this.onAdd();
                break;
            case ACTIONS.DELETE:
                //表头删除
                this.onDelete({area,record});
                break;
            case ACTIONS.EDIT:
				//表头和表体修改
                this.onEdit({record});
                break;
            case ACTIONS.SAVEADD:
				//保存新增
            	this.onSaveAdd();
            	break;
            case ACTIONS.SAVE:
				//保存
                this.onSave();
                break;
        };
        //通用及插件通用扩展的操作流程功能
        switch (btncode) {
            case ACTIONS.PRINT:
                this.onPrint();    //打印
                break;
            case ACTIONS.OUTPUT:
                this.onOutput();   //输出
                break;
            case ACTIONS.EXPORT:
                this.onExport();   //导出
                break;
            case ACTIONS.ATTACHMENT:
                this.onAttachment();//附件
                break;
            default:
                break;
        };
    }
	
	
	


	/**
	 * 功能介绍 ： 卡片翻页
	 * 参数解释 ：
	 *			 props
	 *			 pk  翻页后数据的pk
	 */
    cardPagination = (props, pk) => {

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;

        //加载卡片
        this.loadCardData({pk,callback: (data) => {
                //填充卡片数据
            	this.fillCardData({data: data && data.data && data.data.data ,callback: () => {
                        //更新按钮状态
                    	this.updateBtnStatus();
                    }
                });
            }
        })

    }


	/**
	 * 功能介绍 ： 列表 查询 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onQuery = () => {

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;

		//加载列表数据
		this.listTableData({callback: (data) => {
				//列表数据填充
				this.fillListData({data: data,callback: () => {
						//结果提示
						toast({
							title: data && data.data && data.data.data ? '查询成功,共'+data.data.data[list.table.area].allpks.length+'条！' : '未查询到数据！',
							color: data && data.data && data.data.data ? 'success' : 'warning'
						});
					}
				});
			}
		})


    }


	/**
	 * 功能介绍 ： 刷新 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onRefresh = () => {

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;
		//构建选中数据
		let { pks } = this.getCheckedDatas();
		//取出pks中的第一条pk
		let pk = pks && pks[0]
		//根据界面状态判断执行
		 showmode == SHOWMODE_LIST ?
		 //加载列表
		 this.listTableData({callback: (data) => {
				 //列表数据填充
				 this.fillListData({data: data,callback: () => {
						 toast({ title: '刷新成功！', color: 'success' });
						 //按钮更新
						 this.updateBtnStatus();
					 }
				 });
			 }
		 }) :
		 //加载卡片
		 this.loadCardData({pk,callback: (data) => {
				//卡片数据填充
				this.fillCardData({data: data && data.data && data.data.data ,callback: () => {
						 toast({ title: '刷新成功！', color: 'success' });
						 //按钮更新
						 this.updateBtnStatus();
					 }
				 });
			 }
		 })

    }

	/**
	 * 复制功能
	 */
	onCopy = () => {

		//state参数解构
		let { head, headBtn, list, card, showmode, editmode } = this.state;
		//构建选中数据
		let { pks } = this.getCheckedDatas();
		//设置当前显示的界面为卡片
		this.state.showmode = SHOWMODE_CARD;
		//设置界面状态为 编辑态
		this.state.editmode = EDITMODE_EDIT;
		//更新state
		this.setState(this.state, () => {
			//复制
			this.copy({pk:pks && pks[0],callback: (data) => {
				//卡片数据填充
				this.fillCardData({data: data && data.data && data.data.data, callback: () => {
				}});
			}})
			//更新页面状态
			this.updatePageStatus()
			//按钮更新
			this.updateBtnStatus();
		})

	}

	/**
	 * 功能介绍 ： 导入刷新 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onImportRefresh = () => {

		//state参数解构
        let { head, headBtn, list, card, showmode, editmode } = this.state;
    	//构建选中数据
		let { pks } = this.getCheckedDatas();
		//取需要加载卡片的pk
		let pk = pks && pks[0] ? pks && pks[0] : list.table.allpks.slice(-1)[0];
		//根据界面状态判断执行
		 showmode == SHOWMODE_LIST ?
		 //加载列表
		 this.listTableData({callback: (data) => {
				 //列表数据填充
				 this.fillListData({data: data,callback: () => {
						//按钮更新
						this.updateBtnStatus();
					 }
				 });
			 }
		 }) :
		 //加载卡片
		 this.loadCardData({pk,callback: (data) => {
				//填充卡片数据
				this.fillCardData({data: data && data.data && data.data.data ,callback: (data) => {
						//更新按钮状态
						this.updateBtnStatus();
					 }
				 });
			 }
		 })
    }


	/**
	 * 功能介绍 ： 取消 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onCancel = () => {

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;

    	//构建选中数据
		let { pks } = this.getCheckedDatas();
		//取出需要加载的卡片pk
		let pk = pks && pks[0] ? pks && pks[0] : list.table.allpks ? list.table.allpks.slice(-1)[0] : "";
		
		//取消处理
		let handleCancel = () => {
			//修改界面状态为浏览态
			this.state.editmode = EDITMODE_BROWSE;
			//修改显示界面为卡片
			this.state.showmode = SHOWMODE_CARD
			//更新state
			this.setState(this.state, () => {
				//更新卡片页面状态
				this.updatePageStatus()
				//加载数据 如果当前页有数据就加载当前页数据，否则加载列表第一条数据
				if(list.table.allpks || pks && pks[0]){
					this.loadCardData({pk,callback: (data) => {
							//填充卡片数据
							this.fillCardData({data: data && data.data && data.data.data ,callback : () => {
								this.props.cardPagination.setCardPaginationId({id: pk, status: 1});
								//更新按钮
								this.updateBtnStatus();
							}});
						}
					})
				}else{
					//修改界面状态为浏览态
					this.state.editmode = EDITMODE_BROWSE;
					//修改界面为列表
					this.state.showmode = SHOWMODE_LIST
					//更新列表
					this.setState(this.state,() => {
						//加载列表数据
						this.listTableData({callback: (data) => {
							//列表数据填充
							this.fillListData({data: data,callback: () => {}});
						}})
						//更新按钮状态
						this.updateBtnStatus();
					})
				}
			});
		}

		promptBox({
			color: 'warning',
			title: "取消", /* 国际化处理： 确认title*/
			content: "确定要取消吗？", /* 国际化处理： 确认内容*/
			beSureBtnClick: handleCancel
		})

    }


	/**
	 * 功能介绍 ： 新增 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onAdd = () => {

		//state参数解构
		let { head, headBtn, list, card, showmode, editmode,context } = this.state;
		
		this.clearCardData({callback : () => {
			//新增请求
			this.add({callback : (data) =>{
					//填充卡片数据
					this.fillCardData({data : data && data.data && data.data.data})
					//填充环境变量数据
					this.fillContextData();
					//初始化翻页器
					this.initCardPaginationWithAllpks();
				}
			})
		}});


        //显示卡片
        this.state.showmode = SHOWMODE_CARD;
		//可编辑
        this.state.editmode = EDITMODE_ADD;
		//更新state
        this.setState(this.state, () => {
            //更新卡片页面状态
            this.updatePageStatus();
            //更新按钮状态
            this.updateBtnStatus();
        });

    }



    /**
	 * 功能介绍 ： 删除 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onDelete = (param = {}) => {

		//state参数解构
    	let { head, headBtn, list, card, showmode, editmode } = this.state;
		
		//删除核心逻辑
		let handleDelete = () => {
			//构建选中的数据
			let { map,pks } = this.getCheckedDatas(param);
			//进行后台删除数据
			this.delete({data: { tsMap: map }, callback: () => {
				//重新根据查询区的条件查询后台数据
				if (showmode == SHOWMODE_LIST) {
					//请求数据
					this.listTableData({callback: (listdata) => {
							//列表数据填充
							this.fillListData({data: listdata, callback: () => {
									//删除后进行提示
									toast({ title: '删除成功！', color: 'success' });
									//更新按钮
									this.updateBtnStatus();
								}
							});
						}
					})
				} else {
					//获取看卡片下一页的数据
					let nextpk = this.props.cardPagination.getNextCardPaginationId({id: pks && pks[0],status:1})
					//设置删除的pk
					this.props.cardPagination.setCardPaginationId({ id: pks && pks[0], status: 3 });
					//如果有下一页的pk
					if(nextpk){
						this.loadCardData({pk: nextpk, callback: (data) => {
							//填充卡片数据
							this.fillCardData({
								data: data && data.data && data.data.data, callback: () => {
									this.props.cardPagination.setCardPaginationId({ id: nextpk, status: 1 });
								}
							});
						}}) 
					}else{
						this.clearCardData({callback : () => {
							this.updateBtnStatus();
						}}) //清空表单数据
					}
					toast({ title: '删除成功！', color: 'success' });
				}
			}})
		}

		//删除弹窗
		promptBox({
			color: 'warning',
			title: this.lang['000002'], /* 国际化处理： 确认title*/
			content: this.lang['000003'], /* 国际化处理： 确认内容*/
			beSureBtnClick: handleDelete
		})


    }

    /**
	 * 功能介绍 ： 修改 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onEdit = ({record} = {}) => {

		 //state参数解构
    	 let { head, headBtn, list, card, showmode, editmode } = this.state;
         //获取pk
    	 let { pks } = this.getCheckedDatas({record});
		 //设置当前显示的界面为卡片
         this.state.showmode = SHOWMODE_CARD;
		 //设置界面状态为 编辑态
         this.state.editmode = EDITMODE_EDIT;
         this.setState(this.state, () => {
        	 //更新卡片页面状态
             this.updatePageStatus();
             //更新按钮状态
             this.updateBtnStatus();
			 // 根据列表数据初始化卡片翻页器
             this.initCardPaginationWithAllpks();
             //根据pk加载卡片数据
             this.edit({pk : pks && pks[0],callback: (data) => {
                    //填充卡片数据
                 	this.fillCardData({ data: data && data.data && data.data.data  });
                 }
             })
         })
    }


	/**
	 * 功能介绍 ： 导出 流程组装
	 * 参数解释 ：
	 *			 无
	 */
	onExport = () => {

		//构建选中的数据
		let { pks } = this.getCheckedDatas();
		//导出pks 赋值
		this.state.execlExport.selectedPKS = pks;
		//更新state
        this.setState(this.state,() => {
            //显示导出模态框
        	this.props.modal.show('exportFileModal');
        })

	}




	/**
	 * 功能介绍 ： 打印 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onPrint = () => {

		//构建选中的数据
    	let { pks } = this.getCheckedDatas();
		//state参数解构
        let { head, headBtn, list, card, showmode, editmode  } = this.state;
		//根据界面状态设置打印默认模板
        this.state.print.data.nodekey = showmode == SHOWMODE_LIST ? PRINTNODEKEY_LIST : PRINTNODEKEY_CARD
		//需要打印的pks
        this.state.print.data.oids = pks;
        //输出类型，打印的输出类型为空
        this.state.print.data.outputType = undefined
		//更新state
        this.setState(this.state,() => {
			//调用平台的打印api
            print('pdf', URLS.printUrl, this.state.print.data);
        })

    }

	/**
	 * 功能介绍 ： 输出 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onOutput = () => {

    	//构建选中的数据
    	let { pks } = this.getCheckedDatas();
		//解构state参数
    	let { head, headBtn, list, card, showmode, editmode  } = this.state;
    	//打印数据模板key
        this.state.print.data.nodekey = showmode == SHOWMODE_LIST ? PRINTNODEKEY_LIST : PRINTNODEKEY_CARD
		//需要输出的pks
        this.state.print.data.oids = pks
		//输出类型
		this.state.print.data.outputType = 'output'
		//更新state
        this.setState(this.state,() => {
			//打开输出弹窗
            output({url : this.state.print.url,data : this.state.print.data});
        })

    }

	/**
	 * 功能介绍 ： 附件管理 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onAttachment = () => {

    	//构建选中的数据
		let { pks } = this.getCheckedDatas();
		//附件的单据id
        this.state.attachment.billId = pks && pks[0];
        //附件界面是否显示
        this.state.attachment.show = true;
		//更新state
        this.setState(this.state);

    }



	/**
	 * 功能介绍 ： 保存 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onSave = ({callback = EMPTY_FN} = {}) => {

		//解构state参数
    	let { head, headBtn, list, card, showmode, editmode  } = this.state;

		// 根据卡片主表单主键字段是否有值标记当前保存操作是新增还是修改
        let isAdd = !(this.props.form.getFormItemsValue(card.form.area, FIELDS.PRIMARYKEY).value);
		
		//保存
		this.save({callback: (data) => {
				//填充卡片数据
				this.fillCardData({data: data && data.data && data.data.data , callback: () => {
						this.state.editmode = EDITMODE_BROWSE;
						//切换编辑状态
						this.setState(this.state, () => {
							let { pks } = this.getCheckedDatas();
							// 给翻页器设置当前页面PK
							this.props.cardPagination.setCardPaginationId({id: pks[0], status: isAdd ? 2 : 1});
							//更新页面状态
							this.updatePageStatus();
							//更新按钮
							this.updateBtnStatus();
							//执行回调函数
							callback && callback(data && data.data && data.data.data );
						})
					}
				});
				//提示信息
				toast({ title: '保存成功！', color: 'success' });
			}
		})
    }

	/**
	 * 功能介绍 ： 保存新增 流程组装
	 * 参数解释 ：
	 *			   callback 回调函数
	 */
	onSaveAdd = () => {

		//解构state参数
		let { head, headBtn, list, card, showmode, editmode  } = this.state;

			
		//保存
		this.save({callback: (data) => {
			let pk = data.data.data.head[card.form.area].rows[0].values[FIELDS.PRIMARYKEY].value;
			// 给翻页器设置当前页面PK
			this.props.cardPagination.setCardPaginationId({id: pk, status: 2}); //新增
			//清空页面内容
			this.clearCardData({callback : () => {
				//新增请求
				this.add({callback : (data) =>{
						//填充卡片数据
						this.fillCardData({data : data && data.data && data.data.data})
						//填充环境变量数据
						this.fillContextData();
					}
				})
			}});
			//提示信息
			toast({ title: '保存成功！', color: 'success' });			
		}})

	}


	/**
	 * 功能介绍 ： 行双击事件 流程组装
	 * 参数解释 ：
	 *			   record  表体行操作记录
	 */
    onRowDoubleClick = (record) => {

    	 //state参数解构
    	 let { head, headBtn, list, card, showmode, editmode } = this.state;
    	 //构建选中数据
		 let { pks } = this.getCheckedDatas({record})
		 //卡片需要加载的数据pk
		 let pk = pks && pks[0]
		 //设置显示的界面为卡片界面
         this.state.showmode = SHOWMODE_CARD;
		 //设置界面状态为浏览态
         this.state.editmode = EDITMODE_BROWSE;
		 //更新state
         this.setState(this.state, () => {
             //加载卡片
             this.loadCardData({pk,callback: (data) => {
                    //填充卡片信息
                 	this.fillCardData({data: data && data.data && data.data.data,callback: () => {
							// 根据列表数据初始化卡片翻页器
							this.initCardPaginationWithAllpks();
							// 设置翻页器当前的数据主键
							this.props.cardPagination.setCardPaginationId({id: pk, status: 1});
                             //更新按钮信息
                             this.updateBtnStatus();
                        	 //更新页面信息
                             this.updatePageStatus();
                         }
                     });
                 }
             })
         })

    }

	/**
	 * 功能介绍 ： 树节点选中 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onTreeNodeSelect = () => {

		//列表数据加载
		this.listTableData({callback: (data) => {
			//列表数据填充
			this.fillListData({data: data, callback: () => {
				//更新按钮
				this.updateBtnStatus();
			}});
		}})

    }

	/**
	 * 功能介绍 ： 卡片返回列表 流程组装
	 * 参数解释 ：
	 *			 无
	 */
    onBackBtnClick = () => {

        //设置界面显示为列表界面
        this.state.showmode = SHOWMODE_LIST;
		//设置界面状态为浏览态
        this.state.editmode = EDITMODE_BROWSE;
		//选中根节点
        this.props.syncTree.setNodeSelected(this.state.list.tree.treeId, 'root');
        //切换页面状态
		this.setState(this.state, () => {
			//加载数据
			this.listTableData({callback: (data) => {
					//列表数据填充
					this.fillListData({data: data, callback: () => {
						//更新按钮
						this.updateBtnStatus();
						}
					});
				}
			})
		});

    }



    //表单，表体编辑前后事件处理

    /**
     * 卡片 子表 编辑前事件
     */
    onBeforeEvent = () => {

		//DEMO1 当子表的加价率为空时，币种禁用， 当子表加价率不为空时，启用币种
		// if(key == "pk_currtype"){
		// 	this.props.cardTable.setEditableByRowId(
		// 		moduleId,changedrows.rowid,"pk_currtype",!!changedrows.values.naddpricerate.value
		// 	)
		// }

		return true;

    }

    /**
     * 卡片 子表 编辑后事件
     */
    onAfterEvent = (props, moduleId, key, value, changedrows, index) => {

    	//state参数解构
		let { head, headBtn, list, card, showmode, editmode } = this.state;

		
		//DEMO1 新增的子表价格自动汇总到form中
		// if(key == "vpricerule" && value != null){
		// 	let sumPrice = 0;
		// 	Object.keys(card.formlist).forEach(area => {
		// 		let alldata = this.props.cardTable.getAllData(area);
		// 		alldata.rows.forEach(row => {
		// 			//字符转为float 在进行相加
		// 			sumPrice += parseFloat(row.values.vpricerule.value);
		// 		})
		// 	})
		// 	//将汇总的金额设置到表头上
		// 	this.props.form.setFormItemsValue(card.form.area, {
		// 		"money": { value: sumPrice }
		// 	})
		// }

		//DEMO2 当子表的加价率为空时，币种禁用， 当子表加价率不为空时，启用币种
		// if(key == "naddpricerate"){
		// 	this.props.cardTable.setEditableByRowId(
		// 		moduleId,changedrows[0].rowid,"pk_currtype",value != null
		// 	)
		// }


	}

    /**
     * 表单编辑后事件
     * @param {*} props
     * @param {*} moduleId
     * @param {*} key
     * @param {*} value
     * @param {*} oldValue
     */
    onAfterEditForm = (props, moduleId, key, value, oldValue) => {

		//state参数解构
		let { head, headBtn, list, card, showmode, editmode } = this.state;


		//DEMO1 选中 [组织] 后，禁用 [行号] 字段 使用时替换对应的值即可
		// if (key == "pk_org" && value != null) {
		// 	this.props.form.setFormItemsDisabled(card.form.area, {
		// 		"rowno": true
		// 	});
		// }

		//DEMO2 选中 [组织] 后，填充 [行号] 为1  使用时替换对应的值即可
		// if (key == "pk_org" && value != null) {
		// 	this.props.form.setFormItemsValue(card.form.area, {
		// 		"rowno": { value: "1" }
		// 	})
		// }

	}

    /**
     * 表单编辑前事件
	 * 编辑前如果返回false 表单的状态时禁用的
     * @param {*} props
     * @param {*} moduleId
     * @param {*} key
     * @param {*} value
     * @param {*} data
     */
    onBeforeEditForm = (props, moduleId, key, value, data) => {

		//state参数解构
		let { head, headBtn, list, card, showmode, editmode } = this.state;

		// 编辑前事件使用案例: 参照过滤。如：交易类型要根据单据类型编码过滤
        // if (key == FIELDS.TRANSTYPE) { // 交易类型PK
        //     let meta = props.meta.getMeta();
        //     meta[card.form.area].items.forEach(item => {
        //         if (item.attrcode == FIELDS.TRANSTYPE) {
        //             item.queryCondition = () => {
        //                 return { parentbilltype: BILLTYPE }
        //             }
        //         }
        //     });
        //     this.props.meta.setMeta(meta);
		// }

        return true;
    }

}

/**
 * 应用的入口createPage
 * 前端底层，通过createPage方法，把各个对象插入到当前应用的props中
 * initTemplate : 目的是初始化模板，目前已经在constructor中使用Utils.loadNCCResource方法获取模板
 * billInfo : 目的是为公式准备，具体可以到nccdev.yonyou.com上搜索公式查看
 */
ApplicationPage = createPage({
    initTemplate: {},
    billinfo: {
        billtype: 'card',
        pagecode: '4004800M1_office_CjmMaster',
        headcode: 'office_CjmMasterForm',
    },
	orderOfHotKey: ['office_CjmMasterForm', ]
})(ApplicationPage)
ReactDOM.render(<ApplicationPage />, document.querySelector("#app"));
