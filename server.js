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
//QP BAPI InsLot Route
app.post('/qp/bapi/inslot',(req,res) => {
	const matnr = req.body.matnr;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_InsLot&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_INSLOT>
		  <!--You may enter the following 2 items in any order-->
		  <MATNR>${matnr}</MATNR>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<MANDT>?</MANDT>
				<!--Optional:-->
				<MATNR>?</MATNR>
				<!--Optional:-->
				<PLANT>?</PLANT>
				<!--Optional:-->
				<INSTYPE>?</INSTYPE>
				<!--Optional:-->
				<OBJNO>?</OBJNO>
				<!--Optional:-->
				<OBJCAT>?</OBJCAT>
				<!--Optional:-->
				<DATCREATE>?</DATCREATE>
				<!--Optional:-->
				<TIMCREATE>?</TIMCREATE>
				<!--Optional:-->
				<STARTDAT>?</STARTDAT>
				<!--Optional:-->
				<STARTTIM>?</STARTTIM>
				<!--Optional:-->
				<ENDDAT>?</ENDDAT>
				<!--Optional:-->
				<ENDTIM>?</ENDTIM>
				<!--Optional:-->
				<INSLOTNO>?</INSLOTNO>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_INSLOT>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_INSLOT.Response']['ITAB']['item'];
			res.send(resp);
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
//EP Routes
//EP IM Route
app.post('/ep/im',(req,res) => {
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_IM&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_IM>
		  <!--You may enter the following 2 items in any order-->
		  <!--Optional:-->
		  <OBJNR>?</OBJNR>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<OBJNR>?</OBJNR>
				<!--Optional:-->
				<TITLE>?</TITLE>
				<!--Optional:-->
				<USER_ID_CR>?</USER_ID_CR>
				<!--Optional:-->
				<ORG_ID>?</ORG_ID>
				<!--Optional:-->
				<PLANT_ID>?</PLANT_ID>
				<!--Optional:-->
				<LOC_ROOT_KEY_REF>?</LOC_ROOT_KEY_REF>
				<!--Optional:-->
				<START_TIMESTAMP>?</START_TIMESTAMP>
				<!--Optional:-->
				<END_TIMESTAMP>?</END_TIMESTAMP>
				<!--Optional:-->
				<REP_TIMESTAMP>?</REP_TIMESTAMP>
				<!--Optional:-->
				<LOSS_OF_PROD_TS>?</LOSS_OF_PROD_TS>
				<!--Optional:-->
				<STREET_HOUSE_NUM>?</STREET_HOUSE_NUM>
				<!--Optional:-->
				<POSTAL_CODE>?</POSTAL_CODE>
				<!--Optional:-->
				<CITY>?</CITY>
				<!--Optional:-->
				<COUNTRY>?</COUNTRY>
				<!--Optional:-->
				<REGION>?</REGION>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_IM>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_IM.Response']['ITAB']['item'];
			res.send(resp);
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
	
});
//EP RA Route
app.post('/ep/ra',(req,res) => {
	let objnr = req.body.objnr;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_RA&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_RISKA>
		  <!--You may enter the following 2 items in any order-->
		  <OBJNR>${objnr}</OBJNR>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<MANDT>?</MANDT>
				<!--Optional:-->
				<OBJNR>?</OBJNR>
				<!--Optional:-->
				<EPTYPE>?</EPTYPE>
				<!--Optional:-->
				<EPID>?</EPID>
				<!--Optional:-->
				<SEVERE>?</SEVERE>
				<!--Optional:-->
				<PROBLTY>?</PROBLTY>
				<!--Optional:-->
				<ACID>?</ACID>
				<!--Optional:-->
				<ACCAT>?</ACCAT>
				<!--Optional:-->
				<ACTYPE>?</ACTYPE>
				<!--Optional:-->
				<ACPRIO>?</ACPRIO>
				<!--Optional:-->
				<DATCONTR>?</DATCONTR>
				<!--Optional:-->
				<TIMECONTR>?</TIMECONTR>
				<!--Optional:-->
				<RESPPCONTR>?</RESPPCONTR>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_RISKA>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_RISKA.Response']['ITAB']['item'];
			if(resp == null)
			{
				res.send({"null" : "null"});
			}
			res.send(resp);
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
	
});
//EP IMCU Route
app.post('/ep/imcu',(req,res) => {
	const ObjectNumber = req.body.ObjectNumber;
	const Region = req.body.Region;
	const IncidentTitle = req.body.IncidentTitle;
	const ObjectCreatedBy = req.body.ObjectCreatedBy;
	const OrganizationalID = req.body.OrganizationalID;
	const PlantID = req.body.PlantID;
	const Location = req.body.Location;
	const StartDate = req.body.StartDate;
	const EndDate = req.body.EndDate;
	const DateOfIncidentReporting = req.body.DateOfIncidentReporting;
	const LossOfProduction = req.body.LossOfProduction;
	const StreetOrHouseNum = req.body.StreetOrHouseNum;
	const PostalCode = req.body.PostalCode;
	const City = req.body.City;
	const Country = req.body.Country;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_IMCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_IMCU_Req>
		  <ObjectNumber>${ObjectNumber}</ObjectNumber>
		  <Region>${Region}</Region>
		  <IncidentTitle>${IncidentTitle}</IncidentTitle>
		  <ObjectCreatedBy>${ObjectCreatedBy}</ObjectCreatedBy>
		  <OrganizationalID>${OrganizationalID}</OrganizationalID>
		  <PlantID>${PlantID}</PlantID>
		  <Location>${Location}</Location>
		  <StartDate>${StartDate}</StartDate>
		  <EndDate>${EndDate}</EndDate>
		  <DateOfIncidentReporting>${DateOfIncidentReporting}</DateOfIncidentReporting>
		  <LossOfProduction>${LossOfProduction}</LossOfProduction>
		  <StreetOrHouseNum>${StreetOrHouseNum}</StreetOrHouseNum>
		  <PostalCode>${PostalCode}</PostalCode>
		  <City>${City}</City>
		  <Country>${Country}</Country>
	   </rak:MT_SRK_IMCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_IMCU_Resp'];
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
//Employee routes
//Employee leave route
app.post('/emp/leave',(req,res) => {
	let pernr = req.body.pernr;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_Leave&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_LEAVE>
		  <!--You may enter the following 2 items in any order-->
		  <PERNR>${pernr}</PERNR>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<REFNR>?</REFNR>
				<!--Optional:-->
				<PERNR>?</PERNR>
				<!--Optional:-->
				<BEGDA>?</BEGDA>
				<!--Optional:-->
				<ENDDA>?</ENDDA>
				<!--Optional:-->
				<BEGUZ>?</BEGUZ>
				<!--Optional:-->
				<ENDUZ>?</ENDUZ>
				<!--Optional:-->
				<AWART>?</AWART>
				<!--Optional:-->
				<ABWTG>?</ABWTG>
				<!--Optional:-->
				<STDAZ>?</STDAZ>
				<!--Optional:-->
				<PLANS>?</PLANS>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_LEAVE>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_LEAVE.Response']['ITAB']['item'];
			if(resp == null)
			{
				res.send({"null" : "null"});
			}
			res.send(resp);
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
	
});
//Employee Leave CU
app.post('/emp/leavecu',(req,res) => {
	const PersonnelNumber = req.body.PersonnelNumber;
	const EndDate = req.body.EndDate;
	const StartDate = req.body.StartDate;
	const StartTime = req.body.StartTime;
	const EndTime = req.body.EndTime;
	const AttendanceOrAbsenceType = req.body.AttendanceOrAbsenceType;
	const AttendanceAndAbsenceDays = req.body.AttendanceAndAbsenceDays;
	const AbsenceHours = req.body.AbsenceHours;
	const ReferenceNumber = req.body.ReferenceNumber;
	const Position = req.body.Position;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_LeaveCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_LeaveCU_Req>
		  <PersonnelNumber>${PersonnelNumber}</PersonnelNumber>
		  <EndDate>${EndDate}</EndDate>
		  <StartDate>${StartDate}</StartDate>
		  <StartTime>${StartTime}</StartTime>
		  <EndTime>${EndTime}</EndTime>
		  <AttendanceOrAbsenceType>${AttendanceOrAbsenceType}</AttendanceOrAbsenceType>
		  <AttendanceAndAbsenceDays>${AttendanceAndAbsenceDays}</AttendanceAndAbsenceDays>
		  <AbsenceHours>${AbsenceHours}</AbsenceHours>
		  <ReferenceNumber>${ReferenceNumber}</ReferenceNumber>
		  <Position>${Position}</Position>
	   </rak:MT_SRK_LeaveCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_LeaveCU_Resp'];
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
//Employee Pay
app.post('/emp/pay',(req,res) => {
	const PersonnelNumber = req.body.PersonnelNumber;
	const Month = req.body.Month;
	const Year = req.body.Year;
	// console.log(matnr);
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_Pay_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_Pay_Req>
		  <PersonnelNumber>${PersonnelNumber}</PersonnelNumber>
		  <Month>${Month}</Month>
		  <Year>${Year}</Year>
	   </rak:MT_SRK_Pay_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_Pay_Resp'];
		// console.log(resp);
		res.send({
			PersonnelNumber: resp['PersonnelNumber']['_text'],
			Month: resp['Month']['_text'],
			Year: resp['Year']['_text'],
			PayScaleType: resp['PayScaleType']['_text'],
			PayScaleArea: resp['PayScaleArea']['_text'],
			PayScaleGroup: resp['PayScaleGroup']['_text'],
			PayScaleLevel: resp['PayScaleLevel']['_text'],
			DateofNextIncrease: resp['DateofNextIncrease']['_text'],
			WorkingHoursPerPayrollPeriod: resp['WorkingHoursPerPayrollPeriod']['_text'],
			AnnualSalary: resp['AnnualSalary']['_text'],
			WageType: resp['WageType']['_text']
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
//Employee Profile CU
app.post('/emp/profilecu',(req,res) => {
	const PersonnelNumber = req.body.PersonnelNumber;
	const PersonnelArea = req.body.PersonnelArea;
	const EmployeeGroup = req.body.EmployeeGroup;
	const OrganizationalKey = req.body.OrganizationalKey;
	const BusinessArea = req.body.BusinessArea;
	const PayrollArea = req.body.PayrollArea;
	const OrganizationalUnit = req.body.OrganizationalUnit;
	const Position = req.body.Position;
	const SupervisorArea = req.body.SupervisorArea;
	const EmployeeName = req.body.EmployeeName;
	const CompanyCode = req.body.CompanyCode;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_ProfileCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_ProfileCU_Req>
		  <PersonnelNumber>${PersonnelNumber}</PersonnelNumber>
		  <PersonnelArea>${PersonnelArea}</PersonnelArea>
		  <EmployeeGroup>${EmployeeGroup}</EmployeeGroup>
		  <OrganizationalKey>${OrganizationalKey}</OrganizationalKey>
		  <BusinessArea>${BusinessArea}</BusinessArea>
		  <PayrollArea>${PayrollArea}</PayrollArea>
		  <OrganizationalUnit>${OrganizationalUnit}</OrganizationalUnit>
		  <Position>${Position}</Position>
		  <SupervisorArea>${SupervisorArea}</SupervisorArea>
		  <EmployeeName>${EmployeeName}</EmployeeName>
		  <CompanyCode>${CompanyCode}</CompanyCode>
	   </rak:MT_SRK_ProfileCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_ProfileCU_Resp'];
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
//Employee Profile
app.post('/emp/profile',(req,res) => {
	const PersonnelNumber = req.body.PersonnelNumber;
	// console.log(matnr);
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_Profile_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_Profile_Req>
		  <PersonnelNumber>${PersonnelNumber}</PersonnelNumber>
	   </rak:MT_SRK_Profile_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_Profile_Resp'];
		// console.log(resp);
		res.send({
			PersonnelNumber: resp['PersonnelNumber']['_text'],
			PersonnelArea: resp['PersonnelArea']['_text'],
			EmployeeGroup: resp['EmployeeGroup']['_text'],
			OrganizationalKey: resp['OrganizationalKey']['_text'],
			BusinessArea: resp['BusinessArea']['_text'],
			PayrollArea: resp['PayrollArea']['_text'],
			OrganizationalUnit: resp['OrganizationalUnit']['_text'],
			Position: resp['Position']['_text'],
			SupervisorArea: resp['SupervisorArea']['_text'],
			EmployeeName: resp['EmployeeName']['_text'],
			CompanyCode: resp['CompanyCode']['_text']
		});
	});

	res1.on("error", function (error) {
		console.error(error);
	});
});

req1.write(postData);

req1.end();
	
});
// Maintenance portal
//Notification CU
app.post('/main/notificationcu',(req,res) => {
	const NotificationNo = req.body.NotificationNo;
	const PriorityType = req.body.PriorityType;
	const Priority = req.body.Priority;
	const TimeofNotification = req.body.TimeofNotification;
	const DateofNotification = req.body.DateofNotification;
	const NameofPersonReportingNotification = req.body.NameofPersonReportingNotification;
	const OrderNumber = req.body.OrderNumber;
	const MaterialNo = req.body.MaterialNo;
	const DateforNotificationCompletion = req.body.DateforNotificationCompletion;
	const InspectionLotNumber = req.body.InspectionLotNumber;
	const BatchNumber = req.body.BatchNumber;
	const PurchasingOrganization = req.body.PurchasingOrganization;
	const NameofPersonReponsibleforSystem = req.body.NameofPersonReponsibleforSystem;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_Main_Notif_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_Main_Notif_Req>
		  <NotificationNo>${NotificationNo}</NotificationNo>
		  <PriorityType>${PriorityType}</PriorityType>
		  <Priority>${Priority}</Priority>
		  <TimeofNotification>${TimeofNotification}</TimeofNotification>
		  <DateofNotification>${DateofNotification}</DateofNotification>
		  <NameofPersonReportingNotification>${NameofPersonReportingNotification}</NameofPersonReportingNotification>
		  <OrderNumber>${OrderNumber}</OrderNumber>
		  <MaterialNo>${MaterialNo}</MaterialNo>
		  <DateforNotificationCompletion>${DateforNotificationCompletion}</DateforNotificationCompletion>
		  <InspectionLotNumber>${InspectionLotNumber}</InspectionLotNumber>
		  <BatchNumber>${BatchNumber}</BatchNumber>
		  <PurchasingOrganization>${PurchasingOrganization}</PurchasingOrganization>
		  <NameofPersonReponsibleforSystem>${NameofPersonReponsibleforSystem}</NameofPersonReponsibleforSystem>
	   </rak:MT_SRK_Main_Notif_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_Main_Notif_Resp'];
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
//Work CU
app.post('/main/workcu',(req,res) => {
	const OrderNumber = req.body.OrderNumber;
	const PriorityType = req.body.PriorityType;
	const Priority = req.body.Priority;
	const EquipmentNumber = req.body.EquipmentNumber;
	const ObjectID = req.body.ObjectID;
	const NameofPersonReponsibleforSystem = req.body.NameofPersonReponsibleforSystem;
	const PlannedDowntimeinHours = req.body.PlannedDowntimeinHours;
	const DateFromWhichTheSystemIsAvailable = req.body.DateFromWhichTheSystemIsAvailable;
	const MaintenancePlan = req.body.MaintenancePlan;
	const MaintenanceItem = req.body.MaintenanceItem;
	const NotificationNo = req.body.NotificationNo;
	
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_SYNC_Main_WorkCU_Req&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rak="http://rakeshsaperp.com">
	<soapenv:Header/>
	<soapenv:Body>
	   <rak:MT_SRK_Main_WorkCU_Req>
		  <OrderNumber>${OrderNumber}</OrderNumber>
		  <PriorityType>${PriorityType}</PriorityType>
		  <Priority>${Priority}</Priority>
		  <EquipmentNumber>${EquipmentNumber}</EquipmentNumber>
		  <ObjectID>${ObjectID}</ObjectID>
		  <NameofPersonReponsibleforSystem>${NameofPersonReponsibleforSystem}</NameofPersonReponsibleforSystem>
		  <PlannedDowntimeinHours>${PlannedDowntimeinHours}</PlannedDowntimeinHours>
		  <DateFromWhichTheSystemIsAvailable>${DateFromWhichTheSystemIsAvailable}</DateFromWhichTheSystemIsAvailable>
		  <MaintenancePlan>${MaintenancePlan}</MaintenancePlan>
		  <MaintenanceItem>${MaintenanceItem}</MaintenanceItem>
		  <NotificationNo>${NotificationNo}</NotificationNo>
	   </rak:MT_SRK_Main_WorkCU_Req>
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
		const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:MT_SRK_Main_WorkCU_Resp'];
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
//Notification
app.post('/main/notification',(req,res) => {
	
	let ANING = req.body.ANING;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_Main_Not&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_NOTIF>
		  <!--You may enter the following 2 items in any order-->
		  <ANING>${ANING}</ANING>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<QMNUM>?</QMNUM>
				<!--Optional:-->
				<ARTPR>?</ARTPR>
				<!--Optional:-->
				<PRIOK>?</PRIOK>
				<!--Optional:-->
				<MZEIT>?</MZEIT>
				<!--Optional:-->
				<QMDAT>?</QMDAT>
				<!--Optional:-->
				<QMNAM>?</QMNAM>
				<!--Optional:-->
				<AUFNR>?</AUFNR>
				<!--Optional:-->
				<MATNR>?</MATNR>
				<!--Optional:-->
				<QMDAB>?</QMDAB>
				<!--Optional:-->
				<PRUEFLOS>?</PRUEFLOS>
				<!--Optional:-->
				<CHARG>?</CHARG>
				<!--Optional:-->
				<EKORG>?</EKORG>
				<!--Optional:-->
				<ANING>?</ANING>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_NOTIF>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_NOTIF.Response']['ITAB']['item'];
			if(resp == null)
			{
				res.send({"null" : "null"});
			}
			res.send(resp);
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
	
});
//Work
app.post('/main/work',(req,res) => {
	let ANING = req.body.ANING;
	var options = {
		'method': 'POST',
		'port': 50000,
		'host': 'dxktpipo.kaarcloud.com',
		'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_Main_Work&interfaceNamespace=http://rakeshsaperp.com',
		'headers': {
			'Content-Type': 'application/xml',
			'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
		},
		'maxRedirects': 20
	};
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_WORK>
		  <!--You may enter the following 2 items in any order-->
		  <ANING>${ANING}</ANING>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<QMNUM>?</QMNUM>
				<!--Optional:-->
				<AUFNR>?</AUFNR>
				<!--Optional:-->
				<ARTPR>?</ARTPR>
				<!--Optional:-->
				<PRIOK>?</PRIOK>
				<!--Optional:-->
				<EQUNR>?</EQUNR>
				<!--Optional:-->
				<GEWRK>?</GEWRK>
				<!--Optional:-->
				<ANING>?</ANING>
				<!--Optional:-->
				<GAUZT>?</GAUZT>
				<!--Optional:-->
				<ANLVD>?</ANLVD>
				<!--Optional:-->
				<WARPL>?</WARPL>
				<!--Optional:-->
				<WAPOS>?</WAPOS>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_WORK>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_WORK.Response']['ITAB']['item'];
			if(resp == null)
			{
				res.send({"null" : "null"});
			}
			res.send(resp);
		});

		res1.on("error", function (error) {
			console.error(error);
		});
	});

	req1.write(postData);

	req1.end();
	
});
//Test wsdl
var options = {
	'method': 'POST',
	'port': 50000,
	'host': 'dxktpipo.kaarcloud.com',
	'path': 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_SampleData&receiverParty=&receiverService=&interface=SI_SRK_OUT_IM&interfaceNamespace=http://rakeshsaperp.com',
	'headers': {
		'Content-Type': 'application/xml',
		'Authorization': 'Basic UE9VU0VSOmthYXIyMDIw',
	},
	'maxRedirects': 20
};


app.post('/login', (req, res) => {
	// const vendorID = req.body.vendId;
	const postData =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZBAPI_SRK_IM>
		  <!--You may enter the following 2 items in any order-->
		  <!--Optional:-->
		  <OBJNR>?</OBJNR>
		  <ITAB>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<OBJNR>?</OBJNR>
				<!--Optional:-->
				<TITLE>?</TITLE>
				<!--Optional:-->
				<USER_ID_CR>?</USER_ID_CR>
				<!--Optional:-->
				<ORG_ID>?</ORG_ID>
				<!--Optional:-->
				<PLANT_ID>?</PLANT_ID>
				<!--Optional:-->
				<LOC_ROOT_KEY_REF>?</LOC_ROOT_KEY_REF>
				<!--Optional:-->
				<START_TIMESTAMP>?</START_TIMESTAMP>
				<!--Optional:-->
				<END_TIMESTAMP>?</END_TIMESTAMP>
				<!--Optional:-->
				<REP_TIMESTAMP>?</REP_TIMESTAMP>
				<!--Optional:-->
				<LOSS_OF_PROD_TS>?</LOSS_OF_PROD_TS>
				<!--Optional:-->
				<STREET_HOUSE_NUM>?</STREET_HOUSE_NUM>
				<!--Optional:-->
				<POSTAL_CODE>?</POSTAL_CODE>
				<!--Optional:-->
				<CITY>?</CITY>
				<!--Optional:-->
				<COUNTRY>?</COUNTRY>
				<!--Optional:-->
				<REGION>?</REGION>
			 </item>
		  </ITAB>
	   </urn:ZBAPI_SRK_IM>
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
			const resp = JSON.parse(data)['SOAP:Envelope']['SOAP:Body']['ns0:ZBAPI_SRK_IM.Response']['ITAB']['item'];
			console.log(resp);
			res.send(resp);
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