# Geena Shutdown Service documentation

Geena Shutdown Service allows you to handle tasks like: start, stop and restart.
You send http requests from within your program to trigger tasks.

Let's say for exemple, when the bundle is ready to stop, it sends a HTTP request to the Shutdown Service,
The Shutdown acknowleges and start processing the requested task.
