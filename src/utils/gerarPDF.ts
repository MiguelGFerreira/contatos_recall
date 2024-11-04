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

	const docDefinition = {
		pageSize: 'A4',
		pageMargins: [40, 100, 40, 40], // Ajuste das margens para acomodar o cabeçalho
		styles: {
			header: { fontSize: 18, bold: true, alignment: "center" },
			subheader: { fontSize: 14, bold: true },
			tableHeader: { bold: true, fillColor: "#eeeeee" },
			table: { margin: [0, 5, 0, 15] }
		},
		header: {
			table: {
				widths: [50, "*", 100],
				body: [
					[
						{
							image: `data:image/png;base64,${logo}`,
							width: 50,
							rowSpan: 2,
							margin: [0, 5, 0, 5]
						},
						{
							text: "Listas De Contatos Dos Comitês De Recolhimento E Recall",
							bold: true,
							alignment: "center",
							margin: [0, 5, 0, 2]
						},
						{
							text: "AN-CQ-PPRCQ004-002",
							alignment: "right",
							margin: [0, 5, 5, 2]
						}
					],
					[
						{},
						{
							text: "Sistema de Gestão da Qualidade e Segurança de Alimentos",
							alignment: "center",
							margin: [0, 0, 0, 5]
						},
						{
							table: {
								body: [
									[{ text: "Vigência: 10/06/2024", alignment: "right" }],
									[{ text: "Versão: 12", alignment: "right" }]
								]
							},
							layout: "noBorders",
							margin: [0, 0, 5, 5]
						}
					]
				]
			},
			margin: [40, 10, 40, 10]
		},

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
