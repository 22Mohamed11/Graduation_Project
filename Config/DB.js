const mongoose = require("mongoose");

const DBConnection = () => {
  mongoose
    .connect(process.env.DB_CONNECT_APP)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};

module.exports = DBConnection;
