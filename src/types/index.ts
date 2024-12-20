export interface Contato {
	ID: number,
	CONTATO: string,
	MATRICULA: string,
	SETOR: string,
	TELEFONE: string,
	EMAIL: string,
	SITE: string,
	TIPO: string
	DELETADO: number
}

export interface TceUser {
	USUARIO: string,
	RELATORIO: string,
	ACESSO: string,
	SIGLAFILIAL: string,
	NUMEROFILIAL: string,
	DEPARTAMENTO: string,
	ALTERAREG: string
}