import dataInterval from './list/dataInterval'
import taxFunc from './list/taxFunc'
import salaryChange from './list/salarychangedate'
import psntype from './list/psntype'
import grant from './list/grant'
import lastStaffEstab from './list/laststaffestablish'
import lastannualbudget from './list/lastannualbudget'
import staffestab from './list/staffestablish'
import staffestablishscale from './list/staffestablishscale'

const Config = {
    dataInterval: dataInterval,
    taxFunc: taxFunc,
    salaryChange: salaryChange,
    psntype: psntype,
    grant: grant,
    lastStaffEstab: lastStaffEstab,
    lastannualbudget: lastannualbudget,
    staffestab: staffestab,
    staffestablishscale: staffestablishscale
    // otherSource: () => import('./list/otherResource/index')
}
export default Config