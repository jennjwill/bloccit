const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Topic = require("../../src/db/models").Topic;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Fonda Lee's Jade War",
        description: "Chat about this book"
      })
        .then(topic => {
          this.topic = topic;

          Post.create({
            title: "OMG I got Green Bone swag",
            body: "She even sent a signed sticker",
            topicId: this.topic.id
          }).then(post => {
            this.post = post;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });
  describe("#create()", () => {
    it("should create a topic object with a title and description", done => {
      Topic.create({
        title: "Fonda Lee's Jade War",
        description: "Chat about this second book"
      })
        .then(topic => {
          expect(topic.title).toBe("Fonda Lee's Jade War");
          expect(topic.description).toBe("Chat about this second book");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return associated posts", done => {
      this.topic.getPosts().then(posts => {
        expect(posts[0].title).toBe("OMG I got Green Bone swag");
        done();
      });
    });
  });
});
