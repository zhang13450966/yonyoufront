import MatchAction from './action';
import {SETTLTTYPE } from '../../constance';
class FeeeMatchAction extends MatchAction {
    constructor(){
        super('feeMaterial','4004SETTLEMENT-000001')
    }
    before(page) {
        page.state.btnName = 'FeeSettle';
		page.state.settleType = SETTLTTYPE.FEE; 
    }
}
export default FeeeMatchAction;