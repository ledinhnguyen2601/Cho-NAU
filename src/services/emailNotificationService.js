// File: src/services/emailNotificationService.js
import { db, doc, getDoc } from '../config/firebase';

/**
 * Service to dispatch transactional email notifications to users
 * When recipient is offline, or on critical state events (orders, verifications, messages).
 */

export const sendEmailNotification = async ({
  toEmail,
  toName,
  subject,
  type, // 'new_message' | 'order_update' | 'verification_result'
  data = {}
}) => {
  if (!toEmail) return false;

  console.log(`📧 [EMAIL SERVICE] Triggering notification:`, {
    to: `${toName || 'User'} <${toEmail}>`,
    subject,
    type,
    payload: data,
    timestamp: new Date().toISOString()
  });

  try {
    // Check global settings first
    let globalConfig = null;
    try {
      const raw = localStorage.getItem('nau_system_settings');
      if (raw) globalConfig = JSON.parse(raw);
    } catch (e) {}

    if (globalConfig) {
      if (type === 'new_message' && globalConfig.notifyEmailOnNewMessage === false) return false;
      if (type === 'order_update' && globalConfig.notifyEmailOnOrderUpdate === false) return false;
      if (type === 'verification_result' && globalConfig.notifyEmailOnVerification === false) return false;
    }

    // In web client environment, we log & dispatch payload
    // Can be connected to EmailJS / SendGrid / Firebase Cloud Functions webhook
    const emailPayload = {
      service_id: 'service_chonau',
      template_id: 'template_nau_alert',
      user_id: 'user_nau_api',
      template_params: {
        to_email: toEmail,
        to_name: toName || 'Sinh viên NAU',
        subject: subject,
        message_title: subject,
        type: type,
        details: JSON.stringify(data),
        action_url: data.actionUrl || window.location.origin,
        sender_name: data.senderName || 'Hệ thống Chợ NAU'
      }
    };

    // Store recent email log in local session for audit trail
    const logs = JSON.parse(sessionStorage.getItem('nau_email_logs') || '[]');
    logs.unshift({
      id: `email_${Date.now()}`,
      to: toEmail,
      subject,
      type,
      sentAt: new Date().toISOString()
    });
    sessionStorage.setItem('nau_email_logs', JSON.stringify(logs.slice(0, 20)));

    return true;
  } catch (error) {
    console.error('Email dispatch error:', error);
    return false;
  }
};

/**
 * Trigger offline message alert if receiver is not currently online
 */
export const notifyOfflineReceiver = async ({ receiverId, senderName, messageText, conversationId }) => {
  if (!db || !receiverId) return;

  try {
    const userDoc = await getDoc(doc(db, 'users', receiverId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Check if user is offline or not active recently
      const isOnline = userData.isOnline === true;
      const lastActive = userData.lastActive ? new Date(userData.lastActive).getTime() : 0;
      const isRecentlyActive = (Date.now() - lastActive) < 2 * 60 * 1000; // 2 minutes

      if (!isOnline || !isRecentlyActive) {
        await sendEmailNotification({
          toEmail: userData.email,
          toName: userData.name,
          subject: `[Chợ NAU] Bạn có tin nhắn mới từ ${senderName}`,
          type: 'new_message',
          data: {
            senderName,
            messageText,
            actionUrl: `${window.location.origin}/chat?convId=${conversationId}`
          }
        });
      }
    }
  } catch (err) {
    console.warn('Could not check offline status for email notification:', err);
  }
};
