const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./modals/shortUrl");
const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(res=>{
  console.log("DB Connected!")
}).catch(err => {
console.log(Error, err.message);
})

app.set("view engine", "ejs");
// app.use(express.urlendcoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get('/:shortUrl',async (req,res)=>{
  const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl})
  if(shortUrl== null){
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
})

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
