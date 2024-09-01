import { toast } from "nc-lightapp-front";
import Utils from "@public/utils";
const { arraySum, langCheck } = Utils;
import { tableRender } from "./methods";

//冻结方法
export const freezeCell = function (type, blockIndex) {
    this.IS_CLICK_BLOCK = true;
    type = type.key || type;
    let { row, col } = this.isClickCoords;
    if (blockIndex > 0) col = blockIndex;
    let tableHeight = document.getElementById("reportTable").offsetHeight;
    let tableScrollTop =
        document.getElementsByClassName("wtHolder")[0].scrollTop;
    let tableScrollLeft =
        document.getElementsByClassName("wtHolder")[0].scrollLeft;
    let tableWidth =
        document.getElementsByClassName("hot-table")[0].offsetWidth;
    if (
        this.state.settings.colWidths.length > 0 ||
        this.state.settings.rowHeights.length > 0
    ) {
        let overflowHeight = arraySum(
            this.state.settings.rowHeights.slice(0, row > 0 ? +row + 2 : 1)
        );
        let overFlowWidth = arraySum(
            this.state.settings.colWidths.slice(0, +col > 0 ? +col + 1 : 1)
        );
        //超出第一屏，不可冻结
        if (
            overflowHeight > tableHeight &&
            (type == "lockRow" || type == "lockRowColumn")
        ) {
            toast({
                content: langCheck("reportMultiLang", "100301-000001"),
                color: "warning",
            }); /* 国际化处理： 当前位置超出一屏,暂不支持冻结。*/
            return;
        }
        if (
            overFlowWidth > tableWidth &&
            (type == "lockColumn" || type == "lockRowColumn")
        ) {
            toast({
                content: langCheck("reportMultiLang", "100301-000001"),
                color: "warning",
            }); /* 国际化处理： 当前位置超出一屏,暂不支持冻结。*/
            return;
        }
    }

    //冻结后回归初始点
    if (tableScrollTop > 0 && tableScrollTop < tableHeight) {
        document.getElementsByClassName("wtHolder")[0].scrollTo(0, 0);
    }
    if (tableScrollLeft > 0 && tableScrollLeft < tableWidth) {
        document.getElementsByClassName("wtHolder")[0].scrollTo(0, 0);
    }

    this.state.settings.fixedColumnsLeft = +col;
    this.state.settings.fixedRowsTop = +row;

    //冻结后增加粗边框标志
    onFreeze(type);
    if (type == "lockRow") {
        this.state.settings.fixedColumnsLeft = 0;
    }

    if (type == "lockColumn") {
        this.state.settings.fixedRowsTop = 0;
    }

    tableRender(this, this.state.result);
};

function onFreeze(type) {
    if (type === "lockRow") {
        lockRow();
    } else if (type == "lockColumn") {
        lockColumn();
    } else {
        lockRow();
        lockColumn();
    }
}

function lockRow() {
    let dom = document.querySelector(".ht_clone_top tbody");
    if (dom) dom.classList.add("render-border");
    let dom2 = document.querySelector(".ht_clone_top_left_corner table");
    if (dom2) dom2.classList.add("render-left-border");
}

function lockColumn() {
    let dom = document.querySelector(".ht_clone_left tbody");
    if (dom) dom.classList.add("render-border");
    let dom2 = document.querySelector(".ht_clone_top_left_corner table");
    if (dom2) dom2.classList.add("render-top-border");
}
