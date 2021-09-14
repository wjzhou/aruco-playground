// the yup es module isn't working at this moment
//@ts-ignore
// import yup from 'https://www.unpkg.com/yup@0.32.9/es/index.js';
// const schema = yup.object({
//   unit: yup.number().default(72),
//   paperSize: yup.array().of(yup.number()).length(2),
// });
// export function validate(o: any): Promise<boolean> {
//   return schema.isValid(o);
// }
export function validate(o) {
    return true;
}
