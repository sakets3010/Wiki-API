const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const wikiSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", wikiSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((articles) => {
        res.send(articles);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(() => {
        res.send("Success");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("successfully deleted");
      })
      .catch((err) => {
        res.send(err);
      });
  });

//specific
app
  .route("/articles/:articleName")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleName })
      .then((article) => {
        res.send(article);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .put((req, res) => {
    Article.findOneAndReplace(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content }
    )
      .then(() => {
        res.send("Successfully updated");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleName }, { $set: req.body })
      .then(() => {
        res.send("Successfully patched");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req,res)=>{
    Article.deleteOne({ title: req.params.articleName }).then(() => {
        res.send("Successfully deleted");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(3000, () => {
  console.log("app listening at port 3000");
});
