import{a as s,v as x}from"./validate-5e4093e9.js";const p="https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting",S=`${p}/products`,l=`${p}/carts`,L=`${p}/orders`;let i=[],u=[],h=[],m={data:{user:""}};function g(){s.get(S).then(t=>{u=t.data.products,f(),console.log(t.data)}).catch(t=>{console.log(t)})}g();function d(){s.get(l).then(t=>{h=t.data.carts;let a=t.data.total;E(h,a),console.log(t.data)}).catch(t=>{console.log(t)})}d();function f(t="全部商品"){i=t==="全部商品"?u:u.filter(e=>e.category===t);const a=document.querySelector(".searchResult");a.textContent=i.length?`本次搜尋共${i.length}筆資料`:"查無此關鍵字資料";const c=document.querySelector(".productList");let r="";i.forEach(e=>{r+=`
        <li class="col-3 h-100 position-relative">
            <span class="bg-dark text-white fs-5 px-6 py-2 position-absolute" style="top: 12px;right: 8px;">新品</span>
            <img src="${e.images}" class="card-img-top" alt="產品圖片-${e.title}">
            <input type="button" value="加入購物車" class="bg-dark fs-5 text-white addCartItemBtn w-100 py-2" data-id="${e.id}" data-title="${e.title}">
            <div class="card-body">
            <h5 class="card-title fs-5 py-2">${e.title}</h5>
            <p class="card-text fs-5"><del>${e.origin_price}</del></p>
            <p class="card-text fs-3">${e.price}</p>
            <input type="hidden" class="quantityInput" value="1">
            </div>
        </li>`}),c.innerHTML=r,document.querySelector("#categorySearch").addEventListener("change",e=>{f(e.target.value)}),document.querySelectorAll(".addCartItemBtn").forEach(e=>{e.addEventListener("click",y=>{const $=y.target.dataset.id,q=y.target.dataset.title;I($,q)})})}function E(t,a){const c=document.querySelector("#cartItem"),r=document.querySelector("#cartFinalTotal");let o="";t.forEach(e=>{o+=`
        <tr class="text-nowrap fs-5">
        <td class="d-flex align-items-center py-5">
          <div class="overflow-hidden" style="height: 80px;">
            <img src="${e.product.images}" class="me-4" alt="產品圖片-${e.product.title}" style="width: 80px">
          </div>
          <p>${e.product.title}</p>
        </td>
        <td class="py-5">${e.product.price}</td>
        <td class="py-5">${e.quantity}</td>
        <td class="py-5">${e.product.price*e.quantity}</td>
        <td class="py-5">
          <a href="#" class="removeBtn d-flex justify-content-center align-items-center text-decoration-none" data-id="${e.id}" data-title="${e.product.title}">
            <span class="material-symbols-outlined text-dark" style="font-size: 24px;">
              close
            </span>
          </a>
        </td>
      </tr>`}),c.innerHTML=o,r.textContent=`NT$ ${a.toLocaleString("en-US")}`,document.querySelectorAll(".removeBtn").forEach(e=>{e.addEventListener("click",T)})}function I(t,a){const c={data:{productId:t,quantity:1}};s.get(l).then(r=>{const n=r.data.carts.find(e=>e.product.id===t);n?s.patch(l,{data:{id:n.id,quantity:n.quantity+1}}).then(e=>{alert(`${n.product.title}，數量 +1！`),d(),console.log(e.data)}).catch(e=>{alert("請稍後再試"),console.log(e)}):s.post(l,c).then(e=>{alert(`${a}，已成功加入購物車！`),d(),console.log(e.data.carts)}).catch(e=>{alert("請稍後再試"),console.log(e)}),console.log(r.data)}).catch(r=>{console.log(r)})}function T(t){t.preventDefault();const a=t.currentTarget.dataset.id,c=t.currentTarget.dataset.title,r=`${l}/${a}`;s.delete(r).then(o=>{alert(`商品品項：${c}，已成功刪除。`),g(),d(),console.log(o.data)}).catch(o=>{alert("請稍後再試"),console.log(o)})}const C=document.querySelector(".removeAllBtn");C.addEventListener("click",B);function B(t){t.preventDefault(),s.delete(l).then(a=>{alert("全部品項已成功刪除。"),g(),d(),console.log(a.data)}).catch(a=>{alert("請稍後再試"),console.log(a)})}const v=document.querySelector(".addOrderForm"),b=document.querySelector(".addOrderBtn"),D=document.querySelector("#customerName"),A=document.querySelector("#customerTel"),k=document.querySelector("#customerEmail"),w=document.querySelector("#customerAdd"),O=document.querySelector("#payment");b.addEventListener("click",function(){let t={};t.name=D.value.trim(),t.tel=A.value.trim(),t.email=k.value.trim(),t.address=w.value.trim(),t.payment=O.value.trim(),Object.values(t).includes("")?alert("每個欄位都為必填！"):(m.data.user=t,v.reset(),F())});const U={customerName:{presence:{message:"^必填！"}},customerTel:{presence:{message:"^必填！"}},customerEmail:{email:{email:!0,message:"^請輸入有效的電子郵件地址！"},presence:{message:"^必填！"}},customerAdd:{presence:{message:"^必填！"}},payment:{presence:{message:"^必填！"}}},j=document.querySelectorAll('input[type="text"],select[name="payment"]');j.forEach(t=>{t.addEventListener("change",function(){const a=document.querySelector(`.${t.name}`);a.innerHTML="";let c=x(v,U);console.log(c),c&&Object.keys(c).forEach(r=>{document.querySelector(`.${r}`).innerHTML=`<p class="d-flex align-items-center text-danger mb-2">
                <span class="material-symbols-outlined me-1">error</span>${c[r]}
              </p>`})})});function F(){console.log(m),s.post(L,m).then(t=>{alert("已成功送出預定資料！"),console.log(t.data)}).catch(t=>{alert("請稍後再試"),console.log(t.data)})}
