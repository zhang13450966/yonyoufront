// import { base, high } from 'nc-lightapp-front';
// import config from '../../config';
// css
import './index.less';
// components
import EditTable from 'src/hrkq/statistics/common/components/EditTable';

// let { ApproveDetail } = high;
// import ApproveDetail from 'uap/common/components/ApproveDetail';
export default class extends EditTable {
    initailMeta = () => {
        /**
         * 添加操作
         * rongqb 20190523
         */
        let that = this;
        let {tableId, meta, lang, tabActive} = this.props,
            metaInfo = meta.getMeta(),
            info = metaInfo[tableId];
        if (tableId === 'abnormal_list' || tableId === 'details_list' || !info) return;
        let {items} = info;

        if (items) {
            items.push({
                attrcode: 'opr',
                itemtype: 'customer',
                hyperlinkflag: false,
                label: lang['hrkq-000005'],
                textAlign: 'center',
                visible: true,
                width: '140px',
                fixed: 'right',
                onCellClick: (row) => {
                },
                render(text, row, index) {
                    if (row['values'] &&
                        row['values']['approvestatus'] &&
                        row['values']['approvestatus']['value'] > -1) {
                        return (
                            <span style={{color: '#0073E1', cursor: 'pointer', marginRight: '12px'}}
                                  onClick={() => {
                                      if (row['values'] &&
                                          row['values']['approvestatus'] &&
                                          row['values']['approvestatus']['value'] > -1) {
                                          that.setState({
                                              showApprove: true,
                                              approveData: {
                                                  billtype: row['values']['billtype']['value'],
                                                  billid: row['values'][tabActive['pk']]['value']
                                              }
                                          });
                                      }
                                  }
                                  }
                            >
                                {lang['hrkq-000006']}
                            </span>
                        )
                    }
                }
            });
        }
        meta.setMeta(metaInfo)
    }

    componentDidMount = () => {
        this.initailMeta();
    }
}
