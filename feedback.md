## John Nezzi - feedback
43 passing (9s)
  32 failing
    
  
  14) /
       
       /api
         /articles/:article_id
           PATCH status:200s no body responds with an unmodified article:
     Error: expected 200 "OK", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  24) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with a 200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN):
     Error: expected 200 "OK", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  25) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with a 400 if given an invalid inc_votes:
     Error: expected 400 "Bad Request", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)
      
* Check the inc_votes before passing to the `knex` as `knex` is just ignoring it in this case.

  26) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH with no body responds with an unmodified comment:
     Error: expected 200 "OK", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  27) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with 404 if non-existent article id is used:
     Error: expected 404 "Not Found", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  28) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with 404 if non-existent comment id is used:
     Error: expected 404 "Not Found", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  29) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with 400 if invalid article id is used:
     Error: expected 400 "Bad Request", got 202 "Accepted"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at parser (node_modules/superagent/lib/node/index.js:916:18)
      at IncomingMessage.res.on (node_modules/superagent/lib/node/parsers/json.js:19:7)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  30) /
       /api
         /articles/:article_id/comments/:comment_id
           PATCH responds with 400 if invalid comment id is used:
     Error: expected 400 "Bad Request", got 500 "Internal Server Error"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:728:3)
      at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  31) /
       /api
         /articles/:article_id/comments/:comment_id
           DELETE responds with 404 if given a non-existent article_id:
     Error: expected 404 "Not Found", got 204 "No Content"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

  32) /
       /api
         /articles/:article_id/comments/:comment_id
           DELETE responds with 404 if given a non-existent comment_id:
     Error: expected 404 "Not Found", got 204 "No Content"
      at Test._assertStatus (node_modules/supertest/lib/test.js:268:12)
      at Test._assertFunction (node_modules/supertest/lib/test.js:283:11)
      at Test.assert (node_modules/supertest/lib/test.js:173:18)
      at localAssert (node_modules/supertest/lib/test.js:131:12)
      at /Users/mitch/northcoders/BE/BE2-Reviews/john-nezzi/node_modules/supertest/lib/test.js:128:5
      at Test.Request.callback (node_modules/superagent/lib/node/index.js:716:12)
      at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
      at endReadableNT (_stream_readable.js:1098:12)
      at process.internalTickCallback (internal/process/next_tick.js:72:19)

