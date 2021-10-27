var mysql = require('mysql');


    var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'marina',
	database:'comments' 
  });


module.exports = {



    createConn: function () {

        con.connect(function (err) {

            if (err) console.log("Already connected");

            else console.log("Connected");

        });

    },

    getAllComments: async function (name) {

        return new Promise((resolve) => {

            con.query("SELECT * FROM addcomment", function (err, result) {

                if (err) throw err;

                resolve(result);

            });

        });

    },

    getComment: async function (name) {

        return new Promise((resolve) => {

            con.query("SELECT * FROM addcomment where name='" + name + "'", function (err, result) {

                if (err) throw err;

                resolve(result);

            });

        });

    },

    createTable: async function () {

        return new Promise((resolve) => {

            var q = "CREATE TABLE IF NOT EXISTS addcomment (id_user INT UNIQUE  AUTO_INCREMENT, name VARCHAR(255), comment VARCHAR(255))";

            con.query(q, function (err, result) {

                if (err) throw err;

                console.log("Table addcomment created. ")

                resolve();

            })

        })

    },

    insertComment: async function ( name, comment) {

        return new Promise((resolve) => {

            var q = "INSERT INTO addcomment VALUES(NULL,?,?)";

            con.query(q, [ name, comment], function (err, result) {

                if (err) throw err;

                console.log("Added comment in DB");

                resolve();

            });

        })

    }

}