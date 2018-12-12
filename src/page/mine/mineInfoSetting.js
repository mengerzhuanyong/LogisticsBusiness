/**
 * 速芽物流商家端 - MineInfoSetting
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
import SYImagePicker from 'react-native-syan-image-picker'
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

const ui = GlobalIcons.images_bg_ui;

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
export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            store: global.store ? global.store.storeData : '',
            item: params.item ? params.item : '',
            id: params.item ? params.item.id : '',
            company: params.item ? params.item.company : '',
            name: params.item ? params.item.name : '',
            realname: params.item ? params.item.realname : '',
            mobile: params.item ? params.item.mobile : '',
            area: params.item ? [params.item.province, params.item.city, params.item.district] : [],
            address: params.item ? params.item.dress : '',
            logo: params.item ? params.item.logo : '',
            banner: params.item ? params.item.img : '',
            reminder: params.item ? params.item.reminder : '',
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

    handleOpenImagePicker = (type, cropW, cropH) => {
        cropW = parseInt(cropW);
        cropH = parseInt(cropH);
        SYImagePicker.removeAllPhoto();
        SYImagePicker.showImagePicker({imageCount: 1, isCrop: true, CropW: cropW, CropH: cropH, enableBase64: true}, (err, img) => {
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
        let {id, company, name, item, realname, mobile, logo, banner, area, address, reminder} = this.state;
        let url = NetApi.mineStoreEdit;
        let data = {
            id: id,
            company: company,
            name: name,
            realname: realname,
            mobile: mobile,
            logo: logo,
            banner: banner,
            area: area,
            address: address,
            reminder: reminder,
        };
        if (item.style == 1 && !company) {
            toastShort('请输入公司名称');
            return;
        }
        if (!name) {
            toastShort('请输入门店名称');
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
        if (!logo) {
            toastShort('请上传门店logo');
            return;
        }
        if (!banner) {
            toastShort('请上传门店banner图');
            return;
        }
        if (!area) {
            toastShort('请选择门店所在地');
            return;
        }
        if (!address) {
            toastShort('请输入门店详细地址');
            return;
        }
        this.setState({
            canPress: false
        })
        this.netRequest.fetchPost(url, data)
            .then(result => {
                toastShort(result.msg);
                    // console.log(result);
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
        const { store, item, area, ready, refreshing, companyListData, mobile, name, company, realname, address, logo, banner, reminder, canPress } = this.state;
        let isStore = store.isStore == 1 ? true : false;
        console.log(this.state);
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'门店信息'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>基本信息</Text>
                            </View>
                            {item.style == 1 && <View style={[GlobalStyles.horLine, styles.horLine]} />}
                            {item.style == 1 && <View style={styles.infoItemView}>
                                <Text style={styles.infoItemTitle}>公司名称：</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    editable = {isStore}
                                    placeholder = "请输入公司名称"
                                    defaultValue = {company}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            company: text
                                        })
                                    }}
                                />
                            </View>}
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.infoItemView}>
                                <Text style={styles.infoItemTitle}>门店名称：</Text>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    editable = {isStore}
                                    placeholder = "请输入门店名称"
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
                                    editable = {isStore}
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
                                <TextInput
                                    style = {styles.inputItemCon}
                                    editable = {isStore}
                                    placeholder = "请输入联系电话"
                                    defaultValue = {mobile}
                                    maxLength = {11}
                                    keyboardType={'numeric'}
                                    placeholderTextColor = '#888'
                                    // customKeyboardType = "numberKeyBoard"
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
                                <Text style={styles.titleViewCon}>门店地址</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                style = {styles.inputItemConTextView}
                                onPress = {() => store.isStore == 1 && this.showAreaPicker()}
                            >
                                <Text style={styles.inputItemConText}>{area.length > 0 ? `${area[0]} - ${area[1]} - ${area[2]}` : '请选择省市区'}</Text>
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TextInput
                                style = {styles.inputItemCon}
                                editable = {isStore}
                                placeholder = "请输入详细地址"
                                defaultValue = {address}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        address: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>门店Logo</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                activeOpacity = {0.8}
                                style = {styles.uploadItemView}
                                onPress = {() => store.isStore == 1 && this.handleOpenImagePicker('1', GlobalStyles.width * 0.8, GlobalStyles.width * 0.8)}
                            >
                                {logo == '' ?
                                    <Image source={GlobalIcons.images_bg_upload} style={styles.uploadBtn} />
                                    :
                                    <Image source={{uri: logo}} style={styles.uploadImagesLogo} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>门店Banner</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TouchableOpacity
                                activeOpacity = {0.8}
                                style = {styles.uploadItemView}
                                onPress = {() => store.isStore == 1 && this.handleOpenImagePicker('2', GlobalStyles.width * 0.95, GlobalStyles.width * 0.95 / 2)}
                            >
                                {banner == '' ?
                                    <Image source={GlobalIcons.images_bg_upload} style={styles.uploadBtn} />
                                    :
                                    <Image source={{uri: banner}} style={styles.uploadImages} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.addressAddItemView, {marginTop: 10,}]}>
                            <View style={[styles.titleView]}>
                                <Text style={styles.titleViewCon}>温馨提示</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <TextInput
                                editable = {isStore}
                                style = {styles.inputItemMultilineCon}
                                multiline = {true}
                                defaultValue = {reminder}
                                placeholder = "请输入门店的温馨提示..."
                                placeholderTextColor = '#555'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        reminder: text
                                    })
                                }}
                            />
                        </View>
                        {store.isStore == 1 && <View style={[GlobalStyles.btnView, styles.btnView]}>
                            <TouchableOpacity
                                style = {GlobalStyles.btnView}
                                onPress = {() => {canPress && this.submit()}}
                            >
                                <Text style={GlobalStyles.btnItem}>立即修改</Text>
                            </TouchableOpacity>
                        </View>}
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
        padding: 15,
        height: 130,
        color: '#555',
        lineHeight: 20,
        textAlignVertical: 'top',
    },
    remarkConView: {
        padding: 15,
    },
    remarkConText: {
        color: '#555',
        lineHeight: 20,
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
        alignItems: 'center',
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
        // flex: 1,
        resizeMode: 'contain',
        width: GlobalStyles.width - 30,
        height: (GlobalStyles.width - 30) / 2,
    },
    uploadImagesLogo: {
        width: 220,
        height: 220,
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
});