"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (id, loop, autoPlay, controls, speed) => `
<html>
  <head>
    <title></title>
    <script src="https://f.vimeocdn.com/js/froogaloop2.min.js"></script>
    <script src="https://player.vimeo.com/api/player.js"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        overflow: hidden;
      }

      iframe {
        overflow: hidden;
      }
    </style>
  </head>

  <body>

  <iframe
    id="player"
    src="https://player.vimeo.com/video/${id}?h=b1277af935&autoplay=${autoPlay ? '1' : '0'}&muted=1&loop=${loop ? '1' : '0'}&controls=${controls ? '1' : '0'}&speed=${speed ? '1' : '0'}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen></iframe>

  <script>
    const sendEvent = (evt, data) => {
      const payload = { name: evt, data: data };
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    };

    const player = new Vimeo.Player("player");
    
    const play = async () => {
      await player.play();
    };

    const pause = async () => {
      await player.pause();
    };

    const setTime = async (seconds) => {
      await player.setCurrentTime(seconds);
    };

    const getDuration = async () => {
      const duration = await player.getDuration();
      sendEvent('duration', duration);
    };

    player.on('ended', (data) => {
      sendEvent('finish', data);
    });

    player.on('play', (data) => {
      sendEvent('play', data);
    });

    player.on('pause', (data) => {
      sendEvent('pause', data);
    });

    player.on('loaded', (data) => {
      sendEvent('ready', data);
    });

    player.on('timeupdate', (data) => {
      sendEvent('playProgress', data);
    });

    player.on('volumechange', (data) => {
      sendEvent('volumeChange', data);
    });

    player.on('error', (data) => {
      sendEvent('error', data);
    });
  </script>

  </body>
</html>
`;
//# sourceMappingURL=index.js.map