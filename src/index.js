"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Vimeo = void 0;
var react_1 = require("react");
var react_native_webview_1 = require("react-native-webview");
var template_1 = require("../lib/template");
var Vimeo = function (_a) {
    var videoId = _a.videoId, onReady = _a.onReady, onPlay = _a.onPlay, onPlayProgress = _a.onPlayProgress, onPause = _a.onPause, onFinish = _a.onFinish, onVolumeChange = _a.onVolumeChange, onError = _a.onError, loop = _a.loop, controls = _a.controls, autoPlay = _a.autoPlay, _b = _a.speed, speed = _b === void 0 ? false : _b, style = _a.style, containerStyle = _a.containerStyle, getVimeoPlayer = _a.getVimeoPlayer;
    var _c = (0, react_1.useState)(false), isPlaying = _c[0], setPlaying = _c[1];
    var _d = (0, react_1.useState)(autoPlay), autoPlayValue = _d[0], setAutoPlay = _d[1];
    var _e = (0, react_1.useState)({}), handlers = _e[0], setHandlers = _e[1];
    var ref = (0, react_1.useRef)();
    var player = function (action) {
        var handler = ref.current.injectJavaScript;
        switch (action.type) {
            case 'play':
                if (isPlaying)
                    return;
                handler('play();');
                setPlaying(true);
                break;
            case 'pause':
                if (!isPlaying)
                    return;
                handler('pause();');
                setPlaying(false);
                break;
            case 'set_time':
                handler("setTime(".concat(action.time, ");"));
                break;
            case 'get_duration':
                registerBridgeEventHandler('duration', action.callback);
                handler('getDuration();');
                break;
            case 'get_time':
                registerBridgeEventHandler('currentTime', action.callback);
                handler('getTime();');
                break;
            default:
                break;
        }
    };
    var registerHandlers = function () {
        setHandlers({
            'ready': onReady,
            'play': onPlay,
            'playProgress': onPlayProgress,
            'pause': onPause,
            'finish': onFinish,
            'volumeChange': onVolumeChange,
            'error': onError
        });
    };
    var registerBridgeEventHandler = function (eventName, handler) {
        var newHandlers = __assign({}, handlers);
        newHandlers[eventName] = handler;
        setHandlers(newHandlers);
    };
    var onBridgeMessage = function (event) {
        var message = event.nativeEvent.data;
        var payload = JSON.parse(message);
        var handler = handlers[payload.name];
        handler && handler(payload.data);
    };
    (0, react_1.useEffect)(function () {
        registerHandlers();
    }, []);
    (0, react_1.useEffect)(function () {
        getVimeoPlayer && getVimeoPlayer(player);
    }, [getVimeoPlayer, player]);
    return (<react_native_webview_1.WebView source={{
            html: (0, template_1["default"])(videoId, loop, autoPlayValue, controls, speed)
        }} javaScriptEnabled={true} ref={ref} onMessage={onBridgeMessage} scalesPageToFit={false} onNavigationStateChange={function (a) { return console.log(a.url); }} onError={function (error) { return console.error(error); }} scrollEnabled={false} style={style} containerStyle={containerStyle} setBuiltInZoomControls={false} setDisplayZoomControls={false} automaticallyAdjustContentInsets allowsFullscreenVideo/>);
};
exports.Vimeo = Vimeo;
