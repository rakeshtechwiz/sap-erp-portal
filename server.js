require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var http = require('follow-redirects').http;
const cors = require('cors');
var fs = require('fs');
const parser = require('xml-js');
const jwt = require('jsonwebtoken');


app = express();

app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
//Users List
let users = [{
	"name" : "c001",
	"password" : "password"
},
{
	"name" : "v001",
	"password" : "password"
},
{
	"name" : "e001",
	"password" : "password"
},
{
	"name" : "m001",
	"password" : "password"
},
{
	"name" : "p001",
	"password" : "password"
},
{
	"name" : "s001",
	"password" : "password"
},
{
	"name" : "q001",
	"password" : "password"
}
]
//Login Route
app.post('/users/login',(req,res) => {
	console.log("Someone's here");
	const user = users.find(user => user.name === req.body[0].name);
	if(user == null){
		res.send(JSON.stringify("User not found"));
	} else {
		if(user.password === req.body[0].password){
			console.log("Yay");
			const CurrentUserName = req.body[0].name;
			const CurrentUser = { name : CurrentUserName };
			const accessToken = jwt.sign(CurrentUser , process.env.ACCESS_TOKEN_SECRET);
			res.json({accessToken: accessToken });
		}
		else {
			res.send(JSON.stringify("Wrong Password"));
		}
	}
});
//Authentication Route
app.post('/auth', (req,res) => {
  console.log("Hey from auth route");
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null){
	  res.send(JSON.stringify("Not allowed"));
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
	  if(err) {
		  res.send(JSON.stringify("Not allowed"));
	  }
	  console.log(user);
	  res.send(user);
  })
});
//SAP Side
var options = {
	'method': 'POST',
	'port': 50000,
	'host': 'dxktpipo.kaarcloud.com',
	'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SaiRakesh&receiverParty=&receiverService=&interface=SI_Vendor1_Req&interfaceNamespace=http://training.com/sairakesh',
	'headers': {
		'Content-Type': 'application/xml',
		'Authorization': 'Basic UE9VU0VSOkthYXJAUE8yMDIw',
	},
	'maxRedirects': 20
};


app.post('/login', (req, res) => {
	const vendorID = req.body.vendId;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sair="http://training.com/sairakesh">
   <soapenv:Header/>
   <soapenv:Body>
      <sair:MT_Vendor1_Req>
         <Vendor1ID>${vendorID}</Vendor1ID>
      </sair:MT_Vendor1_Req>
   </soapenv:Body>
</soapenv:Envelope>`;
	const req1 = http.request(options, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_Vendor1_Resp'];
			res.send({
				vendorAddr: resp['VendorAddr']['_text'],
				vendorDesc: resp['VendorDesc']['_text'],
				vendorName: resp['VendorName']['_text']
			});
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
});



app.listen(8000, () => {
	console.log('Reading on port ', 8000);
})