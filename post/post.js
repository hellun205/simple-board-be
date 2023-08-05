const getCurrentId = (conn, callback) => {
  conn.query(
    "SELECT currentId FROM global WHERE id = '0';",
    (error, rows, field) => {
      if (callback) callback(rows[0].currentId);
    }
  );
};

const addId = (conn, callback) => {
  getCurrentId(conn, (id) => {
    conn.query(
      "UPDATE global SET currentId = ? WHERE id = '0';",
      [id + 1],
      (err, rows, field) => {
        if (callback) callback(!err);
      }
    );
  });
};

const findById = (conn, id, callback) => {
  conn.query("SELECT * FROM posts WHERE id = ?;", [id], (err, rows, field) => {
    if (callback) callback(rows[0]);
  });
};

const getAll = (conn, callback) => {
  conn.query("SELECT * FROM posts;", (err, rows, field) => {
    if (callback)
      if (err) {
        callback(undefined);
      } else {
        callback(rows);
      }
  });
};

const writePost = (conn, title, content, author, callback) => {
  getCurrentId(conn, (id) => {
    conn.query(
      "INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?);",
      [id, title, content, author, 0, 0, 0],
      (err, rows, field) => {
        if (!err) {
          addId(conn, (ok) => {
            if (callback) callback(ok);
          });
        } else {
          if (callback) callback(false);
        }
      }
    );
  });
};

const addView = (conn, id, callback) => {
  conn.query(
    "UPDATE posts SET view = view + 1 WHERE id = ?;",
    [id],
    (err, rows, field) => {
      if (callback) {
        callback(!err);
      }
    }
  );
};

const addLike = (conn, id, callback) => {
  conn.query(
    "UPDATE posts SET likes = likes + 1 WHERE id = ?;",
    [id],
    (err, rows, field) => {
      if (callback) {
        callback(!err);
      }
    }
  );
};

const addDisLike = (conn, id, callback) => {
  conn.query(
    "UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?;",
    [id],
    (err, rows, field) => {
      if (callback) {
        callback(!err);
      }
    }
  );
};

const editPost = (conn, id, title, content, callback) => {
  conn.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?;",
    [title, content, id],
    (err, rows, field) => {
      if (callback) {
        callback(!err);
      }
    }
  );
};

module.exports = {
  getCurrentId,
  findById,
  getAll,
  writePost,
  addView,
  addLike,
  addDisLike,
  editPost,
};
