import { combineReducers } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarReducer";
import detailsModalReducer from "./detailsModalReducer";
import authReducer from "./authReducer";
import linkReducer from "./linkReducer";
import itemReducer from "./itemReducer";
import CartReducer from "./CartReducer";
import orderReducer from "./orderReducer";
import analyticReducer from "./analyticReducer"
import notificationReducer from "./notificationReducer"
import documentReducer from "./documentReducer"

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  detailsModal: detailsModalReducer,
  auth: authReducer,
  link: linkReducer,
  items: itemReducer,
  cart: CartReducer,
  order: orderReducer,
  analytic: analyticReducer,
  notification: notificationReducer,
  document: documentReducer
  
  
});

export default rootReducer;
