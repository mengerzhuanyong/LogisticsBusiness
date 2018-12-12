/**
 * 速芽物流商家端 - RegularMatch
 * http://menger.me
 * @大梦
 */


import {toastShort, consoleLog} from './utilsToast'

const phoneRule = /^1[34578]\d{9}$/;

export const checkPhone = (phone) => {
	let status = phoneRule.test(phone);
	return status;
};

export const formatPrice = (price) => {

    //清除"数字"和"."以外的字符
    price = price.replace(/[^\d.]/g, "");

    //验证第一个字符是数字而不是
    price = price.replace(/^\./g, "");

    //只保留第一个. 清除多余的
    price = price.replace(/\.{2,}/g, ".");
    price = price.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

    //只能输入两个小数
    price = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

    return price;
}