// File: src/utils/formatters.js

/**
 * Format currency in Vietnamese Dong (e.g., 12.500.000 ₫)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Parse any date representation safely (Firestore Timestamp, ISO string, epoch number, Date instance)
 * Returns a valid Date object or null if invalid. Never throws.
 */
export const parseDate = (input) => {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  // Firestore Timestamp with toDate()
  if (typeof input?.toDate === 'function') {
    try {
      const d = input.toDate();
      return isNaN(d?.getTime?.()) ? null : d;
    } catch(e) { return null; }
  }

  // Firestore Timestamp with toMillis()
  if (typeof input?.toMillis === 'function') {
    try {
      const d = new Date(input.toMillis());
      return isNaN(d.getTime()) ? null : d;
    } catch(e) { return null; }
  }

  // Firestore raw Timestamp object: { seconds: number, nanoseconds: number }
  if (typeof input === 'object' && input.seconds !== undefined) {
    const d = new Date(input.seconds * 1000);
    return isNaN(d.getTime()) ? null : d;
  }

  // String or timestamp number
  try {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  } catch(e) {
    return null;
  }
};

/**
 * Format relative time in Vietnamese (e.g. "Vừa xong", "5 phút trước", "Hôm qua 14:30")
 * 100% crash-proof: handles Firestore Timestamps, strings, numbers, and null.
 */
export const formatRelativeTime = (dateInput) => {
  const date = parseDate(dateInput);
  if (!date) return 'Vừa xong';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return `Hôm qua lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch(e) {
    return 'Gần đây';
  }
};

/**
 * Format full date & time (e.g., "14:30, 24/08/2024")
 * 100% crash-proof: handles Firestore Timestamps, strings, numbers, and null.
 */
export const formatDateTime = (dateInput) => {
  const date = parseDate(dateInput);
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch(e) {
    return '';
  }
};

/**
 * Format phone number (e.g., "0988 123 456")
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

/**
 * Get status label and color for verification status
 */
export const getVerificationBadgeInfo = (status) => {
  switch (status) {
    case 'verified':
      return {
        label: '✓ Đã xác thực',
        bg: 'bg-nau-success/10 dark:bg-nau-success/20',
        text: 'text-nau-success dark:text-nau-success',
        border: 'border-nau-success/30 dark:border-nau-success/40'
      };
    case 'pending_verification':
      return {
        label: '⏳ Đang chờ duyệt',
        bg: 'bg-nau-warning/10 dark:bg-nau-warning/20',
        text: 'text-nau-warning dark:text-nau-warning',
        border: 'border-nau-warning/30 dark:border-nau-warning/40'
      };
    case 'rejected':
      return {
        label: '✕ Bị từ chối',
        bg: 'bg-nau-danger/10 dark:bg-nau-danger/20',
        text: 'text-nau-danger dark:text-nau-danger',
        border: 'border-nau-danger/30 dark:border-nau-danger/40'
      };
    case 'suspended':
      return {
        label: '⛔ Đã bị khóa',
        bg: 'bg-nau-background dark:bg-nau-surface',
        text: 'text-nau-text dark:text-nau-text-secondary',
        border: 'border-nau-border dark:border-nau-border'
      };
    case 'new':
    default:
      return {
        label: 'Chưa xác thực',
        bg: 'bg-slate-100 dark:bg-nau-surface',
        text: 'text-nau-text-secondary dark:text-nau-text-muted',
        border: 'border-nau-border dark:border-nau-border'
      };
  }
};
