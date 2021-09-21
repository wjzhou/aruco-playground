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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXByaWx0YWctcGxheWdyb3VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcmlsdGFnLXBsYXlncm91bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFhLFFBQVEsRUFBRyxNQUFNLHNCQUFzQixDQUFDO0FBQzVELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFJN0MsU0FBUyxZQUFZO0lBQ25CLE1BQU0sS0FBSyxHQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUF5QixDQUFDLEtBQUssQ0FBQztJQUM5RSxJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsQ0FBQztLQUNUO0FBQ0gsQ0FBQztBQUVELFNBQVMsSUFBSTtJQUNYLE1BQU0sSUFBSSxHQUFHLFlBQVksRUFBRSxDQUFDO0lBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7O0lBQzVDLE1BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JFLENBQUMsQ0FBQyxDQUFDIn0=