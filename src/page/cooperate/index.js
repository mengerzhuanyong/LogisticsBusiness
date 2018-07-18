/**
 * 速芽物流商家端 - Cooperate
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

const WEBVIEW_REF = 'webview';

export default class Cooperate extends Component {

    constructor(props){
        super(props);
        this.state={
            url: 'https://m.baidu.com',
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
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <StatusBar
                    animated = {true}
                    hidden = {false}
                    backgroundColor = {'#42b3ff'}
                    translucent = {true}
                    barStyle = {'default'}
                />
                {!loading ?
                    <WebView
                        ref={WEBVIEW_REF}
                        startInLoadingState={true}
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