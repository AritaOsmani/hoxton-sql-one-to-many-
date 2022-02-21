import Database from "better-sqlite3";
import { MuseumData, WorkData } from "./Types";

const db = new Database('./museum.db', {
    verbose: console.log
})

const museums: MuseumData[] = [
    {

        name: 'The Louvre Museum',
        city: 'Paris'
    },
    {

        name: 'The Museum of Modern Art',
        city: 'New York'
    },
    {

        name: 'State Hermitage Museum',
        city: 'St.Petersburg'
    },
    {

        name: 'Tate Modern',
        city: 'London'
    },
    {

        name: 'Museo Nacional Del Prado',
        city: 'Madrid'
    }
]
const works: WorkData[] = [
    {
        name: 'Liberty Leading the People ',
        picture: 'https://cdn.kastatic.org/googleusercontent/aPyDvEE0Ns8_kqo6gwcfeBbFBkM5z0_ObtVDlIZGRb3hTxgJXb6pcztObGslkyGv64Fx3dcIeOQ0_IO57yU9G_EcJA',
        museumId: 1
    },
    {
        name: 'Mona Lisa',
        picture: 'https://news.artnet.com/app/news-upload/2021/11/4126_10706281_0.jpg',
        museumId: 1
    },
    {
        name: 'The Starry Night',
        picture: 'https://www.vangoghgallery.com/img/starry_night_full.jpg',
        museumId: 2
    },
    {
        name: 'The Persistence of Memory',
        picture: 'The Persistence of Memory',
        museumId: 2
    },
    {
        name: 'The Boulevard Montmarte in Paris',
        picture: 'https://lh5.ggpht.com/sWB0yWfSZ2qnIf8mV_KiuWDlmwjemrGCAf7Ep6R9s1V_MKsVT9HdMN7Llgcgbxg',
        museumId: 3
    },
    {
        name: 'Forgotten Horizon',
        picture: 'https://www.tate.org.uk/art/images/work/T/T01/T01078_9.jpg',
        museumId: 4
    },
    {
        name: 'Metamorphosis of Narcissus',
        picture: 'https://upload.wikimedia.org/wikipedia/en/2/21/Metamorphosis_of_Narcissus.jpg',
        museumId: 4
    },
    {
        name: 'Nan one month after being battered',
        picture: 'https://www.tate.org.uk/art/images/work/P/P78/P78045_9.jpg',
        museumId: 4
    },
    {
        name: 'Las Meninas',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Las_Meninas_01.jpg',
        museumId: 5
    }
]

// const dropMuseums = db.prepare(`
//     DROP TABLE museums;
// `)


const createMuseums = db.prepare(`
    CREATE TABLE IF NOT EXISTS museums (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL
    );
`)

const createWorks = db.prepare(`
    CREATE TABLE IF NOT EXISTS works(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    museumId INTEGER NOT NULL,
    FOREIGN KEY (museumId) REFERENCES museums(id)
    );
`)

const deleteMuseum = db.prepare(`
    DELETE FROM museums;
`)
const deleteWork = db.prepare(`
    DELETE FROM works;
`)

const createMuseum = db.prepare(`
    INSERT INTO museums (name,city) VALUES (?,?);
`)

const createWork = db.prepare(`
    INSERT INTO works (name,picture,museumId) VALUES (?,?,?);
`)

createMuseums.run()
createWorks.run();

deleteMuseum.run();
deleteWork.run();

for (const museum of museums) {
    createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
    createWork.run(work.name, work.picture, work.museumId)
}