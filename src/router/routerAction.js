/**
 * 速芽物流商家端 - 数据操作模块
 * http://menger.me
 * @大梦
 */

import { NavigationActions } from 'react-navigation'

export const routerReset = (content) => {
    setTimeout(() => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: content})
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }, 500)
};