const express = require('express')
const movieRouter =  express.Router()



const { getAllMoviesPublic, getMovieById} = require('../controllers/movieController')
const upload = require('../middlewares/multer')



//public route for movies(no auth)
movieRouter.get('/', getAllMoviesPublic);
movieRouter.get('/:id', getMovieById);



module.exports= movieRouter