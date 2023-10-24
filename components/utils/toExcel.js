import ExcelJS from 'exceljs';
import { saveAs } from 'filesaver.js-npm';
import { zformatDate } from '~/plugins/config';

async function toExcel( filename, data, total){

        const workbook = new ExcelJS.Workbook();
        workbook.created = new Date();

        const worksheet  = workbook.addWorksheet(filename);

        await worksheet.addRow({});
        worksheet.getRow(1).values = [`${filename}`]
        worksheet.getRow(2).values = [`Generado el ${zformatDate(new Date(), true)}`]

        worksheet.getRow(1).font = {
            name: 'Arial Black',
            bold: true,
        };

        worksheet.getRow(4).values = data.encabezados
        worksheet.getRow(4).font = {
            name: 'Arial Black',
            bold: true,
        };
        worksheet.getRow(4).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFDCDCDC'
            }
        } 

        worksheet.columns = data.columnas;
        await worksheet.addRows(data.rows);

        await data.columnasNumber.map( async (item)=> {
            worksheet.getColumn(item).numFmt = '$#,##0.00;[Red]-$#,##0.00';
        })

        await data.rowsBold? data.rowsBold.map( async (row)=> {
            worksheet.getRow(row+4).font = {
                bold: true,
            };
        }): null;

        if(total == true){
            let lastRow = parseInt(data.rows.length) + 4;
            worksheet.getRow(lastRow).font = {
                bold: true,
            };
            worksheet.getRow(lastRow).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFDCDCDC'
                }
            } 
        }

        workbook.xlsx.writeBuffer().then(function (data) {
            var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, filename+".xlsx");
        });
};

export default toExcel;