import express from "express";
import cors from "cors";
import { getObjectUrl } from "./aws-connect";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/name/", async (req, res) => {
	let { name } = req.query;

	if (name !== undefined) {
		name = name.toString().toLowerCase();

		const url = await getObjectUrl(name);
		if (url.length === 0) {
			res.status(404).send("No images found");
		} else {
			res.send(url);
		}
	} else {
		res.sendStatus(400);
	}
});

app.listen(process.env.PORT!, () =>
	console.log(`Server is running on port ${process.env.PORT!}`)
);

export default app;
