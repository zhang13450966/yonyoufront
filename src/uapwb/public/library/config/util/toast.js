import {toast} from 'nc-lightapp-front';
export function _toast(content, color = $const.SPELL.success, additions = {}) {
    return toast({content, color, ...additions})
}
