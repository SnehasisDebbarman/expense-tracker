export function monthWiseData(data, month = new Date().getMonth()) {
  const items = data.filter((item) => {
    return new Date(item.date).getMonth() === month;
  });
  return items;
}
