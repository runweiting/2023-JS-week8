import axios from 'axios';
import './assets/scss/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

const customerUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting';
const productUrl = `${customerUrl}/products`;

const adminUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting';
const ordersUrl = `${adminUrl}/orders`;

const config = {
  headers: {
    'Authorization':'CXLvMgR3dAaogAeoJqJ2IhKaL4P2'
  }
};

// 前台
// 取得產品列表
function getProductList(){
    axios
    .get(productUrl)
    .then((res)=>{
        console.log(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })
};
getProductList();

// 後台
// API get -> getOrderList() 取得訂單列表
function getOrderList(){
    axios
    .get(ordersUrl,config)
    .then((res)=>{
        let orderData = res.data.orders;
        renderOrder(orderData);
    })
    .catch((err)=>{
        console.log(err)
    })
};
function renderOrder(array){
    const orderItem = document.querySelector('#orderItem');
    let str = '';
    array.forEach((item,index) => {
        str += `
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${item.products[index].title}</p>
        </td>
        <td>${new Date(item.createdAt * 1000).toLocaleDateString()}</td>
        <td class="orderStatus">
          <a href="#" class="statusBtn" data-id="${item.id}">${item.paid ? '已處理' : '未處理'}</a>
        </td>
        <td>
          <input type="button" class="removeOrderItem-Btn" data-id="${item.id}" value="刪除">
        </td>`;      
    });
    orderItem.innerHTML = str;
};

getOrderList();
