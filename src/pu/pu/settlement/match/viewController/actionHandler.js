
import AutoSettleAction from './autoSettleAction';
import AutoSettleRuleAction from './autoSettleRuleAction';
import BackAction from './backAction';
import DifferentMaterialMatchAction from './differentMaterialMatchAction';
import DistributeByMoneyAction from './distributeByMoneyAction';
import DistributeByNumAction from './distributeByNumAction';
import FeeDistributeAction from './feeDistributeAction';
import FeeMatchAction from './feeMatchAction';
import SameMaterialMatchAction from './sameMaterialMatchAction';
import SettleAction from './settleAction';
import ShowFeeInvoiceAction from './showFeeInvoiceAction';
import WithoutInvoiceMatchAction from './withoutInvoiceMatchAction';
import BackSettleAction from './backSettleAction';

class ActionHandler {
    constructor(page) {
        this.props = page.props;
        this.page = page;
        this.instance = null;
        this.handlerMap = null;
    }

    static getInstance(page) {
        if (this.instance == null) {
            this.instance = new ActionHandler(page);
        }
        return this.instance;
    }

    /**
     * 动作执行
     * @param {*} key
     */
    doAction(key) {
        if (this.handlerMap == null) {
            this.init();
        }
        let action = this.handlerMap.get(key) 
        if (action == null) {
            console.log('can not find a action named' +key);
        } else {
            this.before(key);
            action.doAction(this.page);
            this.after(key);
        }

    }

    /**
     * 动作前处理
     * @param {*} key 
     */
    before(key) {
        //TODO
    }
    /**
     * 动作后处理
     * @param {*} key 
     */
    after(key) {
        //TODO
    }
    /**
     * 加载对应按钮的action
     */
    init() {
        let map = new Map();
        map.set('AutoSettle', new AutoSettleAction());
        map.set('Settle', new SettleAction());
        map.set('Back', new BackAction());
        map.set('FeeSettle', new FeeMatchAction());
        map.set('SameMaterialSettle', new SameMaterialMatchAction());
        map.set('DifferentMaterialSettle', new DifferentMaterialMatchAction());
        map.set('WithoutInvoiceSettle', new WithoutInvoiceMatchAction());
        map.set('FeeDistribute', new FeeDistributeAction());
        map.set('ShowFeeInvoice', new ShowFeeInvoiceAction());
        map.set('DistributeByMny', new DistributeByMoneyAction());
        map.set('DistributeByNum', new DistributeByNumAction());
        map.set('AutoSettleRule', new AutoSettleRuleAction());
        map.set('BackSettle', new BackSettleAction());
        this.handlerMap = map;
        
    }
}

export default ActionHandler;