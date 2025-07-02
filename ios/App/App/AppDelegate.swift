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
        print("🔥 NOTIFICATION RECEIVED")
        // Firebase configuration
        FirebaseApp.configure()
      
        // Setup notification categories
        setupNotificationCategories()
      
        // ✅ Tambahkan Firebase Messaging delegate
        Messaging.messaging().delegate = self

        // Request notification permissions
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) {
            granted, error in
            if granted {
                DispatchQueue.main.async {
                    UNUserNotificationCenter.current().delegate = self
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
        requestFCMToken()
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
  
    func setupNotificationCategories() {
        print("this function is call")
        let answerAction = UNNotificationAction(
            identifier: "ANSWER_ACTION",
            title: "Answer",
            options: [.foreground] // opens the app
        )

        let declineAction = UNNotificationAction(
            identifier: "DECLINE_ACTION",
            title: "Decline",
            options: [.destructive]
        )

        let callCategory = UNNotificationCategory(
            identifier: "CALL_CATEGORY",
            actions: [answerAction, declineAction],
            intentIdentifiers: [],
            options: [.customDismissAction]
        )
        print("this function is return", callCategory)

        UNUserNotificationCenter.current().setNotificationCategories([callCategory])
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
        print("🔥 NOTIFICATION RECEIVED willPresent")
        let userInfo = notification.request.content.userInfo
        print("user info", userInfo)
        let aps = userInfo["aps"] as? [String: Any]
        
        // Cara 1: Ambil dari aps.alert (jika payload APNs)
        if let alert = aps?["alert"] as? [String: String] {
            let title = alert["title"] ?? "No Title"
            let body = alert["body"] ?? "No Body"
            print("📢 [APS Alert] Title:", title)
            print("📢 [APS Alert] Body:", body)
        }
        
        // Cara 2: Ambil langsung dari content notifikasi
        let content = notification.request.content
        print("📢 [Content] Title:", content.title) // "Security"
        print("📢 [Content] Body:", content.body)   // "Incoming call"
        completionHandler([.alert, .badge, .sound])
    }

    // Handle notification tap
    func userNotificationCenter(
        _ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        print("🔥 NOTIFICATION RECEIVED didReceive")
        let content = response.notification.request.content
        print("content", content)
        print("📢 Title dari Alert:", content.title) // "Security"
        print("📢 Body dari Alert:", content.body)   // "Incoming call"
        let actionId = response.actionIdentifier
        if actionId == "ANSWER_ACTION" {
            print("📞 Answer pressed")
            // Notify JS via NotificationCenter or route in WKWebView
        } else if actionId == "DECLINE_ACTION" {
            print("📞 Decline pressed")
            // Same here
        }
        
        // Akses custom data
        let userInfo = content.userInfo
        if let callerName = userInfo["callerName"] as? String {
            print("📢 Caller Name:", callerName) // "Security"
        }
        NotificationCenter.default.post(
            name: NSNotification.Name.init("pushNotificationReceived"), object: response)
        completionHandler()
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("🔥 NOTIFICATION RECEIVED")
        print("caller", userInfo)
        
        Messaging.messaging().appDidReceiveMessage(userInfo)
        completionHandler(.noData)
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
