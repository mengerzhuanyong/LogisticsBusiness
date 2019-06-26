/**
 * 速芽物流商家端 - MineAddressEdit
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
import Picker from 'react-native-picker'
// import ImagePicker from 'react-native-image-picker'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { checkPhone } from '../../util/utilsRegularMatch'

import OrderItemView from '../../component/order/orderItem'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import AddressItem from '../../component/mine/addressItem'

import ShopData from '../../asset/json/homeBusiness.json'
import area from '../../asset/json/area.json'

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
export default class MineAddressEdit extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            id: params.item ? params.item.id : '',
            name: params.item ? params.item.name : '',
            realname: params.item ? params.item.realname : '',
            mobile: params.item ? params.item.mobile : '',
            area: params.item ? [params.item.province, params.item.city, params.item.district] : [],
            address: params.item ? params.item.dress : '',
            logo: params.item ? params.item.logo : '',
            banner: params.item ? params.item.img : '',
            addressName: params.item ? params.item.address_name : '',
            longitude: params.item ? params.item.longitude : '',
            ready: false,
            loadMore: false,
            refreshing: false,
            uploading: false,
            companyListData: [],
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

    dropLoadMore = () => {}

    freshNetData = () => {}


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

    uploadImages = (type, source) => {
        let url = NetApi.uploadImages;
        let data = {
            image: source,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    if (type == 1) {
                        this.setState({
                            logo: result.data,
                            uploading: false,
                        })
                    } else {
                        this.setState({
                            banner: result.data,
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
            }
        });
    }

    submit = () => {
        let {id, name, realname, mobile, logo, banner, area, longitude, addressName, address} = this.state;
        let url = NetApi.storeEdit;
        let data = {
            id: id,
            name: name,
            realname: realname,
            mobile: mobile,
            logo: logo,
            banner: banner,
            area: area,
            address: address,
            longitude,
            address_name: addressName
        };
        if (!name) {
            toastShort('请输入服务点名称');
            return;
        }
        if (!realname) {
            toastShort('请输入负责人姓名');
            return;
        }
        if (!mobile) {
            toastShort('请输入联系电话');
            return;
        }
        if (!checkPhone(mobile)) {
            toastShort('手机号格式不正确，请重新输入');
            return;
        }
        // if (!logo) {
        //     toastShort('请上传服务点logo');
        //     return;
        // }
        // if (!banner) {
        //     toastShort('请上传服务点banner图');
        //     return;
        // }
        // if (!area) {
        //     toastShort('请选择服务点所在地');
        //     return;
        // }
        if (!address) {
            toastShort('请选择服务点所在地');
            return;
        }
        this.setState({
            canPress: false
        })
        this.netRequest.fetchPost(url, data)
            .then(result => {
                toastShort(result.msg);
                if (result && result.code == 1) {
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
                } else {
                    this.setState({
                        canPress: true
                    })
                }
            })
            .catch(error => {
                toastShort('error');
                this.setState({
                    canPress: true
                })
            })
    }

    render(){
        const { area, ready, refreshing, companyListData, mobile, name, realname, address, logo, banner, canPress } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'修改服务点信息'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView>
                    <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>基本信息</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.infoItemView}>
                                <Text style={styles.infoItemTitle}>服务点名称：</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入服务点名称"
                                    defaultValue = {name}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            name: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.infoItemView}>
                                <Text style={styles.infoItemTitle}>负责人姓名：</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入负责人姓名"
                                    defaultValue = {realname}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            realname: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.infoItemView}>
                                <Text style={styles.infoItemTitle}>联系电话：</Text>
                                <CustomKeyboard.CustomTextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "请输入联系电话"
                                    maxLength = {11}
                                    defaultValue = {mobile}
                                    placeholderTextColor = '#888'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>服务点地址</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.inputItemConTextView}
                                onPress = {() => this.onPressSelectAddress()}
                            >
                                <Text style={[styles.inputItemConText,]} numberOfLines={2}>{address || '选择地区'}</Text>
                            </TouchableOpacity>
                            {/*<View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入详细地址"
                                defaultValue = {address}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        address: text
                                    })
                                }}
                            />*/}
                        </View>
                        {/*<View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>服务点Logo</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.uploadItemView}
                                onPress = {() => this.pickerImages('1')}
                            >
                                {logo == '' ?
                                    <Image source={GlobalIcons.images_bg_upload} style={styles.uploadBtn} />
                                    :
                                    <Image source={{uri: logo}} style={styles.uploadImages} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>服务点Banner</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.uploadItemView}
                                onPress = {() => this.pickerImages('2')}
                            >
                                {banner == '' ?
                                    <Image source={GlobalIcons.images_bg_upload} style={styles.uploadBtn} />
                                    :
                                    <Image source={{uri: banner}} style={styles.uploadImages} />
                                }
                            </TouchableOpacity>
                        </View>*/}
                        <View style={[GlobalStyles.btnView, styles.btnView]}>
                            <TouchableOpacity
                                style = {GlobalStyles.btnView}
                                onPress = {() => {canPress && this.submit()}}
                            >
                                <Text style={GlobalStyles.btnItem}>立即修改</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.tipsStyle}>因物流公司距离市区普遍较远，平台开通“服务点”功能，类似于阿里的“驿站”商家可自己或者找代理，在市区里设一个点，客户只需要把货放在服务点，然后商家自己或者代理就可以把货物统一送到物流公司。</Text>
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
    horLine: {
        marginVertical: 5,
    },
    addressAddItemView: {
        padding: 15,
        backgroundColor: '#fff',
    },
    inputItemCon: {
        flex: 1,
        height: 40,
        fontSize: 15,
        color: '#555',
        alignItems: 'center',
    },
    inputItemMultilineCon: {
        height: 130,
        textAlignVertical: 'top',
    },
    inputItemConTextView: {
        height: 40,
        justifyContent: 'center',
    },
    inputItemConText: {
        fontSize: 15,
        color: '#555',
    },
    addressAddTips: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressAddTipsName: {
        fontSize: 15,
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
    uploadView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    uploadItemView: {
        // width: (GlobalStyles.width - 60) / 2,
        // height: 120,
        // backgroundColor: '#f7f7f7',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    uploadImagesTips: {
        fontSize: 13,
        color: '#888',
    },
    uploadImagesTitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    uploadBtn: {
        width: 80,
        height: 80,
        // backgroundColor: '#123',
        resizeMode: 'contain',
    },
    uploadImages: {
        width: GlobalStyles.width - 30,
        // flex: 1,
        height: GlobalStyles.width / 2,
        resizeMode: 'contain',
    },
    titleView: {
        height: 45,
        justifyContent: 'center',
    },
    titleViewCon: {
        fontSize: 16,
        color: '#333',
    },
    infoItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    infoItemTitle: {
        width: 95,
        fontSize: 14,
        color: '#555',
    },
    tipsStyle:{
        fontSize: 13,
        color: '#333',
        lineHeight: 20,
        marginBottom: 20,
        marginHorizontal: 20,
    },
});