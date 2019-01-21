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

  it('GET status:404 responds with error fo a non existent route', () => request.get('/api/nonesense')
    .expect(404)
    .then(({
      body,
    }) => {
      expect(body.message).to.eql('Invalid route');
    }));

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

    it('POST status:400 if req.body is malformed (key missing)', () => request.post('/api/topics')
      .send({
        slug: 'john',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Missing mandatory field');
      }));

    it('POST status:400 if req.body is malformed (additional key)', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        slug: 'john',
        random: 'random tings',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Bad Request, Invalid object structure provided');
      }));

    it('POST status:422 and responds with "Bad Request, Duplicate key violation" when duplicate key is sent', () => request.post('/api/topics')
      .send({
        description: 'The Man Dem',
        slug: 'mitch',
      })
      .expect(422)
      .then(({
        body,
      }) => {
        expect(body.message).to.equal('Bad Request, Duplicate key violation');
      }));

    it('DELETE status:405 and responds with "Invalid method for this endpoint"', () => request.delete('/api/topics')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint"', () => request.put('/api/topics')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 and responds with "Invalid method for this endpoint"', () => request.patch('/api/topics')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  describe('/api/topics/:topic/articles', () => {
    it('GET status:200 and responds with an array of topics by article', () => request.get('/api/topics/cats/articles')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(1);
        expect(body.articles[0].topic).to.eql('cats');
        expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
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
        expect(body.articles).to.have.lengthOf(10);
        expect(body.articles[0].article_id).to.eql(1);
      }));

    it('GET status:200 returns default response if given invalid sort_by:', () => request.get('/api/topics/mitch/articles?sort_by=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(1);
      }));

    it('GET status:200 returns default response if given invalid limit:', () => request.get('/api/topics/mitch/articles?limit=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(10);
      }));

    it('GET status:200 and takes a limt query and responds with appropriate number of articles', () => request.get('/api/topics/mitch/articles?limit=5')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(5);
      }));

    it('GET status:200 and takes a sort_by query and responds articles sorted by that query', () => request.get('/api/topics/mitch/articles?sort_by=article_id')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(12);
      }));

    it('GET status:200 and takes a p query and responds articles paginated by that query', () => request.get('/api/topics/mitch/articles?p=2')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(12);
        expect(body.articles).to.have.lengthOf(1);
      }));

    it('GET status:200 and takes a order query and responds articles ordered by that query', () => request.get('/api/topics/mitch/articles?sort_order=asc')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(12);
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

    it('POST status:404 adding an article to a non-existent topic', () => request.post('/api/topics/john/articles')
      .send({
        title: 'poke it out',
        body: 'Playboy playboy hit me on my face time',
        username: 'icellusedkars',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Bad Request, Not found');
      }));

    it('POST status:400 and responds with error "Bad Request, Invalid value provided" when sent a user not in users table', () => request.post('/api/topics/mitch/articles')
      .send({
        title: 'Living in the shadow of a great man',
        body: 'Playboy playboy hit me on my face time',
        username: 'John',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Bad Request, Not found');
      }));
  });

  describe('/api/articles', () => {
    it('GET Status:200, it responds with an array of articles', () => request.get('/api/articles')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(10);
        expect(body.articles[0].title).to.eql('Living in the shadow of a great man');
        expect(body.articles[0]).to.have.all.keys('author', 'title', 'article_id', 'votes', 'comment_count', 'created_at', 'topic');
      }));

    it('GET status:200 and responds with default settings of limit=10, sort_by=date,order=desc', () => request.get('/api/articles')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(10);
        expect(body.articles[0].article_id).to.eql(1);
      }));

    it('GET status:200 returns default response if given invalid sort_by:', () => request.get('/api/articles?sort_by=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(1);
      }));

    it('GET status:200 returns default response if given invalid limit:', () => request.get('/api/articles?limit=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(10);
      }));

    it('GET status:200 and takes a limit query and responds with appropriate number of articles', () => request.get('/api/articles?limit=5')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles).to.have.lengthOf(5);
      }));

    it('GET status:200 and takes a sort_by query and responds articles sorted by that query', () => request.get('/api/articles?sort_by=article_id')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(12);
      }));

    it('GET status:200 and takes a p query and responds articles paginated by that query', () => request.get('/api/articles?p=2')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(11);
        expect(body.articles).to.have.lengthOf(2);
      }));

    it('GET status:200 and takes a order query and responds articles ordered by that query', () => request.get('/api/articles?sort_order=asc')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.articles[0].article_id).to.eql(12);
      }));


    it('DELETE status:405 and responds with "Invalid method for this endpoint" ', () => request.delete('/api/articles')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint" ', () => request.put('/api/articles')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 and responds with "Invalid method for this endpoint" ', () => request.patch('/api/articles')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  describe('/api/articles/:article_id', () => {
    it('GET status:200 responds with an article object', () => request.get('/api/articles/4')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.article).to.have.all.keys('article_id', 'author', 'title', 'votes', 'body', 'comment_count', 'created_at', 'topic');
      }));

    it('GET status:404 responds with "No article found" when sent invalid article_id format', () => request.get('/api/articles/400')
      .expect(404)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('No article found');
      }));

    it('GET status:404 responds with "No article found" when sent invalid article_id ', () => request.get('/api/articles/banana')
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Invalid input format');
      }));

    it('PATCH status:200 accepts a patch requests and amends the database accordingly', () => request.patch('/api/articles/1')
      .send({
        inc_votes: 3,
      })
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.article.votes).to.eql(103);
      }));

    it('PATCH status:400 responds with error when invalid data type sent', () => request.patch('/api/articles/1')
      .send({
        inc_votes: 'banana',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Invalid input format');
      }));

    it('PATCH status:200s no body responds with an unmodified article', () => request.patch('/api/articles/1')
      .send()
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Invalid input format');
      }));

    it('DELETE status:204 accepts a delete requests and deletes the article from the databse', () => request.delete('/api/articles/2')
      .expect(204)
      .then(() => request.get('/api/articles/2')
        .expect(404)));

    it('DELETE status:404 when given a non-existent article_id ', () => request.delete('/api/articles/200')
      .expect(404)
      .then((res) => {
        expect(res.body.message).to.equal('no article found');
      }));

    it('DELETE status:404 when given a invalid article_id ', () => request.delete('/api/articles/banana')
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid input format');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint" ', () => request.put('/api/articles/2')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));
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

    it('GET Status:404 responds with "no article found" when passed an invalid article id', () => request.get('/api/articles/99/comments')
      .expect(404)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('no article found');
      }));

    it('GET responds with 400 for an invalid article_id:', () => request.get('/api/articles/banana/comments')
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Invalid input format');
      }));

    it('GET status:200 and responds with default settings of limit=10, sort_by=date,order=desc', () => request.get('/api/articles/1/comments')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments).to.have.lengthOf(10);
        expect(body.comments[0].comments_id).to.eql(2);
      }));

    it('GET status:200 returns default response if given invalid sort_by:', () => request.get('/api/articles/1/comments?sort_by=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments[0].comments_id).to.eql(2);
      }));

    it('GET status:200 returns default response if given invalid limit:', () => request.get('/api/articles/1/comments?limit=frogs')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comments).to.have.lengthOf(10);
      }));

    it('GET status:200 and takes a limit query and responds with appropriate number of articles', () => request.get('/api/articles/1/comments?limit=5')
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

    it('POST status:400 when adding a comment with an invalid username', () => request.post('/api/articles/9/comments')
      .send({
        username: 'john',
        body: 'Im a social commententator',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Bad Request, Not found');
      }));

    it('POST status:400 when adding a comment with an invalid article id', () => request.post('/api/articles/banana/comments')
      .send({
        username: 'icellusedkars',
        body: 'Im a social commententator',
      })
      .expect(400)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('Invalid input format');
      }));

    // it.only('POST status:400 when adding a comment with an invalid article id', () => request.post('/api/articles/9/comments')
    //   .send({
    //     username: 'icellusedkars',
    //    dockey: 'monckey',
        
    //   })
    //   .expect(400)
    //   .then(({
    //     body,
    //   }) => {
    //     expect(body.message).to.eql('Invalid input format');
    //   }));

    it('PATCH status:200 accepts a patch requests and amends the database accordingly', () => request.patch('/api/articles/9/comments/1')
      .send({
        inc_votes: 4,
      })
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.comment.votes).to.eql(20);
      }));

    // it.only('PATCH responds with 404 if non-existent comment id is used:', () => request.patch('/api/articles/9/comments/1000')
    //   .send({
    //     inc_votes: 4,
    //   })
    //   .expect(200)
    //   .then(({
    //     body,
    //   }) => {
    //     expect(body.comment.votes).to.eql(20);
    //   }));

    it('DELETE status:204 accepts a delete requests and deletes the article from the databse', () => request.delete('/api/articles/9/comments/1')
      .expect(204)
      .then(() => request.get('/api/articles/9/comments'))
      .then(({
        body,
      }) => {
        expect(body.comments).to.have.lengthOf(1);
      }));
  });

  describe('/api/users', () => {
    it('GET status:200 responds with an an array of user objects', () => request.get('/api/users')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body.users).to.have.lengthOf(3);
      }));

    it('DELETE status:405 and responds with "Invalid method for this endpoint"', () => request.delete('/api/users')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint"', () => request.put('/api/users')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 and responds with "Invalid method for this endpoint"', () => request.patch('/api/users')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
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

    it('GET status:404 errors when user is not found', () => request.get('/api/users/john')
      .expect(404)
      .then(({
        body,
      }) => {
        expect(body.message).to.eql('no user found');
      }));

    it('DELETE status:405 and responds with "Invalid method for this endpoint"', () => request.delete('/api/users/icellusedkars')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint"', () => request.put('/api/users/icellusedkars')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 and responds with "Invalid method for this endpoint"', () => request.patch('/api/users/icellusedkars')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));
  });

  describe('/api', () => {
    it('GET status:200 responds with an object containing the endpoints info', () => request.get('/api')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.have.all.keys('endPointsData');
      }));

    it('DELETE status:405 and responds with "Invalid method for this endpoint"', () => request.delete('/api')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PUT status:405 and responds with "Invalid method for this endpoint"', () => request.put('/api')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));

    it('PATCH status:405 and responds with "Invalid method for this endpoint"', () => request.patch('/api')
      .expect(405)
      .then((res) => {
        expect(res.body.message).to.equal('Invalid method for this endpoint');
      }));
  });
});
