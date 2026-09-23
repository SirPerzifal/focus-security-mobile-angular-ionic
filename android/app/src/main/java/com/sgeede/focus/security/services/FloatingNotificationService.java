package com.sgeede.focus.security.services;
import com.sgeede.focus.security.R;
import android.view.Gravity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.graphics.PixelFormat;
import android.widget.TextView;

public class FloatingNotificationService extends Service {

    private WindowManager windowManager;
    private View floatingView;

    @Override
    public void onCreate() {
        super.onCreate();
        
        // Buat notifikasi persisten
        createNotificationChannel();
        Notification notification = new Notification.Builder(this, "CALL_SERVICE_CHANNEL")
                .setContentTitle("Incoming Call Service")
                .setContentText("Waiting for incoming calls...")
                .build();
        
        startForeground(1, notification); // Menjadikan service sebagai foreground service

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        floatingView = LayoutInflater.from(this).inflate(R.layout.floating_call_layout, null);

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY, 
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.TOP | Gravity.START;
        params.x = 100;
        params.y = 200;

        windowManager.addView(floatingView, params);

        // TextView callText = floatingView.findViewById(R.id.notif_message);
        // callText.setText("Incoming call..."); // Bisa diupdate dengan nama pemanggil
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    "CALL_SERVICE_CHANNEL",
                    "Call Notification Service",
                    NotificationManager.IMPORTANCE_LOW
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingView != null) {
            windowManager.removeView(floatingView);
        }
    }
}