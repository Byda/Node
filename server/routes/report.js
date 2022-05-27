var express = require("express")
var Node = require("../models/node")
var reportRoute = express.Router()

reportRoute.get('/',(req, res)=>{
    workbook.write('./report.xlsx', res);
})
function CreateExcel(){
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet 1');
  
    let column = 1;
    header.forEach((item)=>{
      worksheet.cell(1, column++).string(item)
    })
    
    let row = 2;
    data.forEach((data)=>{
      let colIndex = 1
      Object.keys(data).forEach((colName)=>{
        worksheet.cell(row, colIndex++).string(data[colName])
      })
      row++;
    })
    workbook.write('report.xlsx');
  }

  CreateExcel();
module.exports = reportRoute
    

