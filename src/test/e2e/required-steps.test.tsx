import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInputCard } from '@/components/quiz/TextInputCard';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import type { Question } from '@/lib/quiz/types';

/**
 * E2E-style validation tests: asigură că utilizatorul NU poate avansa
 * în quiz fără să completeze pașii obligatorii.
 */

describe('E2E: Pași obligatorii text (name / instagram / email / phone)', () => {
  it('NAME: nu trimite când e gol și afișează eroare', () => {
    const onSubmit = vi.fn();
    render(
      <TextInputCard question="Cum te cheamă?" placeholder="Prenumele" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByRole('button', { name: /continuă/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/obligatoriu/i)).toBeInTheDocument();
  });

  it('INSTAGRAM: nu trimite când e gol (obligatoriu acum)', () => {
    const onSubmit = vi.fn();
    render(
      <TextInputCard question="Instagram?" placeholder="@username" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByRole('button', { name: /continuă/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/obligatoriu/i)).toBeInTheDocument();
    // Nu există buton "Sari peste"
    expect(screen.queryByRole('button', { name: /sari peste/i })).toBeNull();
  });

  it('EMAIL: blochează email invalid', () => {
    const onSubmit = vi.fn();
    render(
      <TextInputCard question="Email?" placeholder="email" type="email" onSubmit={onSubmit} />
    );
    const input = screen.getByPlaceholderText('email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'nu-e-email' } });
    fireEvent.click(screen.getByRole('button', { name: /continuă/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/email valid/i)).toBeInTheDocument();
  });

  it('EMAIL: acceptă email valid', () => {
    const onSubmit = vi.fn();
    render(
      <TextInputCard question="Email?" placeholder="email" type="email" onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'a@b.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /continuă/i }));
    expect(onSubmit).toHaveBeenCalledWith('a@b.com');
  });

  it('PHONE: nu trimite când e gol', () => {
    const onSubmit = vi.fn();
    render(
      <TextInputCard question="Telefon?" placeholder="tel" type="tel" onSubmit={onSubmit} />
    );
    fireEvent.click(screen.getByRole('button', { name: /continuă/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('E2E: Întrebare multi-select — butonul Continuă este dezactivat fără selecție', () => {
  const multiQ: Question = {
    id: 'TEST_MULTI',
    phase: 'L1_CONCRETE',
    text: 'Alege una sau mai multe',
    multiSelect: true,
    options: [
      { code: 'A', text: 'Opțiunea A' },
      { code: 'B', text: 'Opțiunea B' },
    ],
  };

  it('butonul este disabled la început', () => {
    const onMulti = vi.fn();
    render(<QuestionCard question={multiQ} onMultiAnswer={onMulti} />);
    const btn = screen.getByRole('button', { name: /continuă/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(onMulti).not.toHaveBeenCalled();
  });

  it('după selecție, butonul se activează și trimite', () => {
    const onMulti = vi.fn();
    render(<QuestionCard question={multiQ} onMultiAnswer={onMulti} />);
    fireEvent.click(screen.getByText('Opțiunea A'));
    const btn = screen.getByRole('button', { name: /continuă/i }) as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
    fireEvent.click(btn);
    expect(onMulti).toHaveBeenCalledTimes(1);
    expect(onMulti.mock.calls[0][0][0].code).toBe('A');
  });
});
