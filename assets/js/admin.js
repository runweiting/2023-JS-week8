import axios from 'axios';

/* 共用 ------- */
const config = {
    headers: {
        'Authorization':'CXLvMgR3dAaogAeoJqJ2IhKaL4P2'
    }
};

/* 後台 url ------- */
const adminUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting';
const ordersUrl = `${adminUrl}/orders`;

let orderData = [];

// 1：GET 取得訂單列表 getOrderList()
function getOrderList(){
    axios
    .get(ordersUrl,config)
    // -> 
    .then((res)=>{
        orderData = res.data.orders;
        renderOrder(orderData);
    })
    .catch((err)=>{
        console.log(err)
    })
};
// 渲染訂單列表 -> renderOrder() 
function renderOrder(array){
    const orderItem = document.querySelector('#orderItem');
    if (!orderItem) {
        console.error('找不到 #orderItem 元素');
        return;
    };
    let str = '';
    array.forEach((item) => {
        str += `
        <tr class="text-nowrap">
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
            <p>${item.products[0].title}</p>
        </td>
        <td>${new Date(item.createdAt * 1000).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${item.id}">${item.paid ? '已處理' : '未處理'}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${item.id}" value="刪除">
        </td>
        </tr>`;      
    });
    orderItem.innerHTML = str;
    // -> 在每次渲染後，重新設定按鈕監聽
    const statusBtn = document.querySelectorAll('.statusBtn');
    statusBtn.forEach((item)=>{
        item.addEventListener('click',changeOrderStatus);
    });
    const removeBtn = document.querySelectorAll('.removeBtn');
    removeBtn.forEach((item)=>{
        item.addEventListener('click',removeOrderItem);
    });
    const removeAllBtn = document.querySelectorAll('.btn-warning');
    removeAllBtn.forEach((item)=>{
        item.addEventListener('click',removeAllorders);
    })
};

// 2. PUT 修改訂單狀態 changeOrderStatus()
function changeOrderStatus(e){
    e.preventDefault();
    const orderId = e.target.dataset.id;
    axios
    .put(ordersUrl,
        {
            "data": {
                "id": orderId,
                "paid": true
            }
        },
    config)
    // ->
    .then((putRes)=>{
        console.log(putRes.data);
        alert(`訂單編號：${orderId} 已處理`);
        renderOrderStatus(orderId,putRes.data.paid);
        getOrderList();
    })
    .catch((putErr)=>{
        console.log(putErr)
    })
};
// 渲染訂單狀態 -> renderOrderStatus()
function renderOrderStatus(orderId,paid){
    const statusBtn = document.querySelector(`.statusBtn[data-id="${orderId}"]`);
    statusBtn.textContent = paid ? "已處理" : "未處理"
};

// 3. DELETE 刪除特定訂單 -> removeOrderItem() 
function removeOrderItem(e){
    const deleteOrderUrl = `${ordersUrl}/${e.target.dataset.id}`;
    axios
    .delete(deleteOrderUrl,config)
    .then((delRes)=>{
        alert(`訂單編號：${e.target.dataset.id} 已刪除`);
        getOrderList();
        console.log(delRes.data);
    })
    .catch((delErr)=>{
        alert('請稍後再試');
        console.log(delErr)
    })
};

// 4. DELETE 刪除全部訂單 -> removeAllorders()
function removeAllorders(e){
    axios
    .delete(ordersUrl,config)
    .then((delRes)=>{
        console.log(delRes.data);
        alert('成功刪除全部訂單');
        getOrderList();
    })
    .catch((delErr)=>{
        console.log(delErr)
    })
};

getOrderList();
