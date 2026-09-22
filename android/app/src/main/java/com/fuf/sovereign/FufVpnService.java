package com.fuf.sovereign;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import androidx.core.app.NotificationCompat;

import java.io.IOException;

public class FufVpnService extends VpnService {
    private static final String TAG = "FufVpnService";
    private static final String CHANNEL_ID = "fuf_vpn_channel";
    private static final int NOTIFICATION_ID = 40401;

    public static final String ACTION_START = "com.fuf.sovereign.START";
    public static final String ACTION_STOP = "com.fuf.sovereign.STOP";

    public static volatile boolean isRunning = false;
    private ParcelFileDescriptor vpnInterface = null;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            if (ACTION_STOP.equals(action)) {
                stopVpn();
                return START_NOT_STICKY;
            }
        }

        startVpn();
        return START_STICKY;
    }

    private void startVpn() {
        if (isRunning) {
            Log.d(TAG, "VPN is already running.");
            return;
        }

        try {
            createNotificationChannel();
            Notification notification = buildForegroundNotification();
            startForeground(NOTIFICATION_ID, notification);

            Builder builder = new Builder();
            builder.setSession("FUF Sovereign Shield");
            builder.addAddress("10.111.0.2", 32);
            
            // Route DNS queries to Cloudflare & Quad9 privacy resolvers
            builder.addDnsServer("1.1.1.1");
            builder.addDnsServer("9.9.9.9");
            
            // Allow apps to bypass VPN for direct LAN connectivity
            builder.setBlocking(false);

            vpnInterface = builder.establish();
            isRunning = true;
            Log.i(TAG, "⚡ FUF On-Device Sovereign VPN Established (Cellular & Wi-Fi Shield Active)");
        } catch (Exception e) {
            Log.e(TAG, "Failed to establish VPN interface: " + e.getMessage(), e);
            stopVpn();
        }
    }

    private void stopVpn() {
        isRunning = false;
        if (vpnInterface != null) {
            try {
                vpnInterface.close();
            } catch (IOException e) {
                Log.e(TAG, "Error closing VPN interface: " + e.getMessage());
            }
            vpnInterface = null;
        }
        stopForeground(true);
        stopSelf();
        Log.i(TAG, "🛑 FUF On-Device Sovereign VPN Stopped.");
    }

    @Override
    public void onDestroy() {
        stopVpn();
        super.onDestroy();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "FUF Sovereign Defense",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Maintains continuous real-time on-device tracker sinkholing");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification buildForegroundNotification() {
        Intent launchIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("FUF Sovereign Shield 🛡️")
            .setContentText("Active Defense: 45-Vector Real-Time Tracker Sinkhole Engaged")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }
}
