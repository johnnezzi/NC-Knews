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

    it.only('PUT/PATCH/DELETE status:405 and handles invalid requests', () => {
      const invalidMethods = ['patch', 'delete', 'put'];
      const invalidRequests = invalidMethods.map(invalidMethod => request[invalidMethod](('/api/topics')));
      return Promise.all(invalidRequests)
        .then(body => console.log(body));
    });
  });

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

    it('GET status:404 and responds with "no article found" if there is no article', () => request.get('/api/topics/hams/articles')
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

    it('GET status:200 and takes a order query and responds articles ordered by that query', () => request.get('/api/topics/mitch/articles?sort_order=asc')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body[0].article_id).to.eql(12);
      }));

    it('POST status:201 and responds with added data', () => request.post('/api/topics/mitch/articles')
      .send({
        title: 'poke it out',
        body: 'Playboy playboy hit me on my face time',
        username: 'icellusedkars',
      })
      .expect(201)
      .then(({
        body,
      }) => {
        expect(body.article.title).to.eql('poke it out');
        expect(body.article.body).to.eql('Playboy playboy hit me on my face time');
        expect(body.article.username).to.eql('icellusedkars');
        expect(body.article.topic).to.eql('mitch');
        expect(body.article).to.have.any.keys('created_at');
      }));

    it('POST status:400 and responds with error "Bad Request, Invalid object structure provided" when wrong key is sent', () => request.post('/api/topics/mitch/articles')
      .send({
        title: 'poke it out',
        mind: 'Playboy playboy hit me on my face time',
        username: 'icellusedkars',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Bad Request, Invalid object structure provided');
      }));

    it('POST status:400 and responds with error "Bad Request, Username does not exist" when sent a user not in users table', () => request.post('/api/topics/mitch/articles')
      .send({
        title: 'Living in the shadow of a great man',
        body: 'Playboy playboy hit me on my face time',
        username: 'John',
      })
      .expect(422)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Bad Request, Username does not exist');
      }));
  });

  describe('/api/articles', () => {
    it('GET Status:200, it responds with an array of articles', () => request.get('/api/articles')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.have.lengthOf(10);
        expect(body[0].title).to.eql('Living in the shadow of a great man');
        expect(body[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
      }));

    it('GET status:200 and responds with default settings of limit=10, sort_by=date,order=desc', () => request.get('/api/articles')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.have.lengthOf(10);
        expect(body[0].article_id).to.eql(1);
      }));
  });

  describe('/api/articles/:article_id', () => {
    it('GET status:200 responds with an article object', () => request.get('/api/articles/4')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.have.lengthOf(1);
        expect(body[0]).to.have.all.keys('article_id', 'author', 'title', 'votes', 'body', 'comment_count', 'created_at', 'topic');
      }));

    it('GET status:404 responds with "No article found" when sent invalid article_id ', () => request.get('/api/articles/400')
      .expect(404)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('No article found');
      }));

    it('PATCH status:201 raccepts a patch requests and amends the database accordingly', () => request.patch('/api/articles/1')
      .send({
        inc_votes: 3,
      })
      .expect(202)
      .then(({
        body,
      }) => {
        expect(body.votes).to.eql(103);
      }));

    it('DELETE status:204 accepts a delete requests and deletes the article from the databse', () => request.delete('/api/articles/2')
      .expect(204)
      .then(() => request.get('/api/articles/2')
        .expect(404)));
  });
  describe('/api/articles/:article_id/comments', () => {
    it('GET Status:200 responds and an array of comments for queried article', () => request.get('/api/articles/9/comments')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments[0].body).to.eql('Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!');
        expect(body.comments).to.have.a.lengthOf(2);
        expect(body.comments[0]).to.have.all.keys('comments_id', 'votes', 'created_at', 'author', 'body');
      }));

    it('GET status:200 and responds with default settings of limit=10, sort_by=date,order=desc', () => request.get('/api/articles/1/comments')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments).to.have.lengthOf(10);
        expect(body.comments[0].comments_id).to.eql(2);
      }));

    it('GET status:200 and takes a limt query and responds with appropriate number of articles', () => request.get('/api/articles/1/comments?limit=5')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments).to.have.lengthOf(5);
      }));

    it('GET status:200 and takes a sort_by query and responds articles sorted by that query', () => request.get('/api/articles/1/comments?sort_by=comments_id')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments[0].comments_id).to.eql(18);
      }));

    it('GET status:200 and takes a p query and responds articles paginated by that query', () => request.get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments[0].comments_id).to.eql(12);
        expect(body.comments).to.have.lengthOf(3);
      }));

    it('GET status:200 and takes a order query and responds articles ordered by that query', () => request.get('/api/articles/1/comments?sort_order=asc')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments[0].comments_id).to.eql(18);
      }));

    it('POST status:201 respond with article which has been added to topic', () => request.post('/api/articles/9/comments')
      .send({
        username: 'icellusedkars',
        body: 'Im a social commententator',
      })
      .expect(201)
      .then(({
        body,
      }) => {
        expect(body.comment.body).to.eql('Im a social commententator');
        expect(body.comment.article_id).to.eql(9);
        expect(body.comment).to.have.all.keys('username', 'body', 'article_id', 'comments_id', 'created_at', 'votes');
      }));

    it('PATCH status:201 accepts a patch requests and amends the database accordingly', () => request.patch('/api/articles/9/comments/1')
      .send({
        inc_votes: 4,
      })
      .expect(202)
      .then(({
        body,
      }) => {
        expect(body.comment.votes).to.eql(20);
      }));
    it('DELETE status:204 accepts a delete requests and deletes the article from the databse', () => request.delete('/api/articles/9/comments/1')
      .expect(204)
      .then(() => request.get('/api/articles/9/comments/1')
        .expect(404)));
  });

  describe('/api/users', () => {
    it('GET status:200 responds with an an array of user objects', () => request.get('/api/users')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.users).to.have.lengthOf(3);
      }));
  });

  describe('/api/users/:username', () => {
    it('GET status:200 responds with an an array of user objects', () => request.get('/api/users/icellusedkars')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.user.username).to.have.eql('icellusedkars');
        expect(body.user).to.have.all.keys('username', 'avatar_url', 'name');
      }));
  });

  describe('/api/', () => {
    it('GET status:200 responds with an object containing the endpoints info', () => request.get('/api')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.have.all.keys('endPointsData');
      }));
  });
});
