import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient


app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany(); // metodo para achar os filmes do banco de dados
    res.json(movies); // retorno da nossa api vai ser um json com todos os filmes
})

app.listen(port, () => {
    console.log(`Servidor em execucao na porta ${port}`);
});