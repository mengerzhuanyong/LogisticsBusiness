/**
 * 速芽物流商家端 - MineDiscount
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
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import OrderItemView from '../../component/order/orderItem'

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;

export default class MineDiscount extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            store: global.store.storeData,
            discountInfo: '',
            money: '',
            canBack: false,
        }
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
        let url = NetApi.storeDiscount;
        let data = {
            sid: this.state.store.sid,
            is_store: this.state.store.isStore,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    this.setState({
                        discountInfo: result.data.disinfo,
                        money: result.data.money,
                    })
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    submit = () => {
        let url = NetApi.storeSetDiscount;
        let { store, discountInfo, money } = this.state;
        let data = {
            sid: store.sid,
            disinfo: discountInfo,
            money: money,
        };
        if (discountInfo > 2 && money == '') {
            toastShort('请输入价格', 'center');
            return;
        }
        this.setState({
            canPress: false
        });
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    toastShort('提交成功');
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 1000);
                } else {
                    toastShort(result.msg);
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
                // console.log('登录出错', error);
            })
    }

    render(){
        let { discountInfo, money, store } = this.state;
        let defaultMoney = discountInfo > 2 ? money : null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'优惠信息'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {store.isStore == 1 ?
                    <View style={styles.containerView}>
                        <View style={styles.paymentMethodView}>
                            <TouchableOpacity
                                style = {styles.paymentMethodItem}
                                onPress = {() => {
                                    this.setState({
                                        money: '0',
                                        discountInfo: '1',
                                    })
                                }}
                            >
                                <View style={styles.paymentMethodTitleView}>
                                    <Text style={styles.paymentMethodTitle}>免费上门取件</Text>
                                </View>
                                <Image source={discountInfo == '1' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.paymentMethodItem}
                                onPress = {() => {
                                    this.setState({
                                        money: '0',
                                        discountInfo: '2',
                                    })
                                }}
                            >
                                <View style={styles.paymentMethodTitleView}>
                                    <Text style={styles.paymentMethodTitle}>免费上门取送件</Text>
                                </View>
                                <Image source={discountInfo == '2' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.paymentMethodItem}
                                onPress = {() => {
                                    this.setState({
                                        discountInfo: '3',
                                    })
                                }}
                            >
                                <View style={styles.paymentMethodTitleView}>
                                    <Text style={styles.paymentMethodTitle}>满</Text>
                                    <TextInput
                                        style = {styles.inputItemCon}
                                        placeholder = "请输入"
                                        defaultValue = {discountInfo == 3 ? money : null}
                                        keyboardType = {'numeric'}
                                        placeholderTextColor = '#888'
                                        underlineColorAndroid = {'transparent'}
                                        onChangeText = {(text)=>{
                                            this.setState({
                                                money: text,
                                                discountInfo: '3'
                                            })
                                        }}
                                    />
                                    <Text style={styles.paymentMethodTitle}>元 上门取件</Text>
                                </View>
                                <Image source={discountInfo == '3' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.paymentMethodItem}
                                onPress = {() => {
                                    this.setState({
                                        discountInfo: '4',
                                    })
                                }}
                            >
                                <View style={styles.paymentMethodTitleView}>
                                    <Text style={styles.paymentMethodTitle}>满</Text>
                                    <TextInput
                                        style = {styles.inputItemCon}
                                        placeholder = "请输入"
                                        defaultValue = {discountInfo == 4 ? money : null}
                                        keyboardType = {'numeric'}
                                        placeholderTextColor = '#888'
                                        underlineColorAndroid = {'transparent'}
                                        onChangeText = {(text)=>{
                                            this.setState({
                                                money: text,
                                                discountInfo: '4'
                                            })
                                        }}
                                    />
                                    <Text style={styles.paymentMethodTitle}>元 上门取送件</Text>
                                </View>
                                <Image source={discountInfo == '4' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style = {[GlobalStyles.btnView, styles.btnView]}
                            onPress = {()=>this.submit()}
                        >
                            <Text style={[GlobalStyles.btnItem, styles.btnItem]}>确认修改</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.contentView, styles.flexRow]}>
                        <Text style={styles.contentText}>优惠形式:</Text>
                        <Text style={styles.contentTextCon}>{discountInfo}</Text>
                    </View>
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
    contentView: {
        // flex: 1,
        padding: 15,
        backgroundColor: '#fff',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contentText: {
        fontSize: 14,
        color: '#333',
    },
    contentTextCon: {
        color: '#666',
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
    inputItemCon: {
        width: 80,
        fontSize: 15,
        textAlign: 'center',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color: GlobalStyles.themeColor,
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