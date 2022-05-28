var express = require("express")
var Node = require("../models/node")
var path = require("path")
var mime = require("mime")
var reportRoute = express.Router()
var excel = require("excel4node")
var alarm = require("../models/alarm")

async function CreateExcel(OS_Type){
   
  var workbook = new excel.Workbook();
  var worksheet = workbook.addWorksheet('Sheet 1');
  var alarms = await alarm.find({OS_Type: OS_Type}).lean()
  header = ["OS_Type",
  "OS_Location",
  "OS_Number",
  "indicator",
  "value",
  "unit",
  "severity",
  "content",
  "LOWLOW",
  "HIGHHIGH",
  "LOW",
  "HIGH",
  "DEADBAND",
  "startTime",
  "duration",
  "ACK",
  "ACKUser",
  "ACKTime"]

  col = 1;
  header.forEach(item => {
    worksheet.cell(2, col++).string(item)
  });

  let startRow = 3;
  for (let i = 0; i < alarms.length; i++) {
    worksheet.cell(startRow + i, 1).number(alarms[i].OS_Type);
    worksheet.cell(startRow + i, 2).string(alarms[i].OS_Location);
    worksheet.cell(startRow + i, 3).string(alarms[i].OS_Number);
    worksheet.cell(startRow + i, 4).string(alarms[i].indicator);
    worksheet.cell(startRow + i, 5).number(alarms[i].value);
    worksheet.cell(startRow + i, 6).string(alarms[i].unit);
    worksheet.cell(startRow + i, 7).number(alarms[i].severity);
    worksheet.cell(startRow + i, 8).string(alarms[i].content);
    worksheet.cell(startRow + i, 9).number(alarms[i].LOWLOW);
    worksheet.cell(startRow + i, 10).number(alarms[i].HIGHHIGH);
    worksheet.cell(startRow + i, 11).number(alarms[i].LOW);
    worksheet.cell(startRow + i, 12).number(alarms[i].HIGH);
    worksheet.cell(startRow + i, 13).number(alarms[i].DEADBAND);
    worksheet.cell(startRow + i, 14).string((new Date(alarms[i].startTime)).toString());
    worksheet.cell(startRow + i, 15).number((alarms[i].duration));
    worksheet.cell(startRow + i, 17).string(alarms[i].ACKUser);
    if(alarms[i].ACKTime)
    worksheet.cell(startRow + i, 18).string((new Date(alarms[i].ACKTime)).toString());
    else worksheet.cell(startRow + i, 18).number(alarms[i].ACKTime);
}
  workbook.write('report.xlsx');

  }

  reportRoute.get('/:type', async (req, res, next)=>{
    var OS_Type = parseInt(req.params.type)
    CreateExcel(OS_Type)
    const file = path.join(__dirname, '../report.xlsx');
    console.log(file)
    const fileName = path.basename(file)
    // const mimeType = mime.getType(file)
    res.setHeader("Content-Disposition", "attachment;filename=" + fileName) 
    res.setHeader("Content-Type", "xlsx")
    setTimeout(()=>res.download(file), 2000)
  })
  

module.exports = reportRoute
    

