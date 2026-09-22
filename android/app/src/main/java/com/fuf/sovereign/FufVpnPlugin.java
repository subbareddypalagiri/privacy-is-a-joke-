package com.fuf.sovereign;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.VpnService;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "FufVpn")
public class FufVpnPlugin extends Plugin {

    @PluginMethod
    public void isSupported(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("supported", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void isVpnActive(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("active", FufVpnService.isRunning);
        call.resolve(ret);
    }

    @PluginMethod
    public void startVpn(PluginCall call) {
        Context context = getContext();
        Intent prepareIntent = VpnService.prepare(context);

        if (prepareIntent != null) {
            startActivityForResult(call, prepareIntent, "vpnPermissionResult");
        } else {
            startServiceDirectly();
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("active", true);
            call.resolve(ret);
        }
    }

    @ActivityCallback
    private void vpnPermissionResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            startServiceDirectly();
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("active", true);
            call.resolve(ret);
        } else {
            call.reject("VPN permission denied by user");
        }
    }

    @PluginMethod
    public void stopVpn(PluginCall call) {
        Context context = getContext();
        Intent intent = new Intent(context, FufVpnService.class);
        intent.setAction(FufVpnService.ACTION_STOP);
        context.startService(intent);

        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("active", false);
        call.resolve(ret);
    }

    private void startServiceDirectly() {
        Context context = getContext();
        Intent intent = new Intent(context, FufVpnService.class);
        intent.setAction(FufVpnService.ACTION_START);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }
}
