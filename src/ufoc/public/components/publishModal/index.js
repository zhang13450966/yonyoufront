import React, { Component } from 'react';
import { base, createPage, ajax, toast, getMultiLang } from 'nc-lightapp-front';

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}};

import "./index.less"
const { NCModal, NCButton, NCRadio, NCFormControl, NCStep, NCSelect, NCTooltip } = base;
// import SQTtransfer from '../SQTtransfer';
const { NCRadioGroup } = NCRadio;
const NCSteps = NCStep.NCSteps;
const NCOption = NCSelect.NCOption;
const treeUseId = 'treeUseId'; //初始化树ID
const treeMenuId = 'treeMenuId'; //初始化树ID
const widgetSize = [
	{ width: '1', height: '1', value: '1,1' },
	{ width: '1', height: '2', value: '1,2' },
	{ width: '1', height: '3', value: '1,3' },
	{ width: '1', height: '4', value: '1,4' },
	{ width: '2', height: '2', value: '2,2' },
	{ width: '2', height: '3', value: '2,3' },
	{ width: '2', height: '4', value: '2,4' }
];

const REG = /^[0-9a-zA-Z]{1,}$/;

function generateTreeData(sourceList, options) {
	if (!sourceList) return [];
	let keyName = options ? options.keyName : 'refpk';
	let parentKeyName = options ? options.parentKeyName : 'pid';
	// 过滤父节点(包含pid为空或者子元素的pk找不到pid的数据)
	let rootList = sourceList.filter((x) => {
		if (!x[parentKeyName]) return true;
		return !sourceList.find((item) => item[keyName] === x[parentKeyName]);
	});
	// 生成部门结构数据(过滤的父节点中的数据在全数据中查找当前数据对应的子数据)
	let fun = (node) => {
		// 递归对象子元素
		let children = sourceList.filter((x) => x[parentKeyName] === node[keyName]).map(fun);
		if (children && children.length) {
			return Object.assign({}, node, { children });
		} else {
			return node;
		}
	};
	// 生成树形结构
	return rootList.map(fun);
}

class PublishModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			useTreeData: [], //小应用树数据
			menuTreeData: [], //菜单树数据
			enabledMenuPk: '',
			orgTypeArray: [], //组织类型下拉数组
			currentIndex: 0, //哪一个tab
			showPublishModal: false, //模态框显示或隐藏
			firstTreeSelect: false,
			secondTreeSelect: false,
			pageData: {
				publishType: '1', //发布类型
				publishMethod: 'new', //发布方式
				orgTypeCode: '', //选中的组织类型
				appCode: '', //节点编码
				appName: '', //节点名称
				pageUrl: '', //跳转路径
				menuCode: '', //菜单编码
				menuName: '', //菜单名称
				targetPath: '', //发布小部件的路径
				size: '', //小部件大小
				selAppPk: '', //小应用树Pk
				selAppCode: '', //小应用树code
				selMenuCode: '' //菜单树code
			},
			// 多语需要使用的状态
			json: {} ,
			intl: null,
			scopeIds: [] //scopeId下拉
		};
		this.transferData = [];
		this.filedProperties = {};
	}

	componentWillMount() {
		if(_.isEmpty($appRoot.state.json)){
            // 初始化调用getPlatformLang方法获取多语
            let callback = (json, bool, LangData) => {
                $appRoot.state.json = json;
            }
            $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
        }
	}

	componentDidMount() {
		this.getTreedata();
		this.getOptions();
		this.setState({ showPublishModal: true });
	}

	getOptions = () => {
		// ajax({
		// 	url: '/nccloud/report/lightsmart/fetchScopeIdListAction.do',
		// 	data: {},
		// 	success: (res) => {
		// 		this.setState({
		// 			scopeIds: res.data.scopeIds
		// 		});
		// 	}
		// });
	};

	//获取树数据
	getTreedata = () => {
		ajax({
			url: '/nccloud/ufoe/task/publishAppQuery.do',
			data: {},
			success: (res) => {
				const { appTree, menuTree, orgType, enabledMenuPk } = res.data;
				//替换后端返回数据格式，由于平台同部树组件内部 只认识refpk和refname
				let transLateUserData = appTree.map((item) => {
					item.refpk = item.pk;
					item.refname = item.code + item.name;
					return item;
				});
				let transLateMenuData = menuTree.map((item) => {
					item.refpk = item.code;
					item.refname = item.code + item.name;
					return item;
				});
				//重写转换树结构方法，这里统一处理转换树
				let useTreeData = generateTreeData(JSON.parse(JSON.stringify(transLateUserData)));
				let menuTreeData = generateTreeData(JSON.parse(JSON.stringify(transLateMenuData)));
				//调用平台树API 渲染树结构
				this.props.syncTree.setSyncTreeData(treeUseId, useTreeData);
				this.props.syncTree.setSyncTreeData(treeMenuId, menuTreeData);
				this.setState({ orgTypeArray: orgType, enabledMenuPk });
			}
		});
	};

	hideModal = (flag = false) => {
		//隐藏模态框
		if (!flag) this.props.hidePublishModal();
		this.setState({
			showPublishModal: flag,
			currentIndex: 0,
			pageData: {
				...this.state.pageData,
				publishType: '1', //发布类型
				publishMethod: 'new', //发布方式
				orgTypeCode: '', //选中的组织类型
				appCode: '', //节点编码
				appName: '', //节点名称
				pageUrl: '', //跳转路径
				menuCode: '', //菜单编码
				menuName: '', //菜单名称
				targetPath: '', //发布小部件的路径
				size: '', //小部件大小
				selAppPk: '', //小应用树Pk
				selAppCode: '', //小应用树code
				selMenuCode: '' //菜单树code
			}
		});
	};

	onHandleClick = (way) => {
		//按钮操作
		let { currentIndex, pageData } = this.state;
		switch (way) {
			case 'next':
				currentIndex++;
				if (pageData.appCode === '')
					return toast({
						content: $appRoot.state.json['public_lang-000196'],/* 国际化处理： 请输入节点编码*/
						color: 'warning'
					});
				if (pageData.appName === '')
					return toast({
						content: $appRoot.state.json['public_lang-000197'],/* 国际化处理： 请输入节点名称*/
						color: 'warning'
					}); 
				if (pageData.orgTypeCode === '')
					return toast({
						content: $appRoot.state.json['public_lang-000198'],/* 国际化处理： 请选择组织类型*/
						color: 'warning'
					}); 

				if (!this.state.firstTreeSelect)
					return toast({
						content: $appRoot.state.json['public_lang-000199'],/* 国际化处理： 请选择目录树三级节点*/
						color: 'warning'
					}); 

				if (currentIndex == 2) {
					if (!pageData.menuCode || pageData.menuCode === '')
						return toast({
							content: $appRoot.state.json['public_lang-000200'],/* 国际化处理： 请输入菜单编码*/
							color: 'warning'
						}); 
					if (!pageData.menuName || pageData.menuName === '')
						return toast({
							content: $appRoot.state.json['public_lang-000201'],/* 国际化处理： 请输入菜单名称*/
							color: 'warning'
						}); 

					if (!this.state.secondTreeSelect)
						return toast({
							content: $appRoot.state.json['public_lang-000199'],/* 国际化处理： 请选择目录树三级节点*/
							color: 'warning'
						}); 
				}

				this.setState({ currentIndex });
				break;
			case 'cancel':
				this.hideModal();
				break;
			case 'prev':
				currentIndex--;
				this.setState({ currentIndex });
				break;
			case 'finish':
				if (pageData.appCode === '')
					return toast({
						content: $appRoot.state.json['public_lang-000196'],/* 国际化处理： 请输入节点编码*/
						color: 'warning'
					}); 

				if (pageData.appName === '')
					return toast({
						content: $appRoot.state.json['public_lang-000197'],/* 国际化处理： 请输入节点名称*/
						color: 'warning'
					}); 

				if (pageData.orgTypeCode === '')
					return toast({
						content: $appRoot.state.json['public_lang-000198'],/* 国际化处理： 请选择组织类型*/
						color: 'warning'
					});
				if (!pageData.menuCode||(pageData.menuCode&&pageData.menuCode.length <=6))
					return toast({
						content: $appRoot.state.json['public_lang-000202'],/* 国际化处理： 菜单编码必须输入且长度必须大于6！*/
						color: 'warning'
					}); 

				this.publishReport();
				break;
			case 'finishAndSet':
				if (!pageData.menuCode || pageData.menuCode === '')
					return toast({
						content: $appRoot.state.json['public_lang-000200'],/* 国际化处理： 请输入菜单编码*/
						color: 'warning'
					}); 
				if (!pageData.menuName || pageData.menuName === '')
					return toast({
						content: $appRoot.state.json['public_lang-000201'],/* 国际化处理： 请输入菜单名称*/
						color: 'warning'
					}); 

				if (!this.state.secondTreeSelect)
					return toast({
						content: $appRoot.state.json['public_lang-000199'],/* 国际化处理： 请选择目录树三级节点*/
						color: 'warning'
					}); 
				this.publishReport('finishAndSet');
				break;
		}
	};

	publishReport = async (type) => {
		//发布
		const { pageData, enabledMenuPk } = this.state;
		const {
			publishType,
			publishMethod,
			appCode,
			appName,
			orgTypeCode,
			pageUrl,
			menuCode,
			menuName,
			selAppPk,
			selAppCode,
			selMenuCode,
			targetPath,
			size,
			pk_appregister,
			scopeid
		} = pageData;
		// {"publishType": "必传 发布类型", "publishMethod": "发布方式", "enabledMenuPk":"必传", "pk_storyboard":"必传 点击的面板", "curAppCode":"必传 url里的appcode",
		//   "selAppPk":"必传 小应用树Pk", "selAppCode":"必传 小应用树code ", "selMenuCode":"必传 菜单树code"
		//   "appCode":"必传 节点编码", "appName":"必传 节点名称", "orgTypeCode":"必传 组织类型 pk_orgtype", "pageUrl":"非必传",
		//   "menuCode":"必传 菜单编码", "menuName":"必传 菜单名称", }
		let data = {
			publishType,
			publishMethod,
			enabledMenuPk,
			pk_report: this.props.publishBoardItem.id.value,
			fieldCodes: this.transferData.length == 0 ? Object.keys(this.filedProperties) : this.transferData,
			curAppCode: this.props.getSearchParam('c'),
			selAppPk,
			selAppCode,
			selMenuCode,
			appCode,
			appName,
			orgTypeCode,
			pageUrl,
			menuCode,
			menuName,
			width: (size && size.split(',')[0]) || '1',
			height: (size && size.split(',')[1]) || '1',
			targetPath,
			pk_appregister,
			scopeid
		};

		//判断用户是否点击了树节点
		if (pageData.publishMethod === 'new') {
			if ([ selAppPk, selAppCode, selMenuCode ].includes('')) {
				toast({ content: $appRoot.state.json['public_lang-000203'], color: 'warning' }); /* 国际化处理： 请选择树应用节点*/
				return;
			}
		}
		//当为覆盖时候，不传selMenuCode
		if (pageData.publishMethod === 'overwrite') {
			delete data.selMenuCode;
		}

		let cb = param => {
			ajax({
				url: '/nccloud/report/lightbq/reppublishapp.do',
				data,
				success: (res) => {
					toast({ content: $appRoot.state.json['public_lang-000204'], color: 'success' }); /* 国际化处理： 操作成功*/
					this.hideModal(); //成功之后关闭弹框
					this.props.ctmsRequest(param)
					if (type === 'finishAndSet' && res.data.selectedkey) {
						this.handlePageTo(res.data.selectedkey, res.data.appCode, res.data.pcode);
					}
				}
			});
		}
		let param = {
			id: publishType === 'delete' ? pk_appregister : this.props.publishBoardItem.id.value,
			type: publishType === 'delete' ? 'DELETE' : 'UPDATE',
			module: publishType === 'delete' ? 'App' : 'FreeReport',
			code: publishType === 'delete' ? 'FreeReport': '',
			onClose: cb
		}
		let pk_taskParam = JSON.parse(this.props.that.publishModalTask);  //获取参数
		let new_taskParam = {
			code:pk_taskParam.code,
			refname:pk_taskParam.display,
			refpk:pk_taskParam.value,

		}
		let newParam = {
			"publishType":"NEW",
			"oldAppCode":"182012008A",
			"newAppCode":appCode,
			"pk_parentApp":selAppPk,
			"newAppName":data.appName,
			"paramMap":{
				"sourceType":1,
				"taskInfo":encodeURI(JSON.stringify(new_taskParam)),
				"pk_busiprop":pk_taskParam.busi_prop
			},
			"newMenuItemCode":data.menuCode,
			"newMenuItemName":data.menuName,
			"isCopyUserTemplet":true,//是否复制用户自定义模板
		}

		console.log($appRoot.state.json['public_lang-000205'],param,data,newParam);/* 国际化处理： 设置完成的参数*/
		try {
			let vres =  await $nccUtil.promiseAjax("/nccloud/ufoe/task/publishApp.do",newParam);  //发ajax
			console.log($appRoot.state.json['public_lang-000206'],param,data,vres);/* 国际化处理： 设置完成的数据*/
			this.props.hidePublishModal();
			$nccPlatform.toast({ color: 'success', content: $appRoot.state.json['public_lang-000207']});/* 国际化处理： 发布成功！*/
		} catch (error) {
				console.error(error)
		}

		// this.props.ctmsLogic(param);
	};

	handlePageTo = (templetid, appcode, pcode) => {
		window.parent.open(
			`/nccloud/resources/workbench/public/common/main/index.html#/ZoneSetting?c=102202APP&p=102202APP_PAGE&ar=0001Z510000000065KV7&n=%25E9%25A1%25B5%25E9%259D%25A2%25E6%25A8%25A1%25E6%259D%25BF%25E8%25AE%25BE%25E7%25BD%25AE&b1=%25E5%258A%25A8%25E6%2580%2581%25E5%25BB%25BA%25E6%25A8%25A1%25E5%25B9%25B3%25E5%258F%25B0&b2=%25E5%25BC%2580%25E5%258F%2591%25E9%2585%258D%25E7%25BD%25AE&b3=%25E5%25BA%2594%25E7%2594%25A8%25E7%25AE%25A1%25E7%2590%2586&templetid=${templetid}&pcode=${pcode}&pid=undefined&appcode=${appcode}&templettype=undefined&hideback=true`,
			'_blank'
		);
	};

	onFormChange = (key, val) => {
		//输入框修改
		if ((key === 'appCode' || key === 'menuCode') && val && !REG.test(val)) return;
		this.setState({
			pageData: { ...this.state.pageData, [key]: val }
		});
	};

	//选择树节点回调
	onSelectEve = (code, data, a, b) => {
		let pos = b.node.props.pos;
		pos = pos.split('-');
		const { pageData, currentIndex } = this.state;
		if (data.isleaf) {
			this.nodeStack = {
				pk_appregister: data.pk,
				selAppPk: data.code,
				selAppCode: data.name,
				appCode: data.code,
				appName: data.name,
				orgTypeCode: data.def1,
				publishType: pageData.publishType,
				scopeid: pageData.scopeid,
				publishMethod: pageData.publishMethod,
				size: pageData.size
			};
		} else {
			this.nodeStack = undefined;
		}
		if (currentIndex === 0 && pageData.publishMethod === 'new') {
			if (pos.length == 4 && !data.isleaf) {
				this.setState({
					firstTreeSelect: true,
					pageData: {
						appCode: '', //data.code + '01',
						appName: this.props.publishBoardItem.name.value,
						orgTypeCode: 'GLOBLE00000000000000',
						publishType: pageData.publishType,
						scopeid: pageData.scopeid,
						publishMethod: pageData.publishMethod,
						size: pageData.size,
						selAppPk: data.pk,
						selAppCode: data.code,
						pk_appregister: data.pk
					}
				});
			}
		} else {
			if (data.isleaf) {
				this.setState({
					pageData: {
						pk_appregister: data.pk,
						selAppPk: data.code,
						selAppCode: data.name,
						appCode: data.code,
						appName: data.name,
						orgTypeCode: data.def1,
						publishType: pageData.publishType,
						scopeid: pageData.scopeid,
						publishMethod: pageData.publishMethod,
						size: pageData.size
					},
					finishDisabled: false
				});
			} else {
				this.setState({
					finishDisabled: true
				});
			}
		}
	};

	//选择下一步菜单树节点
	onSelectEveSecond = (code, data, a, b) => {
		console.log($appRoot.state.json['public_lang-000208'],code, data, a, b);/* 国际化处理： 菜单树点击*/
		let pos = b.node.props.pos;
		pos = pos.split('-');
		if (pos.length == 4 && !data.isleaf) {
			this.setState({
				secondTreeSelect: true,
				pageData: {
					appCode: this.state.pageData.appCode,
					appName: this.state.pageData.appName,
					orgTypeCode: this.state.pageData.orgTypeCode,
					menuCode: data.code, //data.code + '01',
					menuName: this.props.publishBoardItem.name.value,
					pageUrl: this.state.pageData.pageUrl,
					targetPath: this.state.pageData.targetPath,
					publishType: this.state.pageData.publishType,
					publishMethod: this.state.pageData.publishMethod,
					scopeid: this.state.pageData.scopeid,
					size: this.state.pageData.size,
					selAppPk: this.state.pageData.selAppPk,
					selAppCode: this.state.pageData.selAppCode,
					selMenuCode: data.code
				}
			});
		}
	};

	/**
     * 穿梭框onChange事件
     * @param {*} select
     */
	SQTtransferOnChange = (selects) => {
		this.transferData = selects.map((item) => item.code);
	};

	render() {
		const titles = [
			$appRoot.state.json['public_lang-000209'],/* 国际化处理： 应用注册*/
			$appRoot.state.json['public_lang-000210']/* 国际化处理： 菜单注册*/
		];
		const { syncTree, publishBoardItem } = this.props;
		const { createSyncTree } = syncTree;
		let {
			pageData,
			currentIndex,
			showPublishModal,
			useTreeData,
			menuTreeData,
			orgTypeArray,
			scopeIds,
			finishDisabled
		} = this.state;
		const {
			publishType,
			publishMethod,
			appCode,
			appName,
			pageUrl,
			menuCode,
			menuName,
			orgTypeCode,
			targetPath,
			size,
			scopeid
		} = pageData;
		const STEPS = [
			{
				content: (
					<div className="publish-report">
						<div className="publish-container">
							<div className="publish-way" style={{display:"none"}}>
								<p className="publish-lable">{$appRoot.state.json['public_lang-000211']} :</p>{/* 国际化处理： 发布方式*/}
								<NCRadioGroup
									selectedValue={publishMethod}
									onChange={(val) => {
										if (this.nodeStack && val !== 'new')
											pageData = { ...pageData, ...this.nodeStack };
										this.setState({
											pageData: { ...pageData, publishMethod: val }
										});
									}}
								>
									<NCRadio value="new">{$appRoot.state.json['public_lang-000024']}</NCRadio>{/* 国际化处理： 新增*/}
								</NCRadioGroup>
							</div>
							{/*<div className="publish-way">
            <p className='publish-lable'>{'类型'} :</p>
            <NCRadioGroup selectedValue={publishType} onChange={val => {
              this.setState({ pageData: { ...pageData, publishType: val } })
            }}>
              <NCRadio value="1">{'小应用'}</NCRadio>
              <NCRadio value="2">{'小部件'}</NCRadio>
            </NCRadioGroup>
            <div className="publish-select">
              <NCSelect value={size} disabled={publishType === '2' ? false : true} onChange={val => this.setState({ pageData: { ...pageData, size: val } })}>
                {widgetSize.map(item => <NCOption value={item.value}>{item.width} * {item.height}</NCOption>)}
              </NCSelect>
            </div>

          </div>*/}
						</div>
						<div className="publish-tree">
							{createSyncTree({
								searchType: 'filtration',
								treeId: treeUseId,
								needSearch: true,
								showModal: false,
								needEdit: false,
								onSelectEve: this.onSelectEve
							})}
						</div>
					</div>
				),
				footer: (
					<div className="publish-footer">
						<div className="footer-item-content">
							<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000212']}>{/* 国际化处理： 新增应用编码*/}
								<span>
									<i className="required">*</i>
									{$appRoot.state.json['public_lang-000212']}{/* 国际化处理： 新增应用编码*/}
								</span>
								<NCFormControl
									disabled={publishMethod !== 'new' ? true : false}
									value={appCode}
									onChange={(val) => this.onFormChange('appCode', val)}
								/>
							</div>
							<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000213']}>{/* 国际化处理： 新增应用名称*/}
								<span>
									<i className="required">*</i>
									{$appRoot.state.json['public_lang-000213']}{/* 国际化处理： 新增应用名称*/}
								</span>
								<NCFormControl
									disabled={publishMethod !== 'new' ? true : false}
									value={appName}
									onChange={(val) => this.onFormChange('appName', val)}
								/>
							</div>
							<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000214']}>{/* 国际化处理： 组织类型*/}
								<span>
									<i className="required">*</i>
									{$appRoot.state.json['public_lang-000214']}{/* 国际化处理： 组织类型*/}
								</span>
								<NCSelect
									disabled={publishMethod !== 'new' ? true : false}
									value={orgTypeCode}
									onChange={(val) => this.setState({ pageData: { ...pageData, orgTypeCode: val } })}
									fieldid= {$appRoot.state.json['public_lang-000214']}
								>
									{orgTypeArray.map((item) => (
										<NCOption value={item.pk_orgtype}>
											{item.code} {item.name}
										</NCOption>
									))}
								</NCSelect>
							</div>
							{publishType == 1 && (
								<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000215']}>{/* 国际化处理： 页面跳转路径*/}
									<span>{$appRoot.state.json['public_lang-000215']}</span>{/* 国际化处理： 页面跳转路径*/}
									<NCFormControl
										value={pageUrl}
										onChange={(val) => this.onFormChange('pageUrl', val)}
									/>
								</div>
							)}
							{publishType == 2 && (
								<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000216']}>{/* 国际化处理： 小部件跳转路径*/}
									<span>{$appRoot.state.json['public_lang-000216']}</span>{/* 国际化处理： 小部件跳转路径*/}
									<NCFormControl
										value={targetPath}
										onChange={(val) => this.onFormChange('targetPath', val)}
									/>
								</div>
							)}
						</div>
						<div className="footer-btn-content">
							{publishMethod !== 'delete' ? (
								<NCButton
									colors={`${publishMethod === 'new' ? 'primary' : ''}`}
									fieldid={$appRoot.state.json['public_lang-000031']}/* 国际化处理： 下一步*/
									onClick={() => {
										if (publishMethod === 'new') {
											this.onHandleClick('next');
										} else {
											if (pageData.appCode === '')
												return toast({
													content: $appRoot.state.json['public_lang-000196'],/* 国际化处理： 请输入节点编码*/
													color: 'warning'
												}); 
											this.setState({ currentIndex: 2 });
										}
									}}
								>
									{$appRoot.state.json['public_lang-000031']}{/* 国际化处理： 下一步*/}
								</NCButton>
							) : null}
							{publishMethod === 'new' ? null : (
								<NCButton
									colors="primary"
									disabled={finishDisabled}
									fieldid={$appRoot.state.json['public_lang-000021']}/* 国际化处理： 确定*/
									onClick={this.onHandleClick.bind(this, 'finish')}
								>
									{$appRoot.state.json['public_lang-000021']}{/* 国际化处理： 确定*/}
								</NCButton>
							)}
							<NCButton
								fieldid={$appRoot.state.json['public_lang-000022']}/* 国际化处理： 取消*/
								onClick={this.onHandleClick.bind(this, 'cancel')}
							>
								{$appRoot.state.json['public_lang-000022']}{/* 国际化处理： 取消*/}
							</NCButton>
						</div>
					</div>
				)
			},
			{
				content: (
					<div className="publish-report">
						{createSyncTree({
							searchType: 'filtration',
							treeId: treeMenuId,
							needSearch: true,
							showModal: false,
							needEdit: false,
							onSelectEve: this.onSelectEveSecond
						})}
					</div>
				),
				footer: (
					<div className="publish-footer">
						<div className="footer-item-content">
							<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000217']}>{/* 国际化处理： 新菜单编码*/}
								<span>
									<i className="required">*</i>
									{$appRoot.state.json['public_lang-000217']}{/* 国际化处理： 新菜单编码*/}
								</span>
								<NCFormControl
									value={menuCode}
									onChange={(val) => this.onFormChange('menuCode', val)}
								/>
							</div>
							<div className="footer-item" fieldid={$appRoot.state.json['public_lang-000218']}>{/* 国际化处理： 新菜单名称*/}
								<span>
									<i className="required">*</i>
									{$appRoot.state.json['public_lang-000218']}{/* 国际化处理： 新菜单名称*/}
								</span>
								<NCFormControl
									value={menuName}
									onChange={(val) => this.onFormChange('menuName', val)}
								/>
							</div>
						</div>
						<div className="footer-btn-content">
							<NCButton
								fieldid={$appRoot.state.json['public_lang-000030']}/* 国际化处理： 上一步*/
								onClick={this.onHandleClick.bind(this, 'prev')}
							>
								{$appRoot.state.json['public_lang-000030']}{/* 国际化处理： 上一步*/}
							</NCButton>
							<NCButton
								colors="primary"
								onClick={this.onHandleClick.bind(this, 'finish')}
								fieldid={$appRoot.state.json['public_lang-000032']}/* 国际化处理： 完成*/
							>
								{$appRoot.state.json['public_lang-000032']}{/* 国际化处理： 完成*/}
							</NCButton>
							<NCButton
								fieldid={$appRoot.state.json['public_lang-000022']}/* 国际化处理： 取消*/
								onClick={this.onHandleClick.bind(this, 'cancel')}
							>
								{$appRoot.state.json['public_lang-000022']}{/* 国际化处理： 取消*/}
							</NCButton>
						</div>
					</div>
				)
			},

		];
		return (
			<NCModal
				show={showPublishModal}
				id="publishModal"
				fieldid="publish"
				className="publish-modal"
				size="lg"
				minHeight={520}
				bodyHeight={'353px'}
				onHide={this.onHandleClick.bind(this, 'cancel')}
			>
				<NCModal.Header closeButton={true}>
					<NCModal.Title fieldid={$appRoot.state.json['public_lang-000219']}>{/* 国际化处理： 发布*/}
						<div style={{ display: 'flex', alignItems: 'baseline' }}>
							<p style={{ fontSize: '16px' }}>{$appRoot.state.json['public_lang-000219']}</p>{/* 国际化处理： 发布*/}
							<NCTooltip inverse placement="right" overlay={$appRoot.state.json['public_lang-000220']}>{/* 国际化处理： 新增请选择一个应用分类(编码长度为6位，需输入新建应用编码，应用编码长度需大于6位)，覆盖和删除请选择一个已存在的应用。*/}
								<i
									className="icon iconfont icon-zhuyi1"
									style={{ color: 'rgb(255, 153, 0)', cursor: 'pointer' }}
								/>
							</NCTooltip>
						</div>
					</NCModal.Title>
				</NCModal.Header>
				<NCModal.Body>
					<div className="step-box">
						<NCSteps current={currentIndex}>
							{titles.map((item, index) => (
								<NCStep onClick={() => this.onChangeStep(item, index)} key={item} title={item} />
							))}
						</NCSteps>
						{STEPS[currentIndex].content}
					</div>
				</NCModal.Body>
				<NCModal.Footer>{STEPS[currentIndex].footer}</NCModal.Footer>
			</NCModal>
		);
	}
}

export default createPage({})(PublishModal);
