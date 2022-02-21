import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

const app = express();
const PORT = 4000;
const db = new Database('./museum.db', {
    verbose: console.log
})

app.use(cors())
app.use(express.json())

const getMuseums = db.prepare(`
    SELECT * FROM museums;
`)

const getWorks = db.prepare(`
    SELECT * FROM works;
`)
const getWorksById = db.prepare(`
    SELECT * FROM works WHERE id =?;
`)
const getWorksByMuseum = db.prepare(`
    SELECT * FROM works WHERE museumId = ?
`)
const getMuseumById = db.prepare(`
    SELECT*FROM museums WHERE id =?;
`)

app.get('/museums', (req, res) => {

    const museums = getMuseums.all();

    for (const museum of museums) {
        const artWork = getWorksByMuseum.all(museum.id)
        museum.works = artWork
    }

    res.send(museums)
})

app.get('/museums/:id', (req, res) => {
    const id = req.params.id;
    const museum = getMuseumById.get(id)

    const works = getWorksByMuseum.all(museum.id)
    museum.works = works;
    res.send(museum)
})

app.get('/works', (req, res) => {
    const works = getWorks.all();

    for (const work of works) {
        const museum = getMuseumById.get(work.museumId)
        work.museum = museum
    }

    res.send(works)
})

app.get('/works/:id', (req, res) => {
    const id = req.params.id;
    const work = getWorksById.get(id);
    if (work) {
        const museum = getMuseumById.get(work.museumId)
        work.museum = museum;
        res.send(work)
    } else {
        res.status(404).send({ message: 'Work not found!' })
    }
})

// app.post('/museums',(req,res)=>{

// })

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})