/**
 * 速芽物流用户端 - MineStoreNote
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    WebView,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
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
import RightButton from '../../component/common/headerRightButton'

export default class MineStoreNote extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            store: global.store ? global.store.storeData : '',
            content: '',
            canPress: true,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        if (global.store) {
            this.setState({
                store: global.store.storeData
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

    loadNetData = () => {
        let {store} = this.state;
        let url = NetApi.index + store.sid;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code == 1) {
                    this.setState({
                        content: result.data.hot_note,
                    })
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    submitChange = () => {
        let {store, content} = this.state;
        let url = NetApi.mineStoreNote;
        let data = {
            sid: store.sid,
            hot_note: content,
        };
        if (!content) {
            toastShort('请输入门店公告信息', 'center');
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

    render(){
        let {canPress, content, store} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'门店公告'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {<RightButton title={store.isStore == 1 ? '保存' : ''} titleStyle={{color: '#fff'}} submitFoo = {() => this.submitChange()} />}
                />
                <View style={styles.content}>
                    {store.isStore == 0 ?
                        <Text style={styles.noteContext}>{content}</Text>
                        :
                        <TextInput
                            multiline = {true}
                            defaultValue = {content}
                            style = {styles.inputItemConText}
                            placeholder = "填写您的建议与意见..."
                            placeholderTextColor = '#333'
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    content: text
                                })
                            }}
                        />
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    noteContext: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    horLine: {
        marginVertical: 5,
    },
    feedbackContextView: {},
    inputItemCon: {
        height: 45,
    },
    inputItemConText: {
        flex: 1,
        padding: 15,
        // height: 200,
        fontSize: 14,
        color: '#333',
        lineHeight: 30,
        borderRadius: 5,
        textAlignVertical: 'top',
        backgroundColor: '#fafafa',
        // backgroundColor: '#123',
    },
    btnView: {
        width: GlobalStyles.width - 70,
        marginVertical: 50,
    }
});
