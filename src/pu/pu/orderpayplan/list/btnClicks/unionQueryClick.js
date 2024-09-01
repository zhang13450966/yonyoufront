/*
 * @Author: heyfn 
 * @PageInfo: 联查明细
 * @Date: 2022-01-19 09:55:03 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-01-19 09:55:03
 */
export default function unionQueryClick(pk_order) {
    this.setState({
        pk_order: pk_order
    }, () => this.props.modal.show('viewModal'));
}