# Simple TCP Proxy Server

## Description

This project is a simple TCP proxy server built using Deno. It specifically handles HTTP `CONNECT` requests, allowing it to establish a tunnel between a client and a target server. The proxy listens on port `8080` and only supports the `CONNECT` method, which is commonly used for tunneling HTTPS traffic.

## Features

- **TCP Proxy**: Handles raw TCP connections.
- **HTTP CONNECT Method Support**: Establishes a tunnel between the client and the target server using the HTTP `CONNECT` method.
- **Port 8081**: The proxy listens exclusively on port `8081` by defaul. (can be ovveride by PORT env value)

## How It Works

When a client sends an HTTP `CONNECT` request to the proxy, the server:

1. Parses the request to extract the target hostname and port.
2. Establishes a TCP connection to the specified target server.
3. Responds to the client with `HTTP/1.1 200 Connection Established` if the connection is successful.
4. Forwards data bidirectionally between the client and the target server, effectively creating a tunnel.


