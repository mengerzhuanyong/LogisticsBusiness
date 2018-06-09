/**
 * 速芽物流商家端 - MineStoreSetting
 * https://menger.me
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

export default class MineStoreSetting extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            store: global.store.storeData,
            features: [
                {name: '零担', value: '1'},
                {name: '整车', value: '0'},
                {name: '冷藏', value: '0'},
                {name: '国际', value: '0'},
            ],
            deliveryFee: [
                {name: '取件费', value: ''},
                {name: '送件费', value: ''},
            ],
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.submit(0);
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

    submit = (submit) => {
        let url = NetApi.mineStoreSetting;
        let { store, features, deliveryFee } = this.state;
        let data = {
            sid: store.sid,
            features,
            deliveryFee,
            submit,
        };
        this.setState({
            canPress: false
        });
        this.netRequest.fetchPost(url, data, true)
            .then( result => {
                if (result && result.code === 1) {
                    if (submit === 1) {
                        toastShort(result.msg);
                        this.timer = setTimeout(() => {
                            this.onBack();
                        }, 1000);
                    } else {
                        this.setState({
                            features: result.data.features,
                            deliveryFee: result.data.deliveryFee,
                        })
                    }
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

    renderFeatures = (data) => {
        let {store: {isStore}} = this.state;
        if (data.length < 1) {
            return;
        }
        let contentView = data.map((obj, index) => {
            return (
                <View style={[styles.contentCon]} key={index}>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.paymentMethodItem}
                        activeOpacity = {isStore === 1 ? 0.7 : 1}
                        onPress = {() => {
                            if (isStore === 1) {
                                data[index].value = obj.value === '1' ? '0' : '1';
                                this.setState({
                                    features: data
                                })
                            }
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Text style={styles.paymentMethodTitle}>{obj.name}</Text>
                        </View>
                        <Image source={obj.value === '1' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                </View>
            );
        });
        return contentView;
    }
    renderDeliveryFee = (data) => {
        let {store: {isStore}} = this.state;
        if (data.length < 1) {
            return;
        }
        let contentView = data.map((obj, index) => {
           return (
                <View style={[styles.contentCon]} key={index}>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style = {styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Text style={styles.paymentMethodTitle}>送件费</Text>
                        </View>
                        <View style={styles.paymentMethodTitleView}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = {isStore === 1 ? "请输入" : '未设置'}
                                editable = {isStore === 1}
                                defaultValue = {obj.value}
                                keyboardType = {'numeric'}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    data[index].value = text;
                                    this.setState({
                                        deliveryFee: data
                                    });
                                }}
                            />
                            <Text style={styles.paymentMethodTitle}>元</Text>
                        </View>
                    </View>
                </View>
            ); 
        });
        return contentView;
    }

    render(){
        let { features, deliveryFee, store } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'门店服务设置'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {store.isStore == 1 ?
                    <ScrollView style={styles.containerView}>
                        <View style={styles.paymentMethodView}>
                            <View style={styles.contentItemTitleView}>
                                <Text style={styles.contentItemTitle}>门店服务特色</Text>
                            </View>
                            {this.renderFeatures(features)}
                        </View>
                        <View style={[styles.paymentMethodView]}>
                            <View style={styles.contentItemTitleView}>
                                <Text style={styles.contentItemTitle}>小件取送费</Text>
                            </View>
                            {this.renderDeliveryFee(deliveryFee)}
                        </View>
                        <TouchableOpacity
                            style = {[GlobalStyles.btnView, styles.btnView]}
                            onPress = {()=>this.submit(1)}
                        >
                            <Text style={[GlobalStyles.btnItem, styles.btnItem]}>确认修改</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    :
                    <View style={[styles.contentView, styles.flexRow]}>
                        <Text style={styles.contentText}>优惠形式:</Text>
                        <Text style={styles.contentTextCon}>{features}</Text>
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
        marginBottom: 10,
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
    contentItemTitleView: {
        height: 45,
        justifyContent: 'center',
    },
    contentItemTitle: {
        fontSize: 15,
        color: '#555',
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
        width: 100,
        fontSize: 15,
        textAlign: 'right',
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555',
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