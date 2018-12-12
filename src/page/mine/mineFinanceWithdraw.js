/**
 * 速芽物流商家端 - MineFinanceWithDraw
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

export default class MineFinanceWithDraw extends Component {

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

    submitWithdraw = () => {
        let { store, money, alipayAccount, alipayName, minMoney } = this.state;
        // console.log(money);
        let url = NetApi.withdraw;
        let data = {
            sid: store.sid,
            money: money,
            name: alipayName,
            aliaccount: alipayAccount,
        };
        if (alipayAccount == '') {
            toastShort('请输入支付宝账号');
            return;
        }
        if (alipayName == '') {
            toastShort('请输入支付宝账户姓名');
            return;
        }
        if (money == '') {
            toastShort('请输入提现金额');
            return;
        }
        money = parseFloat(money).toFixed(2);
        minMoney = parseFloat(minMoney).toFixed(2);
        let status =  money - minMoney;
        // console.log(money, minMoney, status);
        if (status < 0) {
            let msg = '最低提现金额为' + minMoney + '元，请重新输入';
            toastShort(msg);
            return;
        }
        // return;
        this.setState({
            canPress: false
        })
        // console.log(data);
        // return;
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log(result);
                toastShort(result.msg);
                if (result && result.code == 1 ) {
                    this.timer = setTimeout(() => {
                        this.props.navigation.navigate('MineFinanceWithdrawSuccess');
                    }, 500)
                } else {
                    this.setState({
                        canPress: true
                    });
                }
            })
            .catch( error => {
                toastShort('error');
                this.setState({
                    canPress: true
                });
            })
    };


    render(){
        const { money, allMoney, minMoney } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'申请提现'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView>
                    <View style={styles.mineTopContainer}>
                        <View style={styles.accountInfoItem}>
                            {/*<Text style={styles.accountTitle}>支付宝账号</Text>*/}
                            <TextInput
                                style = {[styles.inputItemCon, styles.accountInput]}
                                placeholder = "请输入支付宝账号"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                keyboardType = {'email-address'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        alipayAccount: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.accountInfoItem}>
                            {/*<Text style={styles.accountTitle}>账户姓名</Text>*/}
                            <TextInput
                                style = {[styles.inputItemCon, styles.accountInput]}
                                placeholder = "请输入账户姓名"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                // keyboardType = {'numeric'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        alipayName: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.mineMiddleContainer}>
                        <Text style={styles.containerTitle}>提现金额</Text>
                        <View style={styles.containerContent}>
                            <Text style={styles.moneyIcon}>¥</Text>
                            <TextInput
                                value = {money}
                                style = {styles.inputItemCon}
                                placeholder = "输入提现金额"
                                placeholderTextColor = '#fff'
                                underlineColorAndroid = {'transparent'}
                                keyboardType = {'numeric'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        money: text
                                    });
                                }}
                            />
                            {money !== '' && <Text
                                style = {GlobalStyles.clearInputBtn}
                                onPress = {() => {
                                    this.setState({
                                        money: '',
                                    })
                                }}
                            >x</Text>}
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.containerBotView}>
                            <Text style={[styles.leftTitle, styles.containerTitle]}>可用余额 {parseFloat(allMoney).toFixed(2)}元</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    let status = parseFloat(allMoney).toFixed(2) - parseFloat(minMoney).toFixed(2);
                                    if (status >= 0) {
                                        this.setState({
                                            money: parseFloat(allMoney).toFixed(2)
                                        });
                                    } else {
                                        let msg = '余额不足' + minMoney + '元，无法提交申请';
                                        toastShort(msg, 'center');
                                    }
                                }}
                            >
                                <Text style={styles.rightTitle}>全部提现</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, money == '' && styles.btnItemView]}
                        onPress = {() => this.submitWithdraw()}
                        activeOpacity = {money == '' ? 1 : 0.7}
                    >
                        <Text style={[GlobalStyles.btnItem, money == '' && styles.btnItemName]}>立即提交申请</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {
        marginLeft: 20,
        marginVertical: 5,
    },
    mineTopContainer: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    accountInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountTitle: {
        fontSize: 14,
        color: '#555',
    },
    accountInput: {
        flex: 1,
        fontSize: 14,
    },
    mineMiddleContainer: {
        padding: 15,
        backgroundColor: '#fff',
    },
    containerTitle: {
        color: '#666',
        fontSize: 15,
    },
    containerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#f50',
    },
    moneyIcon: {
        fontSize: 25,
        color: '#333',
    },
    inputItemCon: {
        flex: 1,
        height: 60,
        fontSize: 30,
        color: '#333',
        marginLeft: 10,
        textAlignVertical: 'bottom',
        // backgroundColor: '#ddd',
    },
    containerBotView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    leftTitle: {},
    rightTitle: {
        color: GlobalStyles.themeColor,
    },
    btnItemView: {
        backgroundColor: '#ddd',
    },
    btnItemName: {
        color: '#888'
    },
});
