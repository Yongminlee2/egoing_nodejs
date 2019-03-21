var fs = require('fs');
exports.foo = { 
    HTML : function (title,list,description,crud) {
        return `<!doctype html>
                <html>
                <head>
                <title>WEB1 -${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    ${crud}
                    <h2>${title}</h2>
                    ${description}
                    <img src = "/1.jpg" style="width:500px; height:500px; display:block;">
                </body>
                </html>
                `;
            },
    list : function (){ 
    var list = '<ul>';
    var filelist = fs.readdirSync('./data');
    for(var i =0;i<filelist.length;i++){
        list += `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`
    }
    list += '</ul>'
    return list
    }
}