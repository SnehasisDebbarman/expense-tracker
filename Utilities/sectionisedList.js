export function sectionsedList(list) {
  const sectionizedArray = list.reduce((acc, curr) => {
    const date = curr.dateNow;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      id: curr.id,
      expenseName: curr.expenseName,
      expenseCategory: curr.expenseCategory,
      subCategory: curr.subCategory,
      amount: curr.amount,
      dateNow: curr.dateNow,
      currentTime: curr.currentTime,
    });
    return acc;
  }, {});

  const result = Object.entries(sectionizedArray).map(([date, data]) => ({
    date,
    data,
  }));
  result.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  return result;
}
