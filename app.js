/**
 * Created by wangqi on 2017/4/22.
 */
var express=require('express');
var path=require('path');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
mongoose.Promise = require('bluebird');
var Movie=require('./models/movie.js');
var _=require('underscore');
var port=process.env.PORT||3000;
var app=express();

mongoose.connect('mongodb://localhost/movie')
app.set('views','./view/pages');
app.set('view engine','jade');
//将表单中的数据格式化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.locals.moment=require('moment');
app.listen(port);
//输入PORT=4000 node app.js。可以在4000端口启动
console.log('Servive has started on port '+port);

// index page
app.get('/',function (req,res) {       //路由匹配规则和回调函数
    Movie.fetch(function (err,movies) {
        if(err) console.log(err);
        res.render('index',{
            title:'首页',
            movies:movies
        })
    })
})

// detail page
app.get('/movie/:id',function (req,res) {       //路由匹配规则和回调函数
    var id=req.params.id;
    Movie.findById(id,function (err,movie) {
        res.render('detail',{
            title:movie.title,
            movie:movie
        })
    })

})

//admin update
app.get('/admin/update/:id',function (req,res) {
    var id=req.params.id;
    Movie.findById(id,function (err,movie) {
        res.render('admin',{
            title:'后台更新页',
            movie:movie
        })
    })
})

//adimin post movie
app.post('/admin/movie/new',function (req,res) { console.log(req)
    var id=req.body.movie._id;   //????
    var movieObj=req.body.movie;
    var _movie;

    if(id!=='undefined'){         //已有此条目,更新
        Movie.findById(id,function (err,movie) {
            if(err) console.log(err);
            _movie=_.extend(movie,movieObj);  //'查询的movie','post的movie'
            _movie.save(function (err,movie) {
                if(err) console.log(err);
                res.redirect('/movie/'+movie._id)
            })
        })
    }
    else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        _movie.save(function (err,movie) {
            if(err) console.log(err);
            res.redirect('/movie/'+movie._id)
        })
    }
})

// admin page
app.get('/admin/movie',function (req,res) {       //路由匹配规则和回调函数
    res.render('admin',{
        title:'后台录入页',
        movie:{
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

// list page
app.get('/admin/list',function (req,res) {       //路由匹配规则和回调函数
    Movie.fetch(function (err,movies) {
        if(err) console.log(err);
        res.render('list',{
            movies:movies
        })
    })
})