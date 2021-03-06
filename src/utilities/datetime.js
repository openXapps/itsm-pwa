/**
 * Helper function to return date and time in use local
 * @param {date} dIn Date to process
 * @param {boolean} showTime Show or hide time
 * @returns Date object in user local
 */
export const userDate = (dIn, showTime) => {
  // console.log('userDate: dIn....', dIn);
  let dOut = '';
  const d = dIn ? new Date(dIn) : new Date();
  // console.log('userDate: d......', d);
  dOut = d.getFullYear() + '-';
  dOut += String(d.getMonth() + 1).padStart(2, 0) + '-';
  dOut += String(d.getDate()).padStart(2, 0);
  if (showTime) {
    dOut += ' ' + String(d.getHours()).padStart(2, 0) + ':';
    dOut += String(d.getMinutes()).padStart(2, 0);
  }
  // console.log('userDate: dOut...', dOut);
  return dOut;
};