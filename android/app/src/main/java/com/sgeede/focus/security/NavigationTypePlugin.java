package com.sgeede.focus.security;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Build;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NavigationType")
public class NavigationTypePlugin extends Plugin {

    private String lastNavigationType = "";
    private View decorView;

    @Override
    public void load() {
        super.load();
        try {
            Activity activity = getActivity();
            if (activity != null && activity.getWindow() != null) {
                decorView = activity.getWindow().getDecorView();
                if (decorView != null) {
                    ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, windowInsets) -> {
                        try {
                            final WindowInsetsCompat insetsCopy = windowInsets;
                            v.post(() -> {
                                try {
                                    checkNavigationTypeChange(insetsCopy);
                                } catch (Throwable ignored) {}
                            });
                        } catch (Throwable ignored) {}
                        return ViewCompat.onApplyWindowInsets(v, windowInsets);
                    });
                }
            }
        } catch (Throwable e) {
            // Never allow insets setup to crash the app
        }
    }

    @PluginMethod
    public void getNavigationType(PluginCall call) {
        try {
            JSObject result = detectNavigationType();
            call.resolve(result);
        } catch (Throwable t) {
            JSObject fallback = new JSObject();
            fallback.put("type", "unknown");
            call.resolve(fallback);
        }
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        call.resolve();
    }

    private void checkNavigationTypeChange(WindowInsetsCompat insets) {
        if (insets == null) return;
        try {
            Insets navInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
            int navBarHeight = navInsets.bottom;
            float density = Resources.getSystem().getDisplayMetrics().density;
            int navBarHeightDp = density > 0 ? (int) (navBarHeight / density) : 0;

            String type = navBarHeightDp < 40 ? "gesture" : "button";

            if (!type.equals(lastNavigationType)) {
                lastNavigationType = type;

                JSObject data = new JSObject();
                data.put("type", type);
                data.put("heightDp", navBarHeightDp);
                data.put("heightPx", navBarHeight);

                notifyListeners("navigationTypeChanged", data);
            }
        } catch (Throwable ignored) {}
    }

    private JSObject detectNavigationType() {
        JSObject ret = new JSObject();
        try {
            if (decorView == null && getActivity() != null && getActivity().getWindow() != null) {
                decorView = getActivity().getWindow().getDecorView();
            }

            if (decorView != null) {
                WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(decorView);
                if (insets != null) {
                    Insets navInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
                    int navBarHeight = navInsets.bottom;
                    float density = Resources.getSystem().getDisplayMetrics().density;
                    int navBarHeightDp = density > 0 ? (int) (navBarHeight / density) : 0;

                    String type = navBarHeightDp < 40 ? "gesture" : "button";
                    lastNavigationType = type;

                    ret.put("type", type);
                    ret.put("heightDp", navBarHeightDp);
                    ret.put("heightPx", navBarHeight);
                    return ret;
                }
            }
        } catch (Throwable ignored) {}

        ret.put("type", "unknown");
        return ret;
    }
}