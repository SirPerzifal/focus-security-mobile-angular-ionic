package com.sgeede.focus.security;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import android.util.Log;
import com.sgeede.focus.security.MyFirebaseMessagingService;
import android.app.NotificationManager;
import android.content.Context;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent == null) {
            return;
        }

        Bundle extras = intent.getExtras();
        if (extras != null && extras.containsKey("callAction")) {
            NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.cancel(3000);
            MyFirebaseMessagingService.stopRingtone();
            Log.e("MainActivity", "Masukkk: ");
            String callAction = intent.getStringExtra("callAction");
            String receiverName = intent.getStringExtra("receiverName");
            String callerSocketId = intent.getStringExtra("callerSocketId");
            String callerName = intent.getStringExtra("callerName");
            Log.e("MainActivity", "callAction received here: " + callAction);
            if (bridge.getWebView() != null) {
                bridge.getWebView().post(() -> {
                    String js =
                        "let existingData = localStorage.getItem('callData');" +
                        "let newCall = { callAction: '" + callAction + "', callerName: '" + callerName +
                        "', receiverName: '" + receiverName + "', callerSocketId: '" + callerSocketId + "' };" +
                        "if (existingData) {" +
                        "    let parsedData = JSON.parse(existingData);" +
                        "    if (!Array.isArray(parsedData)) { parsedData = [parsedData]; }" +
                        "    parsedData.push(newCall);" +
                        "    localStorage.setItem('callData', JSON.stringify(parsedData));" +
                        "} else {" +
                        "    localStorage.setItem('callData', JSON.stringify([newCall]));" +
                        "}";
                    bridge.getWebView().evaluateJavascript(js, null);
                });
            }
        }
    }

}
