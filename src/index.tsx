import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';

import webplayer from '../lib/template';
import { LayoutProps, PossiblePlayerActions } from '../lib/types';

export const Vimeo: React.FC<LayoutProps> = ({
  videoId,
  onReady,
  onPlay,
  onPlayProgress,
  onPause,
  onFinish,
  onVolumeChange,
  onError,
  loop,
  controls,
  autoPlay,
  speed = false,
  style,
  containerStyle,
  getVimeoPlayer,
}) => {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [autoPlayValue, setAutoPlay] = useState<boolean>(autoPlay);
  const [handlers, setHandlers] = useState({});
  const ref = useRef<WebView>();

  const player = (action: PossiblePlayerActions) => {
    const handler = ref.current.injectJavaScript;

    switch(action.type) {
      case 'play':
        if (isPlaying) return;
        handler('play();');
        setPlaying(true);
        break;
      case 'pause':
        if (!isPlaying) return;
        handler('pause();');
        setPlaying(false);
        break;
      case 'set_time':
        handler(`setTime(${action.time});`);
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

  const registerHandlers = () => {
    setHandlers({
      'ready': onReady,
      'play': onPlay,
      'playProgress': onPlayProgress,
      'pause': onPause,
      'finish': onFinish,
      'volumeChange': onVolumeChange,
      'error': onError,
    });
  };

  const registerBridgeEventHandler = (eventName: string, handler: any) => {
    const newHandlers = {...handlers};
    newHandlers[eventName] = handler;
    setHandlers(newHandlers);
  };

  const onBridgeMessage = (event: any) => {
    const message = event.nativeEvent.data;
    const payload = JSON.parse(message);
    const handler = handlers[payload.name];
    handler && handler(payload.data);
  };

  useEffect(() => {
    registerHandlers();
  }, []);

  useEffect(() => {
    getVimeoPlayer && getVimeoPlayer(player);
  }, [getVimeoPlayer, player]);

  return (
    <WebView
      source={{
        html: webplayer(videoId, loop, autoPlayValue, controls, speed),
      }}
      javaScriptEnabled={true}
      ref={ref}
      onMessage={onBridgeMessage}
      scalesPageToFit={false}
      onNavigationStateChange={a => console.log(a.url)}
      onError={(error) => console.error(error)}
      scrollEnabled={false}
      style={style}
      containerStyle={containerStyle}
      setBuiltInZoomControls={false}
      setDisplayZoomControls={false}
      automaticallyAdjustContentInsets
      allowsFullscreenVideo
    />
  );
};
