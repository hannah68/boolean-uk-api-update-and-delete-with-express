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
        FROM BOOKS
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
        FROM BOOKS
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
        FROM BOOKS
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
        FROM BOOKS
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
      FROM BOOKS
      WHERE author = $1
      ORDER BY publicationDate DESC;
    `;
    return db
      .query(authorBook, [author])
      .then(result => result.rows)
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
    init
  };
}

module.exports = Book;