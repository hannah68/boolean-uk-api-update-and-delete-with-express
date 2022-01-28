const express = require("express");
const router = express.Router();
const {
    createOne, 
    getAll, 
    getOneBookById, 
    getFictionBooks, 
    getNonFictionBooks,
    getAuthorBooks,
    edit,
    deleteById
} = require("./controller");




router.put("/:identifier", edit);
router.post("/", createOne);
router.get("/", getAll);
router.get("/author/:author", getAuthorBooks);
router.get("/fiction", getFictionBooks);
router.get("/non-fiction", getNonFictionBooks);
router.get("/:id", getOneBookById);
router.delete("/:id", deleteById)


module.exports = router;

// curl -X PUT -H "Content-Type: application/json" -d '{"id":2,"title":"quis natus at totam perferendis tenetur","type":"Fiction","author":"Rogelio Kunze","topic":"thriller","publicationdate":"2011-10-15T23:00:00.000Z"}' http://localhost:3030/books/2 
