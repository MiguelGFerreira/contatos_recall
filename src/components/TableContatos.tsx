"use client"

import { useEffect, useState } from "react";
import { getContatos } from "@/api";
import { Contato } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const TableContatos = () => {
	const [contatos, setContatos] = useState<Contato[] | null>(null);

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

	const gerarPDF = () => {
		const { apoio, equipe, externo } = dividirTipos();

		const criarTabela = (dados: Contato[], titulo: string) => {
			return [
				[{ text: titulo, style: "tableHeader", colSpan: 4, alignment: "center" }, {}, {}, {}],
				["Contato", "Email", "Setor", "Telefone"],
				...dados.map(contato => [
					contato.CONTATO,
					contato.EMAIL,
					contato.SETOR,
					contato.TELEFONE
				])
			];
		};

		const docDefinition = {
			styles: {
				header: { fontSize: 18, bold: true, alignment: "center" },
				subheader: { fontSize: 14, bold: true },
				tableHeader: { bold: true, fillColor: "#eeeeee" },
				table: { margin: [0, 5, 0, 15] }
			},
			content: [
				{ text: "Contatos da Equipe Multidisciplinar", style: "header" },
				{ text: "\nTabela de Apoio\n", style: "subheader" },
				{ table: { body: criarTabela(apoio, "Apoio") }, style: "table" },
				{ text: "\nTabela de Equipe\n", style: "subheader" },
				{ table: { body: criarTabela(equipe, "Equipe") }, style: "table" },
				{ text: "\nTabela Externo\n", style: "subheader" },
				{ table: { body: criarTabela(externo, "Externo") }, style: "table" }
			],
		};

		//@ts-ignore
		pdfMake.createPdf(docDefinition).open();
	};

	return (
		<section>
			<button onClick={gerarPDF} className="btn">Gerar PDF</button>
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
