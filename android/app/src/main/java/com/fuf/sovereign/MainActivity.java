package com.fuf.sovereign;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FufVpnPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
