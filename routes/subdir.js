const express = require('express')
const router = express.Router()
const path = require('path')

router.get("^/$|/index(.html)?", (req, res) => {
    // start w and end w / or /index.html pr /index  --- .html optional
    res.sendFile(path.join(__dirname, '..','views', 'subdir','index.html'))
  })

  router.get("/test(.html)?", (req, res) => {
    // start w and end w / or /index.html pr /index  --- .html optional
    res.sendFile(path.join(__dirname, '..','views', 'subdir','test.html'))
  })

module.exports = router

 