package com.devicespecdetector;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@ReactModule(name = RNCpuInfoModule.NAME)
public class RNCpuInfoModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RNCpuInfo";

    public RNCpuInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @Nonnull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getCpuCoreCount(Promise promise) {
        try {
            int coreCount = Runtime.getRuntime().availableProcessors();

            if (coreCount > 0) {
                promise.resolve(coreCount);
            } else {
                promise.reject("CPU_DETECTION_ERROR", "Unable to detect CPU cores");
            }
        } catch (Exception e) {
            promise.reject("CPU_DETECTION_ERROR", "Exception: " + e.getMessage(), e);
        }
    }

    @Override
    @Nullable
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        int coreCount = Runtime.getRuntime().availableProcessors();
        constants.put("cpuCoreCount", coreCount);
        return constants;
    }
}
