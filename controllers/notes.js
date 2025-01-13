const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
  })
  

notesRouter.get('/:id',async(request, response,next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
    
    const saveNote = await note.save()
    response.json(saveNote)
  }catch(error){
    next(error)
  }
})

notesRouter.delete('/:id',async (request, response, next)=>{
  try{
    const deleteNote = await Note.findByIdAndDelete(request.params.id)
    if(deleteNote){
      response.status(204).end();
  }else{
    response.status(404).send({error:'Note not found'})
  }}
  catch(error){
    next(error)
  }
})

notesRouter.put('/:id', async(request, response, next) => {
  try{
    const body = request.body

    const note = {
      content: body.content,
      important: body.important,
    }

    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {new:true})
    if(updatedNote){
      response.json(updatedNote)
    }else{
      response.status(404).send({error:'Note not found'})
    }
  }
  catch(error){
    next(error)
  }
})

module.exports = notesRouter