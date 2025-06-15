import moment from 'moment';

/**
 * Filter items by month index (0-based). Returns the same sectioned list shape.
 * @param {Array<{date:string,data:Array}>} items
 * @param {number} month
 */
export function filterByMonth(items,month){
  return items.filter(section=>
    moment(section.date,'D MMMM Y').month()===month
  );
}

/**
 * Filter items by category
 * @param {Array<{date:string,data:Array<{expenseCategory:string}>}>} items
 * @param {string} category
 */
export function filterByCategory(items,category){
  return items.map(section=>({
    date:section.date,
    data:section.data.filter(it=>it.expenseCategory===category)
  })).filter(section=>section.data.length>0);
}
