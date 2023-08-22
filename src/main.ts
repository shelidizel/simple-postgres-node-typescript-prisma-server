import { PrismaClient } from "@prisma/client";
import { dir } from "console";
import express from 'express'

const prisma = new PrismaClient()
const app    = express()

app.use(express.json())

app.get('/playlist', async (req, res) => {
    const songs = await prisma.song.findMany({
        where : {released : true},
        include : {singer : true}
    })

    res.json({
        success : true,
        payload : songs
    })
})

app.get(`/song/:id`, async (req, res) => {
    const  id  = req.params.id
    const song = await prisma.song.findFirst({
        where : { id : Number(id) }
    })

    res.json({
        success : true, 
        payload : song
    })
})

app.post('/artist', async ( req, res ) => {

    const artist = await prisma.artist.create({
        data : {
            ...req.body
        }
    })

    res.json({
        success : true,
        payload : artist
    })
})

app.post('/song', async ( req, res ) => {
    const {title, content, singerEmail } = req.body
    const song = await prisma.song.create({
        data : {
            title,
            content,
            released : false,
            singer : { connect : { email : singerEmail}}
        }
    })

    res.json({
        success : true, 
        payload : song
    })
})

app.put('/song/release/:id', async (req, res) => {
    const { id } = req.params
    const song = await prisma.song.update({
        where : {id : Number(id)},
        data : { released : true}
    })

    res.json({
        success : true,
        payload : song
    })
})

app.delete('/song/:id', async (req, res) => {
    const { id } = req.params

    const song = await prisma.song.delete({
        where : { id : Number(id)}
    })

    res.json({
        success : true, 
        payload : song
    })
})

app.get('/artists', async (req, res) => {

    const artists = await prisma.artist.findMany()

    res.status(200).json({
        success : true,
        payload : artists,
        message : 'Operation succesful'
    })
})

app.use((req, res, next) => {
    res.status(404);
    return res.json({
        success : false,
        payload : null,
        message : `resource ${req.url}not found`
    })
})



app.listen(3000, () => {
    console.log('Server listening at port 300');
    
})