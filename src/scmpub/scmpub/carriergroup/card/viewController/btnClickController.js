import addBtnClick from '../btnClick/addBtnClick';
import deleteBtnClick from '../btnClick/deleteBtnClick';
import cancelBtnClick from '../btnClick/cancelBtnClick';
import refreshBtnClick from '../btnClick/refreshBtnClick';
import EditBtnClick from '../btnClick/editBtnClick';
import SaveBtnClick from '../btnClick/saveBtnClick';
import startuseBtnClick from '../btnClick/startuseBtnClick';
import stopuseBtnClick from '../btnClick/stopuseBtnClick';
import printBtnClick from '../btnClick/printBtnClick';
import { FILED } from '../../constance';
export default function buttonClick(props, key, text, record, index) {
    switch (key) {
        case FILED.Add: // 自制
            addBtnClick.bind(this, props)();
            break;
        case FILED.Delete:
            deleteBtnClick.call(this, props);
            break;
        case FILED.Cancel:
            cancelBtnClick.call(this, this.props);
            break;
        case FILED.Refresh:
            refreshBtnClick.call(this, props);
            break;
        case FILED.Edit:
            EditBtnClick.call(this, props);
            break;
        case FILED.Save:
            SaveBtnClick.call(this, key);
            break;
        case FILED.StartUse:
            startuseBtnClick.call(this, props);
            break;
        case FILED.StopUse:
            stopuseBtnClick.call(this, props);
            break;
        case FILED.PrintPop:
            printBtnClick.call(this, this.props);
            break;
        case FILED.Output:
            printBtnClick.call(this, this.props, true);
            break;
    }
}
