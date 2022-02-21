
export type Museum = {
    id: number,
    name: string,
    city: string,
}

export type Work = {
    id: number,
    name: string,
    picture: string,
    museumId: number
}

export type MuseumData = Omit<Museum, 'id'>;
export type WorkData = Omit<Work, 'id'>;