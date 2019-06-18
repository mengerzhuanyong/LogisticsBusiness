/**
 * 速芽物流商家端 - Register
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

import RegisterUser from './registerUser'
import RegisterCompany from './registerCompany'

import SendSMS from '../../component/common/sendSMS'

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            current: true,
            mobile: '',
            code: '',
            password: '',
            repassword: '',
            seconds: 60,
            codeAlreadySend: false,
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

    loadNetData = () => {}

    doRegister = () => {
        let { mobile, code, password, repassword } = this.state;
        let url = NetApi.register;
        let data = {
            mobile: mobile,
            code: code,
            password: password,
            repassword: repassword,
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log('登录', result);
            })
            .catch( error => {
                // console.log('登录出错', error);
            })
    }

    sendSMS = () => {
        let { mobile } = this.state;
        let url = NetApi.sendSMS;
        let data = {
            mobile: mobile,
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
    countDownTimer = () => {
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

    changeRegisterType = (type) => {
        const { current } = this.state;
        if (current == type) {
            return null;
        }
        this.setState({
            current: type
        })
    }

    renderTitleView = () => {
        const { current } = this.state;
        return (
            <View style={styles.navigationTitleView}>

                <TouchableOpacity
                    style = {[styles.navigationTitleItem, current && styles.navigationTitleItemCurrent]}
                    onPress = {() => this.changeRegisterType(true)}
                >
                    <Text style={[styles.navigationTitleName, current && styles.navigationTitleCurrent]}>公司注册</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {[styles.navigationTitleItem, !current && styles.navigationTitleItemCurrent]}
                    onPress = {() => this.changeRegisterType(false)}
                >
                    <Text style={[styles.navigationTitleName, !current && styles.navigationTitleCurrent]}>个人注册</Text>
                </TouchableOpacity>
            </View>
        )
    }


    render(){
        const { current } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView = {this.renderTitleView()}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {current ?


                    <RegisterCompany {...this.props} />
                    :
                    <RegisterUser {...this.props} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navigationTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: GlobalStyles.width - 200,
        justifyContent: 'space-between',
    },
    navigationTitleItem: {
        width: 80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationTitleItemCurrent: {
        borderBottomWidth: 2,
        borderColor: '#fff',
    },
    navigationTitleName: {
        fontSize: 15,
        color: '#333',
    },
    navigationTitleCurrent: {
        color: '#fff',
        // textDecorationLine: 'underline',
    },
    logoView: {
        marginTop: 20,
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
    },
    otherBtnView: {
        height: 30,
        marginHorizontal: 15,
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
        color: GlobalStyles.themeColor
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
});
