
import { InputData, loadYaml  } from './apriltag-jsyaml.js';
import { createPdf } from './apriltag-pdflib.js';
import { validate } from './apriltag-yup.js';



function readTextArea(): InputData {
  const input = (document.getElementById('input') as HTMLTextAreaElement).value;
  try {
    const data = loadYaml(input);
    let isValid = validate(data);
    if (!isValid) {
      throw new Error("validation error");
    }
    return data;
  } catch (e) {
    console.log("load yaml error", e);
    throw e;
  }
}

function draw() {
  const data = readTextArea();
  createPdf(data).catch(function (e) { console.log(e) });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('submit')?.addEventListener('click', draw);
});
