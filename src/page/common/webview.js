/**
 * 速芽物流商家端 - 公共详情页
 * https://menger.me
 * @Meng
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    WebView,
    Dimensions,
    StyleSheet,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'

import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalIcons from '../../constant/GlobalIcon'
import GlobalStyles from '../../constant/GlobalStyle'
import {toastShort, consoleLog} from '../../util/utilsToast'
import SpinnerLoading from '../../component/common/SpinnerLoading'

const WEBVIEW_REF = 'webview';

export default class CommonWebView extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            api: params && params.api ? params.api : '',
            url: '',
            loading: true,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                loading: false,
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        this.onBack();
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };

    loadNetData = () => {
        let {api} = this.state;
        this.netRequest.fetchGet(api)
            .then(result => {
                if (result && result.code === 1) {
                    this.setState({
                        url: result.data.link
                    });
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    dropLoadMore = async () => {};

    freshNetData = async () => {};

    render(){
        let {canPress, loading, url} = this.state;
        let {params} = this.props.navigation.state;
        let pageTitle = (params && params.pageTitle) ? params.pageTitle : '详情';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {pageTitle}
                    leftButton = {UtilsView.getLeftButton(() => this.onBack())}
                /> 
                {!loading ?               
                    <WebView
                        ref={WEBVIEW_REF}
                        startInLoadingState={false}
                        source={{uri: url}}
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
        backgroundColor: '#fafafa',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
});