const express = require('express');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render(__dirname + '/views/index')
})

app.get('/video', (req,res)=>{
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    const videoPath = __dirname+"/assets/videos/test-vid.mp4";
    const videoSize = fs.statSync(__dirname+"/assets/videos/test-vid.mp4").size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    var browserReadStream = fs.createReadStream(videoPath, { start, end });
    browserReadStream.pipe(res);

})
app.listen(5000, ()=>{
    console.log("5000")
})