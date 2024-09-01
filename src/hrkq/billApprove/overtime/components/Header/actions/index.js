let timer = null;

export default class HeaderAction {
    constructor(comp) {
        this.comp = comp;
        this.dispatch = this.comp.props.dispatch;
    }

    // 订单状态下拉框的内容数据
    getOrderStatusList = () => {
        const {props} = this.comp;
        const {overtime} = props;

        return [{
            key: 'all',
            label: overtime.language['gx6008-000070'], // 全部
        }, {
            key: '-1',
            label: overtime.language['gx6008-000001'], // '自由态'
        }, {
            key: '3',
            label: overtime.language['gx6008-000002'], // 提交
        }, {
            key: '2',
            label: overtime.language['gx6008-000003'], // 审批进行中
        }, {
            key: '1',
            label: overtime.language['gx6008-000004'], // 审批通过
        }, {
            key: '4',
            label: overtime.language['gx6008-000006'], // 已发offer
        }, {
            key: '5',
            label: overtime.language['gx6008-000007'], // 接受offer
        }, {
            key: '6',
            label: overtime.language['gx6008-000008'], // 拒绝offer
        }, {
            key: '7',
            label: overtime.language['gx6008-000009'], // 待入职
        }, {
            key: '8',
            label: overtime.language['gx6008-000010'], // 拒绝入职
        }, {
            key: '102',
            label: overtime.language['gx6008-000011'], // 已入职
        }];
    }

    // 订单时间范围的下拉框内容
    getOrderTimeRangeList = () => {
        const {props} = this.comp;
        const {overtime} = props;

        return {
            'oneWeek': overtime.language['gx6008-000012'], // 一周内
            'oneMonth': overtime.language['gx6008-000013'], // 一个月内
            'threeMonth': overtime.language['gx6008-000014'], // 三个月内
            'custom': overtime.language['gx6008-000015'], // 自定义
        };
    }

    // 选择订单状态
    changeOrderStatus = (value) => {
        const {props} = this.comp;
        const {
            overtime: {
                orderStatus: prevOrderStatus
            }
        } = props;

        let valueWithoutAll = [];
        if((value.includes('all') && !prevOrderStatus.includes('all')) || value.length === 0) {
            valueWithoutAll = ['all'];
            this.update({
                orderStatus: valueWithoutAll
            });
        }
        else {
            value.map((item) => {
                if(item !== 'all') {
                    valueWithoutAll.push(item);
                }
            });
            this.update({
                orderStatus: valueWithoutAll
            });
        }
        
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.pubSub.publish('getMainTableData', {
                billstate: valueWithoutAll
            });
        }, 1000);
    }

    // 选择订单时间范围
    changeOrderRange = (value) => {
      
        if(value !== 'custom') {
            this.pubSub.publish('getMainTableData', {
                time: value
            });
        }

        this.update({
            orderTimeRange: value,
            orderBeginTime: '',
            orderEndTime: ''
        });
    }

    // 自定义订单时间范围
    changeOrderTime = (value) => {
        this.update({
            orderBeginTime: value[0],
            orderEndTime: value[1]
        });
        this.pubSub.publish('getMainTableData', {
            orderBeginTime: value[0],
            orderEndTime: value[1]
        });
    }
}