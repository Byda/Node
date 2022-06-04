# Node

Backend consists of:
- OPC Client: Collect data from OPC UA Server running on On-Primise gateway (Raspberry Pi with Ubuntu server OS).
- Web server: Writen by Node.js framework.
  + Connect to MongoDB to save users information and outstations's alarms.
  + Provide REST API in order to do Login funtion in mobile application.
  + Routes for client web browser.

Frontend is build on server-side rendering model with handlebars wiew-engine. It consists of these views:
  + Home: Google Map API was used to monitor remote outstation's status (connect, alarms, ...)
  + Trend: Monitor realtime chart. We used socket.io and chartjs library to complete this function.
  + Alarms: Display remote outsation's alarm stored in MongoDB.
  + Login, Register: jQuery is used to do POST method.
