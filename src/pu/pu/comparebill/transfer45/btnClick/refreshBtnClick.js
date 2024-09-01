/*
 * @Author: chaiwx 
 * @PageInfo: 刷新
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 13:25:55
 */
import commonSearch from './commonSearch';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { CACHDATASOURCE, CACHKEY } from '../../constance';

export default function(props) {
	commonSearch.call(this, getDefData(CACHDATASOURCE.dataSourceTransfer, CACHKEY.transferSearchCach), true);
}
