process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const app = require('../app');
const request = require('supertest')(app);

const connection = require('../connection');

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    it('GET status:200 and responds with an array of topics', () => request.get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.have.lengthOf(2);
        expect(body.topics[0].description).to.equal('The man, the Mitch, the legend');
        expect(body.topics[0]).to.have.all.keys('slug', 'description');
      }));

    it('POST status:201 and responds with added data', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        slug: 'john',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).to.eql({
          description: 'The Man Dem',
          slug: 'john',
        });
      }));

    it('POST status:400 and responds with "Bad Request, Invalid object structure provided" error message', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        snail: 'john',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Bad Request, Invalid object structure provided');
      }));
    it('POST status:400 and responds with "Bad Request, duplicate value provided" error message', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        slug: 'mitch',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Bad Request, Duplicate value supplied');
      }));
    it('GET status:200 and responds with an array of topics by article', () => request.get('/api/topics/cats/articles')
      .expect(200)
      .then(({
        body
      }) => {
        expect(body).to.have.lengthOf(1);
        expect(body[0].topic).to.eql('cats');
      }));
      it('GET status:200 and responds with an array of topics by article', () => request.get('/api/topics/cats/articles')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).to.have.lengthOf(1);
          expect(body[0].topic).to.eql('cats');
        }));
  });
});
