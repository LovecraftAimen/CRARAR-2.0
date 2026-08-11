/**
 * Máscaras e validações para CPF e Telefone (CRARAR)
 */

/**
 * Formata CPF no padrão 000.000.000-00 (máximo 11 dígitos)
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Formata Telefone no padrão (00) 00000-0000 ou (00) 0000-0000 (máximo 11 dígitos)
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Valida o CPF conforme as regras do sistema:
 * - Pode estar em branco (0 dígitos)
 * - Se preenchido, DEVE ter exatamente 11 dígitos
 * - Mais que 0 e menos que 11 NÃO é aceito
 */
export function validateCPF(value: string): { valid: boolean; message?: string } {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) {
    return { valid: true };
  }
  if (digits.length < 11) {
    return {
      valid: false,
      message: 'CPF incompleto. O CPF deve ser deixado em branco ou conter exatamente 11 números.'
    };
  }
  return { valid: true };
}

/**
 * Valida o Telefone:
 * - Deve ter no mínimo 10 dígitos (DDD + 8 ou 9 dígitos)
 */
export function validatePhone(value: string): { valid: boolean; message?: string } {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) {
    return {
      valid: false,
      message: 'Telefone incompleto. Informe o DDD e o número completo (DDD + número).'
    };
  }
  return { valid: true };
}
