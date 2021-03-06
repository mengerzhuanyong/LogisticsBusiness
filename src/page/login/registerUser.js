/**
 * 速芽物流商家端 - RegisterUser
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
import Picker from 'react-native-picker'
import Spinner from 'react-native-spinkit'
import SYImagePicker from 'react-native-syan-image-picker'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation'
// import ImagePicker from 'react-native-image-picker'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { checkPhone } from '../../util/utilsRegularMatch'
import SendSMS from '../../component/common/sendSMS'

import area from '../../asset/json/area.json'

const cameraIcon = GlobalIcons.icon_camera;
const selectedIcon = GlobalIcons.icon_checked;
const selectIcon = GlobalIcons.icon_check;
const pickPhotoOptions = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照上传',
    chooseFromLibraryButtonTitle: '从相册选取',
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class RegisterUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            rePassword: '',
            code: '',
            name: '',
            style: '2',
            idcard: '',
            obverseIdcard: '',
            license: '',
            address: '',
            area: [],
            seconds: 60,
            codeAlreadySend: false,
            uploading: false,
            canPress: true,
            uploadType: 1,
            agree: 0,
            longitude: '',
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        this.timerInterval && clearInterval(this.timerInterval);
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
        let {
            mobile, password, rePassword, code, name, style,
            idcard, obverseIdcard, license, address, area, agree, longitude
        } = this.state;
        let url = NetApi.register;
        let data = {
            mobile: mobile,
            password: password,
            repassword: rePassword,
            code: code,
            name: name,
            style: style,
            idcard: idcard,
            obverseIdcard: obverseIdcard,
            license: license,
            address: address,
            area: area,
            longitude,
        };

        if (!mobile) {
            toastShort('请输入手机号！');
            return;
        }
        if (!checkPhone(mobile)) {
            toastShort('手机号格式不正确，请重新输入');
            return;
        }
        if (!code) {
            toastShort('请输入验证码！');
            return;
        }
        if (!password) {
            toastShort('请输入密码！');
            return;
        }
        if (!rePassword) {
            toastShort('请再次输入密码！');
            return;
        }
        if (!idcard) {
            toastShort('请上传身份正面照片！');
            return;
        }
        if (!obverseIdcard) {
            toastShort('请上传身份反面照片！');
            return;
        }
        if (!license) {
            toastShort('请上传驾驶证照片！');
            return;
        }
        // if (!area) {
        //     toastShort('请选择所在地区！');
        //     return;
        // }
        if (!address) {
            toastShort('请选择所在地');
            return;
        }
        if (agree == 0) {
            toastShort('请认证阅读并点选同意用户协议');
            return;
        }
        this.setState({
            canPress: false,
        });
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    toastShort('注册成功');
                    let store = result.data;

                    // this.setState({
                    //     store: store
                    // });

                    // storage.save({
                    //     key: 'loginState',
                    //     data: {
                    //         isStore: store.is_store,
                    //         uid: store.uid,
                    //         sid: store.sid,
                    //         storeName: store.name,
                    //         storeLogo: store.logo,
                    //         status: store.status,
                    //         token: 'token',
                    //     },
                    // });

                    // global.store = {
                    //     loginState: true,
                    //     storeData: {
                    //         isStore: store.is_store,
                    //         uid: store.uid,
                    //         sid: store.sid,
                    //         storeName: store.name,
                    //         storeLogo: store.logo,
                    //         status: store.status,
                    //         token: 'token',
                    //     }
                    // };

                    this.timer = setTimeout(() => {
                        // const resetAction = NavigationActions.reset({
                        //     index: 0,
                        //     actions: [
                        //         NavigationActions.navigate({ routeName: 'TabNavScreen'})
                        //     ]
                        // })
                        // this.props.navigation.dispatch(resetAction)
                        this.props.navigation.navigate('Login');
                    }, 500);
                } else {
                    toastShort(result.msg);
                    this.setState({
                        canPress: true,
                    });
                }
                // console.log('个人注册', result);
            })
            .catch(error => {
                toastShort('服务器请求失败，请稍后重试！');
                this.setState({
                    canPress: true,
                });
                // console.log('登录出错', error);
            })
    };

    sendSMS = () => {
        let {mobile} = this.state;
        let url = NetApi.sendSMS;
        let data = {
            mobile: mobile,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    this.countDownTimer();
                    toastShort('验证码已发送，请注意查收！');
                } else {
                    toastShort(result.msg);
                }
                // console.log('验证码', result);
            })
            .catch(error => {
                toastShort('服务器请求失败，请稍后重试！');
                // console.log('登录出错', error);
            })
    };

    // 验证码倒计时
    countDownTimer = () => {
        this.setState({
            codeAlreadySend: true,
            seconds: 60,
        });
        this.timerInterval = setInterval(() => {
            if (this.state.seconds === 0) {
                return clearInterval(this.timerInterval);
            }

            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000)
    };

    createAreaData = () => {
        let data = [];
        let len = area.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            let cityLen = area[i]['city'].length;
            for (let j = 0; j < cityLen; j++) {
                let district = {};
                district[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(district);
            }

            let province = {};
            province[area[i]['name']] = city;
            data.push(province);
        }
        return data;
    };

    onPressSelectAddress = () => {
        this.props.navigation.navigate('SelectAddressWeb', {
            onCallBack: (address, longitude, addressName) => this.setState({
                address,
                longitude,
                addressName,
            })
        });
    };

    showAreaPicker = (type) => {
        Picker.init({
            pickerData: this.createAreaData(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区选择',
            selectedValue: [],
            onPickerConfirm: pickedValue => {
                this.setState({
                    area: pickedValue
                });
                // console.log(pickedValue);
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {
                this.setState({
                    area: pickedValue
                });
            }
        });
        Picker.show();
    };

    handleOpenImagePicker = (type) => {
        if (type == 0) {
            this.setState({
                uploadType: 0,
            })
        } else if (type == 1) {
            this.setState({
                uploadType: 1,
            })
        } else {
            this.setState({
                uploadType: 2,
            })
        }
        SYImagePicker.removeAllPhoto();
        SYImagePicker.showImagePicker({imageCount: 1, isRecordSelected: true, enableBase64: true}, (err, img) => {
            // console.log(img);
            if (!err) {
                this.setState({
                    uploading: true,
                }, () => this.uploadImages(type, img[0].base64));
            }
        })
    };

    uploadImages = (type, source) => {
        let url = NetApi.uploadImages;
        let data = {
            image: source,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    if (type == 0) {
                        this.setState({
                            idcard: result.data,
                            uploading: false,
                        })
                    } else if (type == 1) {
                        this.setState({
                            obverseIdcard: result.data,
                            uploading: false,
                        })
                    } else {
                        this.setState({
                            license: result.data,
                            uploading: false,
                        })
                    }
                } else {
                    toastShort(result.msg);
                }
                // console.log(result);
            })
            .catch(error => {
                // console.log(error);
            })
    };

    pickerImages = (type) => {
        ImagePicker.showImagePicker(pickPhotoOptions, (response) => {

            // console.log('Response = ', response);

            if (response.didCancel) {
                // console.log('User cancelled image picker');
            }
            else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let source = 'data:image/jpeg;base64,' + response.data;

                this.uploadImages(type, source);
                if (type == 0) {
                    this.setState({
                        uploadType: 0,
                        uploading: true,
                    })
                } else if (type == 1) {
                    this.setState({
                        uploadType: 1,
                        uploading: true,
                    })
                } else {
                    this.setState({
                        uploadType: 2,
                        uploading: true,
                    })
                }
            }
        });
    }

    onPushToNextPage = (pageTitle, page) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
        })
    }


    render(){
        let { seconds, codeAlreadySend, area, uploading, address, idcard, obverseIdcard, license, canPress,uploadType } = this.state;
        // console.log(uploading && idcard == '');
        return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                <CustomKeyboard.AwareCusKeyBoardScrollView>
                    <View style={styles.signView}>
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>手机号</Text>
                                <CustomKeyboard.CustomTextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入手机号"
                                    maxLength = {11}
                                    placeholderTextColor = '#888'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            {codeAlreadySend ?
                                <View style={styles.btnCodeView}>
                                    {seconds === 0 ?
                                        <SendSMS title = '重新获取' sendSMS = {()=>this.sendSMS()} />
                                        :
                                        <SendSMS title = {`剩余${seconds}秒`} sendSMS = {()=> {}} />
                                    }
                                </View>
                                :
                                <SendSMS title = '获取验证码' sendSMS = {()=>this.sendSMS()} />
                            }
                        </View>
                        <View style={GlobalStyles.horLine} />
                        
                        <Text style={styles.registerTips}>
                            平台已免费为部分商户注册账号，如手机号被注册可点击
                            <Text
                                style={styles.textStyle}
                                onPress = {() => {this.onPushToNextPage('密码找回', 'Repassword')}}
                                >忘记密码找回</Text>
                        </Text>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>验证码</Text>
                            <CustomKeyboard.CustomTextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入验证码"
                                placeholderTextColor = '#888'
                                customKeyboardType = "numberKeyBoard"
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        code: text
                                    })
                                }}
                            />
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>门店名称</Text>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入门店名称"
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
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>身份证</Text>
                            
                            {uploading && uploadType == 0 ?
                                <View style={{flex: 1}}>
                                    <Spinner style={styles.spinner} isVisible={uploading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                </View>
                                :
                                idcard == '' ?
                                    <Text style={styles.inputItemConText}>请上传身份证正面</Text>
                                    :
                                    <View style={{flex: 1}}>
                                        <Image source={{uri: idcard}} style={[GlobalStyles.uploadIcon, styles.uploadImages]} />
                                    </View>
                                
                            }
                            <TouchableOpacity
                                onPress = {() => this.handleOpenImagePicker(0)}
                            >
                                <Image source={cameraIcon} style={styles.cameraIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>行驶证</Text>
                            {uploading && uploadType == 1 ?
                                <View style={{flex: 1}}>
                                    <Spinner style={styles.spinner} isVisible={uploading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                </View>
                                :
                                obverseIdcard == '' ?
                                    <Text style={styles.inputItemConText}>请上传行驶证</Text>
                                    :
                                    <View style={{flex: 1}}>
                                        <Image source={{uri: obverseIdcard}} style={[GlobalStyles.uploadIcon, styles.uploadImages]} />
                                    </View>
                            }
                            <TouchableOpacity
                                onPress = {() => this.handleOpenImagePicker(1)}
                            >
                                <Image source={cameraIcon} style={styles.cameraIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>驾驶证</Text>
                            {uploading && uploadType == 2 ?
                                <View style={{flex: 1}}>
                                    <Spinner style={styles.spinner} isVisible={uploading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                </View>
                                :
                                license == '' ?
                                    <Text style={styles.inputItemConText}>请上传驾驶证</Text>
                                    :
                                    <View style={{flex: 1}}>
                                        <Image source={{uri: license}} style={[GlobalStyles.uploadIcon, styles.uploadImages]} />
                                    </View>
                            }
                            <TouchableOpacity
                                onPress = {() => this.handleOpenImagePicker(2)}
                            >
                                <Image source={cameraIcon} style={styles.cameraIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>所在地</Text>
                            <TouchableOpacity
                                style = {styles.inputItemConTextView}
                                onPress = {() => this.onPressSelectAddress()}
                            >
                                <Text style={styles.inputItemConText}>{address || '请选择所在地'}</Text>
                            </TouchableOpacity>
                        </View>
                        {/*<View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>详细地址</Text>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入请输入详细地址"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        address: text
                                    })
                                }}
                            />
                        </View>*/}
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <Text style={styles.inputItemTitle}>密码</Text>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入密码"
                                secureTextEntry = {true}
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
                                style = {styles.inputItemCon}
                                placeholder = "请再次输入密码"
                                secureTextEntry = {true}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        rePassword: text
                                    })
                                }}
                            />
                        </View>
                        <View style={GlobalStyles.horLine} />

                        <View style={[styles.containerItemView, styles.flowProtocolView]}>
                            <TouchableOpacity
                                style = {styles.flowProtocolBtnView}
                                onPress = {() => {
                                    let state = this.state.agree == '1' ? 0 : 1;
                                    this.setState({
                                        agree: state,
                                    })
                                }}
                            >
                                <Image source={this.state.agree == '1' ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                                <Text style={styles.flowProtocolBtnCon}>我已阅读并同意</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.flowProtocolBtnView}
                                onPress = {() => this.onPushToNextPage('用户协议', 'Protocol')}
                            >
                                <Text style={styles.flowProtocolName}>《用户协议》</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.signBotView}>
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {canPress && this.doRegister()}}
                        >
                            <Text style={GlobalStyles.btnItem}>立即注册</Text>
                        </TouchableOpacity>
                    </View>
                </CustomKeyboard.AwareCusKeyBoardScrollView>
            </KeyboardAwareScrollView>
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
        color: '#111',
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
        // marginTop: 20,
    },
    signItem: {
        height: 50,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: GlobalStyles.width - 30,
    },
    inputItemTitle: {
        width: 70,
        color: '#333',
        marginRight: 10,
    },
    inputItemIcon: {
        width: 40,
        height: 25,
        resizeMode: 'contain',
    },
    cameraIcon: {
        width: 30,
        height: 25,
        resizeMode: 'contain'
    },
    inputItemCon: {
        flex: 1,
        height: 50,
        fontSize: 15,
        color: '#888',
    },
    inputItemConTextView: {
        flex: 1,
    },
    inputItemConText: {
        flex: 1,
        height: 50,
        lineHeight: 50,
        fontSize: 15,
        color: '#888',
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
    uploadImages: {
        height: 45,
        marginTop: -5,
    },
    flowProtocolView: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    flowProtocolBtnIconView: {
        // width: 40,
        // height: 25,
        // backgroundColor: '#123',
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
    registerTips: {
        fontSize: 13,
        color: '#333',
        lineHeight: 20,
        marginVertical: 5,
    },
    textStyle: {
        color: GlobalStyles.themeColor,
        textDecorationLine: 'underline',
    }
});
