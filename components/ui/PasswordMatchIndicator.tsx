'use client';

import clsx from 'clsx';

interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
  show?: boolean;
}

export default function PasswordMatchIndicator({
  password,
  confirmPassword,
  show = true,
}: PasswordMatchIndicatorProps) {
  const isEmpty = confirmPassword.length === 0;
  const isMatching = password === confirmPassword && password.length > 0;
  const hasMismatch = password !== confirmPassword && confirmPassword.length > 0;

  if (!show || isEmpty) return null;

  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 text-xs transition-all duration-200',
        isMatching && 'text-[var(--success)]',
        hasMismatch && 'text-[var(--danger)]'
      )}
    >
      <span className="material-symbols-outlined text-[16px]">
        {isMatching ? 'check_circle' : hasMismatch ? 'cancel' : 'radio_button_unchecked'}
      </span>
      <span className={clsx(isMatching && !hasMismatch && 'font-medium')}>
        {isMatching ? 'Las contraseñas coinciden' : hasMismatch ? 'Las contraseñas no coinciden' : ''}
      </span>
    </div>
  );
}