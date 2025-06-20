#ifndef AppDelegatePlugin_h
#define AppDelegatePlugin_h

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(AppDelegatePlugin, "AppDelegatePlugin",
    CAP_PLUGIN_METHOD(getValueFromAppDelegate, CAPPluginReturnPromise);
)

#endif /* AppDelegatePlugin_h */
