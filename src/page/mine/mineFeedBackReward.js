/**
 * 速芽物流用户端 - MineFeedBackReward
 * http://menger.me
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
import SpinnerLoading from '../../component/common/SpinnerLoading'

export default class MineFeedBackReward extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            sid: global.store ? global.store.storeData.sid : '',
            canPress: true,
            canBack: false,
            loading: true,
            url: '',
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
                loading: false,
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
        let url = NetApi.mineFeedbackReward;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.updateState({
                    url: result.data.link
                })
                // consoleLog('登录', result);
            })
            .catch( error => {
                // consoleLog('登录出错', error);
            })
    }

    render(){
        let {canPress, loading} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'有奖建议'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {!loading ?
                    <WebView
                        ref={(webView) => {this.webview = webView}}
                        startInLoadingState={false}
                        source={{uri: this.state.url}}
                        style={styles.webContainer}
                    />
                    : <SpinnerLoading isVisible={loading}/>
                }
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
    }
});
