export function expenseForDate(items, date) {
  //   const date = "7 January 2023";
  const expensesForDate = array
    .find((item) => item.date === date)
    .data.reduce((acc, curr) => {
      return acc + parseFloat(curr.amount);
    }, 0);
}
export function expenseForMonth(items, month) {
  //   const month = "January";
  const expensesForMonth = array
    .filter((item) => item.date.includes(month))
    .reduce((acc, curr) => {
      return (
        acc +
        curr.data.reduce((subAcc, subCurr) => {
          return subAcc + parseFloat(subCurr.amount);
        }, 0)
      );
    }, 0);
}
export function expenseForWeek(items, week) {
  // const week = 3;
  const expensesForWeek = array
    .filter((item) => moment(item.date, "D MMMM Y").week() === week)
    .reduce((acc, curr) => {
      return (
        acc +
        curr.data.reduce((subAcc, subCurr) => {
          return subAcc + parseFloat(subCurr.amount);
        }, 0)
      );
    }, 0);
}
export function expenseBetweenDates(items, startDate, endDate) {
  //     const startDate = moment('2022-01-01', 'YYYY-MM-DD');
  // const endDate = moment('2022-01-31', 'YYYY-MM-DD');
  const expensesForRange = array
    .filter((item) => {
      const date = moment(item.date, "D MMMM Y");
      return date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate);
    })
    .reduce((acc, curr) => {
      return (
        acc +
        curr.data.reduce((subAcc, subCurr) => {
          return subAcc + parseFloat(subCurr.amount);
        }, 0)
      );
    }, 0);
}
