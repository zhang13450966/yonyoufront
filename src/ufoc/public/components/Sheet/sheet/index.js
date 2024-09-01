/**
 *
 * 报表
 * @author lijle [also named edeity]
 */
import './index.less';
import { promptBox, getMultiLang } from "nc-lightapp-front";

let json = {};
let callback = (mutiLangJson) => {
    json = mutiLangJson
};
getMultiLang({ moduleId: 'epmp_components', domainName: 'epmp', callback, needInlt: false });

// 常量
var CONSTANST = {
    SHEET_DATA_FIELD: 'sheet-data',
    SHEET_LIST_CONTAINER_ID: 'sheets-list-container',
};

/**
 * 报表相关 sheet页签
 */
export function rendererSheet(options, params) {
    // 添加 getSheetInfo 获取sheet 信息, 方便记录
    let __sheetInfo = {
        allSheets: [], // 所有sheets
        activePk: undefined, // 当前sheetPk
    }

    if (options.selector) {
        var sheetList = {
            __isInit: false, // 用来标识初始化事件
            __initFinished: function () {
                sheetList.__isInit = true;
            },
            __getInitStatue: function () {
                return sheetList.__isInit;
            }
        };
        var opt = $.extend({}, options);
        var container = $(options.selector);
        var $sheetListContainer = $("<div>").addClass(CONSTANST.SHEET_LIST_CONTAINER_ID);
        var sheetListDOM = $("<ul class='sheets-list'>");
        // $searchPanel 作为sheetListDOM的备份，作为一页展示sheet的面板
        var $searchPanel = $("<div class='sheet-search-panel'></div>");
        var openClass = 'is-open';
        $searchPanel.hide();
        container.append($sheetListContainer.append(sheetListDOM));
        if (container.length) {
            /**
             * 记录点击历史，以在关闭时能够跳转到关闭前的页签
             * @returns {{empty: empty, addCurrSheet: addCurrSheet, refreshByClose: refreshByClose, closeSheet: closeSheet}}
             * @private
             */
            function _getHistoryAction() {
                var currHistoryIndex = -1; // 记录当前页签的游标
                var sheetHistoryArray = []; // 用以标注页签历史的值
                /**
                 * 页签历史
                 */
                return {
                    empty: function () {
                        currHistoryIndex = -1;
                        sheetHistoryArray = [];
                    },
                    // 添加页签
                    addCurrSheet: function ($sheet) {
                        currHistoryIndex++;
                        sheetHistoryArray.push($sheet)
                    },
                    refreshByClose: function ($closeSheet) {
                        var newHistoryArray = [];
                        var $preSheet = null;
                        var isFindSheet = false;
                        var isFindPreSheet = false;
                        // es6语法中不允许使用未定义全局比变量
                        var $currSheet = null;
                        while (sheetHistoryArray.length > 0) {
                            $currSheet = sheetHistoryArray.pop();
                            if ($currSheet.is($closeSheet)) {
                                if (isFindSheet === false) {
                                    isFindSheet = true;
                                }
                            } else {
                                if (isFindSheet && isFindPreSheet === false) {
                                    $preSheet = $currSheet;
                                    isFindPreSheet = true;
                                }
                                newHistoryArray.unshift($currSheet);
                            }
                        }
                        sheetHistoryArray = newHistoryArray;
                        return $preSheet;
                    },
                    // 关闭页签
                    closeSheet: function ($sheet) {
                        // es6语法中不允许使用未定义全局比变量
                        var $preSheet = null;
                        if ($sheet.hasClass('is-active')) {
                            $preSheet = this.refreshByClose($sheet);
                            // 刷新点击历史，假如当前是激活态，则打开上一次打开的页签
                            if ($preSheet) {
                                $preSheet.trigger('click');
                            }
                        }
                    },
                };
            }

            sheetList.history = _getHistoryAction();

            // 初始化页签
            sheetList.init = function () {
                var sheetOuterDOM = container.find('.sheets-list-container');
                sheetList.history.empty();
                // 添加左右滚动
                initClickEvent();
                openInitSheet();
                addScroll();
                addSheetBar();
                sheetList.__initFinished();

                function initClickEvent() {
                    // 初始化监听事件
                    sheetListDOM.on('click', 'li.report-sheet', function () {
                        var self = $(this);
                        if (!self.hasClass('is-active')) {
                            // 激活当前页签
                            var $preActiveSheet = sheetListDOM.find("li.report-sheet.is-active");
                            $preActiveSheet.removeClass('is-active');
                            $preActiveSheet.prev().removeClass('is-prev-active');
                            $preActiveSheet.next().removeClass('is-next-active');
                            self.addClass('is-active');
                            self.prev().addClass('is-prev-active');
                            self.next().addClass('is-next-active');
                            sheetList.history.addCurrSheet($(this));

                            // 计算是否超出左右距离，假如超出，则滑动到显示区域内
                            var outerWidth = sheetOuterDOM.width();
                            var left = sheetListDOM.css('left');
                            var scrollLeft = parseInt(left.substr(0, left.length - 2));
                            var scrollRight = Math.abs(parseInt(left.substr(0, left.length - 2))) + outerWidth;
                            var sheetLeft = self.offset().left - $('li.report-sheet').first().offset().left;
                            if (sheetLeft <= Math.abs(scrollLeft)) {
                                var toLeft = (-sheetLeft + 4) > 0 ? 4 : (-sheetLeft + 4);
                                sheetListDOM.animate({ 'left': toLeft }); // 距离右边200像素
                            } else if (sheetLeft + self.width() > scrollRight) {
                                sheetListDOM.animate({ 'left': -(sheetLeft - outerWidth + self.width() + 50) });
                            }
                        }
                    });
                }

                /**
                 * @method 控制触发哪个sheet页签被点击
                 * @desc 首先判断当前的sheetList中是否存在 isOpen = true（在addSheet方法入参中配置）的，如果有则点击该sheet页签；否则默认选中第一个sheet页签被点击；
                 */
                function openInitSheet() {
                    // 第一次即执行加载事件
                    var $openSheet = container.find('li.' + openClass);
                    if ($openSheet.length > 0) {
                        $openSheet.removeClass(openClass);
                        $openSheet.trigger('click')
                    } else {
                        var $firstSheet = container.find("li:first");
                        $firstSheet.trigger('click');
                    }
                }

                // 添加基本的工具条
                function addScroll() {
                    var leftMenu = $("<a class='sheet-menu sheet-menu-left'><i class='ysIcon icon-caret-left'></i></a>");
                    var rightMenu = $("<a class='sheet-menu sheet-menu-right'><i class='ysIcon icon-caret-right'></i></a>");
                    var leftBorder = 5; // 左边界
                    // 点击左侧按钮
                    leftMenu.on('click', function () {
                        var outerWidth = sheetOuterDOM.width();
                        var left = sheetListDOM.css('left');
                        var scrollRight = parseInt(left.substr(0, left.length - 2)) + outerWidth / 2;
                        if (scrollRight <= leftBorder) {
                            sheetListDOM.animate({ 'left': scrollRight }, 'fast');
                        } else {
                            sheetListDOM.animate({ 'left': leftBorder }, 'fast');
                        }
                    });
                    // 点击右侧按钮
                    rightMenu.on('click', function () {
                        var outerWidth = sheetOuterDOM.width();
                        var rightBorder = 0 - sheetListDOM.width() + outerWidth - 5; // 右边界
                        if (rightBorder > 0) {
                            return; // 代表sheet页签不占满容器，无需向右
                        } else {
                            var left = sheetListDOM.css('left');
                            var scrollLeft = parseInt(left.substr(0, left.length - 2)) - outerWidth / 2;
                            if (scrollLeft > rightBorder) {
                                sheetListDOM.animate({ 'left': scrollLeft }, 'fast');
                            } else {
                                sheetListDOM.animate({ 'left': rightBorder }, 'fast');
                            }
                        }
                    });
                    container.prepend(leftMenu).append(rightMenu);

                }

                function addSheetBar() {
                    var $menuBar = $("<div class='menu-bar'>");
                    var $icon = $("<i class='ysIcon icon-caret-down'>");
                    var $downBar = $("<a class='sheet-menu'>").append($icon);
                    $menuBar.append($downBar);
                    $menuBar.append($searchPanel);
                    $downBar.on('click', function (e) {
                        if ($searchPanel.is(":hidden")) {
                            $({ deg: 0 }).animate({ deg: 180 }, {
                                duration: 280, step: function (now) {
                                    $icon.css({ transform: 'rotate(' + now + 'deg)' });
                                }
                            });
                            $searchPanel.slideDown('fast');
                        } else {
                            $({ deg: 180 }).animate({ deg: 360 }, {
                                duration: 280, step: function (now) {
                                    $icon.css({ transform: 'rotate(' + now + 'deg)' });
                                }
                            });
                            $searchPanel.slideUp('fast');
                        }
                        e.preventDefault()
                        return false
                    });
                    $(document).on('click', function () {
                        if (!$searchPanel.is(":hidden")) {
                            $({ deg: 180 }).animate({ deg: 360 }, {
                                duration: 280, step: function (now) {
                                    $icon.css({ transform: 'rotate(' + now + 'deg)' });
                                }
                            });
                            $searchPanel.slideUp('fast');
                        }
                    })
                    container.append($menuBar);
                }
            };

            // 重新计算页签的区域
            sheetList.resize = function () {
                var sheetOuterDOM = container.find('.sheets-list-container');
                // 计算container的高度
                var totalWidth = 0;
                var marginLeft = sheetOuterDOM.css('margin-left');
                var marginRight = sheetOuterDOM.css('margin-right');
                var marginLeftNum = marginLeft ? parseInt(marginLeft.substr(0, marginLeft.length - 2)) : 0;
                var marginRightNum = marginRight ? parseInt(marginRight.substr(0, marginRight.length - 2)) : 0;
                /** wangyin 先把宽度撑起来 解决后面sheet比前面宽很多而导致 被挤下来的bug 一般sheet没有宽于9999px的*/
                sheetListDOM.css('width', 99999);
                /** wangyin */
                sheetListDOM.find('li').each(function () {
                    totalWidth = totalWidth + $(this).outerWidth();
                });
                var sheetListDomWidth = totalWidth + marginLeftNum + marginRightNum;
                sheetListDOM.css('width', sheetListDomWidth);
            };

            sheetList.getSheetInfo = () => __sheetInfo;

            // 添加页签
            sheetList.addSheet = function (obj) {
                add(obj);
                // 还原原始格式
                let _formatObj = {
                    pk_obj: obj.pk,
                    name: obj.value
                }
                __sheetInfo.allSheets.push(_formatObj);

                // 初始化添加数据
                function add(sheetSetting) {
                    // 默认配置
                    var defaultSheetSetting = {
                        value: $appRoot.state.json['public_lang-000227'],/* 国际化处理： 默认*/
                        view: {
                            hasCloseBtn: false,
                            isOpen: false
                        },
                        callback: {
                            beforeClick: null, //wangyint新增钩子函数 返回值确定是否弹框
                            click: null, //wangyint
                            afterClick: null,
                            beforeClose: null,
                        }
                    };
                    var currSheetSetting = $.extend(true, defaultSheetSetting, sheetSetting);
                    var cb = currSheetSetting.callback;
                    var $aLink;
                    // 根据当前页签的上报状态，展示不同颜色
                    if (currSheetSetting.reportStatus === '1') {
                        $aLink = $("<a>").addClass("report-sheet").addClass("red-node").text(currSheetSetting.value); // 已上报
                    } else {
                        $aLink = $("<a>").addClass("report-sheet").text(currSheetSetting.value); // 未上报
                    }
                    var $sheetLi = $(`<li id=${currSheetSetting.pk}>`).addClass("report-sheet").append($aLink);

                    // 添加到原DOM文档中
                    $sheetLi.data(CONSTANST.SHEET_DATA_FIELD, currSheetSetting);
                    sheetListDOM.append($sheetLi);
                    sheetList.resize();

                    // 复制一份备份到搜索Panel，sheet列表右侧下拉箭头内的sheet列表
                    var $sheetLink = $("<div class='sheet-link'>");
                    $sheetLink.text(currSheetSetting.value);
                    $searchPanel.append($sheetLink);
                    $sheetLink.on('click', function () {
                        $sheetLi.trigger('click');
                    });
                    // 触发afterClick事件
                    $sheetLi.on('click', async function (event) {
                        /** wangyint 运行beforeClick钩子函数 */
                        if (cb && $.isFunction(cb.beforeClick) && cb.beforeClick()) { //函数执行返回为true可以向下进行
                            await new Promise((resolve, reject) => {
                                promptBox({
                                    color: "warning",
                                    content: $appRoot.state.json['public_lang-000228'],/* 国际化处理： 有单元格发生改变是否保存*/
                                    beSureBtnClick: () => {
                                        cb && $.isFunction(cb.click) && cb.click();
                                        resolve(false);
                                    },
                                    cancelBtnClick: () => {
                                        resolve(true);
                                    }
                                })
                            })
                        };
                        /** \wangyint */
                        // 激活Link页签
                        var $preActiveSheetLink = $searchPanel.find(".sheet-link.is-active");
                        $preActiveSheetLink.removeClass('is-active');
                        $sheetLink.addClass('is-active');
                        if (cb && $.isFunction(cb.afterClick)) {
                            cb.afterClick(currSheetSetting);
                        }

                        // sheetInfo
                        __sheetInfo.activePk = currSheetSetting.pk
                    })

                    // 关闭按钮
                    if (currSheetSetting.view && currSheetSetting.view.hasCloseBtn) {
                        var $closeBtn = $("<span>×</span>").addClass("close-sheet-btn");
                        $aLink.append($closeBtn);
                        // 移除该页签
                        $closeBtn.on('click', function () {
                            cb && $.isFunction(cb.beforeClose) && cb.beforeClose();
                            sheetList.history.closeSheet($sheetLi);
                            // 根据位置删除
                            let index = $($sheetLi).index();
                            //console.error(index, 'index', '====');
                            __sheetInfo.allSheets.splice(index, 1);

                            $sheetLi.remove();
                            $sheetLink.remove();
                            event.stopPropagation();
                            return false;
                        });
                    }

                    // 通过isOpen控制是否触发当前sheet页签的点击事件
                    if (currSheetSetting.view.isOpen) {
                        $sheetLi.addClass(openClass);
                        /**
                         * 假如未初始化，会在初始化时触发click
                         * 假若初始化，需要在此触发click
                         */
                        if (sheetList.__getInitStatue()) {
                            $sheetLi.trigger('click');
                        }
                    }
                };
            };
            sheetList.addSheetClass = function (pk) {
                $(`#${pk} a`).addClass("red-node");
            }
            sheetList.removeSheetClass = function (pk) {
                $(`#${pk} a`).removeClass("red-node");
            }
            return sheetList;
        } else {
            console.error($appRoot.state.json['public_lang-000229'] + options.selector + $appRoot.state.json['public_lang-000230']);/* 国际化处理： 无法找到,的节点*/
        }
    } else {
        console.error($appRoot.state.json['public_lang-000231']);/* 国际化处理： 没有指定页签容器(selector)，无法初始化*/
    }
};
