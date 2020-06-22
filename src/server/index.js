const express = require('express');
const path = require('path');
const faker = require('faker');

const port = process.env.PORT || 5000;
const app = express();

const nameProcs = [];

for(let i = 0; i < 20; i += 1) {
  nameProcs.push(faker.lorem.word());
}

app.use(express.static(path.resolve(__dirname, '../../dist/ng-basics')));

app.get('/api', (request, reply) => {
  reply.send('API is running');
});

app.get('/api/procs', (request, reply) => {
  const procs = nameProcs.map((item, index) => ({
    pid: index + 1,
    title: item,
    cpu: Math.round(Math.random() * 250) / 10,
    memory: Math.round(Math.random() * 100) / 10,  
  }))

  reply.status(200);
  reply.send(
    {
      procs: procs,
    }
  );
});

app.listen(port, () => {
  console.log('listen port 5000');
});

app.use((request, reply) => {
  reply.status(404);
  console.log(`Not found URL: ${request.url}`);
  reply.send({ error: 'Not found' });
});

app.use((err, request, reply) => {
  reply.status(err.status || 500);
  console.log(`Internal error(${reply.statusCode}): ${err.message}`);
  reply.send({ error: err.message });
});
