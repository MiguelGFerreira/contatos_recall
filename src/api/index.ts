import { Contato, TceUser } from "@/types";
import axios from "axios";

const API_URL = 'http://10.0.73.216:83/contatosRecall/express-contatos-recall'

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
		const res = await axios.get(`${API_URL}/contatos/funcionarios`)

		return res.data;
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

	fetch(
		`${API_URL}/contatos`,
		{
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		})
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
}

export const patchContato = async (idcontato: number, contatoData: Contato) => {
	let data = JSON.stringify({
		"contato": contatoData.CONTATO,
		"matricula": contatoData.MATRICULA,
		"setor": contatoData.SETOR,
		"telefone": contatoData.TELEFONE,
		"email": contatoData.EMAIL,
		"site": contatoData.SITE,
		"deletado": 0
	});

	let config = {
		method: 'patch',
		maxBodyLength: Infinity,
		url: `${API_URL}/contatos/${idcontato}`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: data
	};

	axios.request(config)
		.then((response) => {
			return JSON.stringify(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}

export const deleteContato = async (idcontato: number) => {
	let data = JSON.stringify({
		"deletado": 1,
	});

	let config = {
		method: 'patch',
		maxBodyLength: Infinity,
		url: `${API_URL}/contatos/${idcontato}`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: data
	};

	axios.request(config)
		.then((response) => {
			return JSON.stringify(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}

export const getUser = async () => {
	try {
		const response = await axios.get(`http://10.0.73.216:83/flask_login_ad/iis_user`)
		console.log(response);
		//console.log(response.data);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

export const getTceUser = async (data: any) => {
	console.log(data)
	try {
		const response = await axios.post(`http://10.0.73.216:83/flask_login_ad/tce_user`, data)
		console.log(response.data);
		const tceUserData: TceUser = response.data[0] || {} as TceUser
		//tceUserData = tceUserData? tceUserData :
		return tceUserData
	} catch (error) {
		console.error(error);
		return {} as TceUser
	}
}