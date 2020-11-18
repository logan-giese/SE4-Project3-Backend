var express = require("express");
var router = express.Router();

/* Validate a plan object (used when creating a new plan) */
function validate(plan) {
  var errorMessage = "[";

  // Note: ID validation was removed because the database is set to auto-increment/auto-assign IDs
  if (plan.plan_name == null || plan.plan_name.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"plan_name", "message":"Must have plan name"}';
  }
  errorMessage += "]";
  return errorMessage;
}

/* Validate for an update request specifically (check for ID) */
function validateForUpdate(plan) {
  var errorMessage = validate(plan);
  if (plan.plan_id == null || plan.plan_id.length == 0) {
    errorMessage = errorMessage.substring(0, errorMessage.length-2);
    errorMessage += '{"attributeName":"plan_id", "message":"Must have plan ID"}' + "]";
  }
  return errorMessage;
}

/* GET the full plan listing */
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
    sqlQuery = "SELECT * FROM degreeplans LIMIT ? OFFSET ?";
    sqlParams = [limit, offset];
  }
  else {
    sqlQuery = "SELECT * FROM degreeplans WHERE plan_name LIKE ? LIMIT ? OFFSET ?";
    sqlParams = [search, limit, offset];
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

/* GET all courses for a specific plan */
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("SELECT * FROM degreeplans NATURAL JOIN courseplan WHERE plan_ID=?", id, function(
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

/* PUT an updated plan in the database */
router.put("/:id", function(req, res, next) {
  var id = req.params.id;
  console.log(req.body);

  var plan = req.body;
  let errorMessage = validateForUpdate(plan);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "UPDATE degreeplans SET ? WHERE plan_ID=?",
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

/* POST a new plan in the database */
router.post("/", function(req, res, next) {
  console.log(req.body);

  var plan = req.body;
  let errorMessage = validate(plan);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "INSERT INTO degreeplans SET ? ",
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

/* DELETE a plan */
router.delete("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("DELETE FROM degreeplans WHERE plan_ID=?", id, function(
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
