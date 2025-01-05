/**
 * This is a basic HTTP proxy server that forwards requests to a Twinkly device.
 */

import http from 'node:http';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, x-twinkly-ip, x-auth-token',
	'Access-Control-Max-Age': 86400,
};

const proxy = http.createServer((req, res) => {
	if (req.method === 'OPTIONS') {
		res.writeHead(204, corsHeaders).end();
		return;
	}

	if (!req.url) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end('Bad Request, URL is required');
		return;
	}

	const twinklyIP = req.headers['x-twinkly-ip'];
	if (!twinklyIP) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end('Bad Request, X-Twinkly-IP header is required');
		return;
	}

	const options = {
		hostname: twinklyIP as string,
		port: 80,
		path: req.url,
		method: req.method,
		headers: {
			'x-auth-token': req.headers['x-auth-token'] || '',
			'Content-Type': 'application/json',
			'Content-Length': req.headers['content-length'] || 0,
		},
	};

	const proxyReq = http.request(options, (proxyRes) => {
		res.writeHead(
			proxyRes.statusCode || 500,
			Object.assign(corsHeaders, proxyRes.headers),
		);
		proxyRes.pipe(res, { end: true });
	});
	req.pipe(proxyReq, { end: true });
	proxyReq.on('error', (err) => {
		console.error(err);
		res.end(`Proxy error: ${err.message}`);
	});
});

const port = process.env.PORT || 3000;
proxy.listen(port, () => {
	console.log(`Proxy server is running on http://localhost:${port}`);
});
