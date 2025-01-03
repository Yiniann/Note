const express = require('express')
const app = express()

require('dotenv').config()//引入环境变量

const Note = require('./models/note')//引入模型

let notes =[]

app.use(express.static('build'))//serving static files

const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())//允许跨域

app.use(express.json())//json解析

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(result=>{
    response.json(result)
  })
})

app.get('/api/notes/:id',(request,response)=> {
  Note.findById(request.params.id).then(note=>{
    response.json(note)
  })
})

app.delete('/api/notes/:id',(request,response)=>{
  Note.findByIdAndDelete(request.params.id).then(()=>{
    response.status(204).end()
  })
})


//增加笔记
app.post('/api/notes', (request, response) => {

  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content:body.content,
    important:body.important || false,
  })
  note.save().then(saveNote=>{
    response.json(saveNote)
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
