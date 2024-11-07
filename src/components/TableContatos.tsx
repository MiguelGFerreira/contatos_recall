"use client"

import { useEffect, useState } from "react";
import { getContatos } from "@/api";
import { Contato } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import * as pdfMake from "pdfmake/build/pdfmake";
import { gerarPDF } from "@/utils/gerarPDF";
import NewContactForm from "./NewContactForm";

(pdfMake as any).fonts = {
	Roboto: {
		normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
		bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
		italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
		bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
	},
}

const TableContatos = () => {
	const [contatos, setContatos] = useState<Contato[] | null>(null);
	const [visible, setvisible] = useState(true);

	const formatData = (data: string) => {
		return data.split(";").map((item) => item.trim()).join("<br />")
	}

	useEffect(() => {
		const fetchContatos = async () => {
			const data = await getContatos();
			setContatos(data || []);
		};

		fetchContatos();
	}, []);

	if (!contatos) return <LoadingSpinner />;

	const dividirTipos = () => {
		const apoio = contatos.filter(contato => contato.TIPO === "APOIO");
		const equipe = contatos.filter(contato => contato.TIPO === "EQUIPE");
		const externo = contatos.filter(contato => contato.TIPO === "EXTERNO");
		return { apoio, equipe, externo };
	}

	const handleGerarPDF = () => {
		const { apoio, equipe, externo } = dividirTipos();
		gerarPDF(apoio, equipe, externo);
	};

	return (
		<section>
			<button onClick={handleGerarPDF} className="btn">Gerar PDF</button>
			<button onClick={() => setvisible(!visible)} className="btn">Novo contato</button>
			<NewContactForm visible={visible} />
			<table className="tabela">
				<thead>
					<tr>
						<th>Contato</th>
						<th>Email</th>
						<th>Matricula</th>
						<th>Setor</th>
						<th>Site</th>
						<th>Telefone</th>
						<th>Tipo</th>
					</tr>
				</thead>
				<tbody>
					{contatos.map((contato, index) => (
						<tr key={index}>
							<td>{contato.CONTATO}</td>
							<td className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatData(contato.EMAIL) }}></td>
							<td>{contato.MATRICULA}</td>
							<td>{contato.SETOR}</td>
							<td className="whitespace-nowrap">{contato.SITE}</td>
							<td className="whitespace-nowrap" dangerouslySetInnerHTML={{ __html: formatData(contato.TELEFONE) }}></td>
							<td>{contato.TIPO}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

export default TableContatos;
