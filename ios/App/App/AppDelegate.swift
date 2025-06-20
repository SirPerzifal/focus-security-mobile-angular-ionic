import Capacitor
import Firebase
import FirebaseMessaging // ← Tambahkan ini
import UIKit
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Firebase configuration
        FirebaseApp.configure()
        
        // ✅ Tambahkan Firebase Messaging delegate
        Messaging.messaging().delegate = self

        // Request notification permissions
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) {
            granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }

        return true
    }

    // Function that returns a simple string value
    func getCustomValue() -> String {
        return "Hello from AppDelegate - \(Date())"
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate.
    }

    func application(
        _ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(
        _ application: UIApplication, continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(
            application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // MARK: - Push Notifications
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        print("📱 APNs Device Token received")
        
        // ✅ PENTING: Set APNs token ke Firebase
        Messaging.messaging().apnsToken = deviceToken
        
        // Convert device token to string for logging
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let apnsToken = tokenParts.joined()
        print("📱 APNs Token: \(apnsToken)")
        
        // // Post ke Capacitor
        // NotificationCenter.default.post(
        //     name: .capacitorDidRegisterForRemoteNotifications, 
        //     object: deviceToken
        // )
        
        // ✅ Request FCM token setelah APNs token di-set
        self.requestFCMToken()
    }

    func application(
        _ application: UIApplication, 
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        print("❌ Failed to register for remote notifications: \(error)")
        NotificationCenter.default.post(
            name: .capacitorDidFailToRegisterForRemoteNotifications, 
            object: error
        )
    }

    // ✅ Method untuk request FCM token
    private func requestFCMToken() {
        Messaging.messaging().token { token, error in
            if let error = error {
                print("❌ Error fetching FCM registration token: \(error)")
            } else if let token = token {
                print("📱 FCM registration token: \(token)")
                print("📏 FCM Token length: \(token.count)")
                
                // Post ke Capacitor
                NotificationCenter.default.post(
                    name: .capacitorDidRegisterForRemoteNotifications, 
                    object: token
                )

                // Post notification untuk JavaScript
                // DispatchQueue.main.async {
                //     NotificationCenter.default.post(
                //         name: NSNotification.Name("FCMTokenReceived"), 
                //         object: token
                //     )
                // }

                DispatchQueue.main.async {
                    if let webView = self.window?.rootViewController?.view.subviews.first(where: { $0 is WKWebView }) as? WKWebView {
                        let javascript = """
                            document.dispatchEvent(new CustomEvent('FCMTokenReceived', {
                                detail: '\(token)'
                            }));
                        """
                        webView.evaluateJavaScript(javascript, completionHandler: nil)
                    }
                }
                
                // ✅ Simpan ke UserDefaults sebagai backup
                UserDefaults.standard.set(token, forKey: "FCMToken")
            }
        }
    }
}

// MARK: - UNUserNotificationCenterDelegate
extension AppDelegate: UNUserNotificationCenterDelegate {
    // Handle notification when app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter, willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) ->
            Void
    ) {
        completionHandler([.alert, .badge, .sound])
    }

    // Handle notification tap
    func userNotificationCenter(
        _ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        NotificationCenter.default.post(
            name: NSNotification.Name.init("pushNotificationReceived"), object: response)
        completionHandler()
    }
}

// MARK: - MessagingDelegate  
extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("📱 Firebase FCM registration token updated: \(String(describing: fcmToken))")
        
        guard let token = fcmToken else {
            print("❌ FCM token is nil")
            return
        }
        
        print("📱 FCM Token length: \(token.count)")
        print("📱 FCM Token: \(token)")
        
        // ✅ Simpan ke UserDefaults
        UserDefaults.standard.set(token, forKey: "FCMToken")
        
        // // ✅ Post notification untuk JavaScript
        // DispatchQueue.main.async {
        //     NotificationCenter.default.post(
        //         name: NSNotification.Name("FCMTokenReceived"), 
        //         object: token
        //     )
        // }

        DispatchQueue.main.async {
            if let webView = self.window?.rootViewController?.view.subviews.first(where: { $0 is WKWebView }) as? WKWebView {
                let javascript = """
                    document.dispatchEvent(new CustomEvent('FCMTokenReceived', {
                        detail: '\(token)'
                    }));
                """
                webView.evaluateJavaScript(javascript, completionHandler: nil)
            }
        }
        
        // ✅ Optional: Send langsung ke server jika perlu
        // self.sendTokenToServer(token)
    }
    
    // Optional method untuk kirim token ke server
    private func sendTokenToServer(_ token: String) {
        // Implementasi untuk kirim token ke server Anda
        print("📤 Sending FCM token to server: \(token)")
    }
}
