var express= require('express');
var router = express.Router();

var fs = require('fs');
var template = require('./lib/template.js');
router.get('/',(request,response) => {
    
    console.log("1번쨰");
    var title = "Welcome";
    var description = "Hello, Node.js";
    var crud = '<a href="/create">create</a>'
    var template2 = template.foo.HTML(title,template.foo.list(),description,crud);
    
    response.send(template2);
});
router.get('/page/:file',(request,response) => {
    var title = request.params.file;

    fs.readFile(`data/${title}`,'utf8',function(err,description){
        
        console.log('2번째');
        var crud = `<a href="/create">create</a>
        <a href="/update/${title}">update</a>
        <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="삭제">
        </form>`;
        var template2 = template.foo.HTML(title,template.foo.list(),description,crud);    

        response.send(template2);
    });
});

router.get('/create',(request,response) => {
        var title = 'WEB - create';
        var description = fs.readFileSync('./create.html');
        var crud = '';
        var template2 = template.foo.HTML(title,template.foo.list(),description,crud);
        response.send(template2);
});

router.post('/create_process',(request,response) => {

    console.log('3번째');
        var post= request.body;
        var title = post.title;
        var description = post.description;
        console.log('4번째');
        fs.writeFile('./data/'+title,description,'utf8',function(err){
            if (err ===undefined || err == null){
            console.log(title+description);
            response.writeHead(302, {Location: `/page/${title}`});  //요청한 주소로 리다이렉션
            response.end();
        }
        })
});

router.get('/update/:id',(request,response) => {
    var title = request.params.id;
    fs.readFile(`./data/${title}`,'utf8',function(err,data){
        var description = `<form action="http://localhost:3000/update_process" method="post">
        <input type="hidden" name="title_ori" placeholder="title" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="description">${data}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `
        var crud = `<a href="/create">create</a> <a href="/update/${title}">update</a>`;
        var template2 = template.foo.HTML(title,template.foo.list(),description,crud);

        response.send(template2);
    });
});

router.post('/update_process',(request,response) => {
    

        var post = request.body;
        var title = post.title;
        var title_ori = post.title_ori;
        description = post.description;

        fs.rename(`./data/${title_ori}`,`./data/${title}`,()=>{
            fs.writeFile('./data/'+title,description,'utf8',function(err){
                if (err ===undefined || err == null){
                response.writeHead(302, {Location: `/page/${title}`});  //요청한 주소로 리다이렉션
                response.end();
                }
            });
        });
});


router.post('/delete_process',(request,response) => {

        var post = request.body;
        fs.unlink(`./data/${post.id}`,(err)=>{
            response.redirect('/');
        })
});



module.exports = router;