import { useCallback, useEffect, useMemo, useState } from "react";

// import { debounce } from "lodash";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { CircularProgress, Image, Input, Button } from "@nextui-org/react";

import "react-toastify/dist/ReactToastify.css";

const nameArray = ["pom", "gumpi", "mummy", "papa", "family"];

function App() {
	const [name, setName] = useState("");
	const [data, setData] = useState<string[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const startSearch = useCallback(async (val: string) => {
		setName(val);
		setIsLoading(true);
		const res = await fetch(
			`${import.meta.env.VITE_BACKEND_HOST}/api/name?name=${val}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (res.ok) {
			const data = await res.json();
			setData(data);
		} else {
			toast(await res.text());
			setData(null);
		}
		setIsLoading(false);
	}, []);

	const nameDropDown = useMemo(() => {
		return nameArray
			.filter((val) => {
				const searchTerm = name.toLowerCase();
				const fullName = val.toLowerCase();

				return (
					searchTerm &&
					fullName.startsWith(searchTerm) &&
					fullName !== searchTerm
				);
			})
			.map((val) => {
				return (
					<button
						key={val}
						onClick={() => {
							startSearch(val);
						}}
						className="w-full px-3 py-1 bg-transparent rounded-sm border border-white"
					>
						{val}
					</button>
				);
			});
	}, [name, startSearch]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	// const debouncedSearch = useCallback(debounce(startSearch, 1500), []);

	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				name && startSearch(name);
			}
		};

		window.addEventListener("keydown", keyDownHandler);

		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [startSearch, name]);

	return (
		<div>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Bounce}
			/>
			<div className="flex flex-col items-center justify-center gap-2">
				<h3
					className="text-default-500 text-small"
					style={{
						marginTop: "100px",
					}}
				>
					Type a name [example: your name]
				</h3>
				<div className="flex flex-col justify-center items-start md:flex-nowrap">
					<div className="flex gap-2 items-start h-[100px]">
						<Input
							onChange={(e) => setName(e.target.value)}
							value={name}
							key={"inside"}
							type="text"
							label="Name"
							labelPlacement={"inside"}
						/>
						<Button
							style={{
								paddingTop: "1.5rem",
								paddingBottom: "1.5rem",
							}}
							variant="bordered"
							onClick={() => {
								setData(null);
								startSearch(name);
							}}
						>
							Get
						</Button>
					</div>
					<div style={{ marginTop: "5px", width: "100%" }}>
						{data && (
							<Button
								className="w-full"
								radius="sm"
								onClick={() => setData(null)}
							>
								Clear
							</Button>
						)}
					</div>
					<div
						className="flex flex-col w-full"
						style={{
							marginTop: "1rem",
						}}
					>
						{nameDropDown}
					</div>
				</div>
			</div>
			<div
				style={{
					marginTop: "100px",
					minHeight: "700px",
					padding: "1rem",
					paddingBottom: "5rem",
				}}
			>
				{isLoading ? (
					<div className="w-full flex justify-center mt-20">
						<CircularProgress size="lg" aria-label="Loading..." />
					</div>
				) : (
					<div
						style={{
							width: "100%",
							display: "grid",
							justifyContent: "space-between",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(300px, 3fr))",
							gap: "1rem",
						}}
					>
						{data?.map((url) => {
							return <Image key={url} isBlurred src={url} />;
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
