const pool = require("./pool");

async function add_user(username, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (username, password, membership_status) 
     VALUES ($1, $2, false) 
     RETURNING *`,
    [username, hashedPassword],
  );
  return result.rows[0];
}

async function add_member(userId) {
  await pool.query(
    `UPDATE users 
     SET membership_status = true 
     WHERE id = $1`,
    [userId],
  );
}

async function add_post(content, authorId, date) {
  await pool.query(
    `INSERT INTO posts (content, author_id, created_at) 
     VALUES ($1, $2, $3)`,
    [content, authorId, date],
  );
}

async function get_all_posts() {
  const result = await pool.query(
    `SELECT posts.content, posts.created_at, users.username AS author 
     FROM posts 
     JOIN users ON posts.author_id = users.id 
     ORDER BY posts.created_at DESC`,
  );
  return result.rows;
}

async function get_user_by_username(username) {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return result.rows[0];
}

async function get_user_by_id(id) {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
}

module.exports = {
  add_user,
  add_member,
  add_post,
  get_all_posts,
  get_user_by_username,
  get_user_by_id,
};
