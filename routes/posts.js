const router = require("express").Router();
const Post = require("../models/Post");
const Sentiment = require("../Sentiment/index");

//CREATE POST
router.post("/", async (req, res) => {
  console.log("creating posts by id ",);
  console.log("req.body: ", req.body.desc);
  // retirve post data from the request body
  var sentiment = new Sentiment();
  var result = await sentiment.analyze(req.body.desc);
  const newPost = new Post({...req.body, rating: result.score});
  console.dir(newPost)
  try {
    // save the post to the database
    const savedPost = await newPost.save();
    // return ok satus
    res.status(200).json(savedPost);
  } catch (err) {
    // return error if anything goes wrong
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  console.log("updating posts by id ",);
  try {
    // find the post by id
    const post = await Post.findById(req.params.id);
    // update the post if the user is the owner
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        //return error if anything goes wrong
        res.status(500).json(err);
      }
    } else {
      //return error if the user is not the owner
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    //return error if anything goes wrong
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  console.log("deleting posts by id ",);
  try {
    // find the post by id
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) { // check if the user is the owner
      try { // delete the post
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) { // return error if anything goes wrong
        res.status(500).json(err);
      }
    } else { // return error if the user is not the owner
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) { // return error if anything goes wrong
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  console.log("getting posts by id ",);
  try { // find the post by id
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) { // return error if anything goes wrong
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  console.log("getting posts",);
  const username = req.query.user;
  const catName = req.query.cat;
  try {   // find all posts
    let posts;
    if (username) { // if user is specified
      posts = await Post.find({ username }); // find posts by username
    } else if (catName) { // if category is specified
      posts = await Post.find({// find posts by category
        categories: {
          $in: [catName],
        },
      });
    } else { // if no user or category is specified
      posts = await Post.find(); // find all posts
    }
    res.status(200).json(posts); // return posts
  } catch (err) { // return error if anything goes wrong
    res.status(500).json(err);
  }
});

module.exports = router;
