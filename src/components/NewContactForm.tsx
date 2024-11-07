import { getEmployees, postContato } from '@/api';
import { Contato } from '@/types';
import React, { useEffect, useState } from 'react';

interface Employee {
	matricula: string;
	nome: string;
}

const NewContactForm = ({ visible }: { visible: boolean }) => {
	const [tipo, setTipo] = useState('');
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [matricula, setMatricula] = useState('');
	const [telefone, setTelefone] = useState('');
	const [setor, setSetor] = useState('');
	const [site, setSite] = useState('');
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [errors, setErrors] = useState({
		tipo: false,
		nome: false,
		email: false,
		telefone: false,
		matricula: false,
		setor: false,
		site: false,
	})

	const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setErrors((prevErrors) => ({ ...prevErrors, tipo: false }))
		setTipo(event.target.value);
	};

	const handleMatriculaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setErrors((prevErrors) => ({ ...prevErrors, matricula: false }));
		setMatricula(event.target.value);

		const matriculaInfo = employees.find(e => e.matricula === event.target.value);
		if (matriculaInfo) {
			setNome(matriculaInfo.nome);
		}
	};

	const handleSubmit = async () => {
		const newErrors = {
			tipo: !tipo,
			nome: !nome,
			email: !email,
			telefone: !telefone,
			matricula: (tipo === "EQUIPE" || tipo === "APOIO") && !matricula,
			setor: (tipo === "EQUIPE" || tipo === "APOIO") && !setor,
			site: tipo === "EXTERNO" && !site,
		}

		setErrors(newErrors);

		if (Object.values(errors).includes(true)) {

			const newContact: Contato = {
				CONTATO: nome,
				MATRICULA: matricula,
				SETOR: setor,
				TELEFONE: telefone,
				EMAIL: email,
				SITE: site,
				TIPO: tipo
			}

			await postContato(newContact);

			setTipo('');
			setNome('');
			setEmail('');
			setMatricula('');
			setTelefone('');
			setSetor('');
			setSite('');
			setErrors({
				tipo: false,
				nome: false,
				email: false,
				telefone: false,
				matricula: false,
				setor: false,
				site: false,
			});
		}
	}

	async function fetchEmployees() {
		const data = await getEmployees();
		setEmployees(data);
	}

	useEffect(() => {
		fetchEmployees()
	}, [])

	return (
		<div hidden={visible} className="card">
			<div className="grid grid-cols-3 gap-4">
				<div>
					<label htmlFor="tipo">Tipo</label>
					<select name="tipo" id="tipo" value={tipo} onChange={handleTipoChange} className={`${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}>
						<option value="">Selecione...</option>
						<option value="APOIO">Apoio</option>
						<option value="EQUIPE">Equipe</option>
						<option value="EXTERNO">Externo</option>
					</select>
				</div>

				<div>
					<label htmlFor="nome">Contato:</label>
					<input
						type="text"
						id="nome"
						name="nome"
						value={nome}
						onChange={(e) => {
							setNome(e.target.value);
							setErrors((prevErrors) => ({ ...prevErrors, nome: false }));
						}}
						className={`${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setErrors((prevErrors) => ({ ...prevErrors, email: false }));
						}}
						className={`${errors.email ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				<div>
					<label htmlFor="telefone">Telefone:</label>
					<input
						type="tel"
						id="telefone"
						name="telefone"
						value={telefone}
						onChange={(e) => {
							setTelefone(e.target.value);
							setErrors((prevErrors) => ({ ...prevErrors, telefone: false }));
						}}
						className={`${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				{/* Exibe os campos de Matrícula e Setor apenas para Equipe e Apoio */}
				{(tipo === 'EQUIPE' || tipo === 'APOIO') && (
					<>
						<div>
							<label htmlFor="matricula">Matrícula:</label>
							<input
								list="matriculas"
								id="matricula"
								name="matricula"
								value={matricula}
								onChange={handleMatriculaChange}
								className={`${errors.matricula ? 'border-red-500' : 'border-gray-300'}`}
							/>
							<datalist id="matriculas">
								{employees.map((e) => (
									<option key={e.matricula} value={e.matricula}>{e.nome}</option>
								))}
							</datalist>
						</div>

						<div>
							<label htmlFor="setor">Setor:</label>
							<input
								type="text"
								id="setor"
								name="setor"
								value={setor}
								onChange={(e) => {
									setSetor(e.target.value);
									setErrors((prevErrors) => ({ ...prevErrors, setor: false }));
								}}
								className={`${errors.setor ? 'border-red-500' : 'border-gray-300'}`}
							/>
						</div>
					</>
				)}

				{/* Exibe o campo de Site apenas para Externo */}
				{tipo === 'EXTERNO' && (
					<div>
						<label htmlFor="site">Site:</label>
						<input
							type="url"
							id="site"
							name="site"
							value={site}
							onChange={(e) => {
								setSite(e.target.value);
								setErrors((prevErrors) => ({ ...prevErrors, site: false }));
							}}
							className={`${errors.site ? 'border-red-500' : 'border-gray-300'}`}
						/>
					</div>
				)}

				<button onClick={handleSubmit} className='btn'>Enviar</button>
			</div>
		</div>
	);
};

export default NewContactForm;
