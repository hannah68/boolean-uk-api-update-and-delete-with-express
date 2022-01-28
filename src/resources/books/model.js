const db = require("../../utils/database");
const { buildBooksDatabase } = require("../../utils/mockData");

function Book() {
  // create table==================================================
  function createTable() {
    const sql = `
      DROP TABLE IF EXISTS books;
      
      CREATE TABLE IF NOT EXISTS books (
        id              SERIAL        PRIMARY KEY,
        title           VARCHAR(255)   NOT NULL,
        type            VARCHAR(255)   NOT NULL,
        author          VARCHAR(255)   NOT NULL,
        topic           VARCHAR(255)   NOT NULL,
        publicationDate DATE           NOT NULL
      );
    `;

    return db
      .query(sql)
      .then((result) => console.log("[DB] Book table ready."))
      .catch(console.error);
  }

  // get all books===============================================
  function getAllBooks(res){
    const getAll = `
      SELECT * FROM Books
    `;
    return db
      .query(getAll)
      .then(result => result.rows)
      .catch(console.error);
  }

  // create one book =============================================
  function createOneBook(book){
    const createOne = `
      INSERT INTO books (title, type, author, topic, publicationDate)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    return db
      .query(createOne, [book.title, book.type, book.author, book.topic, book.publicationDate])
      .then(result => result.rows[0])
      .catch(console.error);
  }

  // create one book by id======================================
  function getOneById(id,res){
    const getOneById = `
      SELECT *
      FROM books
      WHERE id = $1;
    `;

    return db
      .query(getOneById, [id])
      .then(result => result.rows[0])
      .catch(console.error);
  }
  
  //get books by type / topic===========================================
  function getFictionType(topicOrType){
    if(topicOrType !== "fiction"){
      const topic = topicOrType.toLowerCase();
      const getTopic= `
        SELECT *
        FROM books
        WHERE topic = $1
      `;
      return db
      .query(getTopic, [topic])
      .then(result => result.rows)
      .catch(console.error);

    }else{
      const type = topicOrType.charAt(0).toUpperCase() + topicOrType.slice(1);
      const FictionType = `
        SELECT *
        FROM books
        WHERE type = $1
      `;
      return db
        .query(FictionType, [type])
        .then(result => result.rows)
        .catch(console.error);
    }
  }

  // get books by non-fiction type=================
  function getNonFictionType(topicOrType){
    if(topicOrType !== "non-fiction"){
      const topic = topicOrType.toLowerCase();
      const getTopic= `
        SELECT *
        FROM books
        WHERE topic = $1
      `;
      return db
        .query(getTopic, [topic])
        .then(result => result.rows)
        .catch(console.error);
    }else{
      const type = topicOrType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
      
      const NonFictionType = `
        SELECT *
        FROM books
        WHERE type = $1
      `;
      return db
        .query(NonFictionType, [type])
        .then(result => result.rows)
        .catch(console.error);
    }
  }

  // get author books by order==================================
  function getAuthorBook(author){
    const authorBook = `
      SELECT *
      FROM books
      WHERE author = $1
      ORDER BY publicationDate DESC;
    `;
    return db
      .query(authorBook, [author])
      .then(result => result.rows)
      .catch(console.error);
  }

  // update one book by id============================================
  function updateBookById(book){
    const updatedBook = `
      SET title = $2,
      type = $3,
      author = $4,
      topic = $5,
      publicationDate = $6
      WHERE id = $1
      RETURNING *;
    `;
    return db
    .query(updatedBook, [book.id, book.title, book.type, book.author, book.topic, book.publicationdate])
    .then((result) => result.rows[0])
    .catch(console.error);
  }

  // update one book by title============================================
  function updateBookByTitle(book){
    const updatedBook = `
      UPDATE books
      SET type = $2,
      author = $3,
      topic = $4,
      publicationDate = $5
      WHERE title = $1
      RETURNING *;
    `;
    return db
    .query(updatedBook, [book.title, book.type, book.author, book.topic, book.publicationdate])
    .then((result) => result.rows[0])
    .catch(console.error);
  }

  // delete one book by id ============================================
  function deleteOneById(id){
    const deleteOneById = `
      DELETE FROM books
      WHERE id = $1
      RETURNING *;
    `;

    return db
      .query(deleteOneById, [id])
      .then((result) => result.rows[0])
      .catch(console.error);
  }


  // mock data===================================================
  function mockData() {
    const createBook = `
      INSERT INTO books
        (title, type, author, topic, publicationDate)
      VALUES
        ($1, $2, $3, $4, $5)
    `;
    const books = buildBooksDatabase();
    books.forEach((book) => {
      db.query(createBook, Object.values(book)).catch(console.error);
    });
  }

  function init() {
    console.log("\nCreating mock data for Books...\n")
    createTable();
    mockData();
  }

  return {
    createOneBook,
    getOneById,
    getAllBooks,
    getFictionType,
    getNonFictionType,
    getAuthorBook,
    updateBookById,
    updateBookByTitle,
    deleteOneById,
    init
  };
}

module.exports = Book;