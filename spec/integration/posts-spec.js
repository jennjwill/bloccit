const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user;

        Topic.create(
          {
            title: "Winter Games",
            description: "Post your Winter Games stories.",
            posts: [
              {
                title: "Snowball Fighting",
                body: "So much snow!",
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: "posts"
            }
          }
        ).then(topic => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe("guest user performing CRUD actions for Post", () => {
    beforeEach(done => {
      request.get({
        // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          role: `${this.userId == 0}` //guest vs member
        }
      });
      done();
    });

    describe("GET /topics/:topicId/posts/new", () => {
      it("should not render a new post form", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Post Body");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should not create a new post", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Watching snow melt",
            body:
              "Without a doubt my favoriting things to do besides watching paint dry!"
          }
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "Watching snow melt" } })
            .then(post => {
              expect(post).toBeNull();

              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
      it("should render a view of the selected post", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Snowball Fighting");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post with the associated ID", done => {
        expect(this.post.id).toBe(1);

        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            Post.findById(1).then(post => {
              expect(post).not.toBeNull();
              done();
            });
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should not render a view with an edit post form", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(body).not.toContain("Edit Post");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should not return a status code 302", done => {
        request.post(
          {
            url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
            form: {
              title: "Snowman Building Competition",
              body: "I love watching them melt slowly."
            }
          },
          (err, res, body) => {
            expect(res.statusCode).not.toBe(302);
            done();
          }
        );
      });
    });
  });

  //end guest user context

  //start admin user context
  describe("admin user performing CRUD actions for Topic", () => {
    beforeEach(done => {
      User.create({
        email: "admin@example.com",
        password: "123456",
        role: "admin"
      }).then(user => {
        request.get(
          {
            // mock authentication
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role, // mock authenticate as admin user
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          }
        );
      });

      describe("GET /topics/:topicId/posts", () => {
        it("should respond with all posts", done => {
          request.get(base, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Posts");
            expect(body).toContain("Snowball Fighting");
            done();
          });
        });
      });

      describe("GET /topics/:topicId/posts/new", () => {
        it("should render a view with a new post form", done => {
          request.get(
            `${base}/${this.topic.id}/posts/new`,
            (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("New Post");
              done();
            }
          );
        });
      });

      describe("POST /topics/:topicId/posts/create", () => {
        const options = {
          url: `${base}${this.topic.id}/posts/create`,
          form: {
            title: "Watching snow melt",
            body:
              "Without a doubt my favoriting things to do besides watching paint dry!"
          }
        };
        it("should create a new post and redirect", done => {
          request.post(options, (err, res, body) => {
            Post.findOne({ where: { title: "Watching snow melt" } })
              .then(post => {
                expect(post.title).toBe("Watching snow melt");
                expect(post.description).toBe(
                  "Without a doubt my favoriting things to do besides watching paint dry!"
                );

                done();
              })
              .catch(err => {
                console.log(err);
                done();
              });
          });
        });
      });

      describe("GET /topics/:topicId/posts/:id", () => {
        it("should render a view of the selected post", done => {
          request.get(
            `${base}/${this.topic.id}/posts/${this.post.id}`,
            (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Snowball Fighting");
              done();
            }
          );
        });
      });

      describe("POST /topics/:topicId/posts/:id/destroy", () => {
        it("should delete the post with the associated ID", done => {
          Post.all().then(posts => {
            const postCountBeforeDelete = posts.length;

            expect(postCountBeforeDelete).toBe(1);

            request.post(
              `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
              (err, res, body) => {
                Post.all().then(posts => {
                  expect(err).toBeNull();
                  expect(posts.length).toBe(postCountBeforeDelete - 1);
                  done();
                });
              }
            );
          });
        });
      });

      describe("GET /topics/:topicId/posts/:id/edit", () => {
        it("should render a view with an edit post form", done => {
          request.get(
            `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
            (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Edit Post");
              expect(body).toContain("Snowball Fighting");
              done();
            }
          );
        });
      });

      describe("POST /topics/:topicId/posts/:id/update", () => {
        it("should update the post with the given values", done => {
          request.post(
            {
              url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
              form: {
                title: "Snowman Building Competition",
                body: "I love watching them melt slowly."
              }
            },
            (err, res, body) => {
              expect(err).toBeNull();
              Post.findOne({
                where: { id: 1 }
              }).then(post => {
                expect(post.title).toBe("Snowman Building Competition");
                done();
              });
            }
          );
        });
      });
    });
  });
  //end user admin context

  //start member user context

  describe("member user performing CRUD actions for Post", () => {
    beforeEach(done => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          userId: this.user.id
        }
      }),
        done();
    });

    describe("GET /topics/:topicId/posts/new", () => {
      it("should render a view with a new post form b/c members can create new posts", done => {
        console.log("value of this:" + this);

        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Post");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should not create a new post", done => {
        const options = {
          url: `${base}${this.topic.id}/posts/create`,
          form: {
            title: "Watching snow melt",
            body:
              "Without a doubt my favoriting things to do besides watching paint dry!"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "Watching snow melt" } })
            .then(post => {
              expect(post).toBeNull();
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:id", () => {
      it("should render a view of the selected post", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Snowball Fighting");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post with the associated ID", done => {
        Post.all().then(posts => {
          const postCountBeforeDelete = posts.length;
          expect(postCountBeforeDelete).toBe(1);

          request.post(
            `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
            (err, res, body) => {
              Post.all().then(posts => {
                expect(posts.length).toBe(postCountBeforeDelete);
                done();
              });
            }
          );
        });
      });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should not render a view with an edit post form", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(body).not.toContain("Edit Post");
            expect(body).toContain("Snowball Fighting"); //confirm redirect to post show
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should not update the post with the given values", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Snowman Building Competition",
            body: "I love watching them melt slowly."
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBe(null);
          Post.findOne({
            where: { id: 1 }
          }).then(post => {
            expect(post.title).toBe("Snowball Fighting"); //confirm title didn't change
            done();
          });
        });
      });
    });
  });
});
