/**
 * 速芽物流商家端 - Cooperate
 * http://menger.me
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
import SpinnerLoading from '../../component/common/SpinnerLoading'

const WEBVIEW_REF = 'webview';

export default class Cooperate extends Component {

    constructor(props){
        super(props);
        this.state={
            url: 'https://m.baidu.com',
            loading: true,
        }
    }

    componentDidMount(){
        this.backTimer = setTimeout(() => {
            this.setState({
                loading: false,
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let {canPress, loading} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'Test'}
                    // statusBar = {{barStyle: 'dark-content',}}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {!loading ?
                    <WebView
                        ref={WEBVIEW_REF}
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
        backgroundColor: '#f1f2f3',
    },
    webContainer: {
        flex: 1,
        marginTop: -20,
        backgroundColor: '#f1f2f3',
    },
});