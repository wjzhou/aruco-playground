import { LayoutCircle, LayoutDrillMark, LayoutTag, LayoutText } from './apriltag-jsyaml.js';
import { getDict } from './apriltag-dict.js';
function drawTag(page, id, ax, ay, sSize, dict, unit = 72) {
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
    let drawOption = {
        x: x + squareSize,
        y: y + squareSize,
        size: squareSize,
        color: PDFLib.grayscale(1),
        borderWidth: 0
    };
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
            }
            ;
            drawOption.x += squareSize;
        }
        drawOption.x = x + squareSize;
        drawOption.y += squareSize;
    }
}
function layout(page, pageNum, dict, input) {
    for (var entry of input.layout) {
        if (entry instanceof LayoutTag) {
            let id = entry.idFunc(pageNum);
            if (typeof id !== 'number') {
                throw new Error('id invalid');
            }
            if (id === -1) {
                id = pageNum;
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
            const width = Math.max(entry.size * input.unit * 0.1, 2);
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
            });
            page.drawLine({
                start: { x, y: y - halfLine },
                end: { x, y: y + halfLine },
                thickness: 2
            });
        }
        else if (entry instanceof LayoutText) {
            const text = entry.textFunc(pageNum);
            page.drawText(text, {
                x: entry.startX * input.unit,
                y: entry.startY * input.unit,
                size: entry.size * input.unit,
                rotate: PDFLib.degrees(entry.rotate),
            });
        }
    }
}
export async function createPdf(input) {
    const paperSize = [input.paperSize[0] * input.unit, input.paperSize[1] * input.unit];
    const dict = await getDict(input.dict);
    const pdfDoc = await PDFLib.PDFDocument.create();
    const unit = input.unit;
    const pages = (typeof input.pages === 'number') ? [input.pages] : input.pages.pages;
    for (let pageNum of pages) {
        const page = pdfDoc.addPage(paperSize);
        layout(page, pageNum, dict, input);
    }
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('pdf').src = pdfDataUri;
}
