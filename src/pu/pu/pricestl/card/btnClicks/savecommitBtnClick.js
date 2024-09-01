import commitBtnClick from './commitBtnClick';
import saveBtnClick from './saveBtnClick';
export default function savecommitBtnClick() {
	saveBtnClick.call(this, this.props, null, () => {
		commitBtnClick.call(this, this.props);
	});
}
