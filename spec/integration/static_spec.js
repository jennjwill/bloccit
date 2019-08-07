const request = require("request"); //import request module
const server = require("../../src/server"); //define server & base url
const base = "http://localhost:3000/";

describe("routes : static", () => {
  //scoping all test suites here
  describe("GET /", () => {
    //landing page/root of app; best practice to use http verb like GET and UTL for request
    it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", done => {
      request.get(base, (err, res, body) => {
        //base=URL where GET request is sent, 2nd arg is function w response from server plus content, and/or errors
        expect(res.statusCode).toBe(200);
        expect(body).toContain("Welcome to Bloccit");
        done(); //lets jasmine know test is completed (it's making async requests to server--leaving done() out would make the test pass b/c the expect call won't be made b4 the test finishes)
      });
    });
  });
});
