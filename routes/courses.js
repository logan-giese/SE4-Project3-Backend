var express = require("express");
var router = express.Router();

function validate(student) {
  var errorMessage = "[";

  if (student.idNumber == null || student.idNumber.length == 0) {
    errorMessage +=
      '{"attributeName":"idNumber" , "message":"Must have idNumber"}';
  }
  if (student.firstName == null || student.firstName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"firstName", "message":"Must have first name"}';
  }
  if (student.lastName == null || student.lastName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"lastName" , "message":"Must have last name"}';
  }
  if (student.zip == null || student.zip.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"zip" , "message":"Must have zip code"}';
  }
  if (student.city == null || student.city.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"city" , "message":"Must have city"}';
  }
  if (student.state == null || student.state.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"state" , "message":"Must have state"}';
  }
  if (student.email == null || student.email.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"email" , "message":"Must have email"}';
  }
  if (student.classification == null || student.classification.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"classification" , "message":"Must have classification"}';
  }
  if (student.gender == null || student.gender.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"gender" , "message":"Must have gender"}';
  }
  errorMessage += "]";
  return errorMessage;
}

/* GET student listing. */
router.get("/", function(req, res, next) {
  var offset;
  var limit;
  if (req.query.page == null) offset = 0;
  else offset = parseInt(req.query.page);
  if (req.query.per_page == null) limit = 20;
  else limit = parseInt(req.query.per_page);
  res.locals.connection.query(
    "SELECT * FROM student LIMIT ? OFFSET ?",
    [limit, offset],
    function(error, results, fields) {
      if (error) {
        res.status(500);
        res.send(JSON.stringify({ status: 500, error: error, response: null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.status(200);
        res.send(JSON.stringify(results));
        //If there is no error, all is good and response is 200OK.
      }
    }
  );
});
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("SELECT * FROM student WHERE id=?", id, function(
    error,
    results,
    fields
  ) {
    if (error) {
      res.status(500);
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.status(200);
      res.send(JSON.stringify(results));
      //If there is no error, all is good and response is 200OK.
    }
  });
});
router.put("/:id", function(req, res, next) {
  var id = req.params.id;
  console.log(req.body);

  var student = req.body;
  let errorMessage = validate(student);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "UPDATE student SET ? WHERE id=?",
      [req.body, id],
      function(error, results) {
        if (error) {
          res.status(500);
          res.send(
            JSON.stringify({ status: 500, error: error, response: null })
          );
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.status(200);
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
          //If there is no error, all is good and response is 200OK.
        }
      }
    );
  }
});
router.post("/", function(req, res, next) {
  console.log(req.body);

  var student = req.body;
  let errorMessage = validate(student);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "INSERT INTO student SET ? ",
      req.body,
      function(error, results) {
        if (error) {
          res.status(500);
          res.send(
            JSON.stringify({ status: 500, error: error, response: null })
          );
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.status(200);
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
          //If there is no error, all is good and response is 200OK.
        }
      }
    );
  }
});

router.delete("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("DELETE FROM student WHERE id=?", id, function(
    error,
    results
  ) {
    if (error) {
      res.status = 500;
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.status = 200;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
});
module.exports = router;
