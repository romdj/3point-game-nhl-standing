import express from "express";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/html-ref/NHLStandings.html`);
});
export default app;

app.listen();
