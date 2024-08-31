import { copy } from '@std/io'

const tcpServer = Deno.listen({ port: 8080 });
console.log("TCP proxy server listening on port 8080");

for await (const clientConn of tcpServer) {
  try {
    const buffer = new Uint8Array(1024);
    const bytesRead = await clientConn.read(buffer);
    const request = new TextDecoder().decode(buffer.subarray(0, bytesRead || undefined));

    const [method, url] = request.split(" ");
    if (method !== "CONNECT") {
      await clientConn.write(new TextEncoder().encode("HTTP/1.1 405 Method Not Allowed\r\n\r\n"));
      clientConn.close();
    }

    const [hostname, port] = url.split(":");

    const targetConn = await Deno.connect({ hostname, port: Number(port) });
    console.log("Connection Established", targetConn.remoteAddr.hostname);
    await clientConn.write(new TextEncoder().encode("HTTP/1.1 200 Connection Established\r\n\r\n"));

    await Promise.all([
      copy(clientConn, targetConn),
      copy(targetConn, clientConn),
    ]);

  } catch (err) {
    console.error("Failed to handle connection:", err);
  } finally {
    clientConn.close();
  }
}
