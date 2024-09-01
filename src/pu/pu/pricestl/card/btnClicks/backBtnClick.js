import { URL, PAGECODE, TRANSFER30 } from '../../constance';
export default function backBtnClick(error) {
	this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
	this.props.updatePage(PAGECODE.cardhead, [ PAGECODE.cardbody, PAGECODE.cardbodyano ]);
}
