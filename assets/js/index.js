import axios from 'axios';
import validate from 'validate.js';
import Swal from 'sweetalert2';

/* 前台 url ------- */
const customerUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting';
const productUrl = `${customerUrl}/products`;
const cartUrl = `${customerUrl}/carts`;
const orderUrl = `${customerUrl}/orders`;

let filterProductData = [];
let productData = [];
let cartData = [];
let orderData = { "data": { "user": '' } };

// 1-1. GET 取得產品列表 -> getProductList() -> renderProduct()
function getProductList(){
    axios
    .get(productUrl)
    .then((res)=>{
        productData = res.data.products;
        renderProduct();
    });
};
getProductList();

// 2-1. GET 取得購物車列表 -> getCartList() -> renderCartList()
function getCartList(){
    axios
    .get(cartUrl)
    .then((res)=>{
        cartData = res.data.carts;
        let cartFinalTotalNum = res.data.finalTotal;
        if (cartData.length == 0){
            removeAllBtn.classList.add('d-none')
        } else {
            removeAllBtn.classList.remove('d-none')
        };
        renderCartList(cartData,cartFinalTotalNum);
    });
};
getCartList();

// 1-2. 渲染、篩選產品列表 -> renderProductList()
// 裡面有監聽：categorySearch、addCartItemBtn
function renderProduct(category = "全部商品"){
    filterProductData = category === "全部商品" ?
    productData : productData.filter(item =>
        item.category === category);
    const searchResult = document.querySelector('.searchResult');
    searchResult.textContent = filterProductData.length? `本次搜尋共${filterProductData.length}筆資料` : `查無此關鍵字資料`;
    const productList = document.querySelector('.productList');
    let str = '';
    filterProductData.forEach((item)=>{
        str += `
        <li class="col-3 h-100 position-relative">
            <span class="bg-dark text-white fs-5 px-6 py-2 position-absolute" style="top: 12px;right: 8px;">新品</span>
            <img src="${item.images}" class="card-img-top" alt="產品圖片-${item.title}">
            <input type="button" value="加入購物車" class="btn btn-dark rounded-0 fs-5 text-white addCartItemBtn w-100 py-2" data-id="${item.id}" data-title="${item.title}">
            <div class="card-body">
            <h5 class="card-title fs-5 py-2">${item.title}</h5>
            <p class="card-text fs-5"><del>${item.origin_price}</del></p>
            <p class="card-text fs-3">${item.price}</p>
            <input type="hidden" class="quantityInput" value="1">
            </div>
        </li>`;
    });
    productList.innerHTML = str;
    // -> 在每次渲染後，重新設定按鈕監聽
    const categorySearch = document.querySelector('#categorySearch');
    categorySearch.addEventListener('change',(e)=>{
        renderProduct(e.target.value);
    });
    const addCartItemBtn = document.querySelectorAll('.addCartItemBtn');
    addCartItemBtn.forEach((item)=>{
        item.addEventListener('click',(e)=>{
            const targetID = e.target.dataset.id;
            const targetItem = e.target.dataset.title;
            addCartItem(targetID,targetItem);
        })
    });
};

// 2-2. 渲染購物車列表 -> renderCartList()
// 裡面有監聽：removeBtn
const cartItem = document.querySelector('#cartItem');
const cartFinalTotal = document.querySelector('#cartFinalTotal');
const cartFinalTotalNum = document.querySelector('#cartFinalTotalNum');
function renderCartList(array,total){
    cartFinalTotal.textContent = "總金額：";
    let str = '';
    array.forEach((item)=>{
        str += `
        <tr class="fs-5">
        <td class="d-flex align-items-center py-5">
          <div class="overflow-hidden" style="height: 80px;">
            <img src="${item.product.images}" class="me-4" alt="產品圖片-${item.product.title}" style="width: 80px">
          </div>
          <p>${item.product.title}</p>
        </td>
        <td class="py-5">${item.product.price}</td>
        <td class="py-5">${item.quantity}</td>
        <td class="py-5">${(item.product.price)*(item.quantity)}</td>
        <td class="py-5">
          <a href="#" class="removeBtn d-flex justify-content-center align-items-center text-decoration-none" data-id="${item.id}" data-title="${item.product.title}">
            <span class="material-symbols-outlined text-dark" style="font-size: 24px;">
              close
            </span>
          </a>
        </td>
      </tr>`;
    });
    cartItem.innerHTML = str;
    // 使用 Intl.NumberFormat 來格式化數字，再 formatter.format(number) 將數字格式化為字串
    cartFinalTotalNum.textContent = `NT$ ${total.toLocaleString('en-US')}`;
    // -> 在每次渲染後，重新設定按鈕監聽
    const removeBtn = document.querySelectorAll('.removeBtn');
    removeBtn.forEach((item)=>{
        item.addEventListener('click',removeCartItem);
    });
};

// 3. PATCH/POST 加入購物車 -> addCartItem()
// 先 GET 檢查是否有相同商品，有 PATCH +1，無 POST 1
function addCartItem(targetID,targetItem){
    const postData = {
        "data": {
          "productId": targetID,
          "quantity": 1
        }
      };
    // 先 GET 檢查是否有相同商品
    axios
    .get(cartUrl)
    .then((res)=>{
        let cartListData = res.data.carts;
        const existingCartItem = cartListData.find(item=> item.product.id === targetID);
        if (existingCartItem){
            // 有 PATCH +1
            axios
            .patch(cartUrl,{
                "data": {
                  "id": existingCartItem.id,
                  "quantity": existingCartItem.quantity + 1
                }
              })
            .then((patchRes)=>{
                Swal.fire({
                    title: `${existingCartItem.product.title}`,
                    text: "數量 +1！",
                    icon: "success"
                  });
                getCartList();
            })
        } else {
            // 無 POST 1
            axios
            .post(cartUrl,postData)
            .then((postRes)=>{
                Swal.fire({
                    title: `${targetItem}`,
                    text: "已成功加入購物車！",
                    icon: "success"
                  });
                getCartList();
            });
        };
    });
};

// 4. DELETE 刪除購物車特定商品 -> removeCartItem()
function removeCartItem(e){
    e.preventDefault();
    const targetID = e.currentTarget.dataset.id;
    const targetTitle = e.currentTarget.dataset.title;
    const deleteCartItemUrl = `${cartUrl}/${targetID}`;
    axios
    .delete(deleteCartItemUrl)
    .then((delRes)=>{
        Swal.fire({
            title: `${targetTitle}`,
            text: "已成功刪除。",
            icon: "success"
          });
        getCartList();
    })
};

// 5. DELETE 刪除購物車 -> removeCartAll()
const removeAllBtn = document.querySelector('.removeAllBtn');
removeAllBtn.addEventListener('click',removeCartAll);
function removeCartAll(e){
    e.preventDefault();
    axios
    .delete(cartUrl)
    .then((delRes)=>{
        Swal.fire({
            title: "全部品項",
            text: "已成功刪除。",
            icon: "success"
          });
        getCartList();
    })
};

// 6. POST 送出訂單 -> addOrder()
// 先新增資料 orderData
const addOrderForm = document.querySelector('.addOrderForm');
const addOrderBtn = document.querySelector('.addOrderBtn');
const customerName = document.querySelector('#customerName');
const customerTel = document.querySelector('#customerTel');
const customerEmail = document.querySelector('#customerEmail');
const customerAdd = document.querySelector('#customerAdd');
const payment = document.querySelector('#payment');
addOrderBtn.addEventListener('click',function(){
    let user = {};
    user["name"] = customerName.value.trim();
    user["tel"] = customerTel.value.trim();
    user["email"] = customerEmail.value.trim();
    user["address"] = customerAdd.value.trim();
    user["payment"] = payment.value.trim();
    // if 判斷：是否每個欄位都有填寫？
    // includes() 判斷陣列是否包含特定的元素，回傳 true 或 false
    if (Object.values(user).includes('')){
        Swal.fire("每個欄位都為必填！");
    } else {
        orderData["data"]["user"] = user;
        addOrderForm.reset();
        addOrder();
    };
});
// 再validate.js 表單驗證
const constraints = {
    customerName: {
        presence: {
            message: "^必填！"
        }
    },
    customerTel: {
        presence: {
            message: "^必填！"
        }
    },
    customerEmail: {
        email: {
            email: true,
            message: "^請輸入有效的電子郵件地址！"
        },
        presence: {
            message: "^必填！"
        }
    },
    customerAdd: {
        presence: {
            message: "^必填！"
        }
    },
    payment: {
        presence: {
            message: "^必填！"
        }
    }
};
const inputs = document.querySelectorAll('input[type="text"],select[name="payment"]');
inputs.forEach((item)=>{
    item.addEventListener('change',function(){
        // 1. 清空錯誤提示
        const errorsMessage = document.querySelector(`.${item.name}`);
        errorsMessage.innerHTML = ``;
        // 2. 儲存回傳訊息
        let errors = validate(addOrderForm,constraints);
        // 3. 利用 key 作為 ('.${key}') 顯示 errors value
        if (errors){
            Object.keys(errors).forEach(key =>{
                document.querySelector(`.${key}`).innerHTML = `<p class="d-flex align-items-center text-danger mb-2">
                <span class="material-symbols-outlined me-1">error</span>${errors[key]}
              </p>`;
            });
        };  
    });
});
// addOrder()
function addOrder(){
    axios
    .post(orderUrl,orderData)
    .then((postRes)=>{
        Swal.fire("已成功送出預定資料！");
        updateCart();
    })
};
// 清除購物車顯示資料
function updateCart(){
    cartItem.innerHTML = ``;
    cartFinalTotal.textContent = "購物車目前是空的。";
    cartFinalTotalNum.textContent = 'NT$ 0';
};
