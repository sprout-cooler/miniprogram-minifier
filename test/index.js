var htmlMinifier = require('../src/wxml-minifier/htmlminifier');

var content = `
<wxs src="../../../../filters/tools.wxs" module="tools" />
<view class="infoForm-body">
    <view class="container block-part <%channel%>">
        <!-- 输入表单行 -->
        <view class="input-box flex-layout refer-selector" id="floatHeight">
            <view class="form-item-name text-fill">优惠</view>
            <view class="input-wrapper mutiple-inputs">
                <!-- 抵用券 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{couponStatus == 1 && couponInfo.couponId >= 0}}" bind:tap="jumpCouponList">
                    <view class="form-info-item">
                        <view class="input-content active-text discounts-text">已减 ￥{{couponInfo.amount}}</view>
                        <view class="input-content disable tips-text">立减金额已从房费中扣减</view>
                    </view>
                    <text class="iconfont icon-gengduo"></text>
                </view>
                <!-- 房券 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{couponStatus == 3}}">
                    <view class="form-info-item">
                        <view class="input-content active-text">{{couponInfo.couponName}}</view>
                    </view>
                </view>
                <!-- 无可用优惠券 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{couponStatus == 0}}">
                    <view class="form-info-item">
                        <text class="input-content disable">无可用优惠券</text>
                    </view>
                </view>
                <!-- 不使用优惠券 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{couponStatus == 1 && couponInfo.couponId == -1}}" bind:tap="jumpCouponList">
                    <view class="form-info-item">
                        <text class="input-content disable">不使用优惠券</text>
                    </view>
                    <text class="iconfont icon-gengduo"></text>
                </view>
                <!-- 不支持/不可使用优惠券 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{couponStatus == 2}}">
                    <view class="form-info-item">
                        <text class="input-content disable">不支持/不可使用优惠券</text>
                    </view>
                </view>
                <!-- 返现 -->
                <view class="form-info-wrapper flex-layout" wx:if="{{returnMoney > 0}}">
                    <view class="form-info-item">
                        <view class="input-content active-text discounts-text">返现 ￥{{returnMoney}}</view>
                        <view class="input-content disable tips-text">会员本人预订且入住离店后，返现金额将直接计入个人余额</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="container block-part">
        <!-- 输入表单行 -->
        <!-- 商旅因公因私选择 -->
        <view class="input-box" wx:if="{{baseData.corpOrder}}">
            <radio-group class="infoForm-business infoForm-business-radio" bindchange="businessChange">
                <label class="radio">
                    <radio color="#2098f0" class="radio-btn" value="{{true}}" checked="{{business === 'true'}}"/>商务出行
                </label>
                <label class="radio" style="margin-left: 20px;">
                    <radio color="#2098f0" class="radio-btn" value="{{false}}" checked="{{business === 'false'}}"/>休闲出行
                </label>
            </radio-group>
            <view class="infoForm-business infoForm-business-text" wx:if="{{business === 'true'}}">
                可使用企业账户支付，管理员可查看您的订单
            </view>
            <view class="infoForm-business infoForm-business-text" wx:if="{{business === 'false'}}">
                私人休闲出行，贵司无法查看您的订单
            </view>
        </view>
        <!-- 输入表单行 -->
        <view class="input-box flex-layout" bind:tap="openSelRoom">
            <view class="form-item-name text-fill">房间数量</view>
            <view class="input-wrapper">
                <!-- <input class="input" type="text"></input> -->
                <text class="input-content">{{roomsAmount}}间</text>
            </view>
            <text
                class="infoForm-rest-rooms"
                wx:if="{{baseData.roomRate.hotelSourceType == '7days' && baseData.roomRate.roomRate.quota < 3}}"
            >剩余 {{baseData.roomRate.roomRate.quota}} 间</text>
            <text class="iconfont icon-gengduo" hidden="{{mustSelf || baseData.roomRate.roomRate.quota <= 1 || baseData.roomMaxAmount === 1}}"></text>
        </view>
        <!-- 输入表单行 -->
        <view class="input-box flex-layout">
            <view class="form-item-name text-fill">入住人</view>
            <view class="input-wrapper mutiple-inputs">
                <!-- 可以编辑姓名 (只有在“本人预订本人入住的时候才需要校验是否可以修改姓名”)-->
                <view class="inline-wrapper flex-layout" wx:for="{{guestList}}" wx:key="{{index}}" wx:if="{{!(mustSelf && !baseData.updateMemberName)}}">
                    <input
                        class="input"
                        type="text"
                        value="{{item.guestName}}"
                        data-index="{{index}}"
                        maxlength="30"
                        placeholder="请输入入住人姓名"
                        bindinput="changeGuestName"
                    ></input>
                    <text
                        hidden="{{!item.guestName}}"
                        class="iconfont icon-sousuoqingchu input-clean-btn"
                        data-index="{{index}}"
                        data-value=""
                        bind:tap="changeGuestName"
                    ></text>
                </view>
                <!-- 不可编辑姓名 (只有在“本人预订本人入住的时候才需要校验是否可以修改姓名”)-->
                <view class="inline-wrapper flex-layout" wx:for="{{guestList}}" wx:key="{{index}}" wx:if="{{mustSelf && !baseData.updateMemberName}}">
                    <input
                        class="input"
                        type="text"
                        value="{{item.guestName}}"
                        data-index="{{index}}"
                        maxlength="30"
                        placeholder="请输入入住人姓名"
                        bindinput="changeGuestName"
                        disabled
                    ></input>
                </view>
            </view>
            <!-- <text class="iconfont icon-dingdanruzhurenmingzi"></text> -->
        </view>
        <!-- 输入表单行 -->
        <view class="input-box flex-layout">
            <view class="form-item-name text-fill">联系方式</view>
            <view class="input-wrapper flex-layout">
                <view class="cityCode-wrapper flex-layout" bindtap="openCityCodes">
                    <view class="cityCode-content">+ {{cityCodeInfo.nationCode}}</view>
                    <view
                        class="iconfont icon-xiangqingxiala cityCode-arrow"
                        bind:tap="changeCityCodes"
                    ></view>
                </view>
                <input
                    class="input"
                    value="{{phone}}"
                    type="text"
                    maxlength="11"
                    placeholder="请输入联系方式"
                    bindinput="changePhone"
                    style="flex: 1;"
                />
                <text
                    hidden="{{!phone}}"
                    class="iconfont icon-sousuoqingchu input-clean-btn"
                    data-value=""
                    bind:tap="changePhone"
                ></text>
            </view>
            <!-- <text class="iconfont icon-gengduo"></text> -->
        </view>
        <!-- 输入表单行 -->
        <!-- 证件类型 -->
        <view class="input-box flex-layout" wx:if="{{mustSelf}}" bindtap="doctTypeToggle">
            <view class="form-item-name text-fill">证件类型</view>
            <view class="input-wrapper flex-layout">
                {{doctTypeStr}}
            </view>
            <text class="iconfont icon-gengduo" wx:if="{{baseData.updateIDCard != 0 && supportForeignGuest == 1}}"></text>
        </view>
        <!-- 证件号码 -->
        <view class="input-box flex-layout" wx:if="{{mustSelf}}">
            <view class="form-item-name text-fill">证件号码</view>
            <view class="input-wrapper flex-layout">
                <input
                    class="input"
                    value="{{guestList[0].doctNo}}"
                    type="text"
                    maxlength="18"
                    placeholder="请输入证件号码"
                    bindinput="changeIdCard"
                    disabled="{{baseData.updateIDCard == 0}}"
                ></input>
                <text
                    wx:if="{{baseData.updateIDCard != 0}}"
                    hidden="{{!guestList[0].doctNo}}"
                    class="iconfont icon-sousuoqingchu input-clean-btn"
                    data-value=""
                    bind:tap="changeIdCard"
                ></text>
            </view>
            <!-- <text class="iconfont icon-gengduo"></text> -->
        </view>
        <!-- 输入表单行 -->
        <!-- 住客偏好 -->
        <view class="input-box flex-layout" bind:tap="jumpPreference">
            <view class="form-item-name text-fill">住客偏好</view>
            <view class="input-wrapper">
                <text class="input-content ellipsis">{{preferenceText || '无'}}</text>
            </view>
            <text class="iconfont icon-gengduo"></text>
        </view>
        <!-- 输入表单行 -->
        <!-- 高星到付的情况下都不隐藏 -->
        <view
            class="input-box flex-layout"
            bind:tap="openArriveTimes"
            hidden="{{!(!prepay && !isEnsureHighStart || isEnsureHighStart && baseData.query.mustPay != 1) || baseData.dayUseData}}"
        >
            <view class="form-item-name text-fill">到店时间</view>
            <view class="input-wrapper">
                <text class="input-content ellipsis">{{arriveTime}}</text>
            </view>
            <text class="iconfont icon-gengduo"></text>
        </view>
        <!-- 钟点房到店时间 -->
        <view
            class="input-box flex-layout"
            bind:tap="openArriveTimes"
            hidden="{{!baseData.dayUseData}}"
        >
            <view class="form-item-name text-fill">到店时间</view>
            <view class="input-wrapper">
                <text class="input-content ellipsis">预计{{tools.splitDate(arriveTimeStr, 1)}}前到店</text>
            </view>
            <text class="iconfont icon-gengduo"></text>
        </view>
        <!-- 输入表单行 -->
        <view class="input-box flex-layout">
            <view class="form-item-name text-fill">发票</view>
            <view class="input-wrapper">
                <text class="input-content ellipsis">如有需要请向前台索取</text>
            </view>
            <!-- <text class="iconfont icon-gengduo"></text> -->
        </view>
    </view>
</view>
`;

var result = htmlMinifier.minify(content, {
    collapseWhitespace: true,
    removeComments: true,
    keepClosingSlash: true
})
console.log(result);
console.log(content.length, 'result: ', result.length, result.length / content.length);