# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Preserve line numbers and source file names for crash analytics / stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Preserve Annotations & JavaScript interfaces for WebView
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Capacitor core, plugin annotations, and methods
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

-keep public class * extends com.getcapacitor.Plugin { *; }

# Deprecated Capacitor v2 annotations (if any plugins still use them)
-keep @com.getcapacitor.NativePlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

# Preserve Cordova plugins
-keep public class * extends org.apache.cordova.* {
    public <methods>;
    public <fields>;
}

# Preserve Project Application and Activity
-keep class com.sgeede.focus.security.FocusSecurity { *; }
-keep class com.sgeede.focus.security.MainActivity { *; }

# Preserve custom project plugins, services, receivers, and workers
-keep class com.sgeede.focus.security.plugin.** { *; }
-keep class com.sgeede.focus.security.services.** { *; }
-keep class com.sgeede.focus.security.MyFirebaseMessagingService { *; }
-keep class com.sgeede.focus.security.CallActionReceiver { *; }
-keep class com.sgeede.focus.security.CallNotificationService { *; }
-keep class com.sgeede.focus.security.NavigationTypePlugin { *; }
-keep class com.sgeede.focus.security.MyWorker { *; }

# Preserve Glide
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class * extends com.bumptech.glide.module.AppGlideModule { <init>(...); }

# Suppress OkHttp & Okio warnings
-dontwarn okhttp3.**
-dontwarn okio.**

# Suppress Firebase Messaging & DirectBoot legacy/internal warnings
-dontwarn com.google.android.gms.internal.firebase_messaging.**
-dontwarn com.google.firebase.iid.**

# Preserve attributes essential for Kotlin coroutines, reflection, and callbacks
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Preserve Capacitor Community and Official plugins and their helper classes
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep class getcapacitor.community.** { *; }
-keep interface getcapacitor.community.** { *; }
-keep class com.capacitorjs.** { *; }
-keep interface com.capacitorjs.** { *; }
-keep class com.capacitorcommunity.** { *; }
-keep interface com.capacitorcommunity.** { *; }
-keep class com.ryltsov.** { *; }
-keep interface com.ryltsov.** { *; }

# Preserve Bluetooth LE plugin and its components
-keep class com.capacitorjs.community.plugins.bluetoothle.** { *; }
-keep interface com.capacitorjs.community.plugins.bluetoothle.** { *; }
-dontwarn com.capacitorjs.community.plugins.bluetoothle.**


