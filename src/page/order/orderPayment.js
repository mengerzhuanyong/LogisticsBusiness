/**
 * 速芽物流商家端 - OrderPayment
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import OrderItemView from '../../component/order/orderItem'

export default class OrderPayment extends Component {

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
                <View style={styles.orderPayTitleView}>
                    <View style={styles.orderPayTitle}>
                        <Text style={styles.orderPayTitleName}>总计费用：</Text>
                    </View>
                    <View style={styles.orderPayTitleCon}>
                        <Text style={styles.orderPaymentNum}>50.00 <Text style={styles.orderPaymentUnit}>元</Text></Text>

                    </View>
                </View>
                <View style={styles.paymentMethodView}>
                    <TouchableOpacity style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodTitle}>微信支付</Text>
                        </View>
                        <Image source={GlobalIcons.icon_checked} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodTitle}>支付宝支付</Text>
                        </View>
                        <Image source={GlobalIcons.icon_check} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                </View>
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, styles.btnView]}
                        onPress = {()=>this.submitPayment()}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>确认支付</Text>
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
    orderPayTitleView: {
        height: 70,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    orderPayTitleName: {
        fontSize: 18,
        color: '#444',
    },
    orderPayTitleCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderPaymentNum: {
        fontSize: 26,
        textAlignVertical: 'bottom',
        color: GlobalStyles.themeColor,
    },
    orderPaymentUnit: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5,
    },
    paymentMethodView: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
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
    fixedBtnView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    btnView: {
        borderRadius: 5,
    },
    btnItem: {
        fontSize: 18,
    },
});