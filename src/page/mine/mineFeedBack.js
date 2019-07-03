/**
 * 速芽物流用户端 - MineFeedBack
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Spinner from 'react-native-spinkit'
import SYImagePicker from 'react-native-syan-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { checkPhone } from '../../util/utilsRegularMatch'

const __IOS__ = Platform.OS === 'ios';
export default class MineFeedBack extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            sid: global.store ? global.store.storeData.sid : '',
            phone: '',
            style: '2',
            name: '',
            img: '',
            content: '',
            canPress: true,
            canBack: false,
            uploading: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        if (global.store) {
            this.setState({
                sid: global.store.storeData.sid
            });
        }
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
    }

    onBack = () => {
        // this.props.navigation.state.params.reloadData();
        this.props.navigation.goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {
        
    }

    doFeedBack = () => {
        let url = NetApi.mineFeedback;
        let { sid, phone, style, name, content, img } = this.state;
        let data = {
            sid: sid,
            phone: phone,
            style: style,
            name: name,
            image: img,
            content: content,
        };
        if (!name) {
            toastShort('请输入联系人姓名', 'center');
            return;
        }
        if (!phone) {
            toastShort('请输入联系电话', 'center');
            return;
        }
        if (!checkPhone(phone)) {
            toastShort('手机号格式不正确，请重新输入');
            return;
        }
        if (!content) {
            toastShort('请输入您的建议或意见', 'center');
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

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    handleOpenImagePicker = () => {
        SYImagePicker.removeAllPhoto();
        SYImagePicker.showImagePicker({imageCount: 1, isRecordSelected: true, enableBase64: true}, (err, img) => {
            // console.log(img);
            if (!err) {
                this.setState({
                    uploading: true,
                }, () => this.uploadImages(img[0].base64));
            }
        })
    };

    uploadImages = (source) => {
        let url = NetApi.uploadImages;
        let data = {
            image: source
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    this.updateState({
                        img: result.data,
                        uploading: false,
                    });
                }

            })
            .catch(error => {
                // console.log(error);
                toastShort('error');
            })
    };

    render(){
        let {canPress, uploading, img} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'建议反馈'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                    <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={[styles.feedbackItemView, styles.feedbackContextView]}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "联系人"
                                placeholderTextColor = '#555'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        name: text
                                    })
                                }}
                            />
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <CustomKeyboard.CustomTextInput
                                style = {styles.inputItemCon}
                                placeholder = "联系电话"
                                placeholderTextColor = '#555'
                                customKeyboardType = "numberKeyBoard"
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        phone: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[styles.feedbackItemView, styles.feedbackContextView]}>
                            <TextInput
                                style = {styles.inputItemConText}
                                multiline = {true}
                                placeholder = "填写您的建议与意见..."
                                placeholderTextColor = '#555'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        content: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[styles.feedbackItemView, styles.pictureView]}>
                            {uploading ?
                                <Spinner style={styles.spinner} isVisible={uploading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                :
                                <View>
                                    {img === '' ?
                                        <TouchableOpacity
                                            style = {GlobalStyles.uploadView}
                                            onPress = {() => this.handleOpenImagePicker()}
                                        >
                                            <Image source={GlobalIcons.images_bg_upload} style={[GlobalStyles.uploadIcon, styles.uploadIcon, ]} />
                                        </TouchableOpacity>
                                        :
                                        <View style={styles.uploadPicView}>
                                            <TouchableOpacity
                                                style={styles.deleteIcon}
                                                onPress = {() => {
                                                    SYImagePicker.removeAllPhoto();
                                                    this.updateState({
                                                        img: '',
                                                    })
                                                }}
                                            >
                                                <Image source={GlobalIcons.icon_delete} style={styles.deleteIconCon} />
                                            </TouchableOpacity>
                                            <Image source={{uri: img}} style={[GlobalStyles.uploadIcon, styles.uploadImages]} />
                                        </View>
                                    }
                                </View>
                            }
                        </View>
                        <View style={[GlobalStyles.btnView, styles.btnView]}>
                            <TouchableOpacity
                                style = {GlobalStyles.btnView}
                                onPress = {() => {canPress && this.doFeedBack()}}
                            >
                                <Text style={GlobalStyles.btnItem}>立即反馈</Text>
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
    feedbackItemView: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#fff',        
    },
    horLine: {
        marginVertical: 5,
    },
    feedbackContextView: {},
    inputItemCon: {
        height: 45,
    },
    inputItemConText: {
        height: 130,
        textAlignVertical: 'top',
    },
    btnView: {
        marginVertical: 50,
    },
    uploadPicView: {
        width: 100,
        height: 80,
        position: 'relative',
    },
    deleteIcon: {
        position: 'absolute',
        top: __IOS__ ? -5 : 0,
        right: 5,
        width: 16,
        height: 16,
        backgroundColor: '#f00',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    deleteIconCon: {
        width: 18,
        height: 18,
    },
});
