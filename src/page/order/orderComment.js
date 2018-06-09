/**
 * 速芽物流商家端 - OrderComment
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
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

export default class OrderComment extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
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

    doSubmitComment = () => {

    }

    render(){
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.commentItemView, styles.commentOrderInfoView]}>
                    <Image source={GlobalIcons.banner1} style={styles.commentOrderImage} />
                    <View style={styles.commentCompanyView}>
                        <View style={styles.commentCompanyInfoItem}>
                            <Text style={styles.commentCompanyName}>顺丰速递</Text>
                        </View>
                        <View style={styles.commentCompanyInfoItem}>
                            <View style={styles.commentCompanyInfoLeftView}>

                                <Text style={styles.commentCompanyInfoConText}>发货班次：</Text>
                                <Text style={styles.commentCompanyInfoConText}>黄岛 - 上海</Text>
                            </View>
                            <View style={styles.commentCompanyInfoRightView}>
                                <Text style={styles.commentCompanyInfoConText}>10-11点班次</Text>
                            </View>
                        </View>
                        <View style={styles.commentCompanyInfoItem}>
                            <Text style={styles.commentCompanyInfoConText}>订单价格：</Text>
                            <Text style={styles.commentCompanyInfoMoney}>¥ 50.00</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.commentItemView, styles.commentStarInfoView]}>
                    <Text style={styles.commentStarInfoTitle}>星级评价</Text>
                    <View style={styles.commentStarConView}>
                        <TouchableOpacity style={styles.commentStarItem}>
                            <Image source={GlobalIcons.icon_star_red} style={styles.commentStarIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentStarItem}>
                            <Image source={GlobalIcons.icon_star_red} style={styles.commentStarIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentStarItem}>
                            <Image source={GlobalIcons.icon_star_red} style={styles.commentStarIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentStarItem}>
                            <Image source={GlobalIcons.icon_star_gray} style={styles.commentStarIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentStarItem}>
                            <Image source={GlobalIcons.icon_star_gray} style={styles.commentStarIcon} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.commentStarGrade}>3.0</Text>
                </View>
                <View style={[styles.commentItemView, styles.commentContextView]}>
                    <TextInput
                        style = {styles.inputItemCon}
                        multiline = {true}
                        placeholder = "填写您的评价..."
                        placeholderTextColor = '#888'
                        underlineColorAndroid = {'transparent'}
                        onChangeText = {(text)=>{
                            this.setState({
                                mobile: text
                            })
                        }}
                    />
                </View>
                <View style={GlobalStyles.btnView}>
                    <TouchableOpacity
                        style = {GlobalStyles.btnView}
                        onPress = {() => {this.doSubmitComment()}}
                    >
                        <Text style={GlobalStyles.btnItem}>提交</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    commentItemView: {
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    commentOrderInfoView: {},
    commentOrderImage: {
        width: 80,
        height: 80,
        marginRight: 15,
        resizeMode: 'cover',
    },
    commentCompanyView: {
        flex: 1,
        height: 80,
        justifyContent: 'space-around',
    },
    commentCompanyInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentCompanyName: {
        fontSize: 16,
        color: '#333',
    },
    commentCompanyInfoLeftView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentCompanyInfoConText: {
        fontSize: 13,
        color: '#555',
    },
    commentCompanyInfoRightView: {},
    commentCompanyInfoMoney: {
        fontSize: 16,
        color: '#f60',
    },
    commentStarInfoView: {},
    commentStarInfoTitle: {},
    commentStarConView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentStarItem: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    commentStarIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    commentStarGrade: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    commentContextView: {},
    inputItemCon: {
        height: 120,
    },
});
