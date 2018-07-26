/**
 * 速芽物流商家端 - ServiceEdit
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
import {Select, PullPicker} from 'teaset'
import Picker from 'react-native-picker'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import NavigationButton from '../../component/common/headerRightButton'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import {formatPrice} from '../../util/utilsRegularMatch'

import area from '../../asset/json/area.json'

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;

export default class ServiceEdit extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        // console.log('服务详情',params);
        this.state = {
            item: params.item,
            volumeViewCount: params.item.volmon.length > 0 ? params.item.volmon.length : 1,
            startArea: params.item.star,
            endArea: params.item.end,
            serviceSort: params.item.sort,
            beginTime: params.item.time1,
            endTime: params.item.time2,
            duration: params.item.duration,
            serviceType: params.item.style,
            prices: params.item.volmon,
            carPrices: params.item.car,
            canPress: true,
            storeServices: [],
            selectedServicesName: '',
            prices_tips: '',
            prices_tips_example: '',
            prices_tips_title: '',
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount() {
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
        this.onBack();
    }

    prices = [
        {
            min: '',
            max: '',
            volmon: '',
        },
    ];
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
    onPushToNextPage = (pageTitle, page, params = {}) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };
    loadNetData = () => {
        let url = NetApi.storeServices + '/seid/' + this.state.item.id;
        this.netRequest.fetchGet(url, true)
            .then(result => {
                if (result && result.code == 1) {
                    this.updateState({
                        storeServices: result.data.category,
                        prices_tips: result.data.prices_tips,
                        prices_tips_example: result.data.prices_tips_example,
                        prices_tips_title: result.data.prices_tips_title,
                        prices: result.data.volmon,
                    });
                }
            })
    };
    showTimePicker = (type) => {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for (let i = 1; i < 51; i++) {
            years.push(i + 1980);
        }
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                months.push(i);
                i = 0 + '' + i;
                hours.push(i);
            } else {
                months.push(i);
                hours.push(i);
            }
        }
        for (let i = 1; i < 32; i++) {
            days.push(i);
        }
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                i = 0 + '' + i;
                minutes.push(i);
            } else {
                minutes.push(i);
            }
        }
        let pickerData = [hours, minutes];
        // let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getHours(),
            // date.getHours() === 12 ? 12 : date.getHours()%12,
            date.getMinutes()
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择出发时间',
            wheelFlex: [1, 1],
            onPickerConfirm: pickedValue => {
                pickedValue = `${pickedValue[0]} : ${pickedValue[1]}`;
                // console.log(pickedValue);
                if (type == 'start') {
                    this.setState({
                        beginTime: pickedValue
                    })
                } else {
                    this.setState({
                        endTime: pickedValue
                    })
                }
            },
            onPickerCancel: pickedValue => {
            },
            onPickerSelect: pickedValue => {
                pickedValue = `${pickedValue[0]} : ${pickedValue[1]}`;
                // console.log(pickedValue);
                if (type == 'start') {
                    this.setState({
                        beginTime: pickedValue
                    })
                } else {
                    this.setState({
                        endTime: pickedValue
                    })
                }
            }
        });
        Picker.show();
    }
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
    }
    showAreaPicker = (type) => {
        Picker.init({
            pickerData: this.createAreaData(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区选择',
            selectedValue: [],
            onPickerConfirm: pickedValue => {
                if (type == 'start') {
                    this.setState({
                        startArea: pickedValue
                    })
                } else {
                    this.setState({
                        endArea: pickedValue
                    })
                }
                // console.log(pickedValue);
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {
                if (type == 'start') {
                    this.setState({
                        startArea: pickedValue
                    })
                } else {
                    this.setState({
                        endArea: pickedValue
                    })
                }
            }
        });
        Picker.show();
    }
    renderVolumeView = () => {
        let {prices} = this.state;
        let views = [];
        for (let i = 0; i < prices.length; i++) {
            views.push(
                <View key={i}>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={[styles.orderRemarkInfoView]}>
                        <View style={styles.orderMoneyInfoItem}>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>体积：</Text>
                                <Text style={[styles.orderMoneyInfoCon]}>{prices[i].min}</Text>
                                <Text style={styles.orderMoneyInfoConNum}>至</Text>
                                <Text style={[styles.orderMoneyInfoCon]}>{prices[i].max}</Text>
                                <Text style={styles.orderMoneyInfoConNum}>m³</Text>
                            </View>
                            <View style={[GlobalStyles.verLine, styles.verLine]}/>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>价格：</Text>
                                <TextInput
                                    keyboardType={'numeric'}
                                    style={[styles.inputItemCon, styles.volumeInput]}
                                    placeholder="请输入"
                                    placeholderTextColor='#888'
                                    defaultValue={prices[i].volmon}
                                    underlineColorAndroid={'transparent'}
                                    value={prices[i].volmon}
                                    onChangeText={(text) => {
                                        prices[i].volmon = formatPrice(text);
                                        this.setState({
                                            prices: prices
                                        })
                                        // console.log(prices);
                                    }}
                                />
                                <Text style={styles.orderMoneyInfoConNum}>元</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        return views;
    };
    addVolumeView = () => {
        let {prices} = this.state;
        let obj = {
            min: '',
            max: '',
            volmon: '',
        };
        prices.push(obj);
        this.setState({
            prices: prices,
            volumeViewCount: this.state.volumeViewCount + 1,
        })
    };
    submit = () => {
        let {item, startArea, endArea, serviceType, serviceSort, beginTime, endTime, duration, prices, carPrices} = this.state;
        let url = NetApi.submitEditService;
        let data = {
            id: item.id,
            start: startArea,
            end: endArea,
            time1: beginTime,
            time2: endTime,
            duration: duration,
            style: serviceType,
            car: carPrices,
            sort: serviceSort,
            volmon: prices,
        };
        if (!startArea) {
            toastShort('请输入发货地');
            return;
        }
        if (!endArea) {
            toastShort('请输入目的地');
            return;
        }
        if (!beginTime) {
            toastShort('请输入发车时间');
            return;
        }
        if (!endTime) {
            toastShort('请输入抵达时间');
            return;
        }
        if (!serviceType) {
            toastShort('请输入服务类型');
            return;
        }
        if (!prices) {
            toastShort('请输入服务价格');
            return;
        }
        for (var i = 0; i < prices.length - 1; i++) {
            let item = prices[i]
            if (item.volmon === '') {
                toastShort('请输入服务价格');
                return;
            }
        }
        // console.log(data);
        // return;
        this.setState({
            canPress: false,
        });
        this.netRequest.fetchPost(url, data, true)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    toastShort('修改成功');
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
                } else {
                    toastShort(result.msg);
                    this.setState({
                        canPress: true
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
    compare_hms = (a, b) => {
        var i = a.getHours() * 60 * 60 + a.getMinutes() * 60;
        var n = b.getHours() * 60 * 60 + b.getMinutes() * 60;
        // console.log(i, n);
        // if (i > n) {
        //     alert("a大");
        // } else if (i < n) {
        //     alert("b大");
        // } else {
        //     alert("一样大");
        // }
    }
    renderPricesTips = (data) => {
        if (!data || data.length < 1) {
            return;
        }
        let tips = data.map((item, index) => {
            return (
                <Text key={item.id} style={{fontSize: 14, color: '#555', marginBottom: 5,}}>
                    {item.value}
                    <Text style={{fontSize: 14, color: '#f00', marginBottom: 5,}}>{item.tips}</Text>
                </Text>
            );
        });
        return tips;
    }

    render() {
        let {
            startArea, endArea, serviceType, serviceSort,
            beginTime, endTime, duration, canPress, selectedServicesName, carPrices, storeServices,
            prices_tips, prices_tips_example, prices_tips_title,
        } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'编辑服务信息'}
                    leftButton={UtilsView.getLeftButton(() => {
                        this.state.canBack && this.onBack()
                    })}
                    rightButton={<NavigationButton
                        icon={GlobalIcons.icon_help}
                        iconStyle={{tintColor: '#fff'}}
                        type={'right'}
                        submitFoo={() => this.onPushToNextPage('服务示例', 'WebViewPage', {api: NetApi.serviceHelp})}/>}
                />
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                    style={[GlobalStyles.hasFixedContainer, styles.scrollViewContainer]}
                >
                    <View style={[styles.searchView, styles.containerItemView]}>
                        <View style={styles.searchInputView}>
                            <View style={styles.searchInputItemView}>
                                <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeStartIcon]}>
                                    <Text style={GlobalStyles.placeText}>发</Text>
                                </View>
                                <TextInput
                                    style={[styles.inputItemCon, styles.addressDetailItemView]}
                                    defaultValue={startArea}
                                    placeholder="请输入出发地"
                                    placeholderTextColor='#888'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            startArea: text
                                        })
                                    }}
                                />
                                {/*<TouchableOpacity
                                        style = {styles.addressDetailItemView}
                                        onPress = {() => this.showAreaPicker('start')}
                                    >
                                        <Text style={styles.addressUserName}>{startArea.length > 0 ? `${startArea[0]} - ${startArea[1]} - ${startArea[2]}` : '请选择发货地'}</Text>
                                    </TouchableOpacity>*/}
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine, {marginLeft: 30,}]}/>
                            <View style={styles.searchInputItemView}>
                                <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeEndIcon]}>
                                    <Text style={GlobalStyles.placeText}>收</Text>
                                </View>
                                <TextInput
                                    style={[styles.inputItemCon, styles.addressDetailItemView]}
                                    defaultValue={endArea}
                                    placeholder="请输入目的地"
                                    placeholderTextColor='#888'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            endArea: text
                                        })
                                    }}
                                />
                                {/*<TouchableOpacity
                                        style = {styles.addressDetailItemView}
                                        onPress = {() => this.showAreaPicker('end')}
                                    >
                                        <Text style={styles.addressUserName}>{endArea.length > 0 ? `${endArea[0]} - ${endArea[1]} - ${endArea[2]}` : '请选择'}</Text>
                                    </TouchableOpacity>*/}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderRemarkInfoView]}>
                        <View style={styles.orderInfoItemView}>
                            <Text style={styles.orderCompanyInfoTitle}>服务信息</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                        <View style={[styles.orderRemarkInfoView]}>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>排序：</Text>
                                <TextInput
                                    keyboardType={'numeric'}
                                    style={[styles.inputItemCon, styles.itemRightCon]}
                                    defaultValue={serviceSort}
                                    placeholder="请输入序号"
                                    placeholderTextColor='#888'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            serviceSort: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            {/*<View style={styles.orderMoneyInfoItem}>
                                    <Text style={styles.orderMoneyInfoTitle}>发车时间：</Text>
                                    <TextInput
                                        // CustomKeyboard.CustomTextInput
                                        // customKeyboardType = "numberKeyBoardWithDot"
                                        style = {[styles.inputItemCon, styles.itemRightCon]}
                                        defaultValue = {beginTime}
                                        placeholder = "请输入发车时间"
                                        placeholderTextColor = '#888'
                                        underlineColorAndroid = {'transparent'}
                                        onChangeText = {(text)=> {
                                            this.setState({
                                                beginTime: text
                                            })
                                        }}
                                    />
                                    <Text style={styles.timeUnit}>点</Text>
                                </View>
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                <View style={styles.orderMoneyInfoItem}>
                                    <Text style={styles.orderMoneyInfoTitle}>抵达时间：</Text>
                                    <TextInput
                                        // CustomKeyboard.CustomTextInput
                                        // customKeyboardType = "numberKeyBoardWithDot"
                                        keyboardType = {'numeric'}
                                        style = {[styles.inputItemCon, styles.itemRightCon]}
                                        defaultValue = {endTime}
                                        placeholder = "请输入抵达时间"
                                        placeholderTextColor = '#888'
                                        underlineColorAndroid = {'transparent'}
                                        onChangeText = {(text)=> {
                                            this.setState({
                                                endTime: text
                                            })
                                        }}
                                    />
                                    <Text style={styles.timeUnit}>点</Text>
                                </View>*/}
                            <TouchableOpacity
                                style={styles.orderMoneyInfoItem}
                                onPress={() => this.showTimePicker('start')}
                            >
                                <Text style={styles.orderMoneyInfoTitle}>发车时间：</Text>
                                <Text style={styles.itemRightCon}>{beginTime != '' ? beginTime : '请选择出发时间'}</Text>
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <TouchableOpacity
                                style={styles.orderMoneyInfoItem}
                                onPress={() => this.showTimePicker('end')}
                            >
                                <Text style={styles.orderMoneyInfoTitle}>抵达时间：</Text>
                                <Text style={styles.itemRightCon}>{endTime != '' ? endTime : '请选择抵达时间'}</Text>
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>运输时长：</Text>
                                <TextInput
                                    // CustomKeyboard.CustomTextInput
                                    // customKeyboardType = "numberKeyBoard"
                                    keyboardType={'numeric'}
                                    style={[styles.inputItemCon, styles.itemRightCon]}
                                    defaultValue={duration}
                                    placeholder="请输入多少天能够到达"
                                    placeholderTextColor='#888'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            duration: text
                                        })
                                    }}
                                />
                                <Text style={styles.timeUnit}>天</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>服务类型：</Text>
                                <Select
                                    style={{width: 200, borderWidth: 0,}}
                                    value={selectedServicesName, serviceType}
                                    valueStyle={{flex: 1, color: '#555', textAlign: 'right'}}
                                    items={storeServices}
                                    getItemValue={(item, index) => item.value}
                                    getItemText={(item, index) => item.name}
                                    iconTintColor='#8a6d3b'
                                    placeholder='请选择服务类型'
                                    pickerTitle='服务类型选择'
                                    onSelected={(item, index) => this.setState({
                                        serviceType: item.value,
                                        selectedServicesName: item.name
                                    })}
                                />
                                {/*
                                        // 暂存
                                        <View style={styles.serviceTypeBtnView}>
                                        <TouchableOpacity
                                            style = {styles.serviceTypeBtnItem}
                                            onPress = {() => {
                                                this.setState({
                                                    serviceType: '1'
                                                })
                                            }}
                                        >
                                            <Text style={styles.serviceTypeBtnName}>当日达</Text>
                                            <Image source={serviceType == '1' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style = {styles.serviceTypeBtnItem}
                                            onPress = {() => {
                                                this.setState({
                                                    serviceType: '2'
                                                })
                                            }}
                                        >
                                            <Text style={styles.serviceTypeBtnName}>次日达</Text>
                                            <Image source={serviceType == '2' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style = {styles.serviceTypeBtnItem}
                                            onPress = {() => {
                                                this.setState({
                                                    serviceType: '3'
                                                })
                                            }}
                                        >
                                            <Text style={styles.serviceTypeBtnName}>航空</Text>
                                            <Image source={serviceType == '3' ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                                        </TouchableOpacity>
                                    </View>*/}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.containerItemView, styles.orderRemarkInfoView]}>
                        <View style={styles.orderInfoItemView}>
                            <Text style={styles.orderCompanyInfoTitle}>价格设定</Text>
                        </View>
                        {1 > 2 && <View style={styles.orderMoneyInfoItem}>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <Text style={styles.orderMoneyInfoTitle}>包车价格：</Text>
                            <TextInput
                                // CustomKeyboard.CustomTextInput
                                // customKeyboardType = "numberKeyBoardWithDot"
                                keyboardType={'numeric'}
                                style={[styles.inputItemCon, styles.itemRightCon]}
                                defaultValue={parseFloat(carPrices).toFixed(2)}
                                placeholder="请输入包车价格"
                                placeholderTextColor='#888'
                                underlineColorAndroid={'transparent'}
                                value={carPrices}
                                onChangeText={(text) => {
                                    price = formatPrice(text);
                                    this.setState({
                                        carPrices: price
                                    })
                                }}
                            />
                            <Text style={styles.timeUnit}>元</Text>
                        </View>}
                        {this.renderVolumeView()}
                    </View>
                    {1 > 2 && <TouchableOpacity
                        style={[GlobalStyles.listAddBtnView, {
                            marginBottom: 20,
                            position: 'absolute',
                            right: 10,
                            bottom: 30,
                            zIndex: 99
                        }]}
                        onPress={() => this.addVolumeView()}
                    >
                        <Image source={GlobalIcons.icon_add} style={GlobalStyles.listAddBtnIcon}/>
                    </TouchableOpacity>}
                    <View style={{padding: 20,}}>
                        <Text style={{fontSize: 15, color: '#333', marginBottom: 5,}}>{prices_tips_example}</Text>
                        <Text style={{fontSize: 15, color: '#333', marginBottom: 5,}}>{prices_tips_title}</Text>
                        {this.renderPricesTips(prices_tips)}
                    </View>
                </ScrollView>
                <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                    <TouchableOpacity
                        style={styles.orderDetailBtnItem}
                        onPress={() => this.onBack()}
                    >
                        <Text style={styles.orderDetailBtnName}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.orderDetailBtnItem, styles.orderDetailBtnItemCurrent]}
                        onPress={() => {
                            canPress && this.submit()
                        }}
                    >
                        <Image source={GlobalIcons.images_bg_btn} style={GlobalStyles.buttonImage}/>
                        <Text style={[styles.orderDetailBtnName, styles.orderDetailBtnNameCurrent]}>确认</Text>
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
    scrollViewContainer: {
        marginBottom: 80,
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
        height: 35,
        marginHorizontal: 15,
    },
    horLine: {
        marginVertical: 10,
    },
    searchView: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    searchInputView: {
        width: GlobalStyles.width - 30,
    },
    searchInputItemView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputItem: {
        flex: 1,
        height: 40,
    },
    placeText: {
        fontSize: 12,
        color: '#fff',
    },
    addressRightView: {
        flex: 1,
    },
    addressDetailView: {
        height: 60,
    },
    addressDetailItemView: {
        flex: 1,
        fontSize: 16,
        color: '#555',
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
        height: 35,
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
        fontSize: 16,
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
    inputItemCon: {
        height: 40,
    },
    volumeInput: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
        textAlign: 'center',
        // backgroundColor: '#123',
    },
    orderRemarkInfoView: {},
    orderMoneyInfoItem: {
        height: 40,
        flex: 1,
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
    orderDetailBtnView: {
        height: 80,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        // backgroundColor: '#123',
        justifyContent: 'space-between',
    },
    orderDetailBtnItem: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderColor: GlobalStyles.themeColor,
        width: (GlobalStyles.width - 100) / 2,
    },
    orderDetailBtnItemCurrent: {
        borderWidth: 0,
    },
    orderDetailBtnName: {
        fontSize: 14,
        color: GlobalStyles.themeColor,
    },
    orderDetailBtnNameCurrent: {
        color: '#fff',
    },
    serviceTypeBtnView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    serviceTypeBtnItem: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    serviceTypeBtnName: {
        color: '#333',
        marginRight: 10,
    },
    itemRightCon: {
        width: GlobalStyles.width - 130,
        textAlign: 'right',
        color: '#555'
    },
    timeUnit: {
        fontSize: 15,
        color: '#555',
    },
});
