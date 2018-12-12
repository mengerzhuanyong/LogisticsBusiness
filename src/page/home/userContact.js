/**
 * 速芽物流商家端 - UserContact
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
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import { formatPrice } from '../../util/utilsRegularMatch'

import NavigationButton from '../../component/common/headerRightButton'

import area from '../../asset/json/area.json'

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;

export default class UserContact extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            store: global.store.storeData,
            volumeViewCount: 1,
            contact: [],
            // contact: [{username: '', mobile: '', remark: ''}],
            canPress: true,
        };
        this.netRequest = new NetRequest();
    }

    contact = [];

    // contact = [{
    //     username: '',
    //     mobile: '',
    //     remark: '',
    // }];

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

    loadNetData = () => {
        let {contact, store} = this.state;
        let url = NetApi.contact;
        let data = {
            sid: store.sid,
        };
        this.netRequest.fetchPost(url, data, true)
            .then(result => {
                if (result && result.code === 1) {
                    this.setState({
                        contact: result.data,
                        volumeViewCount: result.data.length,
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })

    };

    renderVolumeView = () => {
        let { volumeViewCount, contact } = this.state;
        let views = [];
        if (!contact || contact.length < 1) {
            return;
        }
        for ( let i = 0; i < volumeViewCount; i++) {
            views.push(
                <View key={i}>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={[styles.orderRemarkInfoView]}>
                        <View style={styles.orderMoneyInfoItemView}>
                            <View style={styles.orderMoneyInfoItem}>
                                <TextInput
                                    style = {[styles.inputItemCon, styles.volumeInput]}
                                    placeholder = "请输入姓名"
                                    editable = {store.isStore != 1}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    value = {contact[i].username}
                                    onChangeText = {(text)=> {
                                        contact[i].username = text;
                                        this.setState({
                                            contact: contact
                                        });
                                        // console.log(contact);
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.verLine, styles.verLine]} />
                            <View style={[styles.orderMoneyInfoItem]}>
                                <TextInput
                                    // customKeyboardType = "numberKeyBoardWithDot"
                                    style = {[styles.inputItemCon, styles.volumeInput]}
                                    placeholder = "请输入电话"
                                    keyboardType={'numeric'}
                                    maxLength={11}
                                    editable = {store.isStore != 1}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    value = {contact[i].mobile}
                                    onChangeText = {(text)=> {
                                        contact[i].mobile = text;
                                        this.setState({
                                            contact: contact
                                        });
                                        // console.log(contact);
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.verLine, styles.verLine]} />
                            <View style={[styles.orderMoneyInfoItem, {flex: 3}]}>
                                <TextInput
                                    style = {[styles.inputItemCon, styles.volumeInput]}
                                    placeholder = "请输入备注"
                                    editable = {store.isStore != 1}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    value = {contact[i].remark}
                                    onChangeText = {(text)=> {
                                        contact[i].remark = text;
                                        this.setState({
                                            contact: contact
                                        });
                                        // console.log(contact);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        return views;
    };

    addVolumeView = () => {
        let { contact } = this.state;
        let obj = {
            username: '',
            mobile: '',
            remark: '',
        };
        contact.push(obj);
        this.setState({
            contact: contact,
            volumeViewCount: this.state.volumeViewCount + 1,
        })
    };

    submitFoo = () => {
        let {contact} = this.state;
        let url = NetApi.contactAdd;
        let data = {
            sid: 1,
            contact
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code === 1) {
                    toastShort('添加成功');
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    render(){
        let {store, contact} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'通讯录'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {<NavigationButton title={store.isStore == 1 ? '保存' : ''} titleStyle={{color: '#fff'}} type={'right'} submitFoo={() => this.submitFoo()} />}
                />
                <View style={styles.contactTitleView}>
                    <Text style={styles.orderMoneyInfoTitle}>姓名</Text>
                    <View style={[GlobalStyles.verLine, styles.verLine]} />
                    <Text style={styles.orderMoneyInfoTitle}>电话</Text>
                    <View style={[GlobalStyles.verLine, styles.verLine]} />
                    <Text style={[styles.orderMoneyInfoTitle, {flex: 3}]}>备注</Text>
                </View>
                <KeyboardAwareScrollView style={[styles.scrollViewContainer]}>
                    <View style={[styles.containerItemView]}>
                        {this.renderVolumeView()}
                    </View>
                    {store.isStore == 1 && <TouchableOpacity
                        style = {[GlobalStyles.listAddBtnView, {marginBottom: 20,}]}
                        onPress = {() => this.addVolumeView()}
                    >
                        <Image source={GlobalIcons.icon_add} style={GlobalStyles.listAddBtnIcon} />
                    </TouchableOpacity>}
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
        flex: 1,
    },
    containerItemView: {
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    horLine: {
        marginVertical: 3,
    },
    verLine: {
        height: 20,
        marginHorizontal: 5,
        backgroundColor: '#ddd',
    },
    contactTitleView: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    inputItemCon: {
        height: 40,
    },
    volumeInput: {
        flex: 1,
        fontSize: 13,
        color: '#555',
        // fontWeight: '600',
        textAlign: 'center',
        // borderBottomWidth: 1,
        // borderColor: '#f60',
        // backgroundColor: '#f60',
        textAlignVertical: 'bottom',
    },
    orderMoneyInfoItemView: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderMoneyInfoItem: {
        flex: 2,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderMoneyInfoTitle: {
        flex: 2,
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
    },
    orderMoneyInfoCon: {
        color: '#555',
    },
    listAddBtnView: {},
    listAddBtnIcon: {},
});
