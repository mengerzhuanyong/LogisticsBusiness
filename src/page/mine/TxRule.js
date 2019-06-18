/**
 * @author jingkai
 * @creationTime time
 */

'use strict';
import React from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView} from 'react-native';
import NavigationBar from '../../component/common/NavigationBar'
import GlobalStyles from "../../constant/GlobalStyle";
import UtilsView from "../../util/utilsView";


export default class TxRule extends React.PureComponent {

    constructor(props) {
        super(props)
        let {params} = this.props.navigation.state;
        this.state = {

            canBack: false,
        }
    }

    componentDidMount() {

        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount() {
        this.backTimer && clearTimeout(this.backTimer);
        // this.timer && clearTimeout(this.timer);
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        // state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'提现规则'}
                    leftButton={UtilsView.getLeftButton(() => {
                        this.state.canBack && this.onBack()
                    })}

                />
                <View style={styles.mainView}>
                    <Text>
                        提现规则：</Text>
                    <Text> 1.提现方式：目前仅支持提现到支付宝；</Text>
                    <Text> 2.提现时间及金额：</Text>
                    <Text> （1）【财务管理】-【余额】每日可提现一次，单笔金额不能低于1元；</Text>
                    <Text> （2）【财务管理】-【余额】每周二、五可分别提现一次，单笔金额不能低于10元；</Text>
                    <Text> 3.到账时间：预计1-3个工作日到账。</Text>
                    <Text> 说明：</Text>
                    <Text> 1.实名认证用户提现的支付宝姓名必须与身份证姓名保持一致；</Text>
                    <Text> 2.如若输入信息或提现支付宝帐号有误，提现款项将会被退回，请检查后再次申请提现；</Text>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
       padding: 5,
    },
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
});