/**
 * 速芽物流商家端 - Flow
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

export default class Flow extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    submitPayment = () => {

    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'Test'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <ScrollView style={GlobalStyles.hasFixedContainer}>
                    <View style={[styles.containerItemView, styles.addressInfoView]}>
                        <View style={styles.addressLeftView}>
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeStartIcon, styles.placeViewIcon]} />
                            <View style={[GlobalStyles.verLine, styles.verLine]} />
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeEndIcon, styles.placeViewIcon]} />
                        </View>
                        <View style={styles.addressRightView}>
                            <View style={styles.addressDetailView}>
                                <View style={styles.addressDetailLeft}>
                                    <Text style={styles.addressUserInfo}>大梦 15066886007</Text>
                                    <Text style={styles.addressDetailCon}>黄岛区光顾软件园</Text>
                                </View>
                                <View style={[GlobalStyles.verLine, styles.verLine]} />
                                <View style={styles.addressDetailRight}>
                                    <Text style={styles.addressDetailRightCon}>地址簿</Text>
                                </View>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.addressDetailView}>
                                <View style={styles.addressDetailLeft}>
                                    <Text style={styles.addressUserInfo}>您要发去哪里？</Text>
                                    <Text style={styles.addressDetailCon}>请输入收获地址</Text>
                                </View>
                                <View style={[GlobalStyles.verLine, styles.verLine]} />
                                <View style={styles.addressDetailRight}>
                                    <Text style={styles.addressDetailRightCon}>地址簿</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.cargoInfoView]}>
                        <View style={styles.containerItemTitleView}>
                            <Text style={styles.containerItemTitleLeft}>添加货物信息</Text>
                            <View style={styles.containerItemTitleRight}>
                                <View style={styles.cargoTypeItem}>
                                    <Image source={GlobalIcons.icon_checked} style={GlobalStyles.checkedIcon} />
                                    <Text style={styles.cargoTypeItemCon}>单类货品</Text>
                                </View>
                                <View style={styles.cargoTypeItem}>
                                    <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                                    <Text style={styles.cargoTypeItemCon}>多类货品</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>请选择物品体积</Text>
                            </View>
                            <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>请选择物品数量</Text>
                            </View>
                            <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>请选物品重量</Text>
                            </View>
                            <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>请选择物品类型</Text>
                            </View>
                            <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <TouchableOpacity style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                                <Text style={styles.cargoAttributesTitle}>包车</Text>
                            </View>
                            <Image source={GlobalIcons.icon_checked} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.containerItemView, styles.cargoAlbumView]}>
                        <View style={styles.containerItemTitleView}>
                            <Text style={styles.containerItemTitleLeft}>添加货物照片</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.containerItemConView}>
                            <TouchableOpacity style={GlobalStyles.uploadView}>
                                <Image source={GlobalIcons.images_bg_upload} style={GlobalStyles.uploadIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.deliveryCarView]}>
                        <View style={styles.containerItemTitleView}>
                            <Text style={styles.containerItemTitleLeft}>代取/送服务车型</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={[styles.containerItemConView, styles.deliveryCarConView]}>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_1_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>摩托车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_2_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>私家车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_3_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>小型面包车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_4_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>小型货车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_5_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>中型货车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_6_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>大型货车</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryCarItem} >
                                <Image source={GlobalIcons.icon_car_7_2} style={styles.deliveryCarIcon} />
                                <Text style={styles.deliveryCarName}>大型厢车</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={[styles.containerItemConView, styles.deliveryTypeView]}>                            
                            <TouchableOpacity  style={styles.deliveryTypeItem} >
                                <Text style={styles.deliveryTypeName}>代取件</Text>
                                <View style={[GlobalStyles.verLine, styles.deliveryTypeVerLine]} />
                                <View style={[styles.deliveryTypeIconView]}>
                                    <Image source={GlobalIcons.icon_car_6_2} style={styles.deliveryTypeIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.deliveryTypeItem} >
                                <Text style={styles.deliveryTypeName}>代送件</Text>
                                <View style={[GlobalStyles.verLine, styles.deliveryTypeVerLine]} />
                                <View style={[styles.deliveryTypeIconView, styles.deliveryTypeIconViewCur]}>
                                    <Image source={GlobalIcons.icon_car_7_2} style={styles.deliveryTypeIcon} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.deliveryCarView]}>
                        <View style={styles.containerItemTitleView}>
                            <Text style={styles.containerItemTitleLeft}>是否商家区间，资费与商家协商</Text>
                            <View style={styles.containerItemTitleRight}>
                                <Image source={GlobalIcons.icon_checked} style={GlobalStyles.checkedIcon} />
                            </View>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.containerItemConView}>
                            <TextInput
                                style = {styles.inputItemCon}
                                multiline = {true}
                                placeholder = "附加事宜..."
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        mobile: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    
                    <View style={[styles.containerItemView, styles.deliveryCouponView]}>
                        <TouchableOpacity style={styles.containerItemTitleView}>
                            <View style={styles.containerItemTitleLeft}>
                                <Text style={styles.containerItemTitle}>选择优惠券</Text>
                            </View>
                            <View style={styles.containerItemTitleRight}>
                                <Text style={[styles.containerItemTitleConText, styles.deliveryCouponConText]}>¥ 2.00 优惠券</Text>
                                <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={[styles.containerItemView, styles.deliveryTotalMoneyView]}>
                        <View style={styles.containerItemTitleView}>
                            <View style={styles.containerItemTitleLeft}>
                                <Text style={styles.containerItemTitle}>总计费用</Text>
                            </View>
                            <View style={styles.containerItemTitleRight}>
                                <Text style={[styles.containerItemTitleConText, styles.deliveryTotalMoneyText]}>¥ 50.00</Text>
                                <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                            </View>
                        </View>
                    </View>
                    
                    <View style={[styles.containerItemView, styles.flowProtocolView]}>
                        <TouchableOpacity style={styles.flowProtocolBtnView}>
                            <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                            <Text style={styles.flowProtocolBtnCon}>我已阅读并同意<Text style={styles.flowProtocolName}>《服务协议》</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, styles.btnView]}
                        onPress = {()=>this.submitPayment()}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>确认发货</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    scrollContainer: {
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
        height: 60,
    },
    horLine: {
        marginVertical: 10,
    },
    addressRightView: {
        flex: 1,
    },
    addressDetailView: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#f60',
        justifyContent: 'space-between',
    },
    addressDetailLeft: {
        flex: 1,
        height: 80,
        justifyContent: 'space-around',
    },
    addressUserInfo: {
        fontSize: 16,
        color: '#333',
    },
    addressDetailCon: {
        fontSize: 14,
        color: '#666',
    },
    addressDetailRight: {
        width: 80,
        alignItems: 'center',
    },
    addressDetailRightCon: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    cargoInfoView: {},
    containerItemTitleView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerItemTitleLeft: {},
    containerItemTitleRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cargoTypeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    cargoTypeItemCon: {
        marginLeft: 5,
    },
    paymentMethodItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentMethodIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    cargoAttributesTitle: {
        color: '#666',
    },
    deliveryCarConView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    deliveryCarItem: {
        marginVertical: 5,
        alignItems: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    deliveryCarIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    deliveryCarName: {
        color: '#666',
    },
    deliveryTypeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deliveryTypeItem: {
        height: 60,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: GlobalStyles.themeColor,
        width: (GlobalStyles.width - 60) / 2,
    },
    deliveryTypeName: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    deliveryTypeVerLine: {
        height: 60,
        backgroundColor: GlobalStyles.themeColor,
    },
    deliveryTypeIconView: {
        width: 70,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deliveryTypeIconViewCur: {
        backgroundColor: GlobalStyles.themeColor,
    },
    deliveryTypeIcon: {
        width: 60,
        resizeMode: 'contain'
    },
    inputItemCon: {
        height: 100,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    deliveryCouponView: {},
    deliveryCouponTitle: {},
    deliveryCouponConView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryCouponConText: {
        fontSize: 15,
    },
    deliveryTotalMoneyText: {
        fontSize: 18,
        color: '#f60',
    },
    flowProtocolView: {
        backgroundColor: 'transparent',
    },
    flowProtocolBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flowProtocolBtnCon: {
        marginLeft: 10,
    },
    flowProtocolName: {
        color: GlobalStyles.themeColor
    },
});
