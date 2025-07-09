import express from "express";

import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient()

app.use(express.json());


app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
})

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        // case isensitive - se a busca for feita por Jhon Wick ou jhon wick ou JHON WHICK, 
        // o registro vai ser retornada na consulta

        // case sensitive - se buscar por Jhon Wick e no banco estiver como  Jhon wick, nao vai ser retornada na consulta
        const movieWithSameTitle = await prisma.movie.findFirst({
            where:{ title:  { equals: title, mode: "insensitive"}  }
        });
            if(movieWithSameTitle) {
                return  res.status(409).send({ message: "Ja existe um filme cadastrado com esse titulo"})
            }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date)
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Falha ao Cadastrar um filme" })
    }
    res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
    // pega o id do registro que vai ser atualizado
    const id = Number(req.params.id);

try{ // tratando possiveis erros para exibir para os usuarios
const movie = await prisma.movie.findUnique({
    where: {
        id
    }
})

if(!movie){ //se o filme nao foi encontraro
    return res.status(404).send({message: "Nenhum Filme foi encontrado"}); // retornamos um status diferente com uma msg dizendo que o filme nao foi encontrado
}

    const data = {...req.body};
    data.release_date = data.release_date ? new Date(data.release_date) : undefined;
    

    
    // pegar os dados do filme  que eu quero atualizar e atualizar ele no prisma
      await prisma.movie.update({
        where: {
           id
        },
        data: data
      }); 
    }catch(error){
        return res.status(500).send({ message: "falha ao atualizar o registro do filme" })
    }
      res.status(200).send();
     
    // retornar o status correto informando que o filme foi atualizado
});

app.listen(port, () => {
    console.log(`Servidor em execucao na porta ${port}`);
});