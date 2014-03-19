var assert = require('assert');

suite('Posts', function () {
  test ('in the server', function (done, server) {
    server.eval(function () {
      Posts.insert({title: 'hll'});
      var docs = Posts.find().fetch();
      emit('docs', docs);
    });

    server.once('docs', function (docs) {
      assert.equal(docs.length, 1);
      done();
    });
  });

  test('using both client and the server', function(done, server, client) {
    server.eval(function() {
      Posts.find().observe({
        added: addedNewPost
      });

      function addedNewPost(post) {
        emit('post', post);
      }
    }).once('post', function(post) {
      assert.fail('this should fail', 'it must fail!', 'donkeys fail');
      done();
    });

    client.eval(function() {
      Posts.insert({title: 'hello title'});
    });
  });
  
    test('Failed test', function(done, server, client) {
    server.eval(function() {
      Posts.find().observe({
        added: addedNewPost
      });

      function addedNewPost(post) {
        emit('post', post);
      }
    }).once('post', function(post) {
      assert.equal(post.title, 'hello title');
      done();
    });

    client.eval(function() {
      Posts.insert({title: 'hello title'});
    });
  });
})
