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

const WEBVIEW_REF = 'webview';

export default class CommonWebView extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            api: params && params.api ? params.api : '',
            url: '',
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
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
        let {url} = this.state;
        let {params} = this.props.navigation.state;
        let pageTitle = (params && params.pageTitle) ? params.pageTitle : '详情';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {pageTitle}
                    leftButton = {UtilsView.getLeftButton(() => this.onBack())}
                />                
                <WebView
                    ref={WEBVIEW_REF}
                    startInLoadingState={true}
                    source={{uri: url}}
                    style={styles.webContainer}
                />
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