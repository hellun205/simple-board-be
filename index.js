const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const {
  getNextId,
  findById,
  addNextId,
  getAll,
  writePost,
  getCurrentId,
  addLike,
  addDisLike,
  addView,
  editPost,
} = require("./post/post");

const app = express();

app.set("port", 3000);

app.use(bodyParser.json());
app.use(cors());

app.route("/api").get((req, res) => {
  res.status(200).send({
    message: "hello",
  });
});

(async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    database: "simple_board",
    port: 3306,
    user: "user",
    password: "user",
  });

  app.route("/api/post/find-by-id").post((req, res) => {
    const { id } = req.body;

    findById(connection, id, (post) => {
      console.log(
        `[${req.ip}] ${post ? "successfully" : "failed"} find post by id: ${id}`
      );
      if (!post) {
        res.status(400).send({
          message: "failed find post",
        });
      } else {
        res.status(200).send({
          message: "successfully find post",
          data: {
            post: post,
          },
        });
      }
    });
  });

  app.route("/api/post/get").get((req, res) => {
    getAll(connection, (posts) => {
      if (posts) {
        res.status(200).send({
          message: "successfully get posts",
          data: {
            posts: posts,
          },
        });
      } else {
        res.status(400).send({
          message: "failed get posts",
        });
      }
    });
  });

  app.route("/api/post/write").post((req, res) => {
    const { author, title, content } = req.body;
    writePost(connection, title, content, author, (ok) => {
      if (ok) {
        res.status(200).send({
          message: "successfully write post",
        });
      } else {
        res.status(400).send({
          message: "failed write post",
        });
      }
    });
  });

  app.route("/api/post/update").post((req, res) => {
    const { id, title, content } = req.body;
    editPost(connection, id, title, content, (ok) => {
      if (ok) {
        res.status(200).send({
          message: "successfully update post",
        });
      } else {
        res.status(400).send({
          message: "failed update post",
        });
      }
    });
  });

  app.route("/api/post/view").post((req, res) => {
    const { id } = req.body;
    addView(connection, id, (ok) => {
      if (ok) {
        res.status(200).send({
          message: "successfully view",
        });
      } else {
        res.status(400).send({
          message: "failed view",
        });
      }
    });
  });

  app.route("/api/post/like").post((req, res) => {
    const { id } = req.body;
    addLike(connection, id, (ok) => {
      if (ok) {
        res.status(200).send({
          message: "successfully like",
        });
      } else {
        res.status(400).send({
          message: "failed like",
        });
      }
    });
  });

  app.route("/api/post/dislike").post((req, res) => {
    const { id } = req.body;
    addDisLike(connection, id, (ok) => {
      if (ok) {
        res.status(200).send({
          message: "successfully dislike",
        });
      } else {
        res.status(400).send({
          message: "failed dislike",
        });
      }
    });
  });

  app.listen(app.get("port"), () => {
    console.log("server is listening port " + app.get("port"));
  });
})();
