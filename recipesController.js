var express = require('express');
const app = express();




const port = process.env.PORT || 5000; //environment variable
app.listen(port, () => {
	console.log(`Listening on portt ${port}`);
});