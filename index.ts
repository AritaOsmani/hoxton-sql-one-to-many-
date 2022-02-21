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

const createMuseum = db.prepare(`
    INSERT INTO museums (name,city) VALUES (?,?);
`)
const createWork = db.prepare(`
    INSERT INTO works (name,picture,museumId) VALUES (?,?,?);
`)

const deleteWork = db.prepare(`
    DELETE FROM works WHERE id=?
`)
const deleteMuseum = db.prepare(`
    DELETE FROM museums WHERE id = ?;
`)
const deleteMuseumWorks = db.prepare(`
    DELETE FROM works WHERE museumId = ?;
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

app.post('/museums', (req, res) => {
    const { name, city } = req.body;
    const errors = []

    if (typeof name !== 'string') {
        errors.push('Name missing or not a string!')
    }
    if (typeof city !== 'string') {
        errors.push('City missing or not a string!')
    }

    if (errors.length === 0) {
        const result = createMuseum.run(name, city)
        const newMuseum = getMuseumById.get(result.lastInsertRowid);
        res.send(newMuseum)
    } else {
        res.status(400).send(errors)
    }
})

app.post('/works', (req, res) => {
    const { name, picture, museumId } = req.body;
    const errors = []

    if (typeof name !== 'string') {
        errors.push('Name missing or not a string!')
    }
    if (typeof picture !== 'string') {
        errors.push('Picture missing or not a string!')
    }
    if (typeof museumId !== 'number') {
        errors.push('Museum id missing or not a number!')
    }

    if (errors.length === 0) {
        const museum = getMuseumById.get(museumId)
        if (museum) {
            const result = createWork.run(name, picture, museumId)
            const newWork = getWorksById.get(result.lastInsertRowid)
            res.status(200).send(newWork)
        } else {
            res.status(404).send('This museum does not exist!')
        }
    } else {
        res.status(400).send(errors)
    }
})

app.delete('/museums/:id', (req, res) => {
    const id = req.params.id;

    const matchedMuseum = getMuseumById.get(id);

    if (matchedMuseum) {
        deleteMuseumWorks.run(id);
        const result = deleteMuseum.run(id);
        if (result.changes !== 0) {
            res.send({ message: 'Museum deleted sucessfully!' })
        } else {
            res.status(400).send({ error: 'Something went wrong!' })
        }
    } else {
        res.status(404).send({ message: 'Museum does not exist!' })
    }
})

app.delete('/works/:id', (req, res) => {
    const id = req.params.id;
    const matchedWork = getWorksById.get(id)

    if (matchedWork) {
        const result = deleteWork.run(id)
        if (result.changes !== 0) {
            res.send({ message: 'Work deleted sucessfully!' })
        } else {
            res.status(400).send({ error: 'Something went wrong!' })
        }
    } else {
        res.status(404).send({ error: 'Work not found!' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})