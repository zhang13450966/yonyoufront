import {toast} from 'nc-lightapp-front';
export function _toast(content, color = $nccConst.spell.success, additions = {}) {
    return toast({content, color, ...additions})
}
