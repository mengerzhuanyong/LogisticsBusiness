/**
 * 速芽物流商家端 - MineInfoSetting
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    loadNetData = () => {
        
    }

    render(){
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {params.webTitle}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <KeyboardAwareScrollView>
                    <View style={[styles.mineInfoItemView, styles.mineInfoPhotoView]}>
                        <Text style={[styles.mineInfoItemTitle]}>头像</Text>
                        <Image source={GlobalIcons.images_user_photo} style={styles.userPhoto} />
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={[styles.mineInfoItemView]}>
                        <Text style={[styles.mineInfoItemTitle]}>昵称</Text>
                        <TextInput
                            style = {styles.inputItemCon}
                            placeholder = "请输入昵称"
                            placeholderTextColor = '#888'
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    mobile: text
                                })
                            }}
                        />
                    </View>
                    <View style={[styles.mineInfoItemView, GlobalStyles.marginTop10]}>
                        <Text style={[styles.mineInfoItemTitle]}>手机</Text>
                        <TextInput
                            style = {styles.inputItemCon}
                            placeholder = "请输入您的手机号"
                            maxLength = {11}
                            placeholderTextColor = '#888'
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    mobile: text
                                })
                            }}
                        />
                    </View>
                    <View style={[GlobalStyles.btnView, styles.btnView]}>
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {this.doLogin()}}
                        >
                            <Text style={GlobalStyles.btnItem}>确认修改</Text>
                        </TouchableOpacity>
                    </View>
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
    horLine: {},
    mineInfoItemView: {
        padding: 15,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',        
        justifyContent: 'space-between',
    },
    mineInfoPhotoView: {
        height: 80,
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'contain',
    },
    inputItemCon: {
        flex: 1,
        textAlign: 'right',
        height: 40,
    },
    inputItemConText: {
        height: 130,
    },
    btnView: {
        marginVertical: 50,
    }
});
