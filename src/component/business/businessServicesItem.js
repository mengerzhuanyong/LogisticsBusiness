/**
 * 速芽物流商家端 - BusinessServicesItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import {toastShort, consoleLog} from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class BusinessServicesItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.item,
            index: this.props.item.index,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        // item: HomeNavigation
    }

    componentDidMount() {
        // consoleLog("参数传递", this.props.item);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            item: nextProps.item.item
        })
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    render(){
        const { item, index } = this.state;
        const { onPushToFlow } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.servicesName}>黄岛 - 北京</Text>
                <Text style={styles.servicesCon}>10点班次</Text>
                <Text style={styles.servicesCon}>25日21点 到达</Text>
                <TouchableOpacity
                    style = {styles.servicesBtnItem}
                    onPress = {onPushToFlow}
                >
                    <Text style={styles.servicesBtnName}>立即下单</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    servicesName: {
        fontSize: 15,
        color: '#555',
    },
    servicesCon: {
        fontSize: 13,
        color: '#555',
    },
    servicesBtnItem: {},
    servicesBtnName: {
        fontSize: 15,
        color: GlobalStyles.themeColor,
    },
});