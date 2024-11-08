import { getEmployees, postContato } from '@/api';
import { Contato } from '@/types';
import React, { useEffect, useState } from 'react';

interface Employee {
	matricula: string;
	nome: string;
}

const NewContactForm = ({ updateContacts }: { updateContacts: () => void }) => {
	const [formValues, setFormValues] = useState({
		tipo: '',
		nome: '',
		email: '',
		matricula: '',
		telefone: '',
		setor: '',
		site: '',
	})
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

	// const handleTipoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
	// 	setErrors((prevErrors) => ({ ...prevErrors, tipo: false }))
	// 	setTipo(event.target.value);
	// };

	// const handleMatriculaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setErrors((prevErrors) => ({ ...prevErrors, matricula: false }));
	// 	setMatricula(event.target.value);

	// 	const matriculaInfo = employees.find(e => e.matricula === event.target.value);
	// 	if (matriculaInfo) {
	// 		setNome(matriculaInfo.nome);
	// 	}
	// };

	const handleFieldChange = (field: string, value: string) => {
		setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
		setFormValues((prevValues) => ({ ...prevValues, [field]: value }));

		if (field === 'tipo') {
			if (value === "EQUIPE" || value === "APOIO") {
				formValues.site = '';
				return;
			} else if (value === "EXTERNO") {
				formValues.matricula = '';
				formValues.setor = '';
				return;
			}
		}
	}

	const doNothing = () => { return }

	const validateForm = () => {
		const { tipo, nome, email, telefone, matricula, setor, site } = formValues;
		return {
			tipo: !tipo,
			nome: !nome,
			email: !email,
			telefone: !telefone,
			matricula: (tipo === "EQUIPE" || tipo === "APOIO") && !matricula,
			setor: (tipo === "EQUIPE" || tipo === "APOIO") && !setor,
			site: tipo === "EXTERNO" && !site,
		};
	};

	const handleSubmit = async () => {
		const validationErrors = validateForm();
		setErrors(validationErrors);

		if (Object.values(validationErrors).includes(true)) return;

		const newContact: Contato = {
			CONTATO: formValues.nome,
			MATRICULA: formValues.matricula,
			SETOR: formValues.setor,
			TELEFONE: formValues.telefone,
			EMAIL: formValues.email,
			SITE: formValues.site,
			TIPO: formValues.tipo
		}

		await postContato(newContact);

		updateContacts();

		setFormValues({
			tipo: '',
			nome: '',
			email: '',
			matricula: '',
			telefone: '',
			setor: '',
			site: '',
		});

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

	async function fetchEmployees() {
		const data = await getEmployees();
		setEmployees(data);
	}

	useEffect(() => {
		fetchEmployees()
	}, [])

	return (
		<div className="card">
			<div className="grid grid-cols-3 gap-4">
				<div>
					<label htmlFor="tipo">Tipo</label>
					<select
						name="tipo"
						id="tipo"
						value={formValues.tipo}
						onChange={(e) => handleFieldChange('tipo', e.target.value)}
						className={`${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
					>
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
						value={formValues.nome}
						onChange={(e) => handleFieldChange('nome', e.target.value)}
						className={`${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formValues.email}
						onChange={(e) => handleFieldChange('email', e.target.value)}
						className={`${errors.email ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				<div>
					<label htmlFor="telefone">Telefone:</label>
					<input
						type="tel"
						id="telefone"
						name="telefone"
						value={formValues.telefone}
						onChange={(e) => handleFieldChange('telefone', e.target.value)}
						className={`${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
					/>
				</div>

				{/* Exibe os campos de Matrícula e Setor apenas para Equipe e Apoio */}
				{(formValues.tipo === 'EQUIPE' || formValues.tipo === 'APOIO') && (
					<>
						<div>
							<label htmlFor="matricula">Matrícula:</label>
							<input
								list="matriculas"
								id="matricula"
								name="matricula"
								value={formValues.matricula}
								onChange={(e) => {
									handleFieldChange('matricula', e.target.value);
									const matriculaInfo = employees.find((f) => f.matricula === e.target.value);
									matriculaInfo ? handleFieldChange('nome', matriculaInfo.nome) : doNothing
								}}
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
								value={formValues.setor}
								onChange={(e) => handleFieldChange('setor', e.target.value)}
								className={`${errors.setor ? 'border-red-500' : 'border-gray-300'}`}
							/>
						</div>
					</>
				)}

				{/* Exibe o campo de Site apenas para Externo */}
				{formValues.tipo === 'EXTERNO' && (
					<div>
						<label htmlFor="site">Site:</label>
						<input
							type="url"
							id="site"
							name="site"
							value={formValues.site}
							onChange={(e) => handleFieldChange('site', e.target.value)}
							className={`${errors.site ? 'border-red-500' : 'border-gray-300'}`}
						/>
					</div>
				)}

			</div>
			<button onClick={handleSubmit} className='btn'>Enviar</button>
		</div>
	);
};

export default NewContactForm;
