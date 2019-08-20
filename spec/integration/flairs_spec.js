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
              name: "Sci-Fi & Fantasy Books",
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
      Flair.create({
        name: "Test Flair",
        color: "blue"
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
});
