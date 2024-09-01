/*
 * @Author: qishy 
 * @PageInfo: 业务对账单列表刷新
 * @Date: 2019-04-28 15:30:05 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-15 11:23:43
 */

import { commonSearch } from '.';
import { BUTTONID, CACHDATASOURCE, CACHKEY } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function(props) {
	props.button.setDisabled({ [BUTTONID.Refresh]: false });
	commonSearch.call(this, null, getDefData(CACHDATASOURCE.dataSourceList, CACHKEY.searchCach), false);
}
