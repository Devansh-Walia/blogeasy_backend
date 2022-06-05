const router = require("express").Router();
var axios = require("axios");
router.post("/", async (req, res) => {
  const devs = req.body.devs;
  console.log("devs: ", devs);
  const result = [];
  try {
    devs.forEach(async (dev) => {
      var config = {
        method: "get",
        url: `https://api.github.com/users/${dev}`,
        headers: {
          "Content-Type": "application/json",
        },
      };
     await axios(config)
         .then(function (response) {
          result.push(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        console.log("result: ", result);
        res.send(result);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
