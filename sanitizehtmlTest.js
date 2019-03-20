var sanitizeHtml = require('sanitize-html');
var dirty = `h1태그는 <h1>링크</h1> 무시가 될까?`;
var sanitizedDescription = sanitizeHtml(dirty,{
    allowedTags:['h1']
});

console.log(sanitizedDescription);