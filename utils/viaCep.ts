import { Tutor } from '../types';

export interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

export const ESTADOS_BRASIL = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' }
];

const citiesCache: Record<string, string[]> = {};

/**
 * Busca a lista de municípios/cidades de um determinado estado (UF) no IBGE
 */
export async function fetchCitiesByUf(uf: string): Promise<string[]> {
  const cleanUf = uf.trim().toUpperCase();
  if (cleanUf.length !== 2) return [];
  if (citiesCache[cleanUf]) return citiesCache[cleanUf];

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${cleanUf}/municipios?orderBy=nome`);
    if (!response.ok) return [];
    const data: Array<{ id: number; nome: string }> = await response.json();
    const cityNames = data.map(item => item.nome);
    citiesCache[cleanUf] = cityNames;
    return cityNames;
  } catch (err) {
    console.error('Erro ao buscar cidades no IBGE:', err);
    return [];
  }
}

/**
 * Formata uma string de CEP no padrão 00000-000
 */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

/**
 * Busca endereço na API ViaCEP pelo CEP de 8 dígitos
 */
export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) return null;
    
    const data: ViaCepResponse = await response.json();
    if (data.erro) return null;

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP no ViaCEP:', error);
    return null;
  }
}

/**
 * Busca inversa de CEP no ViaCEP utilizando UF, Cidade e Nome da Rua (Logradouro)
 * Regras do ViaCEP:
 * - UF exatamente 2 caracteres (ex: SP)
 * - Cidade no mínimo 3 caracteres
 * - Logradouro/Rua no mínimo 3 caracteres
 */
export async function searchCepByAddress(uf: string, cidade: string, logradouro: string): Promise<ViaCepResponse[]> {
  const cleanUf = uf.trim().toUpperCase();
  const cleanCidade = cidade.trim();
  const cleanLogradouro = logradouro.trim();

  if (cleanUf.length !== 2) return [];
  if (cleanCidade.length < 3) return [];
  if (cleanLogradouro.length < 3) return [];

  try {
    const encodedCidade = encodeURIComponent(cleanCidade);
    const encodedLogradouro = encodeURIComponent(cleanLogradouro);
    const response = await fetch(`https://viacep.com.br/ws/${cleanUf}/${encodedCidade}/${encodedLogradouro}/json/`);
    if (!response.ok) return [];

    const data = await response.json();
    if (Array.isArray(data)) {
      return data.filter(item => !item.erro);
    }
    return [];
  } catch (error) {
    console.error('Erro na busca inversa do ViaCEP:', error);
    return [];
  }
}

/**
 * Formata endereço completo para exibição no sistema
 */
export function formatFullAddress(tutor?: Partial<Tutor> | null): string {
  if (!tutor) return '';

  const parts: string[] = [];

  if (tutor.endereco) {
    let addr = tutor.endereco;
    if (tutor.numero) addr += `, ${tutor.numero}`;
    if (tutor.complemento) addr += ` (${tutor.complemento})`;
    parts.push(addr);
  }

  if (tutor.bairro) {
    parts.push(`Bairro: ${tutor.bairro}`);
  }

  if (tutor.cidade || tutor.estado) {
    const cityState = [tutor.cidade, tutor.estado].filter(Boolean).join('/');
    parts.push(cityState);
  }

  if (tutor.cep) {
    parts.push(`CEP: ${formatCep(tutor.cep)}`);
  }

  if (parts.length > 0) {
    return parts.join(' - ');
  }

  return tutor.endereco || '';
}

