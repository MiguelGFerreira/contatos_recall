'use client'

import { useState, useEffect } from 'react';
import { getTceUser, getUser } from "@/api";
import { TceUser } from "@/types";
import TableContatos from "@/components/TableContatos";
import LoadingSpinner from '@/components/LoadingSpinner';

const Home = () => {
	const [tceUser, setTceUser] = useState<TceUser | null>(null);
	const [userName, setUserName] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				// Primeiro, pega o username
				const userNameResponse = await getUser();
				if (userNameResponse) {
					setUserName(userNameResponse);

					// Depois, chama getTceUser com o username
					const tceUserResponse = await getTceUser({ 'USER': `REALCAFE\\${userNameResponse}`, 'RELATORIO': "CONTATOSRECALL" });

					// Atualiza o estado com o usuário do TCE
					setTceUser(tceUserResponse);
				}
			} catch (err) {
				setError('Erro ao carregar os dados.');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div className="lajota noscrollbar">
			<header>
				<h1>LISTAS DE CONTATOS DOS COMITÊS DE RECOLHIMENTO E RECALL</h1>
			</header>
			{tceUser?.ACESSO ? <TableContatos /> : <p>Relatório não liberado para {userName}</p>}
			<TableContatos />
		</div>
	);
};

export default Home;
