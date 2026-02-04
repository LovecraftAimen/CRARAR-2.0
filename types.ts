export interface Tutor {
  id: string;
  nome: string;
  cpf?: string | null;
  telefone: string;
  email?: string | null;
  endereco?: string | null;
  created_at?: string;
}

export interface Animal {
  id: string;
  tutor_id: string;
  nome: string;
  especie: string;
  raca: string;
  data_nascimento: string;
  sexo: string;
  cor: string;
  peso: number;
  categoria: "crarar" | "normal";
  status?: "vivo" | "obito";
  data_adesao: string;
  created_at?: string;
}

export interface Atendimento {
  id: string;
  animal_id: string;
  data: string;
  veterinario: string;
  sintomas: string;
  diagnostico: string;
  tratamento: string;
  medicamentos: string;
  observacoes?: string;
  proximo_retorno?: string;
  obito?: boolean;
  created_at?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: "admin" | "atendente";
  ativo: boolean;
}

export interface Produto {
  id: string;
  id_sku?: string;
  nome: string;
  principio_ativo?: string;
  fabricante?: string;
  categoria: string;
  unidade: string;
  quantidade: number;
  minimo: number;
  ponto_pedido?: string;
  localizacao?: string;
  lote?: string;
  validade?: string;
  registro_mapa?: string;
  receita_especial?: boolean;
  custo?: number;
  preco_venda?: number;
  moeda?: string;
  fornecedor?: string;
  equipamento?: string;
  ultima_manutencao?: string;
  proxima_calibracao?: string;
  uso_veterinario?: string;
  via_administracao?: string;
  status_operacional?: "Ativo" | "Manutenção" | "Inativo";
  created_at?: string;
}
