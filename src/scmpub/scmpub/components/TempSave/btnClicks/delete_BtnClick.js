/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-30 16:05:25
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-20 09:38:10
 */
import { URL } from '../const';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function open_BtnClick(props, record, index) {
	let pk = this.state.tempDataList.rows[index].values.ctempsaveid.value;

	ajax({
		url: URL.DELETETEMPORARY,
		data: [ pk ],
		success: () => {
			let tempSaveData = this.state.tempDataList;
			tempSaveData.rows.splice(index, 1);
			let list = this.state.summary;
			list.splice(index, 1);
			this.setState({
				summary: list,
				tempDataList: tempSaveData
			});
			showSuccessInfo(getLangByResId(this, '4001TEMPSAVE-000007'));
		}
	});
}
