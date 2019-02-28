/**
 * @author zhaowenhui
 * @description 二维码生成器
 */
import React from 'react';
import PropTypes from 'prop-types';
import qr from 'qr.js';
import ReactDOM from 'react-dom';
var URL = '';
function getBackingStorePixelRatio(ctx) {
    return (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    );
}

var getDOMNode;
if (/^0\.14/.test(React.version)) {
    getDOMNode = function(ref) {
        return ref;
    }
} else {
    getDOMNode = function(ref) {
        return ReactDOM.findDOMNode(ref);
    }
}

class QRCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        }
    }

    shouldComponentUpdate(nextProps) {
        var that = this;
        return Object.keys(QRCode.propTypes).some(function(k) {
            return that.props[k] !== nextProps[k];
        });
    }

    componentDidMount() {
        var canvas = getDOMNode(this.refs.canvas);
        var width  = this.props.size;
        var height  = this.props.size;
        this.update(canvas,width,height);
    }

    componentDidUpdate() {
        var canvas = getDOMNode(this.refs.canvas);
        var width  = this.props.size;
        var height  = this.props.size;
        this.update(canvas,width,height);
    }

    utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    update(canvas,width,height,callback) {
        var value = this.utf16to8(this.props.value);
        var qrcode = qr(value);
        var ctx = canvas.getContext('2d');
        var cells = qrcode.modules;
        var tileW = width / cells.length;
        var tileH = height / cells.length;
        var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
        canvas.height = height * scale;
        canvas.width = width * scale;
        ctx.scale(scale, scale);
        cells.forEach(function(row, rdx) {
            row.forEach(function(cell, cdx) {
                ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
                var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            }, this);
        }, this);
        if (this.props.logo) {//绘制中间logo
            var self = this
            var size = width;
            var image = document.createElement('img');
            image.src = this.props.logo;
            image.onload = function() {//图片加载完成后
                var dwidth = self.props.logoWidth || size * 0.2;
                var dheight = self.props.logoHeight || image.height / image.width * dwidth;
                var dx = (size - dwidth*(width/self.props.size)) / 2;
                var dy = (size - dheight*(height/self.props.size)) / 2;
                image.width = dwidth;
                image.height = dheight;
                image.setAttribute("crossOrigin",'Anonymous')
                ctx.drawImage(image, dx, dy, dwidth*(width/self.props.size), dheight*(height/self.props.size));
                URL = canvas.toDataURL("image/png");//转换到url地址
                if (typeof callback === 'function') {
                    callback(URL);
                }
            }

        }else{
            URL  = canvas.toDataURL("image/png");//转换到url地址
            if (typeof callback === 'function') {
                callback(URL);
            }
        }
    }

    // 构造a标签并模拟点击
    createDownload (imgdata){
        var downloadLink = document.getElementById('downloadLink');
        downloadLink.setAttribute('href', imgdata);
        downloadLink.setAttribute('download', '二维码.png');
        downloadLink.click();
    }

    /**
     * [onClickDownLoad 点击下载二维码]
     * @param  {[type]} width  [图片下载宽度]
     * @param  {[type]} height [图片下载高度]
     * @return {[type]}        [description]
     */
    onClickDownLoad (width,height){
        var canvas = document.createElement('canvas');
        this.update(canvas,width,height,(imgdata)=>{this.createDownload(imgdata)})
    }


    /**
     * [resize 根据尺寸剪裁图片]
     * @param  {[type]}   width    [图片下载宽度]
     * @param  {[type]}   height   [图片下载高度]
     * @param  {Function} callback [图片加载成功后的回调]
     * @return {[type]}            [description]
     */
    resize (width, height, callback){
        // // 创建临时图片对象
        // var image = new Image;
        // // 创建画布
        // var canvas = document.createElement('canvas');

        // var context = canvas.getContext('2d');
        // var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(context);
        // var self = this;
        // image.src =  URL
        // // 临时图片加载
        // image.onload = function(){
        // // 图片尺寸
        // // var img_w = image.naturalWidth;
        // // var img_h = image.naturalHeight;
        // // 缩略后尺寸
        // // var dimg_w;
        // // var dimg_h;
        // // // 计算缩略尺寸
        // // dimg_w = width;
        // // dimg_h = Math.ceil(dimg_w*img_h/img_w);
        // // if(dimg_h>height){
        // //     dimg_h = height;
        // //     dimg_w = Math.ceil(dimg_h*img_w/img_h);
        // // }
        //     // 定义画布尺寸
        //     canvas.width = width*scale;
        //     canvas.height = height*scale;
        //     // 在画布上按缩略尺寸画图
        //     context.drawImage(image, 0, 0, self.props.size, self.props.size);
        //     // 获取画布数据
        //     var imgdata = canvas.toDataURL("image/png");
        //     // 将画布数据回调返回
        //     if(typeof(callback)==='function'){
        //         callback(imgdata);
        //     }
        // }
    }

    //创建一个canvas节点
    qCanvas (){
        return  React.createElement('canvas', {
            id: 'qrcode',
            style: { height: this.props.size, width: this.props.size },
            height: this.props.size,
            width: this.props.size,
            ref: 'canvas'
        });
    }

    //展示下载按钮
    downLoadButton(){
        const {
            downLoadLargerWidth,
            downLoadLargerHeight,
            downLoadSmallWidth,
            downLoadSmallHeight,
            isDownload,
            lBText,
            smBText,
            lBStyle,
            smBStyle,
        } = this.props;
        if(isDownload){
            return <div>
                <a id="downloadLink"></a>
                <button
                    style={lBStyle}
                    type="button"
                    onClick={this.onClickDownLoad.bind(this,downLoadLargerWidth/2,downLoadLargerHeight/2)}
                >
                    {lBText}
                </button>
                <button
                    style={smBStyle}
                    type="button"
                    onClick={this.onClickDownLoad.bind(this,downLoadSmallWidth/2,downLoadSmallHeight/2)}
                >
                    {smBText}
                </button>
            </div>
        }
    }

    render() {
        return(
            <div>
                {this.qCanvas()}
                {this.downLoadButton()}
            </div>
        )
        
        
    }
}

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

QRCode.defaultProps = {
    size: 128,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    value: 'https://login.seentao.com',
    isDownload: true,
    downLoadLargerWidth: 1000,
    downLoadLargerHeight: 1000,
    downLoadSmallWidth: 300,
    downLoadSmallHeight: 300,
    lBText: 'larger',
    smBText: 'small',
    // lBStyle: {width:100,height:30,display:'block'},
    // smBStyle: {width:100,height:30,display:'block'},
};
export default QRCode;
