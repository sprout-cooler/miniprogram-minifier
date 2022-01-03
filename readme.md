### minigroparm-minifier

提供 小程序 `.wxml` ,`.wxss`, `.js` 文件的压缩能力。
安装
npm i -D wxml-minifier

使用
let minifier = require('wxml-minifier')
let fs = require('fs')
let resource = fs.readSync('./app.wxml') // 假设输入为：<view class="home"    ></view>       <!-- test -->
let result = minifier(resource)
console.log(result) // <view class="home"></view>
