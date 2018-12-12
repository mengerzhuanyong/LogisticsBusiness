/**
 * 速芽物流商家端 - MineFinanceWithDrawSuccess
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import MineCouponItem from '../../component/mine/mineCouponItem'
import BusinessItem from '../../component/common/businessItem'
import FinanceItem from '../../component/common/financeItem'
import NavigatorItem from '../../component/mine/navigatorItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineFinanceWithDrawSuccess extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            store: global.store.storeData,
            money: '',
            alipayName: '',
            alipayAccount: '',
            allMoney: params ? params.accountMoney : '',
            minMoney: params ? params.minMoney : '',
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

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {

    };

    showActionSheet = () => {
        // console.log('show');
    };

    submitFoo = () => {
    };


    render(){
        const { money, allMoney, minMoney } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'申请提现'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.messageView}>
                    <View style={styles.messageItemView}>
                        <View style={styles.messageItemLeftView}>
                            <Image source={GlobalIcons.icon_checked2} style={styles.messageIcon} />
                        </View>
                        <View style={styles.messageItemRightView}>
                            <Text style={[styles.messageItemRightCon, {color: GlobalStyles.themeColor}]}>发起提现申请</Text>
                        </View>
                    </View>
                    <View style={styles.messageItemView}>
                        <View style={styles.messageItemLeftView}>
                            <View style={[GlobalStyles.verLine, styles.verLine]} />
                        </View>
                    </View>
                    <View style={styles.messageItemView}>
                        <View style={styles.messageItemLeftView}>
                            <Image source={GlobalIcons.icon_watch} style={[styles.messageIcon, styles.messageIconLarge]} />
                        </View>
                        <View style={styles.messageItemRightView}>
                            <Text style={styles.messageItemRightCon}>银行处理中，</Text>
                            <Text style={styles.messageItemRightCon}>48小时内到账</Text>
                        </View>
                    </View>
                    <View style={styles.messageItemView}>
                        <View style={styles.messageItemLeftView}>
                            <View style={[GlobalStyles.verLine, styles.verLine]} />
                        </View>
                    </View>
                    <View style={styles.messageItemView}>
                        <View style={styles.messageItemLeftView}>
                            <Image source={GlobalIcons.icon_money} style={styles.messageIcon} />
                        </View>
                        <View style={styles.messageItemRightView}>
                            <Text style={styles.messageItemRightCon}>到账成功</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style = {[GlobalStyles.btnView, styles.fixBtnView]}
                    onPress = {() => {
                        this.props.navigation.popToTop();
                    }}
                    activeOpacity = {money == '' ? 1 : 0.7}
                >
                    <Text style={[GlobalStyles.btnItem, styles.btnItemName]}>完成</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageView: {
        marginTop: 40,
    },
    messageItemView: {
        marginHorizontal: 40,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    messageItemLeftView: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verLine: {
        height:  50,
        marginVertical: 5,
        backgroundColor: '#ddd',
    },
    messageIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    messageIconLarge: {
        width: 40,
        height: 40,
    },
    messageItemRightView: {},
    messageItemRightCon: {
        fontSize: 15,
        color: '#555',
    },
    horLine: {
        marginLeft: 20,
        marginVertical: 5,
    },
    fixBtnView: {
        position: 'absolute',
        bottom: 40,
    },
    btnItemView: {
        backgroundColor: '#ddd',
    },
    btnItemName: {
        fontSize: 16,
    },
});
