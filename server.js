import express from "express";
import mongoose from "mongoose";
import Memories from "./dbMemories.js";
import Cors from "cors";
import multer from "multer";
import path from "path";
import Grid from "gridfs-stream";
import bodyParser from "body-parser";

import { GridFsStorage } from "multer-gridfs-storage";

Grid.mongo = mongoose.mongo;

const app = express();

const PORT = process.env.PORT || 9000;

const connectionURL =
  "mongodb+srv://admin:nZ5HDh8e3EjrVpu4@cluster0.kjdkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
app.use(bodyParser.json());
app.use(Cors());

const conn = mongoose.createConnection(connectionURL);

mongoose.connect(connectionURL);
let gfs,gridfsBucket
conn.once("open", () => {
  console.log("DB Connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'images'
  });

gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const storage = new GridFsStorage({
  url: connectionURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      {
        const filename = `image-${Date.now()}${path.extname(
          file.originalname
        )}`;

        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      }
    });
  },
});

const upload = multer({ storage });

app.post("/upload/image", upload.single('file'), (req, res) => {
  res.status(201).send(req.file);
});

app.get('/retrive/image', (req, res) => {
    gfs.files.findOne({filename:'image-1644029930568.jpeg'},(err, file) => {
        if (err) {
            res.status(500).send(err.message);
        }
        else {
            if(!file && file.length === 0) {
                res.status(404).send("404 Not Found");
        }
        else {
            const readStream = gridfsBucket.openDownloadStream(file.filename);
        readStream.pipe(res);        }
    }
    })
})

app.get("/", (req, res) => {
  res.send("Heloo");
});

app.post("/update", (req, res) => {
  const update = req.body;
  Memories.updateOne(
    {
      _id: req.body.id,
    },
    { $set: update },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    }
  );
});

app.get("/memories", (req, res) => {
  Memories.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/delete", (req, res) => {
  const id = req.body;
  Memories.deleteOne(id, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.post("/new", (req, res) => {
  const memory = req.body;
  Memories.create(memory, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening post ${PORT}`);
});
