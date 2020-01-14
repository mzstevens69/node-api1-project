// nodejs with express
const express = require('express');

const Lor   = require("./data/db");// points towards helper functions

const server = express();

//middleware teaches express new things
server.use(express.json());

// endpoints
//GET list of users
server.get('/users', (req, res) => {
  Lor.find()
    .then(lors => {
      console.log("Lors", lors);
        res.status(200).json(lors);
    })
    .catch(err => {
        console.log(err);
    
    res.status(500).json({
        errorMessage: "The users information could not be retrieved."
    });
  });
});

// GET a single user by ID

server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    Lor.findById(id)
      .then(lor => {
        console.log("Lor", lor);
         if (lor) res.status(200).json(lor);
         else res.status(404)
           .json({ message: "The user with the specified ID does not exist." })
      })
      .catch(err => {
          console.log(err);
      
      res.status(500).json({
          errorMessage: "The user information could not be retrieved."
      });
    });
  });
 // POST insert(add) a user
 server.post("/users", (req, res) => {
     const {name, bio} = req.body; // added server.use(express.json()) to get this to work.
    //never trust client, validate data will be learning soon
    if (name && bio) {
    Lor.insert(req.body)
        .then(add => {
            res.status(201).json(add);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                errorMessage: "sorry, there was an error adding LoTR data"
            });
        });
    } else{
        res.status(400).json({
            errorMessage: "name and bio required for user"
        });
    }           
 });
// DELETE a user
server.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    Lor.remove(id)
      .then(remove => {
        if (remove) res.status(200).json(remove);
        else
          res.status(404)
            .json({ message: "The user with the specified ID does not exist." });
      })
      .catch(error =>
        res.status(500).json({ error: "The user could not be removed" })
      );
  });
// UPDATE a new
server.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const { name, bio} = req.body;
    if(!name || !bio)
        res.status(400).json({
            errorMessage: "name and bio are required."
        });
        else { Lor.update(id, req.body)
            .then(updte => {
                if (updte) res.status(200).json(updte);
                else res.status(404).json({
                    message: "The user with the specified ID doe not exist."
                });
            })
            .catch(error =>
              res.status(500).json({ error: "The user could not be removed" })
            );

        }
});

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));

