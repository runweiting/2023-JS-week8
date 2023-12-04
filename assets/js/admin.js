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

// 1-1. GET 取得訂單列表 -> getOrderList() -> renderOrder()
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
    });
    renderChartAll(orderData);
    renderChartItem(orderData);
};

// 2-1. PUT 修改訂單狀態 -> changeOrderStatus()
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

// 2-2. 渲染訂單狀態 -> renderOrderStatus()
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
function renderChartAll(){
    let categoryNum = {};
    orderData.forEach((order)=>{
        order.products.forEach((product)=>{
            if (categoryNum[product.category] == undefined){
                categoryNum[product.category] = 1
            } else {
                categoryNum[product.category]++
            }
        });
    });
    // 將物件轉換成陣列，並按照數量降序排序
    // map [key, value] 解構賦值 key 和 value
    // sort 將 value 降序
    let chartAllData = 
    Object.entries(categoryNum)
    .map(([key, value]) => [key, value])
    .sort((a,b)=> b[1] - a[1]);
    console.log(chartAllData);
    // 最大的 value 指定為最深的顏色
    const maxQuantityItem = Math.max(...Object.values(categoryNum));
    // map + 三元運算式將 color 依據 value 排序
    let colorOrders = 
    chartAllData.map(([key, value]) =>
    value === maxQuantityItem ? '#5434A7' : value > Math.floor(maxQuantityItem / 2)? '#9D7FEA' : '#DACBFF');
    console.log(colorOrders); 
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
function renderChartItem(){
    let categoryNum = {};
    orderData.forEach((order)=>{
        order.products.forEach((product)=>{
            const { title, quantity } = product;
            console.log(product);
            console.log(product.quantity);
            if (categoryNum[title] === undefined){
                categoryNum[title] = quantity
            } else {
                categoryNum[title] += quantity
            }
        })
    });
    console.log(categoryNum);
    // 將物件轉換成陣列，並按照數量降序排序
    let chartItemData = 
    Object.entries(categoryNum)
    .map(([key, value]) => [key, value])
    .sort((a,b)=> b[1] - a[1]);
    console.log(chartItemData);
    // 選取前三名
    let top3 = chartItemData.slice(0,3);
    // 計算「其它」的總數
    let otherTotal = chartItemData.slice(3).reduce((acc,[, value])=> acc + value, 0);
    if (otherTotal > 0){
        top3.push(["其他",otherTotal]);
    };
    console.log(top3);
    let colorOrders = top3.map(([key, value], index) => 
        index === 0 ? '#301E5F' : index === 1 ? '#5434A7' : index === 2 ? '#9D7FEA' : '#DACBFF'
    );
    console.log(colorOrders);
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

