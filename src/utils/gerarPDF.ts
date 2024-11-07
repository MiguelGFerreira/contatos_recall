import * as pdfMake from "pdfmake/build/pdfmake";
import { Contato } from "@/types";
import { getBase64ImageFromURL } from "./utilsServer";

(pdfMake as any).fonts = {
	Roboto: {
		normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
		bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
		italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
		bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
	},
};

const criarTabela = (dados: Contato[], titulo: string, incluirSetor: boolean) => {
	const header = incluirSetor ? ["Contato", "Email", "Setor", "Telefone"] : ["Contato", "Email", "Telefone"];
	const body = dados.map(contato => {
		const row = [
			contato.CONTATO,
			contato.EMAIL,
			contato.TELEFONE
		];
		if (incluirSetor) {
			row.splice(2, 0, contato.SETOR);
		}
		return row;
	});

	return [
		//[{ text: titulo, style: "tableHeader", colSpan: header.length, alignment: "center" }, ...Array(header.length - 1).fill({})],
		header,
		...body
	];
};

export const gerarPDF = async (apoio: Contato[], equipe: Contato[], externo: Contato[]) => {
	const logo = await getBase64ImageFromURL("@/../public/coroaRKF.jpg");

	function header_definition(currentPage: number, pageCount: number, pageSize: number) {
		return {
			table: {
				widths: [60, "*", 130],
				body: [
					[
						{
							image: `data:image/png;base64,${logo}`,
							width: 50,
							rowSpan: 4,
							alignment: "center",
							margin: [0, 22.5, 0, 22.5]
						},
						{
							rowSpan: 4,
							stack: [
								{
									text: "Listas De Contatos Dos Comitês De Recolhimento E Recall",
									bold: true,
									alignment: "center",
									//margin: [0, 5, 0, 2]
								},
								{
									text: "Sistema de Gestão da Qualidade e Segurança de Alimentos",
									alignment: "center",
									//margin: [0, 0, 0, 5]
								},
							],
							margin: [0, 8],
						},
						{
							text: "AN-CQ-PPRCQ004-002",
							alignment: "right",
						}
					],
					[
						{},
						{},
						{
							text: "Vigência: 10/06/2024",
							alignment: "right"
						}
					],
					[
						{},
						{},
						{
							text: "Versão: 1",
							alignment: "right"
						}
					],
					[
						{},
						{},
						{
							text: `Página ${currentPage} de ${pageCount}`,
							alignment: "right"
						}
					]
				]
			},
			margin: [40, 10, 40, 10]
		};
	};

	const docDefinition = {
		pageSize: 'A4',
		pageMargins: [40, 100, 40, 40], // Ajuste das margens para acomodar o cabeçalho
		styles: {
			header: { fontSize: 18, bold: true, alignment: "center" },
			subheader: { fontSize: 14, bold: true },
			tableHeader: { bold: true, fillColor: "#eeeeee" },
			table: { margin: [0, 5, 0, 15] }
		},
		header: header_definition,

		content: [
			{ text: "\nContatos da Equipe Multidisciplinar:\n", style: "subheader" },
			{ table: { body: criarTabela(apoio, "Apoio", true) }, style: "table" },
			{ text: "\nEquipe de Apoio ao Comitê de Recall:\n", style: "subheader" },
			{ table: { body: criarTabela(equipe, "Equipe", true) }, style: "table" },
			{ text: "\nLista de Contatos Chave Externos:\n", style: "subheader" },
			{ table: { body: criarTabela(externo, "Externo", false) }, style: "table" }
		],
	};

	//@ts-ignore
	pdfMake.createPdf(docDefinition).open();
};
