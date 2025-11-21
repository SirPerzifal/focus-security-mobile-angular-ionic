import { registerPlugin } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core';

export interface NavigationTypePlugin {
  getNavigationType(): Promise<{ 
    type: 'gesture' | 'button' | 'unknown';
    heightDp?: number;
    heightPx?: number;
  }>;
  
  startListening(): Promise<void>;
  
  addListener(
    eventName: 'navigationTypeChanged',
    listenerFunc: (data: { type: string; heightDp: number }) => void
  ): Promise<PluginListenerHandle>;
}

const NavigationType = registerPlugin<NavigationTypePlugin>('NavigationType');

export default NavigationType;