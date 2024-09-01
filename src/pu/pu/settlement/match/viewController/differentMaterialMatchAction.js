import MatchAction from './action';
import {SETTLTTYPE } from '../../constance';
class DifferentMaterialMatchAction extends MatchAction {
    constructor() {
        super('differentMaterial', '4004SETTLEMENT-000003');
    }
    before(page) {
        page.state.btnName = 'DifferentMaterialSettle';
		page.state.settleType = SETTLTTYPE.DIFFERENT_MATERIAL; 
    }
}
export default DifferentMaterialMatchAction;