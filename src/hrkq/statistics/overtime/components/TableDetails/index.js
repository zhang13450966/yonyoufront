import React, {Component} from 'react';
import {ajax, toast} from 'nc-lightapp-front';

import {hrAjax} from 'src/hrpub/common/utils/utils';
import {connect} from 'src/hrpub/common/store';
import {base, high} from 'nc-lightapp-front';
import {formatDate} from 'src/hrpub/common/utils/utils.js';
import config from '../../config/index';
// css
import './index.less';
// components
import Detail from './detail/';

let {NCTable, NCCheckbox, NCButton, NCModal, NCSelect, NCSelect: {NCOption}} = base;
// let { ApproveDetail } = high;


export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: [],
            unTransfer: [],
        }
    }

    getTableHeight = () => {
        const mainTable = document.getElementsByClassName('container-wrap');
        let tableHeight = 0;
        if (mainTable[0]) {
            tableHeight = mainTable[0].clientHeight - 140
        }
        return tableHeight;
    }

    onCheckedAll = (props, moduleId, isSelected) => {
        this.setState((state, props) => {
            const {editTable, onChecked} = props;
            let transfer = [],  // 可转调休
                unTransfer = [];

            const data = editTable.getAllRows(moduleId)

            if (!isSelected) {
                try {
                    onChecked && onChecked({
                        transfer,
                        unTransfer
                    });
                } catch (e) {
                }

                return {
                    transfer,
                    unTransfer
                }
            } else {
                if (Array.isArray(data)) {
                    data.forEach(row => {
                        let id = row.values.id.value;
                        if (row.values.transferflag.value === '1') { //已转
                            let index = unTransfer.indexOf(id);
                            if (index === -1) {
                                unTransfer.push(id);
                            }
                        } else if ((row.values.transferflag.value === '0' || row.values.transferflag.value === '3') &&
                            row.values.billstatus.value === '1') { //待转并且审核通过
                            let index = transfer.indexOf(id);
                            if (index === -1) {
                                transfer.push(id);
                            }
                        }
                    });
                }

                try {
                    onChecked && onChecked({
                        transfer,
                        unTransfer
                    });
                } catch (e) {
                }

                return {
                    transfer,
                    unTransfer,
                }
            }
        });
    }

    onChecked = (props, moduleId, row, index, isSelected) => {
        this.setState((state, props) => {
            let {
                transfer = [],  // 可转调休
                unTransfer = [] // 可取消转调休
            } = state;
            const {onChecked} = props;
            let id = row.values.id.value;

            if (!isSelected) {
                let index = transfer.indexOf(id);
                if (index > -1) {
                    transfer.splice(index, 1);
                }
                index = unTransfer.indexOf(id);
                if (index > -1) {
                    unTransfer.splice(index, 1);
                }
            } else {
                if (row.values.transferflag.value === '1') { //已转
                    let index = unTransfer.indexOf(id);
                    if (index === -1) {
                        unTransfer.push(id);
                    }
                } else if ((row.values.transferflag.value === '0' || row.values.transferflag.value === '3') &&
                    row.values.billstatus.value === '1') { //待转并且审核通过
                    let index = transfer.indexOf(id);
                    if (index === -1) {
                        transfer.push(id);
                    }
                }
            }

            try {
                onChecked && onChecked({
                    transfer,
                    unTransfer,
                });
            } catch (e) {
            }

            return {
                transfer,
                unTransfer,
            }
        });
    }

    refresh() {
        const {
                props: {
                    refresh,
                    onChecked
                }
            } = this,
            tmp = {
                transfer: [],
                unTransfer: []
            };

        this.setState(tmp);
        try {
            refresh && refresh();
        } catch (e) {
        }
        try {
            onChecked && onChecked(tmp);
        } catch (e) {
        }
    }

    // 转调休
    onTransfer(isTransfer = true) {
        const {
                state: {
                    transfer = [],
                    unTransfer = [],
                },
                props: {
                    modal: {
                        createModal
                    }
                }
            } = this,
            ids = isTransfer ? transfer : unTransfer;

        /**
         *  单人转调休或者取消转调休
         */
        if (ids.length > 1 || !isTransfer) {
            this.transferRestAction({
                isTransfer,
                ids: ids.join(),
            })
        } else if (ids.length == 1) {
            this.getTransferYearMonthAction({
                ids: ids.join()
            }).then(({data, success}) => {
                let year = Object.keys(data)[0] || ''
                let month = year ? data[year][0] : ''
                this.setState({
                    year,
                    month,
                    showModal: true,
                    modalData: data
                });
            })
        }
    }

    // 转调休
    transferRestAction({ids, year, month, isTransfer}) {
        return hrAjax({
            url: '/nccloud/hrkq/overtime/TransferRestAction.do',
            body: {
                ids, year, month, isTransfer
            }
        }).then((res) => {
            this.refresh();
            this.setState({
                showModal: false,
            });
            return res;
        }).catch((err) => {

        })
    }

    // 获取年月
    getTransferYearMonthAction({ids}) {
        return hrAjax({
            url: '/nccloud/hrkq/overtime/GetTransferYearMonthAction.do',
            body: {
                ids
            }
        })
    }

    componentDidMount() {
        const {
            props: {
                register
            }
        } = this;

        register && register({
            onTransfer: this.onTransfer.bind(this),
        });
    }

    render() {
        const {
            state,
            state: {
                showModal = false,
                modalData = {},
                active,
                transfer = [],
                unTransfer = []
            },
            props,
            props: {
                onChecked,
                tabActive,
                register,
                data = [],
                transferTotal = 0,
                lang,
                tableId,
                height,
                onRowDoubleClick,
                editHrBill,
                deleteHrBill,
                editTable: {createEditTable},
                modal: {
                    createModal
                }
            }
        } = this;
        /**
         * 数据变化 去除已经选择的无效的数据
         */
        /*let map = {},
            transferTemp = [],
            unTransferTemp = [];
        data.forEach((item, index) => {
            item.key = item.key || index;
            map[item.id] = item;
        });
        if (transfer.length) {
            transferTemp = transfer.filter(id => {
                return !!map[id];
            });
            if (transferTemp.length != transfer.length) {
                this.setState({
                    transfer: transferTemp
                });
            }
        }
        if (unTransfer.length) {
            unTransferTemp = unTransfer.filter(id => {
                return !!map[id];
            });
            if (unTransferTemp.length != unTransfer.length) {
                this.setState({
                    unTransfer: unTransferTemp
                });
            }
        }
        map && (map = null);
        transferTemp && (transferTemp = null);
        unTransferTemp && (unTransferTemp = null);*/

        /**
         * 切换页签更改状态
         */
        if (tabActive &&
            (!this.state.tabActive ||
                (this.state.tabActive && this.state.tabActive.id !== tabActive.id))) {
            try {
                onChecked && onChecked({
                    transfer: [],
                    unTransfer: []
                });
            } catch (e) {
            }
            this.setState((state, props) => {
                return {
                    tabActive,
                    transfer: [],
                    unTransfer: [],
                }
            });
        }

        return (<div className="table">

            {/* 选择年月 */}
            <NCModal
                //style={{width: 500}}
                className="select-year-month-modal"
                show={showModal}
                onHide={e => {
                    this.setState({
                        showModal: false
                    });
                }}
            >
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{lang['hrkq-0000078']}</NCModal.Title>
                </NCModal.Header>

                <NCModal.Body>
                    <div class="content">
                        <div class="item">
                            <label>{lang['hrkq-0000076']}</label>
                            <NCSelect
                                value={state.year || ''}
                                style={{width: 200}}
                                onChange={year => {
                                    let month = ''
                                    if (modalData[year] && modalData[year].length > 1) {
                                        month = modalData[year][0]
                                    }
                                    this.setState({
                                        year,
                                        month
                                    });
                                }}
                            >
                                {Object.keys(modalData).map((year, index) => {
                                    return (<NCOption value={year} key={index}>{year}</NCOption>);
                                })}
                            </NCSelect>
                        </div>

                        {/* 联想月份 */}
                        {state.year &&
                        modalData[state.year] &&
                        modalData[state.year].length > 1 &&

                        <div class="item">
                            <label>{lang['hrkq-0000077']}</label>
                            <NCSelect
                                value={state.month}
                                style={{width: 200}}
                                onChange={month => {
                                    this.setState({
                                        month
                                    });
                                }}
                            >
                                {modalData[state.year].map((month, index) => {
                                    return (<NCOption value={month} key={index}>{month}</NCOption>);
                                })}
                            </NCSelect>
                        </div>
                        }
                    </div>
                </NCModal.Body>

                <NCModal.Footer>
                    <NCButton shape="border" colors="primary" onClick={() => {
                        this.transferRestAction({
                            isTransfer: true,
                            ids: transfer.join(),
                            year: state.year,
                            month: state.month,
                        })
                    }}>{lang['hrkq-0000039']}</NCButton>
                </NCModal.Footer>
            </NCModal>

            <div className={'flex-container'} style={{height: this.getTableHeight()}}>
                {
                    createEditTable('details_list', {
                        showCheck: true,
                        height: this.getTableHeight(),
                        cancelCustomRightMenu: true,
                        onSelected: this.onChecked,
                        onSelectedAll: this.onCheckedAll,
                        onRowDoubleClick: onRowDoubleClick,
                        onRowClick: (props, name, record, index) => {
                            /*this.setState({
                                active: record
                            });*/
                        }
                    })
                }
            </div>
            {/* 主表 */}
            {/*<NCTable
                bodyStyle={{height: height + 'px'}}
                scroll={{ x: true, y: height - 35 }}
                onRowClick={(row, index, e)=>{
                    this.setState({
                        active: row
                    });
                }}
                columns={[
                    transferTotal > 0 && {
                        key: 'checkbox', //列的键
                        dataIndex: 'checkbox', //列的键
                        fixed: 'left', //当表水平滚动时，此列将被固定：true或'left'或'right'
                        width: 36,
                        title: <NCCheckbox
                            checked={[...transfer, ...unTransfer].length == transferTotal}
                            onChange={e => this.onChecked(e)
                        }/>,
                        render: (text, row, index) => {
                            let disabled = true;
                            if (row.transferflag == '1' ||
                                (row.transferflag == '0' &&
                                    row.billstatus == '1')) { //已转
                                disabled = false
                            }
                            if (!disabled) {
                                return (
                                    <NCCheckbox
                                        checked={[...transfer, ...unTransfer].indexOf(row.id) > -1}
                                        onChange={
                                            e => this.onChecked(e, row)
                                        } />
                                );
                            }
                        },
                    },
                    {
                        key: 'staffcode', //列的键
                        dataIndex: 'staffcode', //列的键
                        i18n: 'hrkq-0000018', //员工编码
                        width: 100,
                        fixed: 'left', //当表水平滚动时，此列将被固定：true或'left'或'right'
                        render(text, row, index) {
                            return (<div className="staffCode">
                                <span>{row['staffcode']}</span>
                            </div>);
                        }
                    },
                    {
                        key: 'staffname',
                        dataIndex: 'staffname',
                        i18n: 'hrkq-0000014', //姓名
                        width: 100,
                        fixed: 'left', //当表水平滚动时，此列将被固定：true或'left'或'right'
                        render(text, row, index) {
                            return (<div className="staffName">
                                <span>{row['staffname']}</span>
                            </div>);
                        }
                    },
                    {
                        key: 'orgname',
                        dataIndex: 'orgname',
                        i18n: 'hrkq-0000025', //所属组织
                    },
                    {
                        key: 'deptname',
                        dataIndex: 'deptname',
                        i18n: 'hrkq-0000026', //所属部门
                    },
                    {
                        key: 'overtimetypename',
                        dataIndex: 'overtimetypename',
                        i18n: 'hrkq-0000032', //加班类型
                    },
                    {
                        key: 'overtimerange',
                        i18n: 'hrkq-0000033', //加班时间
                        width: 400,
                        render(text, row, index) {
                            if (row['overtimebegintime'] &&
                                row['overtimeendtime']) {
                                return (<div>
                                    <span>{formatDate(row['overtimebegintime'], '', 'Y-M-d h-m-s')}</span>
                                    <span style={{ margin: '0 10px' }}>{lang['hrkq-0000067']}</span>
                                    <span>{formatDate(row['overtimeendtime'], '', 'Y-M-d h-m-s')}</span>
                                </div>);
                            }
                        },
                    },
                    {
                        key: 'overtimelen',
                        dataIndex: 'overtimelen',
                        i18n: 'hrkq-0000034', //申请时长
                    },
                    {
                        key: 'actuallen',
                        dataIndex: 'actuallen',
                        i18n: 'hrkq-0000035', //实际时长
                    },
                    {
                        key: 'otsignrange',
                        i18n: 'hrkq-0000036', //加班签到时间
                        width: 400,
                        render(text, row, index) {
                            if (row['otsignbegintime'] &&
                                row['otsignendtime']) {
                                return (<div>
                                    <span>{formatDate(row['otsignbegintime'], '', 'Y-M-d h-m-s')}</span>
                                    <span style={{ margin: '0 10px' }}>{lang['hrkq-0000067']}</span>
                                    <span>{formatDate(row['otsignendtime'], '', 'Y-M-d h-m-s')}</span>
                                </div>);
                            }
                        },
                    },
                    {
                        key: 'billsource',
                        dataIndex: 'billsource',
                        i18n: 'hrkq-0000024', //来源
                        render(text, row, index) {
                            if (config['billsource'][text]) {
                                return (<span>{lang[config['billsource'][text].i18n]}</span>);
                            }
                        },
                    },
                    {
                        key: 'applydate',
                        dataIndex: 'applydate',
                        i18n: 'hrkq-0000037', //申请日期
                        render(text, row, index) {
                            if (text) {
                                return (<span>{formatDate(text)}</span>);
                            }
                        },
                    },
                    {
                        key: 'billstatus',
                        dataIndex: 'billstatus',
                        i18n: 'hrkq-0000038', //状态
                        render(text, row, index) {
                            if (config['approvestatus'][text]) {
                                return (<span>{lang[config['approvestatus'][text].i18n]}</span>);
                            }
                        },
                    },
                    {
                        key: 'transferflag',
                        dataIndex: 'transferflag',
                        i18n: 'hrkq-0000039', //转调休
                        render(text, row, index) {
                            if (text !== 2 &&
                                config['transferflag'][text]) {
                                return (<span>{lang[config['transferflag'][text].i18n]}</span>);
                            }
                        },
                    },
                    {
                        key: 'opearte',
                        i18n: 'hrkq-000005', //操作
                        width: 150,
                        fixed: 'right', //当表水平滚动时，此列将被固定：true或'left'或'right'
                        onCellClick: (row, e) =>{

                        },
                        render: (text, row, index) => {
                            let billSource = row['billsource'];
                            let transferflag = row['transferflag'];
                            if (row['billstatus'] >= 0 &&
                                ['1', '2'].indexOf(row['applysort']) > -1 && billSource !== '2'){
                                return (<span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            this.showFlowHistory(row)
                                        }}>
                                    {lang['hrkq-000006']}
                                </span>); // 流程历史
                            }
                            // 手动录入 且 未转调休的可编辑 删除
                            if (billSource === '2' && transferflag !== '1') {
                                return (
                                    <span>
                                        <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                              onClick={(ev) => {
                                                  ev.stopPropagation();
                                                  editHrBill(row)
                                              }}
                                        >
                                            {lang['hrkq-0000108']}  编辑
                                        </span>
                                        <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                              onClick={(ev) => {
                                                  ev.stopPropagation();
                                                  deleteHrBill(row)
                                              }}>
                                            {lang['hrkq-0000109']}  删除
                                        </span>
                                    </span>
                                )
                            }
                        },
                    },
                ].filter((column, index, list) => {
                    return !!column;
                }).map((column, index, list) => {
                    return {
                        ...column,
                        title: column.title || lang[column.i18n] || ''
                    };
                })}
                data={ data }
            />*/}

            {/* 记录详情 */}
            {active &&
            <Detail
                {...props}
                lang={lang}
                height={height}
                data={active}
                onClose={e => {
                    this.setState({
                        active: null
                    });
                }}
            />}
        </div>);
    }
}
