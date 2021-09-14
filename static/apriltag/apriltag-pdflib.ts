//import * as dicts from './apriltag-dictionary.js';
import type * as PDFLibType from 'pdf-lib';
import { PDFPage, PDFPageDrawSquareOptions, PDFDocument, grayscale } from 'pdf-lib';
import { InputData, LayoutCircle, LayoutDrillMark, LayoutTag, LayoutText, PageData, PageRange } from './apriltag-jsyaml.js';
import { getDict, Dict } from './apriltag-dict.js';

declare const PDFLib: typeof PDFLibType
function drawTag(page: PDFPage, id: number, ax: number, ay: number, sSize: number, dict: Dict, unit: number = 72) {
    const size = dict.size;
    const x = ax * unit, y = ay * unit;
    const squareSize = sSize * unit / (size + 2);
    // opencv's coordinate is different than aruco's. so in order to match the definition of aruco, need to use index 2
    const index = dict.isApriltag ? 2 : 0;
    const data = dict.data[id][index];

    page.drawSquare({
        x: x,
        y: y,
        size: (size + 2) * squareSize,
        color: PDFLib.grayscale(0)
    });
    let drawOption: PDFPageDrawSquareOptions = {
        x: x + squareSize,
        y: y + squareSize,
        size: squareSize,
        color: PDFLib.grayscale(1),
        borderWidth: 0
    }

    // the data is from top row down, while we are drawing from bottom row up
    for (let i = size - 1; i >= 0; --i) {
        for (let j = 0; j < size; ++j) {
            const position = size * i + j;
            const row = position >> 3;
            let rowData = data[row];
            // last byte is right aligned that needs to be left aligned
            if (row === data.length - 1) {
                rowData <<= ((row + 1) * 8 - size * size);
            }
            const mask = 1 << (7 - (position & 7));
            const bit = rowData & mask;
            if (bit) {
                page.drawSquare({ ...drawOption });
            };
            drawOption.x! += squareSize;
        }
        drawOption.x = x + squareSize;
        drawOption.y! += squareSize;
    }
}

function layout(page: PDFPage, pageData: PageData, dict: Dict, input: InputData) {
    for (var entry of input.layout) {
        if (entry instanceof LayoutTag) {
            let id = entry.idFunc(pageData);
            if (typeof id !== 'number') {
                throw new Error('id invalid');
            }
            drawTag(page, id, entry.startX, entry.startY, entry.size, dict, input.unit);
        }
        else if (entry instanceof LayoutCircle) {
            page.drawCircle({
                x: entry.startX * input.unit,
                y: entry.startY * input.unit,
                size: entry.size * input.unit
            });
        }
        else if (entry instanceof LayoutDrillMark) {
            const x = entry.startX * input.unit;
            const y = entry.startY * input.unit;
            const halfLine = entry.size * input.unit * 0.85;
            const width = Math.max(entry.size * input.unit * 0.1, 2)
            page.drawCircle({
                x,
                y,
                size: entry.size * input.unit,
                borderWidth: 2,
                opacity: 0,
            });

            page.drawLine({
                start: { x: x - halfLine, y },
                end: { x: x + halfLine, y },
                thickness: 2
            })

            page.drawLine({
                start: { x, y: y - halfLine },
                end: { x, y: y + halfLine },
                thickness: 2
            })

        }
        else if (entry instanceof LayoutText) {
            const text = entry.textFunc(pageData);
            page.drawText(text, {
                x: entry.startX * input.unit,
                y: entry.startY * input.unit,
                size: entry.size * input.unit,
                rotate: PDFLib.degrees(entry.rotate),
            });
        }
    }
}

export async function createPdf(input: InputData) {
    const paperSize = [input.paperSize[0] * input.unit, input.paperSize[1] * input.unit] as [number, number];
    const dict = await getDict(input.dict);

    const pdfDoc: PDFDocument = await PDFLib.PDFDocument.create();
    const unit = input.unit;
    let pages: PageData[]
    if (typeof input.pages === 'number') {
        pages = [{ id: input.pages }];
    } else if (input.pages instanceof PageRange) {
        pages = input.pages.pages
    } else if (Array.isArray(input.pages)){
        pages = input.pages
    } else {
        throw new Error("page must be a number, a !range or an array of objects");
    }
    for (let pageData of pages) {
        const page = pdfDoc.addPage(paperSize);
        layout(page, pageData, dict, input);
    }
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    (document.getElementById('pdf') as HTMLEmbedElement).src = pdfDataUri;
}