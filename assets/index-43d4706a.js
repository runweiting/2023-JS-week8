import{a as n,v as T}from"./validate-b1489a64.js";const y="https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting",C=`${y}/products`,s=`${y}/carts`,E=`${y}/orders`;let i=[],m=[],u=[],p={data:{user:""}};function I(){n.get(C).then(t=>{m=t.data.products,f(),console.log(t.data)}).catch(t=>{console.log(t)})}I();function d(){n.get(s).then(t=>{u=t.data.carts;let r=t.data.finalTotal;u.length==0?g.classList.add("d-none"):g.classList.remove("d-none"),B(u,r),console.log(t.data)}).catch(t=>{console.log(t)})}d();function f(t="全部商品"){i=t==="全部商品"?m:m.filter(e=>e.category===t);const r=document.querySelector(".searchResult");r.textContent=i.length?`本次搜尋共${i.length}筆資料`:"查無此關鍵字資料";const c=document.querySelector(".productList");let o="";i.forEach(e=>{o+=`
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
        </li>`}),c.innerHTML=o,document.querySelector("#categorySearch").addEventListener("change",e=>{f(e.target.value)}),document.querySelectorAll(".addCartItemBtn").forEach(e=>{e.addEventListener("click",h=>{const S=h.target.dataset.id,L=h.target.dataset.title;b(S,L)})})}const v=document.querySelector("#cartItem"),$=document.querySelector("#cartFinalTotal"),x=document.querySelector("#cartFinalTotalNum");function B(t,r){$.textContent="總金額：";let c="";t.forEach(a=>{c+=`
        <tr class="text-nowrap fs-5">
        <td class="d-flex align-items-center py-5">
          <div class="overflow-hidden" style="height: 80px;">
            <img src="${a.product.images}" class="me-4" alt="產品圖片-${a.product.title}" style="width: 80px">
          </div>
          <p>${a.product.title}</p>
        </td>
        <td class="py-5">${a.product.price}</td>
        <td class="py-5">${a.quantity}</td>
        <td class="py-5">${a.product.price*a.quantity}</td>
        <td class="py-5">
          <a href="#" class="removeBtn d-flex justify-content-center align-items-center text-decoration-none" data-id="${a.id}" data-title="${a.product.title}">
            <span class="material-symbols-outlined text-dark" style="font-size: 24px;">
              close
            </span>
          </a>
        </td>
      </tr>`}),v.innerHTML=c,x.textContent=`NT$ ${r.toLocaleString("en-US")}`,document.querySelectorAll(".removeBtn").forEach(a=>{a.addEventListener("click",D)})}function b(t,r){const c={data:{productId:t,quantity:1}};n.get(s).then(o=>{const l=o.data.carts.find(e=>e.product.id===t);l?n.patch(s,{data:{id:l.id,quantity:l.quantity+1}}).then(e=>{alert(`${l.product.title}，數量 +1！`),d(),console.log(e.data)}).catch(e=>{alert("請稍後再試"),console.log(e)}):n.post(s,c).then(e=>{alert(`${r}，已成功加入購物車！`),d(),console.log(e.data.carts)}).catch(e=>{alert("請稍後再試"),console.log(e)}),console.log(o.data)}).catch(o=>{console.log(o)})}function D(t){t.preventDefault();const r=t.currentTarget.dataset.id,c=t.currentTarget.dataset.title,o=`${s}/${r}`;n.delete(o).then(a=>{alert(`商品品項：${c}，已成功刪除。`),d(),console.log(a.data)}).catch(a=>{alert("請稍後再試"),console.log(a)})}const g=document.querySelector(".removeAllBtn");g.addEventListener("click",A);function A(t){t.preventDefault(),n.delete(s).then(r=>{alert("全部品項已成功刪除。"),d(),console.log(r.data)}).catch(r=>{alert("請稍後再試"),console.log(r)})}const q=document.querySelector(".addOrderForm"),N=document.querySelector(".addOrderBtn"),k=document.querySelector("#customerName"),w=document.querySelector("#customerTel"),F=document.querySelector("#customerEmail"),O=document.querySelector("#customerAdd"),M=document.querySelector("#payment");N.addEventListener("click",function(){let t={};t.name=k.value.trim(),t.tel=w.value.trim(),t.email=F.value.trim(),t.address=O.value.trim(),t.payment=M.value.trim(),Object.values(t).includes("")?alert("每個欄位都為必填！"):(p.data.user=t,q.reset(),H())});const U={customerName:{presence:{message:"^必填！"}},customerTel:{presence:{message:"^必填！"}},customerEmail:{email:{email:!0,message:"^請輸入有效的電子郵件地址！"},presence:{message:"^必填！"}},customerAdd:{presence:{message:"^必填！"}},payment:{presence:{message:"^必填！"}}},j=document.querySelectorAll('input[type="text"],select[name="payment"]');j.forEach(t=>{t.addEventListener("change",function(){const r=document.querySelector(`.${t.name}`);r.innerHTML="";let c=T(q,U);console.log(c),c&&Object.keys(c).forEach(o=>{document.querySelector(`.${o}`).innerHTML=`<p class="d-flex align-items-center text-danger mb-2">
                <span class="material-symbols-outlined me-1">error</span>${c[o]}
              </p>`})})});function H(){console.log(p),n.post(E,p).then(t=>{alert("已成功送出預定資料！"),P(),console.log(t.data)}).catch(t=>{alert("請稍後再試"),console.log(t.data)})}function P(){v.innerHTML="",$.textContent="購物車目前是空的。",x.textContent="NT$ 0"}
