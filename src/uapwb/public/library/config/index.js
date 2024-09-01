import {promiseAjax} from "./util/ajax";
import {_const} from './constant/constant'
import {_AppWrapper} from "./util/AppWrapper";
import {_toast} from "./util/toast";
import {_Logger} from "./util/logger";
import {_store} from "./util/store";

window.$util = {
    ajax: promiseAjax,
    toast: _toast,
    promptBox: $platform.promptBox,
    AppWrapper: _AppWrapper,
};
window.$const = _const;
window.log = _Logger;
window.$store = _store;

