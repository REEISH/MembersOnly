const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const SQL = `
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  membership_status BOOLEAN DEFAULT false
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function populate() {
  console.log("Seeding database...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Tables created successfully.");
    const saltRounds = 10;
    const memberPassword = await bcrypt.hash("memberpass123", saltRounds);
    const guestPassword = await bcrypt.hash("guestpass123", saltRounds);
    const insertUsersQuery = `
      INSERT INTO users (username, password, membership_status)
      VALUES 
        ('euler_fan', $1, true),
        ('math_newbie', $2, false)
      RETURNING id, username;
    `;
    const usersResult = await client.query(insertUsersQuery, [
      memberPassword,
      guestPassword,
    ]);
    console.log("Dummy users inserted.");
    const eulerFanId = usersResult.rows.find(
      (u) => u.username === "euler_fan",
    ).id;
    const mathNewbieId = usersResult.rows.find(
      (u) => u.username === "math_newbie",
    ).id;
    const insertPostsQuery = `
      INSERT INTO posts (content, author_id, created_at)
      VALUES 
        ('Does anyone else find the proof for the infinitude of primes fascinating?', $1, NOW() - INTERVAL '2 days'),
        ('I am struggling with calculus, any tips?', $2, NOW() - INTERVAL '1 day'),
        ('A mathematician is a device for turning coffee into theorems.', $1, NOW())
        `;
    await client.query(insertPostsQuery, [eulerFanId, mathNewbieId]);
    console.log("Dummy posts inserted.");
  } catch (error) {
    console.error("Error populating the database:", error);
  } finally {
    await client.end();
    console.log("Database seeding complete.");
  }
}

populate();
