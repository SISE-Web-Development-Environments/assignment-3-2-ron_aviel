var express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.status(200).send("Hello World");
});

const port = process.env.PORT || 5000; //environment variable
app.listen(port, () => {
	console.log(`Listening on portt ${port}`);
});