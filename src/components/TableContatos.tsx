"use client"

import { useEffect, useState } from "react";
import { deleteContato, getContatos, patchContato } from "@/api";
import { Contato } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import * as pdfMake from "pdfmake/build/pdfmake";
import { gerarPDF } from "@/utils/gerarPDF";
import NewContactForm from "./NewContactForm";
import { Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import Modal from "./Modal";

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
	const [visible, setvisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
	const [editContato, setEditContato] = useState<Contato | null>({
		ID: 0,
		CONTATO: "",
		TIPO: "",
		EMAIL: "",
		TELEFONE: "",
		SITE: "",
		SETOR: "",
		MATRICULA: "",
		DELETADO: 0
	})

	const handleOpenModal = (contato: number) => {
		const selected = contatos!.find((perm) => perm.ID === contato);
		setSelectedContato(selected || null);
		setEditContato(selected || null);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedContato(null);
		setIsModalOpen(false);
	};

	const formatData = (data: string) => {
		return data.split(";").map((item) => item.trim()).join("<br />")
	}

	const handleEdit = () => {
		Swal.fire({
			title: "Tem certeza?",
			text: "Deseja salvar a edição do contato?",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim!",
			animation: false
		}).then((result) => {
			if (result.isConfirmed) {
				patchContato(editContato!.ID, editContato!)
				Swal.fire({
					title: "Concluída!",
					text: "A edição foi feita.",
					icon: "success",
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
			}
		});
	}
	const handleDelete = () => {
		Swal.fire({
			title: "Tem certeza?",
			text: "Deseja deletar o contato em questão?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Deletar!",
			animation: false
		}).then((result) => {
			if (result.isConfirmed) {
				deleteContato(editContato!.ID)
				Swal.fire({
					title: "Concluída!",
					text: "O contato foi deletado.",
					icon: "success",
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
			}
		});
	}

	const fetchContatos = async () => {
		const data = await getContatos();
		setContatos(data || []);
	};

	useEffect(() => {
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

	const updateContacts = () => {
		fetchContatos();
	}

	return (
		<section>
			<button
				type="button"
				onClick={handleGerarPDF}
				className="absolute right-2 text-white hover:text-amber-200 top-[.7em]"
			>
				<svg
					width="30"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
				</svg>
			</button>
			<div className="btn-container">
				{/* <button onClick={handleGerarPDF} className="btn">Gerar PDF</button> */}
				<button onClick={() => setvisible(!visible)} className="btn">Novo contato</button>
			</div>
			<Transition show={visible}>
				<div className="transition duration-300 ease-in data-[closed]:opacity-0">
					<NewContactForm updateContacts={updateContacts} />
				</div>
			</Transition>
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
						<tr key={index} onClick={() => handleOpenModal(contato.ID)}>
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
			{/* Modal para visualização dos detalhes do empréstimo */}
			{selectedContato && (
				<Modal isOpen={isModalOpen} closeModal={closeModal} title={`Menu de edição ${selectedContato.CONTATO}`}>
					<form action={handleEdit} className="flex flex-col gap-4">
						<input id="id-contato" type="text" value={selectedContato.ID} hidden readOnly />
						<input id="tipo-contato" type="text" value={selectedContato.TIPO} hidden readOnly />
						<TextField id="edit-contato" label="Contato" variant="outlined" defaultValue={selectedContato.CONTATO} onChange={(e) => setEditContato({ ...selectedContato, CONTATO: e.target.value })} />
						<TextField id="edit-email" label="Email" variant="outlined" defaultValue={selectedContato.EMAIL} onChange={(e) => setEditContato({ ...selectedContato, EMAIL: e.target.value })} />
						<TextField id="edit-telefone" label="Telefone" variant="outlined" defaultValue={selectedContato.TELEFONE} onChange={(e) => setEditContato({ ...selectedContato, TELEFONE: e.target.value })} />
						{selectedContato.TIPO === "EXTERNO" ? (
							<TextField id="edit-site" label="Site" variant="outlined" defaultValue={selectedContato.SITE} onChange={(e) => setEditContato({ ...selectedContato, SITE: e.target.value })} />
						) : (
							<>
								<TextField id="edit-matricula" label="Matricula" variant="outlined" defaultValue={selectedContato.MATRICULA} onChange={(e) => setEditContato({ ...selectedContato, MATRICULA: e.target.value })} />
								<TextField id="edit-setor" label="Setor" variant="outlined" defaultValue={selectedContato.SETOR} onChange={(e) => setEditContato({ ...selectedContato, SETOR: e.target.value })} />
							</>
						)}

						<div className="mt-6 flex justify-between">
							<button type="button" onClick={handleDelete} className="btnPerigo">
								Deletar
							</button>
							<button onClick={handleEdit} className="btn">
								Salvar
							</button>
						</div>
					</form>
				</Modal>
			)}
		</section>
	);
};

export default TableContatos;
