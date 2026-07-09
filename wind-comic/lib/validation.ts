// 输入验证和清理工具

import { t, type Locale } from './i18n';

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // 移除 < >
    .replace(/javascript:/gi, '') // 移除 javascript: 协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .trim();
}

export function validateIdea(idea: string, locale: Locale = 'zh-CN'): { valid: boolean; error?: string } {
  if (!idea || idea.trim().length === 0) {
    return { valid: false, error: t(locale, 'validation.ideaRequired') };
  }

  if (idea.length < 10) {
    return { valid: false, error: t(locale, 'validation.ideaTooShort') };
  }

  if (idea.length > 100000) {
    return { valid: false, error: t(locale, 'validation.ideaTooLong') };
  }

  return { valid: true };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string, locale: Locale = 'zh-CN'): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: t(locale, 'validation.passwordTooShort') };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: t(locale, 'validation.passwordNeedsUppercase') };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: t(locale, 'validation.passwordNeedsLowercase') };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: t(locale, 'validation.passwordNeedsNumber') };
  }

  return { valid: true };
}
