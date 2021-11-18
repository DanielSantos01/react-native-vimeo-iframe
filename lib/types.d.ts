import { ViewStyle } from 'react-native';

export interface LayoutProps {
    videoId: string;
    loop: boolean;
    autoPlay: boolean;
    controls: boolean;
    speed?: boolean;
    onReady?: () => void;
    onPlay?: () => void;
    onPlayProgress?: (data: any) => void;
    onPause?: () => void;
    onFinish?: () => void;
    onVolumeChange?: () => void;
    onError?: () => void;
    getVimeoPlayer?: (vimeoPlayer: (actions: PossiblePlayerActions) => void) => void;
    scalesPageToFit?: boolean;
    style?: ViewStyle;
    containerStyle?: ViewStyle;
}

export interface TimePassInfo {
  seconds: number;
  percent: number;
  duration: number;
}

export type PossiblePlayerActions = 
  |{ type: 'play'; }
  |{ type: 'pause'; }
  |{ type: 'get_duration'; callback: (duration: number) => void; }
  |{ type: 'set_time'; time: number; }
  |{ type: 'get_time'; callback: (time: number) => void; }