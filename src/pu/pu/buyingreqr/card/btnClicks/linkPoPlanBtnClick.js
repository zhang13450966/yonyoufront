/*
 * @Author: zhaochyu
 * @PageInfo: 联查采购计划
 * @Date: 2020-03-20 16:40:26
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-03-20 16:44:07
 */

import { toast, ajax } from "nc-lightapp-front";
import { BUYINGREQ_CARD, ATTRCODE } from "../../siconst";
import { getLangByResId } from "../../../../../scmpub/scmpub/pub/tool/multiLangUtil";
export default function linkPoPlanBtnClick(props) {
  let selectedRow = props.cardTable.getCheckedRows(BUYINGREQ_CARD.tableId);
  if (selectedRow == null || selectedRow.length == 0) {
    toast({
      color: "warning",
      content: getLangByResId(
        this,
        "4004PRAYBILLR-000004"
      ) /* 国际化处理： 请选择行！*/
    });
    return;
  }
  let pk_praybill = props.form.getFormItemsValue(
    BUYINGREQ_CARD.formId,
    ATTRCODE.pk_praybill
  ).value;
  let data = { keyword: pk_praybill, pageid: this.pageId };
  if (pk_praybill) {
    ajax({
      url: BUYINGREQ_CARD.linpayplay,
      data: data,
      method: "POST",
      success: res => {
        if (res.data) {
          this.setState({
            showNtbDetail: true,
            ntbdata: res.data
          });
        }
      }
    });
  }
}
