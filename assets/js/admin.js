import axios from 'axios';
import Swal from 'sweetalert2';

/* config ------- */
const config = {
    headers: {
        'Authorization':'CXLvMgR3dAaogAeoJqJ2IhKaL4P2'
    }
};

/* 後台 url ------- */
const adminUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting';
const ordersUrl = `${adminUrl}/orders`;

let orderData = [];

// 1-1. GET 取得訂單列表 -> getOrderList() -> renderOrder()
function getOrderList(){
    axios
    .get(ordersUrl,config)
    // -> 
    .then((res)=>{
        orderData = res.data.orders;
        renderOrder(orderData);
        render3cChartAll(orderData);
        render3cChartItem(orderData);
    })
};
getOrderList();

// 1-2. 渲染訂單列表 -> renderOrder() -> renderChartAll();
function renderOrder(array){
    const orderItem = document.querySelector('#orderItem');
    if (!orderItem) {
        console.error('找不到 #orderItem 元素');
        return;
    };
    let str = '';
    array.forEach((item) => {
        str += `
        <tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
            <p>${item.products.map(product => product.title).join('<br>')}</p>
        </td>
        <td>
            <p>${item.products.map(product => product.quantity).join('<br>')}</p>
        </td>
        <td>${item.quantity}</td>
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
};

// 1.3 監聽 statusBtn、removeBtn、removeAllBtn
// (看錄影後修正：綁大範圍 orderTable)
const orderTable = document.querySelector('.orderTable');
orderTable.addEventListener('click',(e)=>{
    e.preventDefault();
    let targetClass = e.target.getAttribute('class');
    const orderId = e.target.getAttribute('data-id');
    if (targetClass == "statusBtn"){
        changeOrderStatus(orderId);
    };
    if (targetClass == "removeBtn"){
        removeOrderItem(orderId);
    };
    const removeAllBtn = e.target.dataset.btn;
    if (removeAllBtn == "removeAllBtn"){
        removeAllorders();
    };
});

// 2-1. PUT 修改訂單狀態 -> changeOrderStatus()
function changeOrderStatus(orderId){
    axios
    .put(ordersUrl,
        {
            "data": {
                "id": orderId,
                "paid": true
            }
        },
    config)
    .then((putRes)=>{
        Swal.fire({
            title: `訂單編號：${orderId}`,
            text: "已處理成功。",
            icon: "success"
          });
        renderOrderStatus(orderId,putRes.data.paid);
        getOrderList();
    });
};

// 2-2. 渲染訂單狀態 -> renderOrderStatus()
function renderOrderStatus(orderId,paid){
    const statusBtn = document.querySelector(`.statusBtn[data-id="${orderId}"]`);
    statusBtn.textContent = paid ? "已處理" : "未處理"
};

// 3. DELETE 刪除特定訂單 -> removeOrderItem() 
function removeOrderItem(orderId){
    const deleteOrderUrl = `${ordersUrl}/${orderId}`;
    axios
    .delete(deleteOrderUrl,config)
    .then((delRes)=>{
        Swal.fire({
            title: `訂單編號：${orderId}`,
            text: "已成功刪除。",
            icon: "success"
          });
        getOrderList();
    })
};

// 4. DELETE 刪除全部訂單 -> removeAllorders()
function removeAllorders(){
    axios
    .delete(ordersUrl,config)
    .then((delRes)=>{
        Swal.fire({
            title: "全部品項",
            text: "已成功刪除。",
            icon: "success"
          });
        getOrderList();
    })
};

// 5-1. 渲染 C3 -> renderChartAll()
// LV1：全產品類別營收比重
// filterData = [{category: "床架",..},..]
// categoryNum = {'床架': 1,..}
// newData = [['床架',1],..]
// Object.entries(categoryNum) = Array(3)['床架',1]...
// [key, value] 解構賦值語法，將 Object.entries 返回的 [key, value] 陣列中的元素分別賦值給 key 和 value
// => [key, value] 表示箭頭函式返回一個包含 key 和 value 的新陣列
// array.sort(compareFunction) compareFunction 接受參數 a、b 根據返回值排序
// compareFunction(a, b) 返回負數，則 a 將在 b 之前 -> 升序
// compareFunction(a, b) 返回正數，則 a 將在 b 之後 -> 降序
function render3cChartAll(){
    let categoryIncome = {};
    orderData.forEach((order)=>{
        order.products.forEach((product)=>{
            if (categoryIncome[product.category] == undefined){
                categoryIncome[product.category] = product.price * product.quantity
            } else {
                categoryIncome[product.category] += product.price * product.quantity
            }
        });
    });
    // 將物件轉換成陣列，並按照數量降序排序
    // map [key, value] 解構賦值 key 和 value
    // sort 將 value 降序
    let chartAllData = 
    Object.entries(categoryIncome)
    .map(([key, value]) => [key, value])
    .sort((a,b)=> b[1] - a[1]);
    // map + 三元運算式將 color 依據 value 排序
    let colorOrders = 
    chartAllData.map(([key, value], index) =>
    index === 0 ? '#5434A7' : index === 1 ? '#9D7FEA' : '#DACBFF');
    let chartAll = c3.generate({
        bindto: '.chartAll',
        data: {
            columns: chartAllData,
            type: "pie",
        },
        pie: {
            title: "全產品類別營收比重",
        },
        color: {
            pattern: colorOrders,
        },
        size: {
            height: 350,
        }
    });
};

// 5-2. 渲染 C3 -> renderChartItem()
// LV2：全品項營收比重：前三名、其他(4~8名)
// arr.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
// reduce((acc, [, value]) => acc + value, 0);
// acc: accumulator 累加器
// [, value]: 解構賦值，取得陣列中的第二個元素 value，而第一個元素則被忽略
// 0: initialValue
function render3cChartItem(){
    let categoryIncome = {};
    orderData.forEach((order)=>{
        order.products.forEach((product)=>{
            const { title, quantity } = product;
            console.log(product);
            if (categoryIncome[title] === undefined){
                categoryIncome[title] = product.price
            } else {
                categoryIncome[title] += product.price
            }
        })
    });
    // 將物件轉換成陣列，並按照數量降序排序
    let chartItemData = 
    Object.entries(categoryIncome)
    .map(([key, value]) => [key, value])
    .sort((a,b)=> b[1] - a[1]);
    // 選取前三名
    let top3 = chartItemData.slice(0,3);
    // 計算「其它」的總數
    let otherTotal = chartItemData.slice(3).reduce((acc,[, value])=> acc + value, 0);
    if (otherTotal > 0){
        top3.push(["其他",otherTotal]);
    };
    let colorOrders = top3.map(([key, value], index) => 
        index === 0 ? '#301E5F' : index === 1 ? '#5434A7' : index === 2 ? '#9D7FEA' : '#DACBFF'
    );
    let chartItem = c3.generate({
        bindto: '.chartItem',
        data: {
            columns: top3,
            type: "pie",
        },
        pie: {
            title: "全品項營收比重",
        },
        color: {
            pattern: colorOrders,
        },
        size: {
            height: 350,
        }
    })
};

