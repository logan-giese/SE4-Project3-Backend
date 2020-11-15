var express = require("express");
var router = express.Router();

/* Validate a course object (used when creating a new course) */
function validate(course) {
  var errorMessage = "[";

  // Note: ID validation was removed because the database is set to auto-increment/auto-assign IDs
  if (course.department == null || course.department.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"department", "message":"Must have department"}';
  }
  if (course.number == null || course.number.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"number", "message":"Must have number"}';
  }
  if (course.name == null || course.name.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"name", "message":"Must have name"}';
  }
  if (course.hours == null || course.hours.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"hours", "message":"Must have hours"}';
  }
  if (course.level == null || course.level.length == 0) {
      // If no course level, set it to the default
      course.level = "0";
  }
  errorMessage += "]";
  return errorMessage;
}

/* Validate for an update request specifically (check for ID) */
function validateForUpdate(course) {
  var errorMessage = validate(course);
  if (course.course_id == null || course.course_id.length == 0) {
    errorMessage = errorMessage.substring(0, errorMessage.length-2);
    errorMessage += '{"attributeName":"course_ID", "message":"Must have course ID"}' + "]";
  }
  return errorMessage;
}

/* GET the full course listing */
router.get("/", function(req, res, next) {
  // Get offset and limit from request url
  var offset;
  var limit;
  if (req.query.page == null) offset = 0;
  else offset = parseInt(req.query.page);
  if (req.query.per_page == null) limit = 50;
  else limit = parseInt(req.query.per_page);
  
  // Construct SQL query based on whether it's a search or not
  var sqlQuery;
  var sqlParams;
  var search = "%"+req.query.search+"%"; // Add SQL wildcards
  if (req.query.search == null) {
    sqlQuery = "SELECT * FROM course LIMIT ? OFFSET ?";
    sqlParams = [limit, offset];
  }
  else {
    sqlQuery = "SELECT * FROM course WHERE number LIKE ? OR name LIKE ? LIMIT ? OFFSET ?";
    sqlParams = [search, search, limit, offset];
  }
  
  // Send the SQL query
  res.locals.connection.query(
    sqlQuery,
    sqlParams,
    function(error, results, fields) {
      if (error) {
        res.status(500);
        res.send(JSON.stringify({ status: 500, error: error, response: null }));
        // If there is error, we send the error in the error section with 500 status
      } else {
        res.status(200);
        res.send(JSON.stringify(results));
        // If there is no error, all is good and response is 200OK.
      }
    }
  );
});

/* GET a specific course */
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("SELECT * FROM course WHERE course_ID=?", id, function(
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

/* PUT an updated course in the database */
router.put("/:id", function(req, res, next) {
  var id = req.params.id;
  console.log(req.body);

  var course = req.body;
  let errorMessage = validateForUpdate(course);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "UPDATE course SET ? WHERE course_ID=?",
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

/* POST a new course in the database */
router.post("/", function(req, res, next) {
  console.log(req.body);

  var course = req.body;
  let errorMessage = validate(course);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "INSERT INTO course SET ? ",
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

/* DELETE a course */
router.delete("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("DELETE FROM course WHERE course_ID=?", id, function(
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
      //If there is no error, all is good and response is 200 OK
    }
  });
});

module.exports = router;
