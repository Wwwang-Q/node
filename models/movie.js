/**
 * Created by wangqi on 2017/4/23.
 */
var mongoose=require('mongoose');
var movieShema=require('../schemas/movie');
var movie=mongoose.model('movie',movieShema);  //传入模型的名字以及模型

module.exports=movie;