
#import "RNAlivePush.h"
#import <React/RCTBundleURLProvider.h>
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <React/RCTRootView.h>

#define kAlivePushConfigPath @"kAlivePushConfigPath.config"
#define kJSBundleFilePath @"bundle"

@implementation RNAlivePush

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()


- (NSArray<NSString *> *)supportedEvents
{
    return @[@"EVENT_BUNDLE_LOAD_ERROR"];
}




- (void)stopObserving
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport
{
    NSDictionary *dic = @{ @"CachePath": [RNAlivePush documentPath],
                           @"AlivePushConfigPath":[RNAlivePush getAlivePushConfigPath],
                           @"VersionName":[RNAlivePush getVersionName],
                           @"VersionCode":[RNAlivePush getVersinCode],
                           @"JSBundleFile": [RNAlivePush getJSBundleFilePath],
                           @"EVENT_BUNDLE_LOAD_ERROR":@"EVENT_BUNDLE_LOAD_ERROR"
                           };
    return dic;
}
RCT_EXPORT_METHOD(reloadBundle)
{
    
    dispatch_async(dispatch_get_main_queue(), ^{
        UIWindow *window = [[UIApplication sharedApplication] valueForKeyPath:@"delegate.window"];
        if(!window){
            window =[[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
        }
        
        
        NSURL* jsCodeLocation = [RNAlivePush  getJSBundleFile];
        if(jsCodeLocation == nil){
            [self sendEventWithName:@"EVENT_BUNDLE_LOAD_ERROR" body:@{@"message": @"加载失败"}];
            return ;
        }
        RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                            moduleName:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleExecutable"]
                                                     initialProperties:nil
                                                         launchOptions:nil];
        rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
        
        UIViewController *rootViewController = [UIViewController new];
        rootViewController.view = rootView;
        window.rootViewController = rootViewController;
        [window makeKeyAndVisible];
    });
    
}


+ (NSURL*)getJSBundleFile{
    
    NSURL *jsCodeLocation;
    
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    
#else
    
    if([[NSFileManager defaultManager] fileExistsAtPath:[RNAlivePush getAlivePushConfigPath]]){
        
        NSString *config = [NSString stringWithContentsOfURL:[NSURL fileURLWithPath:[RNAlivePush getAlivePushConfigPath]] encoding:NSUTF8StringEncoding error:nil];
        
        
        NSData *data = [config dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data
                                                            options:NSJSONWritingPrettyPrinted
                                                              error:nil];
        
        NSMutableString *filePath = [NSMutableString stringWithString:[dic objectForKey:@"path"] ];
        
        NSString *mainbundleJsPath =  [[RNAlivePush documentPath] stringByAppendingPathComponent:[[filePath componentsSeparatedByString:@"Documents"] lastObject]];
        
        BOOL isDirectory;
        
        if([[NSFileManager defaultManager] fileExistsAtPath:mainbundleJsPath isDirectory:&isDirectory]){
            jsCodeLocation = [NSURL fileURLWithPath:mainbundleJsPath];
        }
        else{
            jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
        }
    }
    else{
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
    }
    
#endif
    
    
    return jsCodeLocation;
}


#pragma mark custom methods ###

+ (NSString*)documentPath{
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *docDir = [paths objectAtIndex:0];
    return docDir;
}

+ (NSString*)getAlivePushConfigPath{
    
    NSString *fullConfigPath = [NSString stringWithFormat:@"%@.%@",kAlivePushConfigPath,[RNAlivePush getVersionName]];
    NSString *config = [[self documentPath] stringByAppendingPathComponent:fullConfigPath];
    
    return config;
}

+ (NSString*)getJSBundleFilePath{
    NSString *configPath = [RNAlivePush getAlivePushConfigPath];
    
    if([[NSFileManager defaultManager] fileExistsAtPath:configPath]){
        if(configPath != NULL){
            NSURL *filePath = [NSURL fileURLWithPath:configPath];
            NSString *dicStr = [NSString stringWithContentsOfURL:filePath encoding:NSUTF8StringEncoding error:nil];
            
            NSData *jsonData = [dicStr dataUsingEncoding:NSUTF8StringEncoding];
            if(jsonData!=NULL){
                NSError *err;
                NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&err];
                
                if(dic != NULL){
                    NSString *path = [dic objectForKey:@"path"];
                    return path;
                }
            }
            
        }
    }
    return  @"";//[[self documentPath] stringByAppendingPathComponent:kJSBundleFilePath];
}

+ (NSString*)getVersionName{
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    return app_Name;
}

+ (NSString*)getVersinCode{
    
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleVersion"];
    return app_Version;
}

@end

