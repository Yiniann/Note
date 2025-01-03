const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // 引入环境变量
const Note = require('./models/note'); // 引入模型

app.use(express.static('build')); // 服务静态文件
app.use(cors()); // 允许跨域
app.use(express.json()); // JSON 解析

// 根路由
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// 获取所有笔记
app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error));
});

// 获取单条笔记
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// 增加笔记
app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save()
    .then(savedNote => response.json(savedNote))
    .catch(error => next(error));
});

// 删除笔记
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error));
});

// 未知路由处理
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// 错误处理
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

// 启动服务
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
