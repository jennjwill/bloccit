const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

//modified from assignment branch: post-resource-1 & may need more code from there (now for checkpoint: authorization)

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user; //store the user

        Topic.create(
          {
            title: "Expeditions to Alpha Centauri",
            description:
              "A compilation of reports from recent visits to the star system.",

            posts: [
              {
                title: "My first visit to Proxima Centauri b",
                body: "I saw some rocks.",
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
          this.topic = topic; //store the topic
          this.post = topic.posts[0]; //store the post
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    //copied file from assignment branch & may need other code files
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
    //from assignment branch may be wonky
    it("should return associated posts", done => {
      this.topic.getPosts().then(posts => {
        expect(posts[0].title).toBe("My first visit to Proxima Centauri b");
        done();
      });
    });
  });
});
