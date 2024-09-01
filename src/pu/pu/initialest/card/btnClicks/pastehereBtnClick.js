/*
 * @Author: zhaochyu
 * @PageInfo: 粘贴至此
 * @Date: 2018-08-28 18:27:29
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-07-15 15:10:55
 */
import { PAGECODE, BODY_FIELD, CARD_BUTTON, AREA } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { buttonController } from '../viewControl';
export default function(props, index) {
    props.beforeUpdatePage();
    rowCopyPasteUtils.pasteRowsToIndex.call(
        this,
        props,
        PAGECODE.cardbody,
        index,
        BODY_FIELD.cardInitBtn,
        BODY_FIELD.cardPastBtn,
        [BODY_FIELD.crowno]
    );
    RownoUtils.setRowNo(props, PAGECODE.cardbody, BODY_FIELD.crowno);
    this.setState({ flag: 0 });
    buttonController.lineSelected.call(this, this.props, false);
    props.updatePage(AREA.cardFormArea, AREA.cardTableArea);
}
