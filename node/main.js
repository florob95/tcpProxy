import net from 'net';

const server = net.createServer(clientConn => {
    clientConn.once('data', async (data) => {
        try {
            const request = data.toString();
            const [method, url] = request.split(' ');

            if (method !== 'CONNECT') {
                clientConn.write("HTTP/1.1 405 Method Not Allowed\r\n\r\n");
                return clientConn.end();
            }

            const [hostname, port] = url.split(':');
            const targetConn = net.connect(Number(port), hostname, () => {
                console.log("Connection Established", hostname);
                clientConn.write("HTTP/1.1 200 Connection Established\r\n\r\n");
                clientConn.pipe(targetConn);
                targetConn.pipe(clientConn);
            });

            targetConn.on('error', (err) => {
                console.error("Target connection error:", err);
                clientConn.end();
            });

        } catch (err) {
            console.error("Failed to handle connection:", err);
            clientConn.end();
        }
    });

    clientConn.on('error', (err) => {
        console.error("Client connection error:", err);
    });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8081;
server.listen(port, () => {
    console.log(`TCP proxy server listening on port ${port}`);
});
