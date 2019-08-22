const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/posts";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Hugo winners",
        description: "A list of Hugo nominees and winners"
      }).then(topic => {
        this.topic = topic;

        Post.create({
          title: "SFF book club list winners",
          body: "We should def add Rebecca Roanhorse to our list.",
          topicId: this.topic.id
        })
          .then(post => {
            this.post = post;

            Flair.create({
              name: "SFF Books",
              color: "green",
              postId: this.post.id
            }).then(flair => {
              this.flair = flair;
              done();
            });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("#create()", () => {
    it("should create a flair object with a name and color", done => {
      Post.create({
        title: "Hey new title",
        body: "new words for this new title",
        topicId: this.topic.id
      });

      Flair.create({
        name: "Test Flair",
        color: "blue",
        postId: this.post.id
      })
        .then(flair => {
          expect(flair.name).toBe("Test Flair");
          expect(flair.color).toBe("blue");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("GET /posts/:postId/flairs/new", () => {
    it("should render a new flair form", done => {
      request.get(`${base}/${this.post.id}/flairs/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });

  describe("POST /posts/:postId/flairs/create", () => {
    it("should create a new flair and redirect", done => {
      const options = {
        url: `${base}/${this.post.id}/flairs/create`,
        form: {
          name: "Animal Posts",
          color: "purple"
        }
      };
      request.post(options, (err, res, body) => {
        Flair.findOne({ where: { name: "Animal Posts" } })
          .then(flair => {
            expect(flair).not.toBeNull();
            expect(flair.name).toBe("Animal Posts");
            expect(flair.color).toBe("purple");
            expect(flair.postId).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /posts/:postId/flairs/:id", () => {
    it("should render a view with the selected flair", done => {
      request.get(
        `${base}/${this.post.id}/flairs/${this.flair.id}`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("SFF Books");
          done();
        }
      );
    });
  });
});
