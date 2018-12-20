/**
 * 速芽物流用户端 - RegularMatch
 * http://menger.me
 * @大梦
 */


import { toastShort, consoleLog } from './utilsToast'

const phoneRule = /^1[34578]\d{9}$/;

export const checkPhone = (phone) => {
    let status = phoneRule.test(phone);
    return status;
};

const float1 = /^[1-9]\d*$/;              // 匹配正整数
const float2 = /^-[1-9]\d*$/;             // 匹配负整数
const float3 = /^-?[1-9]\d*$/;            // 匹配整数
const float4 = /^[1-9]\d*|0$/;            // 匹配非负整数（正整数 + 0）
const float5 = /^-[1-9]\d*|0$/;           // 匹配非正整数（负整数 + 0）

const float6 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;                      // 匹配正浮点数
const float7 = /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;                   // 匹配负浮点数

const floatRule = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;         // 匹配浮点数
const float = /^\d+(\.\d+)?$/;              // 匹配f非负浮点数

const float9 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;             // 匹配非负浮点数（正浮点数 + 0）
const float10 = /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/;        // 匹配非正浮点数（负浮点数 + 0）

export const checkFloat = (number) => {
    let status = floatRule.test(number);
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