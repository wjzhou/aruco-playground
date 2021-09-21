import { LayoutCircle, LayoutDrillMark, LayoutTag, LayoutText, PageRange } from './apriltag-jsyaml.js';
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
function layout(page, pageData, dict, input, font) {
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
            const text = entry.textFunc(pageData);
            const size = entry.size * input.unit;
            const width = font.widthOfTextAtSize(text, size);
            const height = font.heightAtSize(size, { descender: false });
            page.drawText(text, {
                x: entry.startX * input.unit - width / 2,
                y: entry.startY * input.unit - height / 2,
                size,
                rotate: PDFLib.degrees(entry.rotate),
            });
            // page.drawRectangle({
            //     x: entry.startX * input.unit - width/2,
            //     y: entry.startY * input.unit - height/2,
            //     width,
            //     height,
            //     borderColor: PDFLib.rgb(1, 0, 0),
            //     borderWidth: 1,
            // })
        }
    }
}
export async function createPdf(input) {
    const paperSize = [input.paperSize[0] * input.unit, input.paperSize[1] * input.unit];
    const dict = await getDict(input.dict);
    const pdfDoc = await PDFLib.PDFDocument.create();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const unit = input.unit;
    let pages;
    if (typeof input.pages === 'number') {
        pages = [{ id: input.pages }];
    }
    else if (input.pages instanceof PageRange) {
        pages = input.pages.pages;
    }
    else if (Array.isArray(input.pages)) {
        pages = input.pages;
    }
    else {
        throw new Error("page must be a number, a !range or an array of objects");
    }
    for (let pageData of pages) {
        const page = pdfDoc.addPage(paperSize);
        layout(page, pageData, dict, input, font);
    }
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('pdf').src = pdfDataUri;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXByaWx0YWctcGRmbGliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXByaWx0YWctcGRmbGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBYSxZQUFZLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQVksU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUgsT0FBTyxFQUFFLE9BQU8sRUFBUSxNQUFNLG9CQUFvQixDQUFDO0FBR25ELFNBQVMsT0FBTyxDQUFDLElBQWEsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxLQUFhLEVBQUUsSUFBVSxFQUFFLE9BQWUsRUFBRTtJQUM1RyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDbkMsTUFBTSxVQUFVLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QyxtSEFBbUg7SUFDbkgsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVsQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ1osQ0FBQyxFQUFFLENBQUM7UUFDSixDQUFDLEVBQUUsQ0FBQztRQUNKLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVO1FBQzdCLEtBQUssRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQUM7SUFDSCxJQUFJLFVBQVUsR0FBNkI7UUFDdkMsQ0FBQyxFQUFFLENBQUMsR0FB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