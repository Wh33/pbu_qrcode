# pbu_qrcode
> 二维码生成并下载
#### 安装
```js
npm i pbu_qrcode
```

#### 使用
```js
import React from 'react';
import QRCode from 'pbu_qrcode';
import img from '../assets/Band-Logo.png'
function qrcode () {
    return (
            <QRCode
                value="https://login.seentao.com"
                logo={img}
                size={200}
                logoWidth={50}
                logoHeight={50}
                lBStyle={{width:100,height:30,display:'block'}}
                smBStyle={{width:100,height:30,display:'block'}}

            />
    )
}
export default qrcode;
```

#### 参数接口说明
```js
QRCode.propTypes = {
    value: PropTypes.string.isRequired,//二维码内容
    size: PropTypes.number,//二维码大小
    bgColor: PropTypes.string,//背景颜色
    fgColor: PropTypes.string,//内容颜色
    logo: PropTypes.string,//logo地址
    logoWidth: PropTypes.number,//logo宽度
    logoHeight: PropTypes.number,//logo高度
    addUrl: PropTypes.func,//生成图片下载地址
    isDownload: PropTypes.bool,//是否需要下载二维码
    downLoadLargerWidth: PropTypes.number,//下载大图的宽度
    downLoadLargerHeight: PropTypes.number,//下载大图的高度
    downLoadSmallWidth: PropTypes.number,//下载大图的宽度
    downLoadSmallHeight: PropTypes.number,//下载大图的宽度
    lBText: PropTypes.string,//大图下载按钮文案
    smBText: PropTypes.string,//小图下载按钮文案 
    lBStyle: PropTypes.object,//大图下载按样式
    smBStyle: PropTypes.object,//小图下载按钮样式
};

```
