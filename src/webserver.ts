import express from "express";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/html-ref/NHL Hockey Standings _ NHL.com.html`);
});
export default app;
