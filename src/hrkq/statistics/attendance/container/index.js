import React, {Component} from 'react';
import {base, promptBox, toast, ajax} from 'nc-lightapp-front';
// const { NCUploader } = high;
import NCUploader from 'uap/common/components/NCUploader';
import {languageCreateUIDOM, hrAjax} from 'src/hrpub/common/utils/utils';
import {
    getClientSize,
    getBEDateQueryCondition,
    getCurDayEndTs,
    getCurDayStartTs,
    formatTemplate,
    formatQueryCondition,
    formatValueByRow
} from 'src/hrkq/statistics/common/utils';
import exportHtmlFunc from 'src/hrpub/common/utils/exportHtml';

// css
import './index.less';

// components
import Form from 'src/hrkq/statistics/common/components/Form';

import Header from '../components/Header';
import ImportDialog from '../components/Import';
import EditTable from '../components/EditTable';
import TableAbnormal from '../components/TableAbnormal';
import TableDetails from '../components/TableDetails';
import Pagination from 'src/hrpub/common/components/Pagination/index';

import config from '../config/index';
import formDownLoad, {getUrlParam} from "../../../public/download";
import addTemplate from "./addTemplate";

let {NCDatePicker, NCLoading, NCPagination, NCTabs, NCTabs: {NCTabPane}, NCInput, NCButton} = base;

export default class extends Component {
    constructor(props) {
        super(props);
        props.use.form('attendance_card', 'outside_card', 'details_card')
        props.use.editTable('attendance_list', 'outside_list', 'details_list', 'abnormal_list')
        this.state = {
            lang: {},
            dist: 'list',
            // 窗口尺寸
            window: {
                ...getClientSize()
            },
            pageInfo: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            tabActive: config.modules[0],
            tabs: [
                ...config.modules
            ],
            showUploader: false,
            billId: null
        };

        this.queryMap = {};

        ['onTabChange', 'initTempalte', 'initData', 'onSearch', 'importClickHandle',
            'onPageInfoChange', 'onResize', 'onImport', 'onExport', 'onExportWithOutQueryId', 'onExportWithInQueryId'].forEach(fun => {
            if (typeof this[fun] == 'function') {
                this[fun] = this[fun].bind(this);
            }
        })
    }

    showDeailFileBtn = (showFlag) => {
        this.props.button.setButtonVisible({
            file: showFlag,
            save: false,
            cancel: false
        })
    }

    onTabChange = (id, isBack) => {
        const {search: {clearSearchArea}} = this.props;
        const {tabs} = this.state,
            current = tabs.filter((tab) => {
                return tab.id === id;
            })[0];

        this.setState((state, props) => {
            return {
                tabActive: current,
                pageInfo: {
                    ...state.pageInfo,
                    pageIndex: 1,
                    total: 0
                }
            };
        }, () => {
            let param = this.getSearchParam()
            this.onSearch(param, isBack)
        });

        //this.queryParams = {};
        //this.initData();

        /*try {
            if (current.queryId) {
                clearSearchArea(current.queryId);
            }
        } catch (e) {
        }*/
    }

    getSearchParam = () => {
        const {
            props: {
                meta
            },
            state: {
                tabActive
            }
        } = this;
        const {dateRanger, queryParams} = this.headerRef.state;
        let tempQuery = {};
        let metaInfo = meta.getMeta(),
            queryOid = metaInfo && metaInfo[tabActive['queryId']] && metaInfo[tabActive['queryId']].oid;

        let tmp;

        /**
         * 开启field 字段验证 须过滤
         */
        /*if (this.fields &&
            this.fields.length) {*/
        if (queryParams) {
            for (let x in queryParams) {
                if (queryParams.hasOwnProperty(x)) {
                    let item = queryParams[x];
                    if (item.refpk) {
                        item = item.refpk
                    } else {
                        item = ''
                    }
                    //if (this.fields.includes(x)) {
                    tmp = tmp || {};
                    tmp[x] = item;
                    // }
                }
            }
            //}
            tempQuery = tmp || queryParams
        }
        return {
            dateRanger,
            queryParams: {
                oid: queryOid,
                ...tempQuery
            },
        };
    }

    initTempalte = (callback) => {
        languageCreateUIDOM(this.props)({
            appcode: config['appcode'],
            pagecode: config['pagecode'],
        }, {...config['mutilLang']}, (metas, lang, intl) => {
            const props = this.props;
            let {button, template} = metas;
            const {meta} = props;

            this.setState({lang});
            template = template ? formatTemplate({template, lang}) : {};
            button = addTemplate(template, lang, button);
            this.props.button.setButtons(button || []);
            meta.setMeta(template);
            callback && callback();
        });
    }

    initData = () => {
        clearTimeout(this.initDataTimer);
        this.initDataTimer = setTimeout(() => {
            const {meta, editTable: {setTableData}, search: {getQueryInfo, clearSearchArea}} = this.props;
            const {tabActive} = this.state;
            this.setState({loading: true});
            this.queryListAction({
                ...this.queryParams
            }).then(({
                         success,
                         data = {}
                     } = {}) => {
                if (success) {
                    if (tabActive.tableId) {
                        if (tabActive.tableId === 'abnormal_list' || tabActive.tableId === 'details_list') {
                            data = this.formatRowData(data, tabActive.tableId)
                        }
                        const {
                            pageid,
                            templetid,
                            [tabActive.tableId]: {
                                pageInfo: {total = 0} = {},
                                areacode,
                                rows = []
                            } = {}
                        } = data;
                        this.onPageInfoChange({
                            total
                        });
                        setTableData(tabActive.tableId, {rows})
                    } else {
                        let {
                            content = [],
                            totalElements = 0,
                            numberOfElements = 0,
                            pageable: {
                                offset,
                                pageNumber,
                                pageSize,
                            } = {}
                        } = data;

                        this.onPageInfoChange({
                            // pageIndex: pageNumber,
                            // pageSize,
                            total: totalElements
                        });

                        this.setState((state, props) => {
                            let current = state.tabs.filter((tab) => {
                                return tab.id == tabActive.id;
                            })[0];
                            current.data = content;

                            return {
                                tabs: state.tabs
                            };
                        });
                    }
                }
                this.setState({loading: false});
            }).catch(({message, stack}) => {
                this.setState({loading: false});
                if (message) {
                    toast({
                        color: "warning",
                        content: message
                    })
                }
                if (stack) {
                    throw new Error(stack);
                }
            })
        });
    }

    formatRowData = (data, tableId) => {
        let {
            content = [],
            totalElements = 0,
            numberOfElements = 0,
            pageable: {
                offset,
                pageNumber,
                pageSize,
            } = {},
            totalPages
        } = data;
        let result = {};
        result[tableId] = {
            "areacode": tableId
        }
        result[tableId]['rows'] = content.map(item => {
            let rowData = {
                status: "0",
                isOptimized: false,
                values: {}
            };
            if (tableId === 'details_list') {
                rowData.disabled = !item.id || item.signType == 1 || item.signType == 0
            }
            Object.keys(item).forEach(key => {
                rowData.values[key] = {
                    display: item[key],
                    value: item[key]
                }
            });
            return rowData;
        });

        result[tableId]['pageInfo'] = {
            pageIndex: Number(pageNumber) + 1,
            pageSize: pageSize,
            total: totalElements,
            totalPage: totalPages
        }
        return result
    }

    formatToJQData = (data) => {
        let result = {};
        if (data.rows && data.rows[0] && data.rows[0].values) {
            let values = data.rows[0].values;
            Object.keys(values).forEach(key => {
                result[key] = values[key] && values[key].value
            })
        }
        return result
    }

    onSearch = ({dateRanger: {beginValue, endValue} = {}, queryParams = {}} = {}, isBack) => {
        let {meta} = this.props;
        const {tabActive} = this.state;

        if (isBack) {
            this.queryParams = this.queryMap[tabActive.id]
        } else {
            this.queryParams = {
                ...queryParams
            };

            if (endValue > 0) {
                if (tabActive.queryId) {
                    this.queryParams = Object.assign({}, this.queryParams, {
                        ...getBEDateQueryCondition({
                            beginValue,
                            endValue,
                            oprtype: 'between',
                            beginField: tabActive.queryTimeField || ''
                        })
                    });
                } else {
                    this.queryParams = Object.assign({}, this.queryParams, {
                        beginDate: beginValue.toString(),
                        endDate: endValue.toString(),
                    });
                }
            }

            this.queryMap[tabActive.id] = JSON.parse(JSON.stringify(this.queryParams))
        }


        this.setState((state, props) => {
            return {
                pageInfo: {
                    ...state.pageInfo,
                    pageIndex: 1,
                }
            };
        });

        this.initData();
    }

    onPageInfoChange = ({pageIndex, pageSize, total} = {}) => {
        let update = {};
        if (pageIndex >= 1) {
            update['pageIndex'] = pageIndex;
        }
        if (pageSize >= 1) {
            update['pageSize'] = pageSize;
        }
        if (total >= 0) {
            update['total'] = total;
        }
        this.setState((state, props) => {
            return {
                pageInfo: {
                    ...state.pageInfo,
                    ...update
                }
            };
        });
    }

    queryListAction = (params) => {
        let {meta} = this.props;
        let {tabActive, pageInfo} = this.state,
            url = `${tabActive.queryAction}`,
            metaInfo = meta.getMeta(),
            oid = metaInfo && metaInfo[tabActive['queryId']] && metaInfo[tabActive['queryId']].oid,
            tmp;

        if (tabActive.queryId) {
            // for template
            tmp = {
                oid,
                pageInfo,
                ...getBEDateQueryCondition({
                    beginValue: getCurDayStartTs(),
                    endValue: getCurDayEndTs(),
                    oprtype: 'between',
                    beginField: tabActive.queryTimeField || ''
                }),
            }
        } else {
            // for not template
            tmp = {
                pageSize: pageInfo.pageSize,
                pageNum: pageInfo.pageIndex,
                beginDate: getCurDayStartTs().toString(),
                endDate: getCurDayEndTs().toString()
            }
        }

        let body = {
            ...tmp,
            ...params
        };

        console.log('queryListAction: ', body)

        return hrAjax({
            url,
            body
        })
    }

    /**
     *  导入
     */
    onImport = (type) => {
        this.setState({
            showImportDialog: true
        })
    }

    /**
     *  导出
     */
    onExport = () => {
        const {
            state: {
                tabActive
            }
        } = this;

        if (tabActive.queryId) {
            this.onExportWithInQueryId();
        } else {
            this.onExportWithOutQueryId();
        }
    }

    /**
     * 查询模版的导出
     */
    onExportWithInQueryId = () => {
        const {
                state: {
                    tabActive,
                    pageInfo,
                    lang
                },
                props: {
                    meta,
                    table
                }
            } = this,
            metaInfo = meta.getMeta();

        this.setState({loading: true});
        this.queryListAction({
            ...this.queryParams,
            pageInfo: {
                pageIndex: 1,
                pageSize: pageInfo.total || 10,
            }
        }).then(({
                     success, data: {
                pageid,
                templetid,
                [tabActive.tableId]: {
                    pageInfo: {total = 0} = {},
                    areacode,
                    rows = []
                } = {}
            } = {}
                 }) => {
            if (success) {
                rows.forEach((row) => {
                    for (let attrcode in row.values) {
                        if (row.values.hasOwnProperty(attrcode)) {
                            let item = row.values[attrcode];
                            item['value'] = formatValueByRow(row, attrcode, lang) || item['value'];
                        }
                    }
                });
                exportHtmlFunc(document.querySelector('.edit-table-wrap'), {
                    title: lang[tabActive.i18n],
                    fileName: lang[tabActive.i18n],
                    maker: lang['hrkq-0000098'],
                    date: lang['hrkq-0000099']
                }, {
                    meta: metaInfo[tabActive['tableId']],
                    data: rows,
                    showIndex: true
                })
            }
            this.setState({loading: false});
        }).catch(({message, stack}) => {
            this.setState({loading: false});
            if (message) {
                toast({
                    color: "warning",
                    content: message
                })
            }
            if (stack) {
                throw new Error(stack);
            }
        })
    }

    /**
     * 非查询模版的导出
     */
    onExportWithOutQueryId = () => {
        let {tabActive, pageInfo} = this.state,
            url = tabActive.exportAction,
            queryKeys = ['beginDate', 'endDate', 'orgId', 'deptId', 'jobId', 'userName', 'isIncludeSub'],
            queryParams = {
                beginDate: getCurDayStartTs().toString(),
                endDate: getCurDayEndTs().toString(),
                isIncludeSub: true,
                ...this.queryParams,
                ...formatQueryCondition(this.queryParams && this.queryParams.querycondition, {
                    pk_org: 'orgId',
                    pk_dept: 'deptId',
                    pk_job: 'jobId',
                    fill_date: ['beginDate', 'endDate']
                })
            };

        queryKeys.forEach(item => {
            let key = item.key || item,
                alias = item.alias || item;

            if (queryParams &&
                queryParams[key] !== undefined) {
                url += `${(/\?/.test(url) ? '&' : '?')}${alias}=${queryParams[key]}`;
            }
        })

        console.log('onExport: ', this.queryParams, queryParams, url);
        const body = getUrlParam(url);
        formDownLoad({
            url,
            body,
            method: 'get',
            enctype: 1
        })
    }

    onResize = () => {
        /**
         * 节流算法优化，固定时间内频繁执行，只执行第一次
         * rongqb 20190425
         */
        if (!this.onResizeTimer) {
            let size = getClientSize();

            this.setState({
                window: size
            });
        }
        clearTimeout(this.onResizeTimer);
        this.onResizeTimer = setTimeout(() => {
            this.onResizeTimer = null;
        }, 100);
    }

    componentDidMount() {
        if (window.location.href.match(/(localhost|127\.0\.0\.1)/)) window.location.hash = `#ifr?page=20191225161616`;
        this.initTempalte(this.initData);
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        document.removeEventListener('resize', this.onResize);
    }

    onButtonClick = (props, btncode) => {
        if (btncode === 'file') {
            // const formId = this.state.tabActive['cardId']
            const billVal = props.form.getFormItemsValue('outside_card', 'pk_outside')
            const billId = billVal && billVal.value
            this.setState({
                billId,
                showUploader: true
            })
        } else if (btncode === 'save') {
            this.saveRecord();
        } else if (btncode === 'cancel') {
            this.cancel()
        }
    }

    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

    addRecord = () => {
        const {
            form: {setFormStatus, setAllFormValue, EmptyAllFormValue, getFormItemsValue}
        } = this.props;
        const {tabActive} = this.state;
        this.setCardMeta(tabActive.cardId, 'add');
        this.setState({
            dist: 'detail'
        })
        this.props.button.setButtonVisible({
            file: false,
            save: true,
            cancel: true
        })
        EmptyAllFormValue(tabActive.cardId);
        setFormStatus(tabActive.cardId, 'add');
    }

    onFormAfterEvent = (props, moduleId, key, value, oldValue) => {
        if (moduleId === 'details_card') {
            if (key !== 'staffCode') return;
            let newValue = {
                display: value.refname,
                value: value.refpk
            }
            props.form.setFormItemsValue(moduleId, {
                'staffName': newValue
            });

        }

    }

    setCardMeta = (cardId, status) => {
        if (cardId === 'attendance_card') {
            const {meta: {getMeta, setMeta}, renderItem} = this.props;
            let meta = getMeta();
            meta[cardId].items.forEach(item => {
                switch (item.attrcode) {
                    case 'pk_psndoc':
                        item.isShowUnit = true;
                        break;
                    case 'fill_date':
                        //item.visible = status === 'add';
                        if (status === 'add') {
                            renderItem('form', cardId, 'fill_date', (
                                <NCDatePicker
                                    format={'YYYY-MM-DD HH:mm:ss'}
                                    showTime={true}
                                />
                            ))
                        } else {
                            renderItem('form', cardId, 'fill_date', (
                                <NCDatePicker
                                    format={'YYYY-MM-DD'}
                                    showTime={true}
                                />
                            ))
                        }
                        break;
                    case 'original_sign_time':
                    case 'fill_time':
                    case 'approvestatus':
                    case 'pk_org':
                    case 'pk_dept':
                        item.visible = status !== 'add';
                        break;
                    default:
                        break;
                }
            })
            setMeta(meta);
        }
    }

    delRecord = () => {
        const {
            editTable: {getCheckedRows}
        } = this.props;
        const {lang, tabActive} = this.state;
        let listData = getCheckedRows(tabActive.tableId);
        if (listData.length === 0) {
            // debugger
            // console.log(lang,'langlanglanglanglanglanglang000')
            toast({'color': 'warning', content: lang["hrkq-0000135"] /*多语: 请选择要删除的数据*/})
            return
        }
        let result = listData.map(item => {
            if (tabActive.id === 'details') {
                return item.data.values['id'].value
            }
            return item.data.values['pk_attendance'].value
        })
        let resultStr = result.join(',');
        let url = `${tabActive.delAction}`;
        hrAjax({
            url,
            body: {ids: resultStr}
        })
            .then(res => {
                if (res.success) {
                    this.onTabChange(tabActive.id)
                }
            })
    }

    saveRecord = () => {
        const {
            form: {setFormStatus, isCheckNow, getAllFormValue, setAllFormValue}
        } = this.props;
        const {tabActive} = this.state;
        let flag = isCheckNow(tabActive.cardId);
        if (!flag) return;
        let url = `${tabActive.saveAction}`;
        let data = getAllFormValue(tabActive.cardId)
        let body;
        if (tabActive.id === 'details') {
            body = this.formatToJQData(data)
        } else {
            data.rows[0].values.billtype = {
                value: '6QBK'
            }
            body = {
                billType: '6QBK',
                formData: {
                    model: data
                }
            }
        }
        hrAjax({
            url,
            body
        }).then((res) => {
            if (res.success) {
                this.props.button.setButtonVisible({
                    file: false,
                    save: false,
                    cancel: false
                })
                this.setCardMeta(tabActive.cardId, 'browse');
                if (res.data && res.data[tabActive.cardId]) {
                    setAllFormValue({
                        [tabActive.cardId]: {
                            rows: res.data[tabActive.cardId].rows
                        }
                    });
                }
                setFormStatus(tabActive.cardId, 'browse');
            }
        })
    }

    cancel = () => {
        const {lang} = this.state;
        promptBox({
            color: 'warning',
            title: lang["hrkq-0000132"] /*多语: 确认取消*/,
            content: lang["hrkq-0000133"] /*多语: 是否确认要取消吗？*/,
            beSureBtnClick: () => {
                this.showDeailFileBtn(false)
                this.setState({
                    dist: 'list'
                })
            }
        });
    }

    importClickHandle(props, btnCode) {
        if (btnCode === 'import2') {
            this.setState({
                showImportDialog: true,
                importType: '2'
            })
        } else if (btnCode === 'import3') {
            this.setState({
                showImportDialog: true,
                importType: '3'
            })
        }
    }

    render() {
        const {
            props = {},
            props: {
                meta,
                search: {NCCreateSearch},
                editTable: {createEditTable},
                table: {createSimpleTable},
                form: {setFormStatus, setAllFormValue, EmptyAllFormValue, getFormItemsValue},
                button
            },
            state,
            state: {
                tabs,
                lang,
                dist,
                window,
                loading,
                pageInfo,
                tabActive,
                importType,
                showImportDialog,
                showUploader,
                billId
            }
        } = this;

        let metaInfo = meta.getMeta(),
            queryOid = metaInfo && metaInfo[tabActive['queryId']] && metaInfo[tabActive['queryId']].oid;

        return (
            <div className={`container-wrap`}>
                <div style={{display: dist === 'list' ? '' : 'none'}}>
                    {/* header */}
                    <Header
                        {...props}
                        lang={lang}
                        queryOid={queryOid}
                        title={metaInfo.name}
                        queryId={tabActive.queryId}
                        tabActive={tabActive}
                        onSearch={this.onSearch}
                        ref={node => this.headerRef = node}
                    />

                    {/* tabs */}
                    <div className="tabs-nav-bar">
                        {/* tabs */}
                        <NCTabs
                            navtype="turn"
                            tabBarPosition="top" //tab头的定位，可以是['left','right','top','bottom']中选择
                            contenttype="moveleft"
                            activeKey={tabActive.id} //设置当前激活的tabPanel的key
                            onChange={this.onTabChange}>
                            {tabs.map((tab, index) => {
                                let params = {
                                    lang,
                                    tabActive,
                                    cardId: tab.cardId,
                                    tableId: tab.tableId,
                                    height: Math.max(window.height - 128, 300),
                                    data: tab.data,
                                    onRowDoubleClick: (row, index, props) => {
                                        if (!tabActive.cardId) return;
                                        this.setCardMeta(tabActive.cardId, 'browse')
                                        EmptyAllFormValue(tabActive.cardId);
                                        this.setState({
                                            dist: 'detail'
                                        });
                                        setFormStatus(tabActive.cardId, 'browse');
                                        setAllFormValue({
                                            [tabActive.cardId]: {
                                                rows: [row]
                                            }
                                        })
                                        this.showDeailFileBtn(tabActive.cardId === 'outside_card')
                                    }
                                };
                                return (<NCTabPane tab={lang[tab.i18n]} key={tab.id}>
                                    {(function (id) {
                                        switch (id) {
                                            case 'abnormal':
                                            //return (<TableAbnormal {...props} {...params} />);
                                            case 'details':
                                            //return ({createEditTable(tableId, {
                                            //                 height,
                                            //                 onRowDoubleClick
                                            //             })});
                                            case 'outside':
                                            case 'attendance':
                                            default:
                                                return (<EditTable {...props} {...params}
                                                                   cancelCustomRightMenu={id === 'details' || id === 'abnormal'}
                                                                   showCheck={id === 'details' || id === 'attendance'}/>);
                                        }
                                    })(tab.id)}
                                </NCTabPane>);
                            })}
                        </NCTabs>

                        <div className="btn-group">
                            {tabActive.id === 'details' && tabActive.exportTemplate &&
                                <span className="import-btn-groups">
                                    {button.createButtonApp({
                                        area: 'import_head',
                                        onButtonClick: this.importClickHandle
                                    })}
                                    {/*<NCButton size="lg" shape="border" colors="primary">
                                        {lang['hrkq-0000084']}
                                    </NCButton>
                                        <ul className="import-list">
                                            {[
                                                {
                                                    i18n: 'hrkq-0000086', // 原始导入
                                                    type: '2'
                                                },
                                                {
                                                    i18n: 'hrkq-0000087', // 考勤机导入
                                                    type: '3'
                                                },
                                            ].map(item => {
                                                return (
                                                    <li onClick={() => {
                                                        this.setState({
                                                            showImportDialog: true,
                                                            importType: item.type
                                                        })
                                                    }}> {lang[item.i18n]} </li>
                                                )
                                            })}
                                        </ul>*/}
                                </span>
                            }
                            {tabActive.id !== 'details' && tabActive.exportTemplate &&
                                <NCButton size="lg" shape="border" colors="primary"
                                          onClick={() => {
                                              this.setState({
                                                  showImportDialog: true,
                                                  importType: '1'
                                              })
                                          }}>
                                    {lang['hrkq-0000084']}
                                </NCButton>
                            }
                            {
                                (tabActive.id === 'details' || tabActive.id === 'attendance') &&
                                [<NCButton size="lg" shape="border" colors="info"
                                           onClick={this.addRecord}>{lang["hrkq-0000100"] /*多语: 新增*/}</NCButton>,
                                    <NCButton size="lg" shape="border" colors="info"
                                              onClick={this.delRecord}>{lang["hrkq-0000109"] /*多语: 删除*/}</NCButton>
                                ]
                            }
                            <NCButton size="lg" shape="border" colors="info"
                                      onClick={this.onExport}>{lang['hrkq-0000085']}</NCButton>
                        </div>
                    </div>


                    {/* pagination */}
                    <div className="pagination" style={{margin: '10px 10px 10px'}}>
                        {parseInt(pageInfo.total || 0) > 0 ?
                            <Pagination
                                total={pageInfo.total}
                                pageSize={pageInfo.pageSize}
                                showQuickJumper={true}
                                showSizeChanger={true}
                                current={pageInfo.pageIndex}
                                onChange={(pageIndex) => {
                                    this.onPageInfoChange({
                                        pageIndex
                                    });
                                    this.initData();
                                }}
                                onShowSizeChange={(pageSize) => {
                                    this.onPageInfoChange({
                                        pageSize,
                                        pageIndex: 1
                                    });
                                    this.initData();
                                }}
                            /> : null}
                    </div>
                </div>
                <div style={{display: dist === 'list' ? 'none' : ''}}>
                    {dist === 'detail' && tabActive['cardId'] && <Form
                        {...props}
                        cardId={tabActive['cardId']}
                        customButton={true}
                        buttonArea={'head'}
                        onButtonClick={this.onButtonClick}
                        onAfterEvent={this.onFormAfterEvent}
                        title={metaInfo && metaInfo[tabActive['cardId']] && metaInfo[tabActive['cardId']].name || ''}
                        onBack={() => {
                            this.showDeailFileBtn(false)
                            this.setState({
                                dist: 'list'
                            }, () => {
                                this.onTabChange(tabActive.id, true)
                            })
                        }}
                    />}
                </div>

                {/* loading */}
                <NCLoading
                    container={this}
                    show={loading}>
                </NCLoading>
                {/* fileUpload */}
                {showUploader && <NCUploader
                    uploadTitle={lang["hrkq-0000129"] /*多语: 附件管理*/}
                    billId={billId}
                    //getGroupList={this.getGroupList}
                    onHide={this.onHideUploader} // 关闭功能
                />
                }

                {/*  ImportDialog */}
                {
                    tabActive.exportTemplate && <ImportDialog
                        lang={lang}
                        {...props}
                        isShow={showImportDialog}
                        type={importType}
                        exportTemplate={tabActive.exportTemplate}
                        onHide={() => {
                            this.setState({
                                showImportDialog: false
                            })
                        }}
                        onSucess={() => {
                            this.setState({
                                showImportDialog: false
                            });
                            this.initData();
                        }}
                    />
                }
            </div>
        );
    };
}
