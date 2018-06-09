/**
 * 速芽物流商家端 - OrderItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import {toastShort, consoleLog} from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import ModalView from '../../util/utilsDialogs'

const MODAL_CONFIG = {
    title: '取消提醒',
    modalText: '取消订单后，将无法恢复，确认要取消吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};
export default class OrderItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.item,
            index: this.props.item.index,
            showModal: false,
            canPress: true,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        // item: HomeNavigation
    }

    componentDidMount() {
        // consoleLog("参数传递", this.props.item);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            item: nextProps.item.item
        })
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    showModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        })
    }

    loadNetData = () => {

    }

    renderShopServices = (data) => {

        // consoleLog('商店服务', data);
        if(data.length <= 0) {
            return null;
        }
        let routers = data.map((obj,index)=>{
            return (
                <Text key = {"services"+index} style={styles.shopRouterCon}>{obj.router}</Text>
            )
        });
        return routers;
    }

    onPushToDetail = (item) => {
        console.log(123);
        const { navigate } = this.props.navigation;
        navigate('OrderDetail', {
            webTitle: '订单详情',
            orderId: item.id,
            reloadData: () => this.props.reloadData(),
        });
    };

    orderCancel = (oid) => {
        this.showModal();
        let url = NetApi.orderCancel + oid;
        this.setState({
            canPress: false
        });
        this.netRequest.fetchGet(url, true)
            .then(result => {
                toastShort(result.msg);
                if (result && result.code == 1) {
                    this.props.reloadData();
                } else {
                    this.setState({
                        canPress: true
                    });
                }
            })
            .catch(error => {
                toastShort('error');
                this.setState({
                    canPress: true
                });
            })
    }

    render(){
        const { item, index, showModal, canPress } = this.state;
        const { onPushToBusiness } = this.props;
        let orderStatus = item.status == 1 || item.status == 7;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style = {styles.orderInfoItem}
                    onPress = {() => this.onPushToDetail(item)}
                >
                    <Text style={styles.orderRouter}>订单号: {item.code}</Text>
                    <Text style={styles.orderNumber}>{item.service}</Text>
                </TouchableOpacity>
                {showModal &&
                    <ModalView
                        show = {showModal}
                        title = {MODAL_CONFIG.title}
                        contentText = {MODAL_CONFIG.modalText}
                        cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.showModal()}
                        confirmFoo = {() => this.orderCancel(item.id)}
                    />
                }
                <View style={styles.shopInfoItem}>
                    {orderStatus && <TouchableOpacity
                        style = {styles.servicesBtnItem}
                        onPress = {() => {canPress && this.showModal()}}
                    >
                        <Text style={[styles.shopRouterBtnItem, {color: '#666'}]}>取消</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                        style = {styles.servicesBtnItem}
                        onPress = {() => this.onPushToDetail(item)}
                    >
                        <Text style={styles.shopRouterBtnItem}>查看</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    orderRouter: {
        fontSize: 14,
        color: '#333',
    },
    orderNumber: {
        fontSize: 13,
        marginTop: 5,
        color: '#666',
    },
    shopAlbumView: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        position: 'relative',
    },
    shopTopIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        zIndex: 2,
        height: 40,
    },
    shopThumbnail: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    shopInfoView: {
        width: GlobalStyles.width - 120,
    },
    shopInfoItem: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 16,
    },
    shopTagsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shopTagsIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    shopTagsName: {
        fontSize: 12,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        color: GlobalStyles.themeColor,
        borderColor: GlobalStyles.themeColor,
    },
    shopStarView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopStarTitle: {
        color: '#333',
    },
    shopStarCon: {},
    shopStarIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    shopStarNum: {
        marginLeft: 10,
        color: '#f00',
    },
    shopDistance: {
        fontSize: 12,
        color: '#888',
    },
    shopDiscountView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopDiscountTitle: {
        padding: 1,
        fontSize: 12,
        borderWidth: 1,
        marginRight: 10,
        color: GlobalStyles.themeColor,
        borderColor: GlobalStyles.themeColor,
    },
    shopDiscountCon: {
        color: GlobalStyles.themeColor,
    },
    shopRouterView: {},
    shopRouterCon: {
        color: '#888'
    },
    servicesBtnItem: {
        marginLeft: 10,
        width: 30,
        height: 30,
        alignItems: 'flex-end',
        justifyContent: 'center',
        // backgroundColor: '#123',
    },
    shopRouterBtnItem: {
        fontSize: 13,
        color: GlobalStyles.themeColor
    },
});