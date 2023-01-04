import { atom } from "recoil";
export const itemState = atom({
  key: "itemState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const categoryState = atom({
  key: "categoryState",
  default: [
    {
      type: "food",
      subCategory: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Online",
        "Restaurant",
        "Tiffin",
        "others",
      ],
    },
    {
      type: "Transport",
      subCategory: ["bus", "train", "Auto", "taxi", "others"],
    },
    {
      type: "Shopping",
      subCategory: [
        "Apparels",
        "shoes",
        "gadgets",
        "Home essentials",
        "others",
      ],
    },
    {
      type: "Self Development",
      subCategory: ["Books", "Courses", "gadgets", "Others"],
    },
    {
      type: "Entairtainment",
      subCategory: ["Movies", "Subscriptions", "Shows", "Others"],
    },
    {
      type: "others",
      subCategory: [],
    },
  ],
});
