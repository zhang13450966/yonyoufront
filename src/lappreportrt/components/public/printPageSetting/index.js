/*
 * @Author: xuyangt
 * @Descripttion: 
 * @Date: 2022-01-04 10:18:49
 * @LastEditTime: 2022-02-10 11:06:18
 */
import React, { useImperativeHandle, forwardRef, useReducer } from 'react';
import { Pcontext, pstore } from './pstore';
import preducer from './preducer';
import './index.less';
// import "../../../../node_modules/nc-lightapp-front/dist/platform/nc-lightapp-front/nc-lightapp-front.css"

import { isPrint, changeTrigger, changeOpenPlan, changeOpenSetting, getPlans, changePlanLists, changeLanginfo, setPrintParams, changeDefaultPlanCode, setReportId, printAction, newPrintAction } from './paction';
import PrintPlan from './printPlan';
import PrintSetting from './printSetting';

function PrintPageSetting(props, ref) {
  const [store, dispatch] = useReducer(preducer, pstore);

  /**
   * 暴露给外界的启动钩子
   */
  async function triggered(pfdParams, type, reportId) {
    dispatch(changeTrigger(true));
    dispatch(setReportId(reportId));
    dispatch(setPrintParams(pfdParams));
    const { langinfo, schemeinfo } = await getPlans(reportId);

    // 如果点击打印按钮
    if (type == 'print') {
      // 存在多个方案弹出方案选择框
      if (schemeinfo.length > 1) {
        // 有多个方案,弹出方案选择框
        dispatch(changeOpenPlan(true));
        dispatch(isPrint(true));
      } else {
        // 没有多个方案直接打印
        printAction(reportId, store.defaultPlanCode, { printSet: {}, ...pfdParams }, code => dispatch(changeDefaultPlanCode(code)));
      }
    }
    // 如果点击打印设置，弹出打印设置弹窗
    if (type == 'print_setting') {
      dispatch(changeOpenSetting(true));
    }

    if (type == 'pdf') {
      // 存在多个方案弹出方案选择框
      if (schemeinfo.length > 1) {
        // 有多个方案,弹出方案选择框
        dispatch(changeOpenPlan(true));
        dispatch(isPrint(false));
      } else {
        // 没有多个方案直接打印
        newPrintAction(reportId, store.defaultPlanCode, { printSet: {}, ...pfdParams }, code => dispatch(changeDefaultPlanCode(code)));
      }
    }

    dispatch(changeLanginfo(langinfo));
    dispatch(changePlanLists(schemeinfo));
  }

  useImperativeHandle(ref, () => {
    return { triggered };
  });
  return (
    <Pcontext.Provider value={{ store, dispatch }}>
      <PrintPlan />
      <PrintSetting isClickSearchBtn={!props.isClickSearchBtn} />
    </Pcontext.Provider>
  );
}

export default forwardRef(PrintPageSetting);
