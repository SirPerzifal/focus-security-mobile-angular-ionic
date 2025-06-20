import Foundation
import Capacitor
import UIKit

@objc(AppDelegatePlugin)
public class AppDelegatePlugin: CAPPlugin {
    
    @objc func getValueFromAppDelegate(_ call: CAPPluginCall) {
        NSLog("🔥 AppDelegatePlugin: getValueFromAppDelegate called")
        
        DispatchQueue.main.async {
            guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
                NSLog("❌ Could not access AppDelegate")
                call.reject("Could not access AppDelegate")
                return
            }
            
            let value = appDelegate.getCustomValue()
            NSLog("✅ Value from AppDelegate: ")
            call.resolve([
                "value": value
            ])
        }
    }
}
