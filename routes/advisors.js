var express = require("express");
var router = express.Router();

/* Validate a advisor object (used when creating a new advisor) */
function validate(advisor) {
  var errorMessage = "[";

  // Note: ID validation was removed because the database is set to auto-increment/auto-assign IDs
  if (student.department == null || student.department.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"advisor_last_name", "message":"Must have last name"}';
  }
  if (student.number == null || student.number.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"advisor_first_name", "message":"Must have first name"}';
  }
  /* TODO - add more validation checks
  if (advisor.name == null || advisor.name.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"name", "message":"Must have name"}';
  }
  if (advisor.hours == null || advisor.hours.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"hours", "message":"Must have hours"}';
  }
  if (advisor.level == null || advisor.level.length == 0) {
      // If no advisor level, set it to the default
      advisor.level = "0";
  }*/
  errorMessage += "]";
  return errorMessage;
}

/* Validate for an update request specifically (check for ID) */
function validateForUpdate(advisor) {
  var errorMessage = validate(advisor);
  if (advisor.id == null || advisor.id.length == 0) {
    errorMessage = errorMessage.substring(0, errorMessage.length-2);
    errorMessage += '{"attributeName":"advisor_ID", "message":"Must have advisor ID"}' + "]";
  }
  return errorMessage;
}

/* GET the full advisor listing */
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
    sqlQuery = "SELECT * FROM Advisors LIMIT ? OFFSET ?";
    sqlParams = [limit, offset];
  }
  else {
    sqlQuery = "SELECT * FROM Advisors WHERE advisor_first_name LIKE ? OR advisor_last_name LIKE ? "+
        "LIMIT ? OFFSET ?";
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

/* GET a specific advisor */
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("SELECT * FROM Advisors WHERE advisor_ID=?", id, function(
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

/* PUT an updated advisor in the database */
router.put("/:id", function(req, res, next) {
  var id = req.params.id;
  console.log(req.body);

  var advisor = req.body;
  let errorMessage = validateForUpdate(advisor);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "UPDATE Advisors SET ? WHERE advisor_ID=?",
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

/* POST a new advisor in the database */
router.post("/", function(req, res, next) {
  console.log(req.body);

  var advisor = req.body;
  let errorMessage = validate(advisor);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "INSERT INTO Advisors SET ? ",
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

/* DELETE an advisor */
router.delete("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("DELETE FROM Advisors WHERE advisor_ID=?", id, function(
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
