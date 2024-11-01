import TableContatos from "@/components/TableContatos";

const Home = () => {
	return (
		<div className="lajota noscrollbar">
			<header>
				<h1>LISTAS DE CONTATOS DOS COMITÊS DE RECOLHIMENTO E RECALL</h1>
			</header>
			<TableContatos />
		</div>
	);
};

export default Home;