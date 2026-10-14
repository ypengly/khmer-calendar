// Tiny static server for local use: `npm start` -> http://localhost:5173
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const T={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8'};
http.createServer((q,s)=>{let p=path.normalize(decodeURIComponent(q.url.split('?')[0])).replace(/^(\.\.[\/\\])+/,'');if(p==='/'||p==='\\')p='/index.html';
const f=path.join(process.cwd(),p);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end('Not found')}s.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});s.end(d)})}).listen(5173,()=>console.log('http://localhost:5173'));
