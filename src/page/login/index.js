/**
 * 速芽物流商家端 - Login
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
    TouchableOpacity,
} from 'react-native'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { checkPhone } from '../../util/utilsRegularMatch'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            mobile: '15066886007',
            password: '123123',
            loginState: '',
            canPress: true,
        };
        this.netRequest = new NetRequest();
    }

    async componentWillMount(){
        try {
            let result = await storage.load({
                key: 'loginState',
            });
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'TabNavScreen'})
                ]
            });
            this.props.navigation.dispatch(resetAction);
        } catch (error) {
            // console.log(error);
        }

        this.loadNetData();
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

    loadNetData = () => {}

    onPushToNextPage = (webTitle, component) => {
        let { navigate } = this.props.navigation;
        navigate(component, {
            webTitle: webTitle
        })
    }

    doLogin = () => {
        let { mobile, password } = this.state;
        let url = NetApi.loginIn;
        let data = {
            mobile: mobile,
            password: password,
        };

        if (!mobile) {
            toastShort('手机号不能为空');
            return;
        }
        if (!checkPhone(mobile)) {
            toastShort('手机号格式不正确，请重新输入');
            return;
        }
        if (!password) {
            toastShort('密码不能为空');
            return;
        }
        this.setState({
            canPress: false,
        })
        this.netRequest.fetchPost(url, data, true)
            .then( result => {
                console.log('登录', result);
                if (result && result.code == '1') {
                    toastShort("登录成功");
                    let store = result.data;

                    this.setState({
                        store: store
                    });

                    storage.save({
                        key: 'loginState',
                        data: {
                            isStore: store.is_store,
                            uid: store.uid,
                            sid: store.sid,
                            storeName: store.name,
                            storeLogo: store.logo,
                            status: store.status,
                            token: 'token',
                        },
                    });

                    global.store = {
                        loginState: true,
                        storeData: {
                            isStore: store.is_store,
                            uid: store.uid,
                            sid: store.sid,
                            storeName: store.name,
                            storeLogo: store.logo,
                            status: store.status,
                            token: 'token',
                        }
                    };

                    this.timer = setTimeout(() => {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'TabNavScreen'})
                            ]
                        })
                        this.props.navigation.dispatch(resetAction)
                    }, 500)
                } else {
                    toastShort(result.msg);
                    this.setState({
                        canPress: true,
                    })
                }
            })
            .catch( error => {
                toastShort("网络请求失败，请稍后重试！");
                this.setState({
                    canPress: true,
                })
            })
    }

    render(){
        let {canPress} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    style = {{
                        height: 0,
                    }}
                    backgroundImage = {false}
                />
                <Image source={GlobalIcons.images_bg_sign} style={styles.backgroundImage} />
                <KeyboardAwareScrollView>
                    <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={styles.logoView}>
                            <Image source={GlobalIcons.logo} style={GlobalStyles.logoIcon} />
                        </View>
                        <View style={styles.signView}>
                            <View style={styles.signItem}>
                                <CustomKeyboard.CustomTextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "手机号"
                                    maxLength = {11}
                                    placeholderTextColor = '#fff'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.signItem}>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "密码"
                                    secureTextEntry = {true}
                                    placeholderTextColor = '#fff'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            password: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.otherBtnView}>
                                <TouchableOpacity
                                    style = {styles.otherBtnItem}
                                    onPress = {() => {this.onPushToNextPage('账号注册', 'Register')}}
                                >
                                    <Text style={styles.otherBtnName}>账号注册</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {styles.otherBtnItem}
                                    onPress = {() => {this.onPushToNextPage('密码找回', 'Repassword')}}
                                >
                                    <Text style={styles.otherBtnName}>忘记密码？</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.signBotView}>
                            <TouchableOpacity
                                style = {[GlobalStyles.btnView, styles.btnView]}
                                onPress = {() => {canPress && this.doLogin()}}
                            >
                                <Text style={[GlobalStyles.btnItem, styles.btnItem]}>登录</Text>
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
        // height: 900,
        position: 'relative',
        backgroundColor: 'transparent',
    },
    backgroundImage: {
        flex: 1,
        // height: GlobalStyles.height + 64,
        height: 900,
        width: GlobalStyles.width,
        resizeMode: 'cover',
        position: 'absolute',
        // bottom: 0,
        top: 0,
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
        padding: 15,
        marginTop: 20,
    },
    signItem: {
        height: 50,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: GlobalStyles.width - 30,
    },
    inputItemIcon: {
        width: 40,
        height: 25,
        resizeMode: 'contain',
    },
    inputItemCon: {
        flex: 1,
        height: 50,
        fontSize: 15,
        color: '#fff',
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
    titleName: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 20,
    },
    otherLoginCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otherLoginBtn: {
        width: 45,
        height: 45,
        marginHorizontal: 50,
    },
    otherLoginIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    btnView: {
        backgroundColor: '#fff',
    },
    btnItem: {
        fontSize: 18,
        color: GlobalStyles.themeColor,
    }
});