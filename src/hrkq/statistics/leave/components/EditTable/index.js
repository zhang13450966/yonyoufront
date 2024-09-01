import { base, high } from 'nc-lightapp-front';
import config from '../../config';
// css
import './index.less';
// components
import EditTable from 'src/hrkq/statistics/common/components/EditTable';

// let { ApproveDetail } = high;

export default class extends EditTable {
    initailMeta = () => {
        /**
         * 添加操作
         * rongqb 20190523
         */
        let { tableId, meta, lang, editHrBill, deleteHrBill, showLeaveoffInfo, showFileUploader } = this.props,
            metaInfo = meta.getMeta(),
            info = metaInfo[tableId];
        let { items } = info;
        let langCode = this.getLangCode('langCode');
        let oprWidth = '120px', oproffWidth = '200px'
        if (langCode === 'english') {
            oprWidth = '140px'
            oproffWidth = '200px'
        }
        if (items) {
            items.push({
                attrcode: 'fileManager',
                itemtype: 'customer',
                hyperlinkflag: false,
                label: lang['hrkq-0000130'],
                textAlign: 'center',
                visible: true,
                width: oprWidth,
                fixed: 'right',
                onCellClick: (row) => {
                    
                },
                render: (text, row, index) => {
                    return (
                        <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }} 
                              onClick={() => {
                                showFileUploader(row)
                              }}
                        >
                            {lang['hrkq-0000129']}
                        </span>
                    )
                }
            });
            items.push({
                attrcode: 'opr',
                itemtype: 'customer',
                hyperlinkflag: false,
                label: lang['hrkq-000005'],
                textAlign: 'center',
                visible: true,
                width: oprWidth,
                fixed: 'right',
                onCellClick: (row) => {
                    
                },
                render: (text, row, index) => {
                    let billSource = row['values'] && row['values']['billsource'] && row['values']['billsource']['value'];
                    if (row['values'] &&
                        row['values']['approvestatus'] &&
                        row['values']['approvestatus']['value'] > -1 && 
                        billSource === '0') {
                        return (
                            <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }} 
                                  onClick={() => {
                                    this.showFlowHistory(row, 'leave')
                                  }}
                            >
                                {lang['hrkq-000006']}
                            </span>
                        )
                    }
                    if (billSource === '1') {
                        return (
                            <span>
                                <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                      onClick={() => {
                                        editHrBill(row)
                                      }}
                                >
                                    {lang['hrkq-0000108']} {/* 编辑 */}
                                </span>
                                <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                      onClick={() => {
                                        deleteHrBill(row)
                                      }}>
                                    {lang['hrkq-0000109']} {/* 删除 */}
                                </span>
                            </span>
                        )
                    }
                }
            });
            items.push({
                attrcode: 'resizeOpr',
                itemtype: 'customer',
                hyperlinkflag: false,
                label: lang['hrkq-0000113'], /* 销假操作 */
                textAlign: 'center',
                visible: true,
                fixed: 'right',
                width: oproffWidth,
                onCellClick: (row) => {
                
                },
                render: (text, row, index) => {
                    let billSource = row['values'] && row['values']['billsource'] && row['values']['billsource']['value'];
                    if (row['values'] &&
                        row['values']['leaveoffapprovestatus'] &&
                        row['values']['leaveoffapprovestatus']['value'] > -1 &&
                        billSource === '0') {
                        return (
                            <span>
                                <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                      onClick={() => {
                                            showLeaveoffInfo(row)
                                      }}
                                >
                                    {lang['hrkq-0000115']} {/* 查看 */}
                                </span>
                                <span style={{ color: '#0073E1', cursor: 'pointer', marginRight: '12px' }}
                                  onClick={() => {
                                      this.showFlowHistory(row, 'leaveoff')
                                  }}
                                >
                                    {lang['hrkq-000006']} {/* 流程历史 */}
                                </span>
                            </span>
                            
                        )
                    }
                }
            });
        }
        meta.setMeta(metaInfo)
    }

    getLangCode = (sName) => {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        var oRE = new RegExp(sRE);
        if (oRE.test(document.cookie)) {
            return RegExp["$1"];
        }
        return null;
    }

    /**
     * @desc: 
     * @param {object} row
     * @param {string} type   'leave'出差  'leaveoff' 销差
     * @return: 
     */
    showFlowHistory = (row, type) => {
        if (type === 'leave') {
            if (row['values'] &&
            row['values']['approvestatus'] &&
            row['values']['approvestatus']['value'] > -1) {
            this.setState({
                showApprove: true,
                approveData: {
                    billtype: row['values']['billtype']['value'],
                    billid: row['values'][config['pk']]['value']
                }
            });
        }
        } else {
            if (row['values'] &&
            row['values']['leaveoffapprovestatus'] &&
            row['values']['leaveoffapprovestatus']['value'] > -1) {
            this.setState({
                showApprove: true,
                approveData: {
                    billtype: '6QXJ',
                    billid: row['values']['pk_leaveoff']['value']
                }
            });
        }
        }
    }
    componentDidMount = () => {
        const { props: {
            register
        } } = this;

        register && register({
            initailMeta: this.initailMeta.bind(this),
        });
    }
}
