'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _qr = require('qr.js');

var _qr2 = _interopRequireDefault(_qr);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author zhaowenhui
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description 二维码生成器
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var URL = '';
function getBackingStorePixelRatio(ctx) {
    return ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
}

var getDOMNode;
if (/^0\.14/.test(_react2.default.version)) {
    getDOMNode = function getDOMNode(ref) {
        return ref;
    };
} else {
    getDOMNode = function getDOMNode(ref) {
        return _reactDom2.default.findDOMNode(ref);
    };
}

var QRCode = function (_React$Component) {
    _inherits(QRCode, _React$Component);

    function QRCode(props) {
        _classCallCheck(this, QRCode);

        var _this = _possibleConstructorReturn(this, (QRCode.__proto__ || Object.getPrototypeOf(QRCode)).call(this, props));

        _this.state = {
            url: ''
        };
        return _this;
    }

    _createClass(QRCode, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var that = this;
            return Object.keys(QRCode.propTypes).some(function (k) {
                return that.props[k] !== nextProps[k];
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.update();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.update();
        }
    }, {
        key: 'utf16to8',
        value: function utf16to8(str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if (c >= 0x0001 && c <= 0x007F) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
                    out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
                    out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
                } else {
                    out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
                    out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
                }
            }
            return out;
        }
    }, {
        key: 'update',
        value: function update() {
            var value = this.utf16to8(this.props.value);
            var qrcode = (0, _qr2.default)(value);
            var canvas = getDOMNode(this.refs.canvas);
            var ctx = canvas.getContext('2d');
            var cells = qrcode.modules;
            var tileW = this.props.size / cells.length;
            var tileH = this.props.size / cells.length;
            var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
            canvas.height = canvas.width = this.props.size * scale;
            ctx.scale(scale, scale);
            cells.forEach(function (row, rdx) {
                row.forEach(function (cell, cdx) {
                    ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
                    var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
                    var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
                    ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
                }, this);
            }, this);
            if (this.props.logo) {
                //绘制中间logo
                var self = this;
                var size = this.props.size;
                var image = document.createElement('img');
                image.src = this.props.logo;
                image.onload = function () {
                    //图片加载完成后
                    var dwidth = self.props.logoWidth || size * 0.2;
                    var dheight = self.props.logoHeight || image.height / image.width * dwidth;
                    var dx = (size - dwidth) / 2;
                    var dy = (size - dheight) / 2;
                    image.width = dwidth;
                    image.height = dheight;
                    image.setAttribute("crossOrigin", 'Anonymous');
                    ctx.drawImage(image, dx, dy, dwidth, dheight);
                    URL = canvas.toDataURL("image/png"); //转换到url地址
                };
            } else {
                URL = canvas.toDataURL("image/png"); //转换到url地址
            }
        }

        // 构造a标签并模拟点击

    }, {
        key: 'createDownload',
        value: function createDownload(imgdata) {
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

    }, {
        key: 'onClickDownLoad',
        value: function onClickDownLoad(width, height) {
            var _this2 = this;

            this.resize(width, height, function (imgdata) {
                _this2.createDownload(imgdata);
            });
        }

        /**
         * [resize 根据尺寸剪裁图片]
         * @param  {[type]}   width    [图片下载宽度]
         * @param  {[type]}   height   [图片下载高度]
         * @param  {Function} callback [图片加载成功后的回调]
         * @return {[type]}            [description]
         */

    }, {
        key: 'resize',
        value: function resize(width, height, callback) {
            // 创建临时图片对象
            var image = new Image();
            // 创建画布
            var canvas = document.createElement('canvas');

            var context = canvas.getContext('2d');
            var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(context);
            var self = this;
            image.src = URL;
            // 临时图片加载
            image.onload = function () {
                // 图片尺寸
                // var img_w = image.naturalWidth;
                // var img_h = image.naturalHeight;
                // 缩略后尺寸
                // var dimg_w;
                // var dimg_h;
                // // 计算缩略尺寸
                // dimg_w = width;
                // dimg_h = Math.ceil(dimg_w*img_h/img_w);
                // if(dimg_h>height){
                //     dimg_h = height;
                //     dimg_w = Math.ceil(dimg_h*img_w/img_h);
                // }
                // 定义画布尺寸
                canvas.width = width * scale;
                canvas.height = height * scale;
                // 在画布上按缩略尺寸画图
                context.drawImage(image, 0, 0, self.props.size, self.props.size);
                // 获取画布数据
                var imgdata = canvas.toDataURL("image/png");
                // 将画布数据回调返回
                if (typeof callback === 'function') {
                    callback(imgdata);
                }
            };
        }

        //创建一个canvas节点

    }, {
        key: 'qCanvas',
        value: function qCanvas() {
            return _react2.default.createElement('canvas', {
                id: 'qrcode',
                style: { height: this.props.size, width: this.props.size },
                height: this.props.size,
                width: this.props.size,
                ref: 'canvas'
            });
        }

        //展示下载按钮

    }, {
        key: 'downLoadButton',
        value: function downLoadButton() {
            var _props = this.props,
                downLoadLargerWidth = _props.downLoadLargerWidth,
                downLoadLargerHeight = _props.downLoadLargerHeight,
                downLoadSmallWidth = _props.downLoadSmallWidth,
                downLoadSmallHeight = _props.downLoadSmallHeight,
                isDownload = _props.isDownload,
                lBText = _props.lBText,
                smBText = _props.smBText,
                lBStyle = _props.lBStyle,
                smBStyle = _props.smBStyle;

            if (isDownload) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement('a', { id: 'downloadLink' }),
                    _react2.default.createElement(
                        'button',
                        {
                            style: lBStyle,
                            type: 'button',
                            onClick: this.onClickDownLoad.bind(this, downLoadLargerWidth, downLoadLargerHeight)
                        },
                        lBText
                    ),
                    _react2.default.createElement(
                        'button',
                        {
                            style: smBStyle,
                            type: 'button',
                            onClick: this.onClickDownLoad.bind(this, downLoadSmallWidth, downLoadSmallHeight)
                        },
                        smBText
                    )
                );
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                this.qCanvas(),
                this.downLoadButton()
            );
        }
    }]);

    return QRCode;
}(_react2.default.Component);

QRCode.propTypes = {
    value: _propTypes2.default.string.isRequired, //二维码内容
    size: _propTypes2.default.number, //二维码大小
    bgColor: _propTypes2.default.string, //背景颜色
    fgColor: _propTypes2.default.string, //内容颜色
    logo: _propTypes2.default.string, //logo地址
    logoWidth: _propTypes2.default.number, //logo宽度
    logoHeight: _propTypes2.default.number, //logo高度
    addUrl: _propTypes2.default.func, //生成图片下载地址
    isDownload: _propTypes2.default.bool, //是否需要下载二维码
    downLoadLargerWidth: _propTypes2.default.number, //下载大图的宽度
    downLoadLargerHeight: _propTypes2.default.number, //下载大图的高度
    downLoadSmallWidth: _propTypes2.default.number, //下载大图的宽度
    downLoadSmallHeight: _propTypes2.default.number, //下载大图的宽度
    lBText: _propTypes2.default.string, //大图下载按钮文案
    smBText: _propTypes2.default.string, //小图下载按钮文案 
    lBStyle: _propTypes2.default.object, //大图下载按样式
    smBStyle: _propTypes2.default.object //小图下载按钮样式
};

QRCode.defaultProps = {
    size: 128,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    value: 'https://login.seentao.com',
    isDownload: true,
    downLoadLargerWidth: 300,
    downLoadLargerHeight: 300,
    downLoadSmallWidth: 100,
    downLoadSmallHeight: 100,
    lBText: 'larger',
    smBText: 'small'
    // lBStyle: {width:100,height:30,display:'block'},
    // smBStyle: {width:100,height:30,display:'block'},
};
exports.default = QRCode;