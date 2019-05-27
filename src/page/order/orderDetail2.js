/**
 * 速芽物流商家端 - OrderDetail
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

const __IOS__ = Platform.OS === 'ios';

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;
const PAY_MODAL_CONFIG = {
    title: '确认支付',
    modalText: '您确认要支付该订单吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};
const CANCEL_MODAL_CONFIG = {
    title: '确认取消',
    modalText: '您确认要取消该订单吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

const shipper = {
    "id": 1,
    "uid": 1,
    "style": 1,
    "name": "大梦",
    "phone": "15066886007",
    "address": "青岛光谷软件园27号楼",
    "createtime": ""
};
const receiver = {
    "id": 2,
    "uid": 1,
    "style": 2,
    "name": "投道科技",
    "phone": "15066886666",
    "address": "青岛光谷软件园27号楼",
    "createtime": ""
};
export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            showPayModal: false,
            showCancelModal: false,
            ready: false,
            orderId: params ? params.orderId : '',
            modalVisiable: false,
            orderInfo: {},
            images: [],
            imageIndex: 1,
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

    loadNetData = () => {
        let url = NetApi.orderDetail + this.state.orderId;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code == 1) {
                    this.setState({
                        orderInfo: result.data
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    renderOrderUserInfo = (type, orderUser) => {
        return (
            <View style={styles.addressDetailView}>
                <View style={styles.addressDetailItemView}>
                    <Text style={styles.addressUserInfo}>{type}人：</Text>
                    <Text style={styles.addressUserName}>{orderUser.name} <Text style={styles.addressUserPhone}>{orderUser.phone}</Text></Text>
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
                    <Image source={GlobalIcons.banner1} style={styles.orderGoodsPic} />
                </TouchableOpacity>
            );
        })
        return images;
    }

    render(){
        let { images, imageIndex } = this.state;
        // console.log(GlobalStyles.noPicture);
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'订单详情'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <ScrollView style={[GlobalStyles.hasFixedContainer, styles.scrollViewContainer]}>
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
                            {this.renderOrderUserInfo('发货', shipper)}
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            {this.renderOrderUserInfo('收货', receiver)}
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderInfoView]}>
                        <View style={styles.orderInfoItemView}>
                            <Image source={GlobalIcons.banner1} style={styles.OrderInfoImage} />
                            <View style={styles.orderCompanyInfo}>
                                <View style={[styles.orderCompanyInfoItem, styles.orderStatusView]}>
                                    <Text style={styles.orderCompanyInfoTitle}>订单状态：</Text>
                                    <Text style={[styles.orderCompanyInfoCon, styles.orderStatus]}>待接单</Text>
                                </View>
                                <View style={styles.orderCompanyInfoItem}>
                                    <Text style={styles.orderCompanyInfoTitle}>路线：</Text>
                                    <Text style={styles.orderCompanyInfoCon}>黄岛 - 上海</Text>
                                </View>
                                <View style={styles.orderCompanyInfoItem}>
                                    <Text style={styles.orderCompanyInfoTitle}>班次：</Text>
                                    <Text style={styles.orderCompanyInfoCon}>10-11点班次</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={[styles.orderCargoInfoView]}>
                            <View style={styles.orderCargoInfoItem}>
                                <View style={styles.orderCargoInfoCon}>
                                    <Text style={styles.orderCargoInfoConText}>重量：</Text>
                                    <Text style={styles.orderCargoInfoConText}>20kg</Text>
                                </View>
                                <View style={styles.orderCargoInfoCon}>
                                    <Text style={styles.orderCargoInfoConText}>数量：</Text>
                                    <Text style={styles.orderCargoInfoConText}>8</Text>
                                </View>
                            </View>
                            <View style={styles.orderCargoInfoItem}>
                                <View style={styles.orderCargoInfoCon}>
                                    <Text style={styles.orderCargoInfoConText}>体积：</Text>
                                    <Text style={styles.orderCargoInfoConText}>30m³</Text>
                                </View>
                                <View style={styles.orderCargoInfoCon}>
                                    <Text style={styles.orderCargoInfoConText}>货物类型：</Text>
                                    <Text style={styles.orderCargoInfoConText}>普通</Text>
                                </View>
                            </View>
                            <View style={styles.orderCargoInfoItem}>
                                <View style={styles.orderCargoInfoCon}>
                                    <Text style={styles.orderCargoInfoConText}>代取/送服务车型：</Text>
                                    <Text style={styles.orderCargoInfoConText}>私家车</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderGoodsPicItemView]}>
                        <View style={styles.orderInfoItemView}>
                            <Text style={styles.orderCompanyInfoTitle}>物品图品</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={[styles.orderGoodsPicView]}>
                            {this.renderGoodsPic(images)}
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderRemarkInfoView]}>
                        <View style={styles.orderInfoItemView}>
                            <Text style={styles.orderCompanyInfoTitle}>备注信息</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={[styles.orderRemarkInfoView]}>
                            <View style={styles.orderRemarkInfoItem}>
                                <Text style={styles.orderCargoInfoConText}>客户备注，客户备注，客户备注，客户备注，客户备注，客户备注，客户备注！</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                        <View style={styles.orderMoneyInfoItem}>
                            <Text style={styles.orderMoneyInfoTitle}>订单总价：</Text>
                            <Text style={styles.orderMoneyInfoCon}>50.00</Text>
                        </View>
                        <View style={styles.orderMoneyInfoItem}>
                            <Text style={styles.orderMoneyInfoTitle}>优惠券：</Text>
                            <Text style={styles.orderMoneyInfoCon}>-0.00</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.orderMoneyInfoItem}>
                            <Text style={styles.orderMoneyInfoTitle}>实付金额：</Text>
                            <Text style={styles.orderMoneyInfoConNum}>¥ 50.00</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                    <TouchableOpacity style={styles.orderDetailBtnItem}>
                        <Text style={styles.orderDetailBtnName}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}>
                        <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                        <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认订单</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={this.state.modalVisiable} transparent={true}>
                    <ImageViewer
                        imageUrls={images}
                         failImageSource={{
                            url: GlobalStyles.noPicture,
                            width: GlobalStyles.width,
                            height: GlobalStyles.width,
                        }}
                        index={imageIndex}
                        onClick = {() => {
                            this.setState({
                                modalVisiable: false,
                            })
                        }}
                    />
                </Modal>
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
        marginBottom: 90,
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
        width: 80,
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
        fontSize: 15,
        color: '#333',
    },
    orderStatus: {
        fontSize: 18,
        color: GlobalStyles.themeColor,
    },
    orderCargoInfoView: {},
    orderCargoInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderCargoInfoCon: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (GlobalStyles.width - 80) / 2,
    },
    orderCargoInfoConText: {
        fontSize: 14,
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
    orderDetailBtnView: {
        height: 80,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    orderGoodsPicItemView: {},
    orderGoodsPicView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    orderGoodsPic: {
        width: GlobalStyles.width / 4,
        height: GlobalStyles.width / 4,
    },
});
