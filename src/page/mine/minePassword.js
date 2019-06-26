/**
 * 速芽物流用户端 - MineInfoSetting
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
import JPushModule from 'jpush-react-native'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import { NavigationActions } from 'react-navigation'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import SendSMS from '../../component/common/sendSMS'

export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            store: global.store ? global.store.storeData : '',
            uid: params.user ? params.user.uid : '',
            phone: params.user ? params.user.phone : '',
            code: '',
            password: '', // '123123',
            repassword: '', // '123123',
            origin_password: '', // '123123',
            seconds: 60,
            newMobile: '',
            loading: false,
            codeAlreadySend: false,
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
        this.timerInterval && clearInterval(this.timerInterval);
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

    loadNetData = () => {}

    renderRightButton = () => {
        let { canPress } = this.state;
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => {canPress && this.submitChange()}}
            >
                <Text style={GlobalStyles.rightButtonName}>保存</Text>
            </TouchableOpacity>
        )
    }

    submitChange = () => {
        let { store, uid, newMobile, code, origin_password, password, repassword } = this.state;
        // console.log(store);
        let url = NetApi.mineEditPwd;
        let data = {
            sid: store.sid,
            uid: store.uid,
            origin_password,
            password,
            repassword,
        };
        // if (!origin_password) {
        //     toastShort('请输入原始密码');
        //     return;
        // }
        if (!password) {
            toastShort('请输入新密码');
            return;
        }
        if (!repassword) {
            toastShort('请再次输入新密码');
            return;
        }
        this.netRequest.fetchPost(url, data, true)
            .then(result => {
                if (result && result.code == 1) {
                    // console.log('用户中心', result);
                    toastShort('更改成功，请重新登录！');
                    this.removeLoginState();
                    this.deleteAlias();
                } else {
                    toastShort(result.msg);
                    // console.log(result.msg);
                }
            })
            .catch(error => {
                // console.log('请求失败', error);
            })
    };

    doLogOut = (index) => {
        let url = NetApi.logOut;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.removeLoginState();
            })
            .catch( error => {
                // console.log('退出失败，请重试！', error);
            })

    };

    removeLoginState = () => {
        storage.remove({
            key: 'loginState',
        });
        global.store.loginState = false;
        global.store.storeData = '';

        this.timerLogout = setTimeout(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'Login'})
                ]
            });
            this.props.navigation.dispatch(resetAction)
        }, 1000);
    };

    deleteAlias = () => {
        JPushModule.deleteAlias(map => {
            if (map.errorCode === 0) {
                // console.log('delete alias succeed')
            } else {
                // console.log('delete alias failed, errorCode: ', map.errorCode)
            }
        })
    }

    sendSMS = (phone) => {
        // phone = 15066660000;
        let url = NetApi.sendPubSMS;
        if (!phone) {
            toastShort('手机号有误');
            return false;
        }
        let data = {
            mobile: phone,
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    this.countDownTimer();
                    toastShort('验证码已发送，请注意查收！');
                }else{
                    toastShort(result.msg);
                }
                // console.log('验证码', result);
            })
            .catch( error => {
                toastShort('服务器请求失败，请稍后重试！');
                // console.log('登录出错', error);
            })
    }

    // 验证码倒计时
    countDownTimer(){
        this.setState({
            codeAlreadySend: true,
            seconds: 60,
        })
        this.timerInterval = setInterval(() => {
            if (this.state.seconds === 0) {
                return clearInterval(this.timerInterval);
            }

            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000)
    }

    render(){
        let { phone, loading, seconds, codeAlreadySend } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'密码修改'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    // rightButton = {this.renderRightButton()}
                />
                <View style={styles.signView}>
                    <View style = {styles.signItem}>
                        <TextInput
                            style = {styles.inputItemCon}
                            placeholder = "请输入原密码"
                            placeholderTextColor = '#888'
                            secureTextEntry = {true}
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text) => {
                                this.updateState({
                                    origin_password: text
                                })
                            }}
                        />
                    </View>
                    <View style={GlobalStyles.horLine} />
                    <View style = {styles.signItem}>
                        <TextInput
                            style = {styles.inputItemCon}
                            placeholder = "请输入新密码"
                            placeholderTextColor = '#888'
                            secureTextEntry = {true}
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text) => {
                                this.updateState({
                                    password: text
                                })
                            }}
                        />
                    </View>
                    <View style={GlobalStyles.horLine} />
                    <View style = {styles.signItem}>
                        <TextInput
                            style = {styles.inputItemCon}
                            placeholder = "请再次输入新密码"
                            placeholderTextColor = '#888'
                            secureTextEntry = {true}
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text) => {
                                this.updateState({
                                    repassword: text
                                })
                            }}
                        />
                    </View>
                </View>

                <View style={[GlobalStyles.btnView, styles.btnView]}>
                    <TouchableOpacity
                        style = {GlobalStyles.btnView}
                        onPress = {() => {this.submitChange()}}
                    >
                        <Text style={GlobalStyles.btnItem}>确认修改</Text>
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
    horLine: {},
    signView: {
        padding: 15,
        // marginTop: 20,
        backgroundColor: '#fff',
    },
    signItem: {
        height: 50,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    inputItemConText: {
        fontSize: 15,
        color: '#666',
    },
});
