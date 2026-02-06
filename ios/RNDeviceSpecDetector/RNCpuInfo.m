#import "RNCpuInfo.h"
#import <sys/sysctl.h>

@implementation RNCpuInfo

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(getCpuCoreCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSInteger coreCount = [[NSProcessInfo processInfo] processorCount];

        size_t size = sizeof(int);
        int mib[2] = {CTL_HW, HW_NCPU};
        int sysctlCoreCount = 0;
        sysctl(mib, 2, &sysctlCoreCount, &size, NULL, 0);

        NSInteger finalCount = MAX(coreCount, sysctlCoreCount);

        if (finalCount > 0) {
            resolve(@(finalCount));
        } else {
            reject(@"CPU_DETECTION_ERROR", @"Unable to detect CPU cores", nil);
        }
    } @catch (NSException *exception) {
        reject(@"CPU_DETECTION_ERROR",
               [NSString stringWithFormat:@"Exception: %@", exception.reason],
               nil);
    }
}

- (NSDictionary *)constantsToExport {
    NSInteger coreCount = [[NSProcessInfo processInfo] processorCount];
    return @{@"cpuCoreCount": @(coreCount)};
}

@end
