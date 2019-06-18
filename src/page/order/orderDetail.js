/**
 * 速芽物流商家端 - OrderDetal
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Alert,
    Image,
    Modal,
    Linking,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import {ACTION_MINE, ACTION_FLOW} from '../../constant/EventActions'
import * as wechat from 'react-native-wechat'
import Alipay from 'react-native-yunpeng-alipay'
import NetRequest from '../../util/utilsRequest'
import ModalView from '../../util/utilsDialogs'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import RightButton from '../../component/common/headerRightButton'

const __IOS__ = Platform.OS === 'ios';

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;

export default class OrderDetal extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            showModal: false,
            showCancelModal: false,
            ready: false,
            orderId: params ? params.orderId : '',
            modalVisiable: false,
            orderInfo: {},
            images: [],
            imageIndex: 1,
            MODAL_CONFIG: {
                title: '确认支付',
                modalText: '您确认要支付该订单吗？',
                cancelBtnName: '取消',
                confirmBtnName: '确定',
            },
            fooType: 0,
            canPress: true,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
        this.onBack();
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    showModal = (type = 0) => {
        let MODAL_CONFIG = {};
        switch(type){
            case 0:
                MODAL_CONFIG = {
                    title: '取消提醒',
                    modalText: '取消订单后，将无法恢复，确认要取消吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            case 1:
                MODAL_CONFIG = {
                    title: '接单提醒',
                    modalText: '确认要接受该订单吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            case 2:
                MODAL_CONFIG = {
                    title: '运输提醒',
                    modalText: '您确认到达目的地了吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            case 7:
                MODAL_CONFIG = {
                    title: '取货提醒',
                    modalText: '您确认已经取到货物了吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            case 8:
                MODAL_CONFIG = {
                    title: '收货提醒',
                    modalText: '您确认货物已签收了吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            case -1:
                MODAL_CONFIG = {
                    title: '删除提醒',
                    modalText: '删除后将无法恢复，您确定要删除吗？',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
            default:
                MODAL_CONFIG = {
                    title: '系统提醒',
                    modalText: '来自系统的确认提醒',
                    cancelBtnName: '取消',
                    confirmBtnName: '确定',
                }
                break;
        }
        this.setState({
            fooType: type,
            MODAL_CONFIG: MODAL_CONFIG,
            showModal: !this.state.showModal,
        })
    }

    confirmFoo = (type) => {
        this.showModal(0);
        // console.log(type);
        let api = '/';
        switch(type){
            case 0:
                api = NetApi.orderCancel;
                break;
            case 1:
                api = NetApi.orderAccept;
                break;
            case 2:
                api = NetApi.orderArrival;
                break;
            case 7:
                api = NetApi.orderPicked;
                break;
            case 8:
                api = NetApi.orderSigned;
                break;
            case -1:
                api = NetApi.orderDelete;
                break;
            default:
                api = NetApi.orderCancel;
                break;
        }
        let url = api + this.state.orderId;

        // return console.log(url);
        this.setState({
            canPress: false
        });
        this.netRequest.fetchGet(url)
            .then(result => {
                toastShort(result.msg);
                if (result && result.code == 1) {
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
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

    loadNetData = () => {
        let url = NetApi.orderDetail + this.state.orderId;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code == 1) {
                    this.setState({
                        ready: true,
                        orderInfo: result.data,
                        images: result.data.images,
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    makeCall = (mobile) => {
        let url = 'tel: ' + mobile;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    // console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err)=>{
                // console.log('An error occurred', err)
            });
    }

    renderOrderUserInfo = (type, orderUser) => {
        return (
            <View style={styles.addressDetailView}>
                <View style={styles.addressDetailItemView}>
                    <Text style={styles.addressUserInfo}>{type}人：</Text>
                    <TouchableOpacity
                        // style = {{backgroundColor: '#123'}}
                        onPress={() => this.makeCall(orderUser.phone)}
                    >
                        <Text style={styles.addressUserName}>{orderUser.name} <Text style={styles.addressUserPhone}>{orderUser.phone}</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addressDetailItemView}>
                    <Text style={styles.addressDetailCon}>{type}地址：</Text>
                    <Text style={styles.addressDetailCon}>{orderUser.address}</Text>
                </View>
            </View>
        )
    };

    renderGoodsPic = (data) => {
        // console.log(data);
        let images = data.map((obj, index) => {
            return (
                <TouchableOpacity
                    key={obj+index}
                    onPress = {() => {
                        this.setState({
                            modalVisiable: true,
                            imageIndex: index,
                        })
                    }}
                >
                    <Image source={{uri: obj.url}} style={styles.orderGoodsPic} />
                </TouchableOpacity>
            );
        })
        return images;
    }

    renderOrderButton = (data) => {
        let {canPress} = this.state;
        let Buttons = <View />
        let status = parseInt(data.status);
        switch(status) {
            // 未付款
            case 0:
                Buttons = <View />;
                break;
            // 待接单
            case 1:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {styles.orderDetailBtnItem}
                            onPress = {() => {canPress && this.showModal(0)}}
                        >
                            <Text style={styles.orderDetailBtnName}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}
                            onPress = {() => {canPress && this.showModal(1)}}
                        >
                            <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                            <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认接单</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 运输中
            case 2:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView, {justifyContent: 'flex-end'}]}>
                        <TouchableOpacity
                            style = {[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}
                            onPress = {() => {canPress && this.showModal(2)}}
                        >
                            <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                            <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认抵达</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 待评价
            case 3:
                Buttons = <View />;
                break;
            // 已完成
            case 4:
                Buttons = <View />;
                break;
            // 退款申请中
            case 5:
                Buttons = <View />;
                break;
            // 退款成功
            case 6:
                Buttons = <View />;
                break;
            // 等待取货
            case 7:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {styles.orderDetailBtnItem}
                            onPress = {() => {canPress && this.showModal(0)}}
                        >
                            <Text style={styles.orderDetailBtnName}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}
                            onPress = {() => {canPress && this.showModal(7)}}
                        >
                            <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                            <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认且收货</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 待收货
            case 8:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView, {justifyContent: 'flex-end'}]}>
                        <TouchableOpacity
                            style = {[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}
                            onPress = {() => {canPress && this.showModal(8)}}
                        >
                            <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                            <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认收货</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            default:
                Buttons = <View />;
                break;
        }
        return Buttons;
    }

    renderPayment = (data) => {
        if (!data) {
            return;
        }
        return (
            <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                <View style={styles.orderMoneyInfoItem}>
                    <Text style={styles.orderMoneyInfoTitle}>{data.title}</Text>
                    <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>{data.value}</Text>
                </View>
            </View>
        );
        // type = parseInt(data.pay_class);
        // reBack = parseInt(data.status);
        // let {paymentType} = this.state;
        // if (reBack == 6) {
        //     if (type == 1) {
        //         return (
        //             <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
        //                 <View style={styles.orderMoneyInfoItem}>
        //                     <Text style={styles.orderMoneyInfoTitle}>退款方式</Text>
        //                     <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>退款至微信</Text>
        //                 </View>
        //             </View>
        //         );
        //     } else {
        //         return (
        //             <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
        //                 <View style={styles.orderMoneyInfoItem}>
        //                     <Text style={styles.orderMoneyInfoTitle}>退款方式</Text>
        //                     <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>退款至支付宝</Text>
        //                 </View>
        //             </View>
        //         );
        //     }
        // }
        // if (type === 1) {
        //     return (
        //         <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
        //             <View style={styles.orderMoneyInfoItem}>
        //                 <Text style={styles.orderMoneyInfoTitle}>支付方式</Text>
        //                 <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>微信支付</Text>
        //             </View>
        //         </View>
        //     );
        // } else {
        //     return (
        //         <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
        //             <View style={styles.orderMoneyInfoItem}>
        //                 <Text style={styles.orderMoneyInfoTitle}>支付方式</Text>
        //                 <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>支付宝支付</Text>
        //             </View>
        //         </View>
        //     );
        // }
    }

    renderOrderCargoInfo = (data) => {
        if (!data || data.length < 1) {
            return;
        }
        let cargoInfo = data.map((item, index) => {
            return (
                <View style={styles.orderCargoInfoCon} key={item.id}>
                    <Text style={styles.orderCargoInfoConText}>{item.title}：</Text>
                    <Text style={styles.orderCargoInfoConText}>{item.value}</Text>
                </View>
            );
        })
        return cargoInfo;
    }

    render(){
        let { orderInfo, paymentType, images, imageIndex, ready, modalVisiable, showModal, MODAL_CONFIG, fooType } = this.state;
        let noMarginBottom = orderInfo.status == 0 || orderInfo.status == 3 || orderInfo.status == 4 || orderInfo.status == 5 || orderInfo.status == 6 || orderInfo.status == 9;
        // orderInfo['remark'] = '11111';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'订单详情'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    // rightButton = {(orderInfo.status == 6 || orderInfo.status == 9) ? <RightButton title = {'删除'} submitFoo = {() => this.showModal(-1)} /> : <View />}
                />
                {ready ?
                    <ScrollView style={[GlobalStyles.hasFixedContainer, styles.scrollViewContainer, noMarginBottom && styles.noMarginBottom]}>
                        <View style={[styles.containerItemView, styles.addressInfoView]}>
                            <View style={styles.addressLeftView}>
                                <View style={[GlobalStyles.placeViewIcon, styles.placeViewIcon, GlobalStyles.placeStartIcon]}>
                                    <Text style={GlobalStyles.placeText}>发</Text>
                                </View>
                                <View style={[GlobalStyles.verLine, styles.verLine]} />
                                <View style={[GlobalStyles.placeViewIcon, styles.placeViewIcon, GlobalStyles.placeEndIcon]}>
                                    <Text style={GlobalStyles.placeText}>收</Text>
                                </View>
                            </View>
                            <View style={styles.addressRightView}>
                                {this.renderOrderUserInfo('发货', orderInfo.shipper)}
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                {this.renderOrderUserInfo('收货', orderInfo.receiver)}
                            </View>
                        </View>

                        <View style={[styles.containerItemView, styles.orderInfoView]}>
                            <View style={styles.orderInfoItemView}>
                                <Image source={{uri: orderInfo.images[0].url}} style={styles.OrderInfoImage} />
                                <View style={styles.orderCompanyInfo}>
                                    <View style={[styles.orderCompanyInfoItem, styles.orderStatusView]}>
                                        <Text style={styles.orderCompanyInfoTitle}>订单状态：</Text>
                                        <Text style={[styles.orderCompanyInfoCon, styles.orderStatus]}>{orderInfo.statusName}</Text>
                                    </View>
                                    <View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>订单类型：</Text>
                                        <Text style={[styles.orderCompanyInfoCon, {alignItems: 'flex-start'}]} numberOfLines={2}>{orderInfo.style}</Text>
                                    </View>
                                    <View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>物流订单号：</Text>
                                        <Text style={styles.orderCompanyInfoCon}>{orderInfo.code}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={[styles.orderCargoInfoView]}>
                                <View style={styles.orderCargoInfoItem}>
                                    {this.renderOrderCargoInfo(orderInfo.cargo_info)}
                                    {1 > 2 && <View>
                                        {orderInfo.cargo_name ? <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>货物名称：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.cargo_name}</Text>
                                        </View> : null }
                                        <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>路线：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.service}</Text>
                                        </View>
                                        <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>班次：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.time}</Text>
                                        </View>
                                        {orderInfo.weight ? <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>重量：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.weight}kg</Text>
                                        </View> : null}
                                        {orderInfo.num ? <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>数量：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.num}</Text>
                                        </View> : null}
                                        {orderInfo.volume ? <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>体积：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.volume}m³</Text>
                                        </View> : null}
                                        {orderInfo.cate ? <View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>货物类型：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.cate}</Text>
                                        </View> : null}
                                        {orderInfo.carVisible && 1 > 2 &&<View style={styles.orderCargoInfoCon}>
                                            <Text style={styles.orderCargoInfoConText}>代取/送服务车型：</Text>
                                            <Text style={styles.orderCargoInfoConText}>{orderInfo.serviceCar}</Text>
                                        </View>}
                                    </View>}
                                </View>
                            </View>
                        </View>

                        <View style={[styles.containerItemView, styles.orderGoodsPicItemView]}>
                            <View style={styles.orderInfoItemView}>
                                <Text style={styles.orderCompanyInfoTitle}>物品图品</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={[styles.orderGoodsPicView]}>
                                {this.renderGoodsPic(orderInfo.images)}
                            </View>
                        </View>
                        {this.renderPayment(orderInfo.pay_status)}

                        <View style={[styles.containerItemView, styles.orderRemarkInfoView]}>
                            <View style={styles.orderInfoItemView}>
                                <Text style={styles.orderCompanyInfoTitle}>备注信息</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={[styles.orderRemarkInfoView]}>
                                <View style={styles.orderRemarkInfoItem}>
                                    <Text style={styles.orderCargoInfoConText}>{orderInfo.remark || '暂无备注信息'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>订单总价：</Text>
                                <Text style={styles.orderMoneyInfoCon}>¥ {parseFloat(orderInfo.price).toFixed(2)}</Text>
                            </View>
                            {orderInfo.deliveryFee && orderInfo.deliveryFee.map((obj, index) => {
                                if (obj.is_selected !== 1) {
                                    return;
                                }
                                return (
                                    <View style={styles.orderMoneyInfoItem} key={index}>
                                        <Text style={styles.orderMoneyInfoTitle}>小件{obj.name}：</Text>
                                        <Text style={styles.orderMoneyInfoCon}>¥ {parseFloat(obj.value).toFixed(2)}</Text>
                                    </View>
                                );
                            })}
                            {orderInfo.coupon > 0 && <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>优惠券：</Text>
                                <Text style={styles.orderMoneyInfoCon}>¥ -{parseFloat(orderInfo.coupon).toFixed(2)}</Text>
                            </View>}
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>订单金额：</Text>
                                <Text style={styles.orderMoneyInfoConNum}>¥ {parseFloat(orderInfo.relprice).toFixed(2)}</Text>
                            </View>
                        </View>
                    </ScrollView>
                    : <ActivityIndicatorItem />
                }
                {ready && this.renderOrderButton(orderInfo)}

                {modalVisiable &&
                    <Modal
                        visible={modalVisiable}
                        transparent={true}
                        onRequestClose={()=> {
                           this.setState({
                               modalVisiable: false,
                           });
                       }}
                    >
                        <ImageViewer
                            imageUrls={images}
                             failImageSource={{
                                url: GlobalStyles.noPicture,
                                width: GlobalStyles.width,
                                height: GlobalStyles.width,
                            }}
                            saveToLocalByLongPress = {false}
                            index={imageIndex}
                            onClick = {() => {
                                this.setState({
                                    modalVisiable: false,
                                });
                            }}
                        />
                    </Modal>
                }
                {showModal &&
                    <ModalView
                        show = {showModal}
                        title = {MODAL_CONFIG.title}
                        contentText = {MODAL_CONFIG.modalText}
                        cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.showModal()}
                        confirmFoo = {() => this.confirmFoo(fooType)}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    scrollViewContainer: {
        marginBottom: 80,
    },
    noMarginBottom: {
        marginBottom: 0,
    },
    containerItemView: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addressInfoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressLeftView: {
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeViewIcon: {
        marginRight: 0,
        marginVertical: 20,
    },
    verLine: {
        height: 40,
    },
    horLine: {
        marginVertical: 10,
    },
    addressRightView: {
        flex: 1,
    },
    addressDetailView: {
        height: 60,
    },
    addressDetailItemView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressUserInfo: {
        fontSize: 18,
        color: '#333',
    },
    addressUserName: {
        fontSize: 16,
    },
    addressUserPhone: {
        fontSize: 14,
        color: '#555',
    },
    addressDetailCon: {
        fontSize: 14,
        color: '#555',
    },
    addressDetailRight: {
        width: 80,
        alignItems: 'center',
    },
    addressDetailRightCon: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    orderInfoItemView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    OrderInfoImage: {
        width: GlobalStyles.width * 0.2,
        height: 80,
        marginRight: 15,
        resizeMode: 'cover',
    },
    orderCompanyInfo: {
        flex: 1,
        height: 80,
        justifyContent: 'space-around',
    },
    orderCompanyInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderStatusView: {
        justifyContent: 'space-between',
    },
    orderCompanyInfoTitle: {
        fontSize: 15,
        color: '#333',
    },
    orderCompanyInfoCon: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        // backgroundColor: '#123'
    },
    orderStatus: {
        fontSize: 18,
        textAlign: 'right',
        color: GlobalStyles.themeColor,
    },
    orderCargoInfoView: {},
    orderCargoInfoItem: {
        flex: 1,
        // backgroundColor: '#123',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderCargoInfoCon: {
        flexDirection: 'row',
        alignItems: 'center',
        width: GlobalStyles.width > 330 ? (GlobalStyles.width - 80) / 2 : GlobalStyles.width,
    },
    orderCargoInfoConText: {
        // flex: 1,
        fontSize: 13,
        color: '#666',
        lineHeight: 25,
    },
    orderMoneyInfoItem: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    orderMoneyInfoTitle: {
        color: '#555',
    },
    orderMoneyInfoCon: {
        color: '#555',
    },
    orderMoneyInfoConNum: {
        fontSize: 16,
        color: '#f60',
    },
    orderDetailBtnItem: {},
    orderDetailBtnName: {},

    orderDetailBtnView: {
        height: 80,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    orderDetailBtnItem: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderColor: GlobalStyles.themeColor,
        width: (GlobalStyles.width - 100) / 2,
    },
    orderDetailBtnItemCurrent: {
        borderWidth: 0,
    },
    orderDetailBtnName: {
        fontSize: 14,
        color: GlobalStyles.themeColor,
    },
    orderDetailBtnNameCurrent: {
        color: '#fff',
    },

    orderItemBtnView: {
        height: 50,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btnItemView: {
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: '#777',
    },
    btnItemViewCur: {
        borderColor: GlobalStyles.themeColor,
    },
    btnItemName: {
        color: '#555',
        fontSize: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    btnItemNameCur: {
        color: GlobalStyles.themeColor,
    },

    chargePayTypeView: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    viewTitle: {
        height: 30,
        fontSize: 15,
        color: '#333',
    },
    chargeTypeItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    chargeTypeTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitleIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    orderGoodsPicItemView: {},
    orderGoodsPicView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginLeft: -10,
        justifyContent: 'flex-start'
    },
    orderGoodsPic: {
        width: (GlobalStyles.width - 55) / 3,
        height: (GlobalStyles.width - 100) / 3,
        marginLeft: 10,
    },
});
