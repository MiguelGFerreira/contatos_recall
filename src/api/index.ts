import { Contato } from "@/types";

const API_URL = 'http://localhost:8000'

export const getContatos = async () => {
	try {
		const res = await fetch(`${API_URL}/contatos`)
		const data = await res.json()

		return data;
	} catch (error) {
		console.error('Erro ao buscar contatos:', error)
	}
}

export const getEmployees = async () => {
	try {
		const res = await fetch(`${API_URL}/contatos/funcionarios`)
		const data = await res.json()

		return data;
	} catch (error) {
		console.error('Erro ao buscar funcionarios:', error)
	}
}

export const postContato = async (newContact: Contato) => {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const raw = JSON.stringify({
		"contato": newContact.CONTATO,
		"matricula": newContact.MATRICULA,
		"setor": newContact.SETOR,
		"telefone": newContact.TELEFONE,
		"email": newContact.EMAIL,
		"site": newContact.SITE,
		"tipo": newContact.TIPO,
	});

	console.log(raw);

	/*fetch(
		`${API_URL}/contatos`,
		{
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		})
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));*/
}