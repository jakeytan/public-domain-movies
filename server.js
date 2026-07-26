const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const usersFile = path.join(rootDir, 'users.json');
const port = process.env.PORT || 3000;

function loadUsers() {
  try {
    const content = fs.readFileSync(usersFile, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

let users = loadUsers();
const sessions = new Map();

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, code, payload) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.vtt': 'text/vtt; charset=utf-8',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
  const requestPath = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`).pathname;
  let filePath = decodeURIComponent(path.join(rootDir, requestPath === '/' ? 'index.html' : requestPath));

  if (!filePath.startsWith(rootDir)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      if (requestPath === '/' || requestPath === '/index.html') {
        const indexPath = path.join(rootDir, 'index.html');
        fs.readFile(indexPath, (readError, content) => {
          if (readError) {
            sendJson(res, 404, { error: 'Not Found' });
            return;
          }
          res.writeHead(200, { 'Content-Type': getContentType(indexPath) });
          res.end(content);
        });
        return;
      }
      sendJson(res, 404, { error: 'Not Found' });
      return;
    }

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        sendJson(res, 500, { error: 'Read failed' });
        return;
      }
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(content);
    });
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

  if (url.pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '').trim();

      if (!username || !password) {
        sendJson(res, 400, { error: '用户名和密码不能为空。' });
        return;
      }
      if (username.length < 3) {
        sendJson(res, 400, { error: '用户名至少3个字符。' });
        return;
      }
      if (password.length < 6) {
        sendJson(res, 400, { error: '密码至少6个字符。' });
        return;
      }

      const duplicate = users.some(user => user.username === username);
      if (duplicate) {
        sendJson(res, 409, { error: '用户名已存在。' });
        return;
      }

      const user = {
        id: crypto.randomUUID(),
        username,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
      };
      users = [...users, user];
      saveUsers(users);

      const token = crypto.randomUUID();
      sessions.set(token, { id: user.id, username: user.username });

      sendJson(res, 201, {
        user: { id: user.id, username: user.username, createdAt: user.createdAt },
        token
      });
    } catch (error) {
      sendJson(res, 400, { error: error.message || '注册失败' });
    }
    return;
  }

  if (url.pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const username = String(body.username || '').trim();
      const password = String(body.password || '').trim();

      const user = users.find(candidate => candidate.username === username);
      if (!user || user.passwordHash !== hashPassword(password)) {
        sendJson(res, 401, { error: '用户名或密码错误。' });
        return;
      }

      const token = crypto.randomUUID();
      sessions.set(token, { id: user.id, username: user.username });

      sendJson(res, 200, {
        user: { id: user.id, username: user.username, createdAt: user.createdAt },
        token
      });
    } catch (error) {
      sendJson(res, 400, { error: error.message || '登录失败' });
    }
    return;
  }

  if (url.pathname === '/api/auth/me' && req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '') || url.searchParams.get('token');
    const session = token ? sessions.get(token) : null;
    if (!session) {
      sendJson(res, 401, { error: '未登录' });
      return;
    }
    sendJson(res, 200, { user: session });
    return;
  }

  if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) sessions.delete(token);
    sendJson(res, 200, { ok: true });
    return;
  }

  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Auth server running at http://127.0.0.1:${port}`);
});
