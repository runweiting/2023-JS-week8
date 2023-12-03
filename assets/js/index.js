/* 共用 ------- */
const config = {
    headers: {
        'Authorization':'CXLvMgR3dAaogAeoJqJ2IhKaL4P2'
    }
};

/* 前台 url ------- */
const customerUrl = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting';
const productUrl = `${customerUrl}/products`;
const cartUrl = `${customerUrl}/carts`;

let filterProductData = [];
let productData = [];
let cartData = [];

// 1-1. GET 取得產品列表 -> getProductList() 
function getProductList(){
    axios
    .get(productUrl)
    .then((res)=>{
        productData = res.data.products;
        renderProduct();
        console.log(res.data)
    })
    .catch((err)=>{
        console.log(err)
    })
};
getProductList();
// 2-1. GET 取得購物車列表 -> getCartList()
function getCartList(){
    axios
    .get(cartUrl)
    .then((res)=>{
        cartData = res.data.carts;
        let cartFinalTotal = res.data.total;
        renderCartList(cartData,cartFinalTotal);
        console.log(res.data)
    })
    // ->
    .catch((err)=>{
        console.log(err)
    })
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
            <input type="button" value="加入購物車" class="bg-dark fs-5 text-white addCartItemBtn w-100 py-2" data-id="${item.id}" data-title="${item.title}">
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
function renderCartList(array,total){
    const cartItem = document.querySelector('#cartItem');
    const cartFinalTotal = document.querySelector('#cartFinalTotal');
    let str = '';
    array.forEach((item)=>{
        str += `
        <tr class="text-nowrap fs-5">
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
    cartFinalTotal.textContent = `NT$ ${total.toLocaleString('en-US')}`;
    // -> 在每次渲染後，重新設定按鈕監聽
    const removeBtn = document.querySelectorAll('.removeBtn');
    removeBtn.forEach((item)=>{
        item.addEventListener('click',removeCartItem);
    });
};

// 3. PATCH/POST 加入購物車 -> addCartItem()
// note: 先 GET 檢查是否有相同商品，有 PATCH +1，無 POST 1
function addCartItem(targetID,targetItem){
    const postData = {
        "data": {
          "productId": targetID,
          "quantity": 1
        }
      };
    // 先檢查是否有相同商品
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
                alert(`${existingCartItem.product.title}，數量 +1！`);
                getCartList();
                console.log(patchRes.data);
            })
            .catch((patchErr)=>{
                alert('請稍後再試');
                console.log(patchErr)
            })
        } else {
            // 無 POST 1
            axios
            .post(cartUrl,postData)
            .then((postRes)=>{
                //console.log(postRes.data.carts.product.title);
                alert(`${targetItem}，已成功加入購物車！`);
                getCartList();
                console.log(postRes.data.carts)
            })
            .catch((postErr)=>{
                alert('請稍後再試');
                console.log(postErr)
            })
        };
        console.log(res.data);
    })
    .catch((err)=>{
        console.log(err)
    })
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
        alert(`商品品項：${targetTitle}，已成功刪除。`);
        getProductList();
        getCartList();
        console.log(delRes.data);
    })
    .catch((delErr)=>{
        alert('請稍後再試');
        console.log(delErr);
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
        alert('全部品項已成功刪除。');
        getProductList();
        getCartList();
        console.log(delRes.data);
    })
    .catch((delErr)=>{
        alert('請稍後再試');
        console.log(delErr);
    })
};



