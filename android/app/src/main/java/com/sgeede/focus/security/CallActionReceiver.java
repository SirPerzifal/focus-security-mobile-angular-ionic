package com.sgeede.focus.security;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import android.app.NotificationManager;
import androidx.work.Data;
import android.app.PendingIntent;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import com.sgeede.focus.security.MyFirebaseMessagingService;

public class CallActionReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Log.e("CallActionReceiver", "Received action: " + intent.getAction());
        String callerName = intent.getStringExtra("callerName");
        String receiverName = intent.getStringExtra("receiverName");
        String callerSocketId = intent.getStringExtra("callerSocketId");
        if (action != null) {
            if (action.equals("com.sgeede.focus.security.ACTION_ACCEPT_CALL")) {
                Log.d("CallActionReceiver", "Call Accepted");
                MyFirebaseMessagingService.stopRingtone();
                dismissNotification(context);
                openApp(context, "acceptCall", callerName, receiverName, callerSocketId);
            } else if (action.equals("com.sgeede.focus.security.ACTION_REJECT_CALL")) {
                Log.d("CallActionReceiver", "Call Rejected");
                MyFirebaseMessagingService.stopRingtone();
                dismissNotification(context);
                openApp(context, "rejectCall", callerName, receiverName, callerSocketId);
            }
        }
    }

    private void dismissNotification(Context context) {
        NotificationManager notificationManager =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancel(3000);
    }

    private void openApp(Context context, String action, String callerName, String receiverName, String callerSocketId) {
        // Intent launchIntent = context.getPackageManager().getLaunchIntsentForPackage(context.getPackageName());
        Intent launchIntent = new Intent(context, MainActivity.class);

        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launchIntent.putExtra("callAction", action);
            launchIntent.putExtra("callerName", callerName);
            launchIntent.putExtra("receiverName", receiverName);
            launchIntent.putExtra("callerSocketId", callerSocketId);
            Log.e("CallActionReceiver", "444444444");
            PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 
                0, 
                launchIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            try {
                Log.e("CallActionReceiver", "5555555555");
                pendingIntent.send();
                Log.e("CallActionReceiver", "6666666666");
            } catch (PendingIntent.CanceledException e) {
                e.printStackTrace();
            }
        } else {
            Log.e("CallActionReceiver", "Gagal membuka aplikasi, launchIntent null.");
        }
    }


}
