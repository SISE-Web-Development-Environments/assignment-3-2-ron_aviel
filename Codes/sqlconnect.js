require("./node_modules/dotenv").config();
const sql = require("./node_modules/mssql");
const config = {
    user: process.env.tedious_userName,
    password: process.env.tedious_password,
    server: process.env.tedious_server,
    database: process.env.tedious_database
};
sql.connect(config)
.then((pool) => {
    return pool.request().query("Select * from dbo.users where user_id=2 ");
})
.then((result) => {
    console.log(result);
}).catch((err)=>{
    console.log("err");
})