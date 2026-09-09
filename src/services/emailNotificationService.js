// File: src/services/emailNotificationService.js
import { db, doc, getDoc } from '../config/firebase';
import { parseDate } from '../utils/formatters';
import { getSystemSettings } from './adminService';

// In-memory cooldown map to prevent email spamming within 5 minutes per conversation
const emailCooldownMap = new Map();

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
    // 1. Check global settings from Firestore/Cache
    let globalConfig = null;
    try {
      globalConfig = await getSystemSettings();
    } catch (e) {
      console.warn('Could not load global settings for email:', e);
    }

    if (globalConfig) {
      if (type === 'new_message' && globalConfig.notifyEmailOnNewMessage === false) return false;
      if (type === 'order_update' && globalConfig.notifyEmailOnOrderUpdate === false) return false;
      if (type === 'verification_result' && globalConfig.notifyEmailOnVerification === false) return false;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || globalConfig?.emailjsServiceId;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || globalConfig?.emailjsTemplateId;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || globalConfig?.emailjsPublicKey;

    let sendSuccess = false;

    // 2. Direct dispatch via EmailJS REST API if keys are configured
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
              email: toEmail,
              user_email: toEmail,
              recipient: toEmail,
              reply_to: toEmail,
              to_name: toName || 'Thành viên NAU',
              name: toName || 'Thành viên NAU',
              subject: subject,
              sender_name: data.senderName || 'Hệ thống Chợ NAU',
              message_text: data.messageText || '',
              message: data.messageText || '',
              action_url: data.actionUrl || window.location.origin,
              platform_name: 'Chợ NAU - Sàn Đồ Cũ Sinh Viên NAU'
            }
          })
        });

        if (response.ok) {
          sendSuccess = true;
          console.log(`✅ [EMAIL SERVICE] Email dispatched successfully to ${toEmail}`);
        } else {
          const errDetail = await response.text();
          console.warn(`⚠️ [EMAIL SERVICE] EmailJS dispatch response (${response.status}):`, errDetail);
        }
      } catch (networkErr) {
        console.warn('⚠️ [EMAIL SERVICE] Network error dispatching EmailJS:', networkErr);
      }
    } else {
      console.log(`ℹ️ [EMAIL SERVICE SIMULATION] Notification prepared for <${toEmail}>: "${subject}". EmailJS keys not configured yet in Admin Settings or .env.`);
    }

    // 3. Browser Notification fallback if user has allowed desktop notifications
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && document.hidden) {
      try {
        new Notification(`[Chợ NAU] Tin nhắn mới từ ${data.senderName || 'Người mua/bán'}`, {
          body: data.messageText || subject,
          icon: '/favicon.ico'
        });
      } catch (notifErr) {}
    }

    // 4. Store recent email log in local session for audit trail
    try {
      const logs = JSON.parse(sessionStorage.getItem('nau_email_logs') || '[]');
      logs.unshift({
        id: `email_${Date.now()}`,
        to: toEmail,
        subject,
        type,
        status: sendSuccess ? 'sent' : (serviceId ? 'failed' : 'simulated'),
        sentAt: new Date().toISOString()
      });
      sessionStorage.setItem('nau_email_logs', JSON.stringify(logs.slice(0, 30)));
    } catch (e) {}

    return true;
  } catch (error) {
    console.error('Email dispatch error:', error);
    return false;
  }
};

/**
 * Trigger offline message alert if receiver is not currently online
 * Automatically called whenever a message is sent!
 */
export const notifyOfflineReceiver = async ({ receiverId, senderName, messageText, conversationId }) => {
  if (!db || !receiverId) return;

  // 5-minute spam prevention per receiver
  const cooldownKey = `${receiverId}_${conversationId || 'default'}`;
  const lastSent = emailCooldownMap.get(cooldownKey) || 0;
  if (Date.now() - lastSent < 5 * 60 * 1000) {
    console.log(`[EMAIL NOTIFICATION] Cooldown active for ${receiverId}. Skipping duplicate email.`);
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', receiverId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (!userData.email) return;

      // Check if user is offline: either isOnline is false, or lastActive is older than 3 minutes
      const lastActiveDate = parseDate(userData.lastActive);
      const lastActiveTime = lastActiveDate ? lastActiveDate.getTime() : 0;
      const isOnline = Boolean(userData.isOnline) && (Date.now() - lastActiveTime) < 3 * 60 * 1000;

      if (!isOnline) {
        console.log(`[EMAIL NOTIFICATION] Receiver ${userData.email} is OFFLINE (last active: ${userData.lastActive || 'chưa ghi nhận'}). Automatically dispatching offline alert email.`);
        
        emailCooldownMap.set(cooldownKey, Date.now());

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
      } else {
        console.log(`[EMAIL NOTIFICATION] Receiver ${userData.email} is ONLINE right now. Skipping offline email.`);
      }
    }
  } catch (err) {
    console.warn('Could not check offline status for email notification:', err);
  }
};


