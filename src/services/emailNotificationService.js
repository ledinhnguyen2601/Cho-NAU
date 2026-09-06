// File: src/services/emailNotificationService.js
import { db, doc, getDoc } from '../config/firebase';
import { parseDate } from '../utils/formatters';

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

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Direct dispatch via EmailJS REST API if keys are provided
    if (serviceId && templateId && publicKey) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: toEmail,
              to_name: toName || 'Thành viên NAU',
              subject: subject,
              sender_name: data.senderName || 'Hệ thống Chợ NAU',
              message_text: data.messageText || '',
              action_url: data.actionUrl || window.location.origin,
              platform_name: 'Chợ NAU - Sàn Đồ Cũ Sinh Viên NAU'
            }
          })
        });

        if (response.ok) {
          console.log(`✅ [EMAIL SERVICE] Email sent successfully to ${toEmail}`);
        } else {
          const errDetail = await response.text();
          console.warn(`⚠️ [EMAIL SERVICE] EmailJS dispatch response (${response.status}):`, errDetail);
        }
      } catch (networkErr) {
        console.warn('⚠️ [EMAIL SERVICE] Network error dispatching EmailJS:', networkErr);
      }
    } else {
      console.log(`ℹ️ [EMAIL SERVICE SIMULATION] Notification prepared for <${toEmail}>: "${subject}".`);
    }

    // Browser Notification fallback if user has allowed desktop notifications
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try {
        new Notification(`[Chợ NAU] Tin nhắn mới từ ${data.senderName || 'Người mua/bán'}`, {
          body: data.messageText || subject,
          icon: '/favicon.ico'
        });
      } catch (notifErr) {}
    }

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
      if (!userData.email) return;

      // Check if user is offline or not active recently
      const isOnline = userData.isOnline === true;
      const lastActiveDate = parseDate(userData.lastActive);
      const lastActiveTime = lastActiveDate ? lastActiveDate.getTime() : 0;
      const isRecentlyActive = (Date.now() - lastActiveTime) < 2 * 60 * 1000; // 2 minutes

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

