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
//Global Variables
let loginStatus;

//Login Route
app.post('/users/login',(req,res) => {
	var loptions = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_Login_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const username = req.body[0].name;
	const password = req.body[0].password;
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_Login_Req>
		  <Username>${username}</Username>
		  <Password>${password}</Password>
	   </rak:MT_SRK_Login_Req>
	</soapenv:Body>
	</soapenv:Envelope>`;
	const req1 = http.request(loptions, function (res1) {
		const chunks = [];

		res1.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res1.on("end", function (chunk) {
			const body = Buffer.concat(chunks);
			const xml = body.toString();
			const data = parser.xml2json(xml, {compact: true, spaces: 4});
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_Login_Resp'];
			loginStatus = resp['Status']['_text'];
			if(loginStatus != 1){
				res.send(JSON.stringify("User not found"));
			} else {
				
					const CurrentUserName = req.body[0].name;
					const CurrentUser = { name : CurrentUserName };
					const accessToken = jwt.sign(CurrentUser , process.env.ACCESS_TOKEN_SECRET);
					res.json({accessToken: accessToken });
				
				
			}
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
   
	

});

//Authentication Route
app.post('/auth', (req,res) => {
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
//SP PO Route
app.post('/sp/po',(req,res) => {
	const matnr = req.body.matnr;
	// console.log(matnr);
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_PO_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_PO_Req>
		  <MaterialNo>${matnr}</MaterialNo>
	   </rak:MT_SRK_PO_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_PO_Resp'];
		// console.log(resp);
		res.send({
			PlannedOrderNo: resp['PlannedOrderNo']['_text'],
			PlanningPlant: resp['PlanningPlant']['_text'],
			ProductionPlant: resp['ProductionPlant']['_text'],
			OrderType: resp['OrderType']['_text'],
			ProcurementType: resp['ProcurementType']['_text'],
			TotalQuantity: resp['TotalQuantity']['_text'],
			OrderStartDate: resp['OrderStartDate']['_text'],
			OrderFinishDate: resp['OrderFinishDate']['_text'],
			PurchasingOrganization: resp['PurchasingOrganization']['_text'],
			StorageLocation: resp['StorageLocation']['_text']
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//SP POCU Route
app.post('/sp/pocu',(req,res) => {
	const MaterialNo = req.body.MaterialNo;
	const PlannedOrderNo = req.body.PlannedOrderNo;
	const PlanningPlant = req.body.PlanningPlant;
	const ProductionPlant = req.body.ProductionPlant;
	const OrderType = req.body.OrderType;
	const ProcurementType = req.body.ProcurementType;
	const TotalQuantity = req.body.TotalQuantity;
	const OrderStartDate = req.body.OrderStartDate;
	const OrderFinishDate = req.body.OrderFinishDate;
	const PurchasingOrganization = req.body.PurchasingOrganization;
	const StorageLocation  = req.body.StorageLocation;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_POCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_POCU_Req>
		  <MaterialNo>${MaterialNo}</MaterialNo>
		  <PlannedOrderNo>${PlannedOrderNo}</PlannedOrderNo>
		  <PlanningPlant>${PlanningPlant}</PlanningPlant>
		  <ProductionPlant>${ProductionPlant}</ProductionPlant>
		  <OrderType>${OrderType}</OrderType>
		  <ProcurementType>${ProcurementType}</ProcurementType>
		  <TotalQuantity>${TotalQuantity}</TotalQuantity>
		  <OrderStartDate>${OrderStartDate}</OrderStartDate>
		  <OrderFinishDate>${OrderFinishDate}</OrderFinishDate>
		  <PurchasingOrganization>${PurchasingOrganization}</PurchasingOrganization>
		  <StorageLocation>${StorageLocation}</StorageLocation>
	   </rak:MT_SRK_POCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_POCU_Resp'];
		res.send({
			status: resp['Status']['_text'],
			
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//SP ProO
app.post('/sp/proo',(req,res) => {
	const PlannedOrderNumber = req.body.PlannedOrderNumber;
	// console.log(matnr);
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_ProO_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_ProO_Req>
		  <PlannedOrderNumber>${PlannedOrderNumber}</PlannedOrderNumber>
	   </rak:MT_SRK_ProO_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_ProO_Resp'];
		// console.log(resp);
		res.send({
			ProductionOrderNumber: resp['ProductionOrderNumber']['_text'],
			OrderType: resp['OrderType']['_text'],
			OrderCategory: resp['OrderCategory']['_text'],
			EnteredBy: resp['EnteredBy']['_text'],
			CreatedOn: resp['CreatedOn']['_text'],
			CompanyCode: resp['CompanyCode']['_text'],
			Plant: resp['Plant']['_text'],
			BusinessArea: resp['BusinessArea']['_text'],
			ControllingArea: resp['ControllingArea']['_text'],
			Location: resp['Location']['_text']
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//SP ProOCU Route
app.post('/sp/proocu',(req,res) => {
	const PlannedOrderNumber = req.body.PlannedOrderNumber;
	const ProductionOrderNumber = req.body.ProductionOrderNumber;
	const OrderType = req.body.OrderType;
	const OrderCategory = req.body.OrderCategory;
	const EnteredBy = req.body.EnteredBy;
	const CreatedOn = req.body.CreatedOn;
	const CompanyCode = req.body.CompanyCode;
	const Plant = req.body.Plant;
	const BusinessArea = req.body.BusinessArea;
	const ControllingArea = req.body.ControllingArea;
	const Location  = req.body.Location;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_ProOCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_ProOCU_Req>
		  <PlannedOrderNumber>${PlannedOrderNumber}</PlannedOrderNumber>
		  <ProductionOrderNumber>${ProductionOrderNumber}</ProductionOrderNumber>
		  <OrderType>${OrderType}</OrderType>
		  <OrderCategory>${OrderCategory}</OrderCategory>
		  <EnteredBy>${EnteredBy}</EnteredBy>
		  <CreatedOn>${CreatedOn}</CreatedOn>
		  <CompanyCode>${CompanyCode}</CompanyCode>
		  <Plant>${Plant}</Plant>
		  <BusinessArea>${BusinessArea}</BusinessArea>
		  <ControllingArea>${ControllingArea}</ControllingArea>
		  <Location>${Location}</Location>
	   </rak:MT_SRK_ProOCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_ProOCU_Resp'];
		res.send({
			status: resp['Status']['_text'],
			
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//QP InsLot Route
app.post('/qp/inslot',(req,res) => {
	const matnr = req.body.matnr;
	// console.log(matnr);
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_InsLot_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_InsLot_Req>
		  <MaterialNumber>${matnr}</MaterialNumber>
	   </rak:MT_SRK_InsLot_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_InsLot_Resp'];
		// console.log(resp);
		res.send({
			InspectionLotNo: resp['InspectionLotNo']['_text'],
			Plant: resp['Plant']['_text'],
			InspectionType: resp['InspectionType']['_text'],
			ObjectNumber: resp['ObjectNumber']['_text'],
			ObjectCategory: resp['ObjectCategory']['_text'],
			CreationDate: resp['CreationDate']['_text'],
			CreationTime: resp['CreationTime']['_text'],
			InsStartDate: resp['InsStartDate']['_text'],
			InsStartTime: resp['InsStartTime']['_text'],
			InsEndDate: resp['InsEndDate']['_text'],
			InsEndTime: resp['InsEndTime']['_text']
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});

//QP ResRecCU Route
app.post('/qp/resreccu',(req,res) => {
	const InspectionLotNo = req.body.InspectionLotNo;
	const InspectionCharNo = req.body.InspectionCharNo;
	const ResultAttribute = req.body.ResultAttribute;
	const InspectorName = req.body.InspectorName;
	const InspectionStartDate = req.body.InspectionStartDate;
	const InspectionEndDate = req.body.InspectionEndDate;
	const NoOfSampleUnits = req.body.NoOfSampleUnits;
	const NoOfDefects = req.body.NoOfDefects;
	const ValuesAboveTR = req.body.ValuesAboveTR;
	const ValuesBelowTR = req.body.ValuesBelowTR;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_ResRecCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_ResRecCU_Req>
		  <InspectionLotNo>${InspectionLotNo}</InspectionLotNo>
		  <InspectionCharNo>${InspectionCharNo}</InspectionCharNo>
		  <ResultAttribute>${ResultAttribute}</ResultAttribute>
		  <InspectorName>${InspectorName}</InspectorName>
		  <InspectionStartDate>${InspectionStartDate}</InspectionStartDate>
		  <InspectionEndDate>${InspectionEndDate}</InspectionEndDate>
		  <NoOfSampleUnits>${NoOfSampleUnits}</NoOfSampleUnits>
		  <NoOfDefects>${NoOfDefects}</NoOfDefects>
		  <ValuesAboveTR>${ValuesAboveTR}</ValuesAboveTR>
		  <ValuesBelowTR>${ValuesBelowTR}</ValuesBelowTR>
	   </rak:MT_SRK_ResRecCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_ResRecCU_Resp'];
		res.send({
			status: resp['Status']['_text'],
			
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//QP UseDecCU Route
app.post('/qp/usedeccu',(req,res) => {
	const InspectionLotNo = req.body.InspectionLotNo;
	const Date = req.body.Date;
	const Counter = req.body.Counter;
	const Plant = req.body.Plant;
	const SelectedSet = req.body.SelectedSet;
	const CodeGroup = req.body.CodeGroup;
	const Code = req.body.Code;
	const FollowUpAction = req.body.FollowUpAction;
	const QualityScore = req.body.QualityScore;
	const PersonResponsible = req.body.PersonResponsible;
	const Time = req.body.Time;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_UseDecCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_UseDecCU_Req>
		  <InspectionLotNo>${InspectionLotNo}</InspectionLotNo>
		  <Date>${Date}</Date>
		  <Counter>${Counter}</Counter>
		  <Plant>${Plant}</Plant>
		  <SelectedSet>${SelectedSet}</SelectedSet>
		  <CodeGroup>${CodeGroup}</CodeGroup>
		  <Code>${Code}</Code>
		  <FollowUpAction>${FollowUpAction}</FollowUpAction>
		  <QualityScore>${QualityScore}</QualityScore>
		  <PersonResponsible>${PersonResponsible}</PersonResponsible>
		  <Time>${Time}</Time>
	   </rak:MT_SRK_UseDecCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_UseDecCU_Resp'];
		res.send({
			status: resp['Status']['_text'],
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//Test wsdl
var toptions = {
	'method': 'POST',
	'port': 50000,
	'host': 'dxktpipo.kaarcloud.com',
	'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SaiRakesh&receiverParty=&receiverService=&interface=SI_Vendor1_Req&interfaceNamespace=http://training.com/sairakesh',
	'headers': {
		'Content-Type': 'application/xml',
		'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
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
	const req1 = http.request(toptions, function (res1) {
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