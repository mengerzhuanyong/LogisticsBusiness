/**
 * 速芽物流商家端 - MineEmployeeAdd
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
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { checkPhone } from '../../util/utilsRegularMatch'

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;

export default class MineEmployeeAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sid: global.store.storeData.sid,
            style: 1,
            name: '',
            mobile: '',
            password: '',
            rePassword: '',
            iscall: '1',
            canPress: true,
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
    }

    loadNetData = () => {

    }

    submit = () => {
        let {sid, style, name, mobile, password, rePassword, iscall, canPress} = this.state;
        let url = NetApi.staffAdd;
        let data = {
            sid: sid,
            style: style,
            name: name,
            mobile: mobile,
            password: password,
            repassword: rePassword,
            iscall: iscall,
        };
        if (!name) {
            toastShort('请输入员工姓名');
            return;
        }
        if (!mobile) {
            toastShort('请输入员工手机号');
            return;
        }
        if (!checkPhone(mobile)) {
            toastShort('手机号格式不正确，请重新输入');
            return;
        }
        if (!password) {
            toastShort('请输入密码');
            return;
        }
        if (!rePassword) {
            toastShort('请再次输入密码');
            return;
        }
        this.setState({
            canPress: false
        });
        this.netRequest.fetchPost(url, data)
            .then(result => {
                // console.log(result);
                toastShort(result.msg);
                if (result && result.code == 1) {
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
                } else {
                    this.setState({
                        canPress: true,
                    });
                }
            })
            .catch(error => {
                toastShort('error');
                this.setState({
                    canPress: true,
                });
            })

    }

    render(){
        let {name, mobile, password, rePassword, iscall, canPress} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'添加员工账号'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView style={[GlobalStyles.hasFix1edContainer, styles.scrollView1Container]}>
                     <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={styles.signView}>
                            <View style={styles.signItem}>
                                <Text style={styles.inputItemTitle}>姓名</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入员工姓名"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            name: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            {/*<View style={styles.signItem}>
                                <Text style={styles.inputItemTitle}>电话</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入员工电话"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />*/}
                            <View style={styles.signItem}>
                                <Text style={styles.inputItemTitle}>账号</Text>
                                <CustomKeyboard.CustomTextInput
                                    style = {[styles.inputItemCon, styles.itemRightCon]}
                                    placeholder = "请输入员工手机号"
                                    maxLength = {11}
                                    placeholderTextColor = '#888'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        });
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.signItem}>
                                <Text style={styles.inputItemTitle}>密码</Text>
                                <TextInput
                                    secureTextEntry = {true}
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入员工密码"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            password: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.signItem}>
                                <Text style={styles.inputItemTitle}>确认密码</Text>
                                <TextInput
                                    secureTextEntry = {true}
                                    style = {styles.inputItemCon}
                                    placeholder = "请再次输入员工密码"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            rePassword: text
                                        })
                                    }}
                                />
                            </View>
                        </View>

                        <View style={styles.paymentMethodView}>
                            <TouchableOpacity
                                style = {styles.paymentMethodItem}
                                onPress = {() => {
                                    let status = this.state.iscall == '1' ? '0' : '1';
                                    this.setState({
                                        iscall: status
                                    })
                                }}
                            >
                                <View style={styles.paymentMethodTitleView}>
                                    <Text style={styles.paymentMethodTitle}>是否接受短信提醒</Text>
                                </View>
                                <Image source={iscall == '1' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                            </TouchableOpacity>
                        </View>

                        <View style={[GlobalStyles.fixedB1tnView, styles.orderDetalBtnView]}>
                            <TouchableOpacity
                                style = {styles.orderDetalBtnItem}
                                onPress = {() => this.onBack()}
                            >
                                <Text style={styles.orderDetalBtnName}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {[styles.orderDetalBtnItem, styles.orderDetalBtnItemCurrent]}
                                onPress = {() => {canPress && this.submit()}}
                            >
                                <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage} />
                                <Text style={[styles.orderDetalBtnName, styles.orderDetalBtnNameCurrent]}>确认</Text>
                            </TouchableOpacity>
                        </View>
                     </CustomKeyboard.AwareCusKeyBoardScrollView>
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
    scrollViewContainer: {
        marginBottom: 90,
    },

    logoView: {
        marginTop: 80,
        alignItems: 'center',
    },
    logoIcon: {
        width: GlobalStyles.width / 2.5,
        height: GlobalStyles.width / 2.5,
    },
    signView: {
        paddingHorizontal: 15,
        // marginTop: 20,
        backgroundColor: '#fff',
    },
    signItem: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: GlobalStyles.width - 30,
        // backgroundColor: '#123',
    },
    inputItemIcon: {
        width: 40,
        height: 25,
        resizeMode: 'contain',
    },
    inputItemTitle: {
        width: 70,
        fontSize: 15,
        color: '#555',
    },
    inputItemCon: {
        flex: 1,
        height: 50,
        fontSize: 13,
        // marginHorizontal: 5,
        // backgroundColor: '#123',
    },
    otherBtnView: {
        height: 30,
        marginTop: 10,
        // marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    otherBtnItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    otherBtnName: {
        fontSize: 15,
        color: '#fff',
    },
    iconCheck: {
        fontSize: 20,
        marginRight: 5,
        color: GlobalStyles.themeColor
    },
    otherLoginView: {
        marginTop: 50,
        alignItems: 'center',
    },
    otherLoginTitle: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    horLine: {
        width: GlobalStyles.width * 0.25,
        backgroundColor: '#ddd',
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
        marginVertical: 15,
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
        color: '#555',
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
    orderDetalBtnView: {
        marginTop: 50,
        height: 80,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderDetalBtnItem: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: GlobalStyles.themeColor,
        width: (GlobalStyles.width - 100) / 2,
    },
    orderDetalBtnItemCurrent: {
        borderWidth: 0,
    },
    orderDetalBtnName: {
        fontSize: 14,
        color: GlobalStyles.themeColor,
    },
    orderDetalBtnNameCurrent: {
        color: '#fff',
    },
    serviceTypeBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceTypeBtnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    serviceTypeBtnName: {
        color: '#333',
        marginRight: 10,
    },
    paymentMethodView: {
        marginTop: 10,
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
});
