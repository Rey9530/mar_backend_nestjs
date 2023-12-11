export function convert_date(fecha) {
  var dateParts = fecha.split('/');
  if (dateParts.length != 3) {
    return new Date();
  }
  return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
}
