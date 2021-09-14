import { loadYaml } from './apriltag-jsyaml.js';
import { createPdf } from './apriltag-pdflib.js';
import { validate } from './apriltag-yup.js';
function readTextArea() {
    const input = document.getElementById('input').value;
    try {
        const data = loadYaml(input);
        let isValid = validate(data);
        if (!isValid) {
            throw new Error("validation error");
        }
        return data;
    }
    catch (e) {
        console.log("load yaml error", e);
        throw e;
    }
}
function draw() {
    const data = readTextArea();
    createPdf(data).catch(function (e) { console.log(e); });
}
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    (_a = document.getElementById('submit')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', draw);
});
