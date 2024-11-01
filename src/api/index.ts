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