"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vimeo = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const template_1 = __importDefault(require("./template"));
const Vimeo = ({ videoId, onReady, onPlay, onPlayProgress, onPause, onFinish, scalesPageToFit, loop, controls, autoPlay, speed = false, style, }) => {
    const [isReady, setReady] = react_1.default.useState();
    const [autoPlayValue, setAutoPlay] = react_1.default.useState(autoPlay);
    const toggleAutoPlay = react_1.default.useCallback(() => setAutoPlay(!autoPlayValue), [
        autoPlayValue,
    ]);
    const handlers = {};
    const registerHandlers = () => {
        registerBridgeEventHandler('ready', onReady ?? onReadyDefault);
        registerBridgeEventHandler('play', onPlay);
        registerBridgeEventHandler('playProgress', onPlayProgress);
        registerBridgeEventHandler('pause', onPause);
        registerBridgeEventHandler('finish', onFinish);
    };
    const registerBridgeEventHandler = (eventName, handler) => {
        handlers[eventName] = handler;
    };
    react_1.default.useEffect(() => {
        registerHandlers();
    }, [videoId, scalesPageToFit]);
    const onBridgeMessage = (event) => {
        const message = event.nativeEvent.data;
        let payload;
        try {
            payload = JSON.parse(message);
            if (payload?.name === 'finish') {
                toggleAutoPlay();
            }
        }
        catch (err) {
            return;
        }
        let handler = handlers[payload.name];
        if (handler)
            handler(payload.data);
    };
    const onReadyDefault = () => {
        setReady(true);
        if (onReady)
            setTimeout(onReady);
    };
    return (<react_native_1.TouchableWithoutFeedback onPress={toggleAutoPlay}>
      <react_native_webview_1.WebView source={{
        html: template_1.default(videoId, loop, autoPlayValue, controls, speed),
    }} javaScriptEnabled={true} bounces={false} onMessage={onBridgeMessage} scalesPageToFit={scalesPageToFit} onError={(error) => console.error(error)} style={[
        {
            marginTop: -8,
            marginLeft: -10,
        },
        style,
    ]}/>
    </react_native_1.TouchableWithoutFeedback>);
};
exports.Vimeo = Vimeo;
//# sourceMappingURL=index.js.map