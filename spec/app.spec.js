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

    it('POST status:400 and responds with "Bad Request, Invalid object structure provided" when wrong key is sent', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        snail: 'john',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Bad Request, Invalid object structure provided');
      }));
    it('POST status:400 and responds with "Bad Request, duplicate value provided" ewhen duplicate value is sent', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        slug: 'mitch',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Bad Request, Duplicate value supplied');
      }));

    describe('/api/topics/:topic/articles', () => {
      it('GET status:200 and responds with an array of topics by article', () => request.get('/api/topics/cats/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body).to.have.lengthOf(1);
          expect(body[0].topic).to.eql('cats');
          expect(body[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
        }));
      it('GET status:400 and responds with "no article found" if there is no article', () => request.get('/api/topics/hams/articles')
        .expect(404)
        .then(({
          body,
        }) => {
          expect(body.message).to.eql('no article found');
        }));
      it('GET status:200 and responds with default settings of limit=10, sort_by=date,order=desc', () => request.get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body).to.have.lengthOf(10);
          expect(body[0].article_id).to.eql(1);
        }));
      it('GET status:200 and takes a limt query and responds with appropriate number of articles', () => request.get('/api/topics/mitch/articles?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body).to.have.lengthOf(5);
        }));
      it('GET status:200 and takes a sort_by query and responds articles sorted by that query', () => request.get('/api/topics/mitch/articles?sort_by=article_id')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body[0].article_id).to.eql(12);
        }));
      it('GET status:200 and takes a p query and responds articles paginated by that query', () => request.get('/api/topics/mitch/articles?p=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body[0].article_id).to.eql(12);
          expect(body).to.have.lengthOf(1);
        }));
      it('GET status:200 and takes a order query and responds articles ordered by that query', () => request.get('/api/topics/mitch/articles?sort=asc')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body[0].article_id).to.eql(12);
        }));
    });
  });
});
