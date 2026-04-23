'use client';

import { getPasswordStrength } from '@/lib/schemas';
import clsx from 'clsx';

interface PasswordStrengthMeterProps {
  password: string;
  showLabels?: boolean;
}

const requirementLabels = {
  length: 'Mínimo 6 caracteres',
  uppercase: 'Una letra mayúscula',
  number: 'Un número',
};

const requirementIcons = {
  length: 'text_fields',
  uppercase: 'format_bold',
  number: 'pin',
};

export default function PasswordStrengthMeter({ password, showLabels = true }: PasswordStrengthMeterProps) {
  const { checks, strength, isValid } = getPasswordStrength(password);
  const isEmpty = password.length === 0;

  // Colores según el strength (0-3)
  const colors = {
    0: 'bg-[var(--border)]',
    1: 'bg-[var(--danger)]',
    2: 'bg-[var(--warning)]',
    3: 'bg-[var(--success)]',
  };

  const textColors = {
    0: 'text-[var(--foreground-muted)]',
    1: 'text-[var(--danger)]',
    2: 'text-[var(--warning)]',
    3: 'text-[var(--success)]',
  };

  const widthPercent = (strength / 3) * 100;

  if (isEmpty) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Barra de progreso */}
      <div className="w-full">
        <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-300 ease-out',
              colors[strength as keyof typeof colors]
            )}
            style={{ width: `${widthPercent}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      {showLabels && (
        <ul className="grid grid-cols-3 gap-2">
          {(Object.keys(checks) as Array<keyof typeof checks>).map((key) => {
            const isMet = checks[key];
            return (
              <li
                key={key}
                className={clsx(
                  'flex items-center gap-1 text-xs transition-colors',
                  isMet ? 'text-[var(--success)]' : 'text-[var(--foreground-muted)]'
                )}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isMet ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={clsx('hidden sm:inline', !isMet && 'line-through')}>
                  {requirementLabels[key as keyof typeof requirementLabels]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}