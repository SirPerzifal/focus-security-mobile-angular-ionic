import CallKit
import UserNotifications

class NotificationService: UNNotificationServiceExtension {
    override func didReceive(
        _ request: UNNotificationRequest,
        withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
    ) {

        let content = request.content.mutableCopy() as! UNMutableNotificationContent

        // Modifikasi content untuk tampilan call-like
        if request.content.categoryIdentifier == "CALL_CATEGORY" {
            content.title = "Incoming Call"
            content.body = "From \(request.content.userInfo["callerName"] ?? "Unknown")"

            // Bisa trigger CallKit di sini juga
            triggerCallKit(from: request.content.userInfo)
        }

        contentHandler(content)
    }

    private func triggerCallKit(from userInfo: [AnyHashable: Any]) {
        // Implementasi CallKit seperti sebelumnya
    }
}
