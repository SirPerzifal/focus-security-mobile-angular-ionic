package com.sgeede.focus.security;

import android.app.Service;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import java.io.ByteArrayOutputStream;

public class CallNotificationService extends Service {
    private static final String CHANNEL_ID = "call_channel";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel(); // Buat channel jika belum ada
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String callerName = intent.getStringExtra("callerName");
        byte[] byteArray = intent.getByteArrayExtra("callerImage");

        Bitmap callerImage = null;
        if (byteArray != null) {
            callerImage = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
        }

        Notification notification = buildNotification(callerName, callerImage);
        
        startForeground(1, notification);

        return START_STICKY;
    }

    private Notification buildNotification(String callerName, Bitmap callerImage) {
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, CHANNEL_ID)
                        .setSmallIcon(android.R.drawable.ic_dialog_info)
                        .setContentTitle("Panggilan Masuk")
                        .setContentText(callerName)
                        .setLargeIcon(callerImage)
                        .setCategory(NotificationCompat.CATEGORY_CALL)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setOngoing(true);

        return notificationBuilder.build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Call Notification Channel",
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Notifikasi untuk panggilan masuk");
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
