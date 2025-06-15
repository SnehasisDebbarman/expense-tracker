import moment from 'moment';

/**
 * Calculate total expenses for each month from the raw items list.
 * @param {Array<{dateNow:string,data:Array<{amount:string}>}>} items
 * @returns {Array<{x:string,y:number}>} - array of objects suitable for charts
 */
export function getMonthlyTotals(items){
  const totals = {};
  items.forEach(section=>{
    const month = moment(section.date, 'D MMMM Y').format('MMM');
    const sum = section.data.reduce((acc,cur)=>acc+parseFloat(cur.amount||0),0);
    totals[month] = (totals[month]||0)+sum;
  });
  return Object.keys(totals).map(month=>({x:month,y:totals[month]}));
}

/**
 * Get weekly totals for the last few weeks.
 * @param {Array<{dateNow:string,data:Array<{amount:string}>}>} items
 * @returns {Array<{x:string,y:number}>}
 */
export function getWeeklyTotals(items){
  const totals = {};
  items.forEach(section=>{
    const week = moment(section.date, 'D MMMM Y').week();
    const sum = section.data.reduce((acc,cur)=>acc+parseFloat(cur.amount||0),0);
    totals[week] = (totals[week]||0)+sum;
  });
  const sortedWeeks = Object.keys(totals).sort((a,b)=>a-b);
  return sortedWeeks.map(week=>({x:`W${week}`,y:totals[week]}));
}
