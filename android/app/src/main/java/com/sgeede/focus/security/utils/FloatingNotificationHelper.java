package com.sgeede.focus.security.utils;

import android.content.Context;
import android.content.Intent;
import com.sgeede.focus.security.services.FloatingNotificationService;

public class FloatingNotificationHelper {
    public static void showFloatingNotification(Context context, String caller) {
        Intent serviceIntent = new Intent(context, FloatingNotificationService.class);
        serviceIntent.putExtra("CALLER_NAME", caller);
        context.startService(serviceIntent);
    }
}