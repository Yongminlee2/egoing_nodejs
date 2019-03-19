var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var f5count = 1;

var  HTMLtemplate = function (title,list,description,crud) {
   return `<!doctype html>
        <html>
        <head>
        <title>${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${crud}
            <h2>${title}</h2>
            ${description}
        </body>
        </html>
        `;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var title = queryData.id;
    var URLpath = url.parse(_url,true).pathname;

    f5count += 1;
    console.log(`시작${f5count}`);
    
    
    fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
        var list = '<ul>';
        var filelist = fs.readdirSync('./data');
        for(var i =0;i<filelist.length;i++){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list += '</ul>';
        var crud;
        if (URLpath === '/'){
            if (title === undefined){
                title = "Welcome";
                description = "Hello, Node.js";
                crud = '<a href="/create">create</a>'
                var template = HTMLtemplate(title,list,description,crud);
                response.writeHead(200);
                response.end(template);
            }
            crud = `<a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="삭제">
                    </form>`;
            var template = HTMLtemplate(title,list,description,crud);
            response.writeHead(200);
            response.end(template);
        }else if(URLpath === '/create'){

            title = 'WEB - create';
            description = fs.readFileSync('./create.html');
            crud = '';
            var template = HTMLtemplate(title,list,description,crud);

            response.writeHead(200);
            response.end(template);
        }else if(URLpath ==='/create_process'){
            var body = '';

            request.on('data',function (data){
                body += data;
            });
            request.on('end',function(){
                var post= qs.parse(body);
                console.log(post);
                var title = post.title;
                description = post.description;
                
                fs.writeFile('./data/'+title,description,'utf8',function(err){
                    if (err ===undefined || err == null){
                    console.log(title+description);
                    response.writeHead(302, {Location: `/?id=${title}`});  //요청한 주소로 리다이렉션
                    response.end();
                }
                })
            });         
        }else if (URLpath === '/update'){
            fs.readFile(`./data/${title}`,'utf8',function(err,data){
                description = `<form action="http://localhost:3000/update_process" method="post">
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
                crud = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;
                var template = HTMLtemplate(title,list,description,crud);

                response.writeHead(200)
                response.end(template);
            });
        }else if (URLpath ==='/update_process'){
            var body = '';
            request.on('data',(data)=>{
                body += data;
            });
            request.on('end',()=>{
                var post = qs.parse(body);
                var title = post.title;
                var title_ori = post.title_ori;
                description = post.description;

                fs.rename(`./data/${title_ori}`,`./data/${title}`,()=>{
                    fs.writeFile('./data/'+title,description,'utf8',function(err){
                        if (err ===undefined || err == null){
                        response.writeHead(302, {Location: `/?id=${title}`});  //요청한 주소로 리다이렉션
                        response.end();
                        }
                    });
                });
            });
        }else if (URLpath === '/delete_process'){
            var body = '';
            request.on('data',function(data){
                body += data;
            });
            request.on('end',function(){
                var post = qs.parse(body);
                fs.unlink(`./data/${post.id}`,(err)=>{
                    console.log(post.id);
                    response.writeHead(302, {Location: `/`});  //요청한 주소로 리다이렉션
                    response.end();
                })
            });
        }else{
            response.writeHead(404);
            response.end('Not Found');
        }
    })
})
app.listen(3000);