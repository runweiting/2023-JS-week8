import{a as n,S as l,v as C}from"./sweetalert2.all-d374ba7b.js";const f="https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting",E=`${f}/products`,o=`${f}/carts`,I=`${f}/orders`;let u=[],p=[],m=[],h={data:{user:""}};function B(){n.get(E).then(t=>{p=t.data.products,v()})}B();function i(){n.get(o).then(t=>{m=t.data.carts;let a=t.data.finalTotal;m.length==0?y.classList.add("d-none"):y.classList.remove("d-none"),b(m,a)})}i();function v(t="全部商品"){u=t==="全部商品"?p:p.filter(e=>e.category===t);const a=document.querySelector(".searchResult");a.textContent=u.length?`本次搜尋共${u.length}筆資料`:"查無此關鍵字資料";const s=document.querySelector(".productList");let c="";u.forEach(e=>{c+=`
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
        </li>`}),s.innerHTML=c,document.querySelector("#categorySearch").addEventListener("change",e=>{v(e.target.value)}),document.querySelectorAll(".addCartItemBtn").forEach(e=>{e.addEventListener("click",g=>{const L=g.target.dataset.id,T=g.target.dataset.title;D(L,T)})})}const $=document.querySelector("#cartItem"),x=document.querySelector("#cartFinalTotal"),S=document.querySelector("#cartFinalTotalNum");function b(t,a){x.textContent="總金額：";let s="";t.forEach(r=>{s+=`
        <tr class="fs-5">
        <td class="d-flex align-items-center py-5">
          <div class="overflow-hidden" style="height: 80px;">
            <img src="${r.product.images}" class="me-4" alt="產品圖片-${r.product.title}" style="width: 80px">
          </div>
          <p>${r.product.title}</p>
        </td>
        <td class="py-5">${r.product.price}</td>
        <td class="py-5">${r.quantity}</td>
        <td class="py-5">${r.product.price*r.quantity}</td>
        <td class="py-5">
          <a href="#" class="removeBtn d-flex justify-content-center align-items-center text-decoration-none" data-id="${r.id}" data-title="${r.product.title}">
            <span class="material-symbols-outlined text-dark" style="font-size: 24px;">
              close
            </span>
          </a>
        </td>
      </tr>`}),$.innerHTML=s,S.textContent=`NT$ ${a.toLocaleString("en-US")}`,document.querySelectorAll(".removeBtn").forEach(r=>{r.addEventListener("click",A)})}function D(t,a){const s={data:{productId:t,quantity:1}};n.get(o).then(c=>{const d=c.data.carts.find(e=>e.product.id===t);d?n.patch(o,{data:{id:d.id,quantity:d.quantity+1}}).then(e=>{l.fire({title:`${d.product.title}`,text:"數量 +1！",icon:"success"}),i()}):n.post(o,s).then(e=>{l.fire({title:`${a}`,text:"已成功加入購物車！",icon:"success"}),i()})})}function A(t){t.preventDefault();const a=t.currentTarget.dataset.id,s=t.currentTarget.dataset.title,c=`${o}/${a}`;n.delete(c).then(r=>{l.fire({title:`${s}`,text:"已成功刪除。",icon:"success"}),i()})}const y=document.querySelector(".removeAllBtn");y.addEventListener("click",N);function N(t){t.preventDefault(),n.delete(o).then(a=>{l.fire({title:"全部品項",text:"已成功刪除。",icon:"success"}),i()})}const q=document.querySelector(".addOrderForm"),k=document.querySelector(".addOrderBtn"),w=document.querySelector("#customerName"),F=document.querySelector("#customerTel"),O=document.querySelector("#customerEmail"),R=document.querySelector("#customerAdd"),M=document.querySelector("#payment");k.addEventListener("click",function(){let t={};t.name=w.value.trim(),t.tel=F.value.trim(),t.email=O.value.trim(),t.address=R.value.trim(),t.payment=M.value.trim(),Object.values(t).includes("")?l.fire("每個欄位都為必填！"):(h.data.user=t,q.reset(),H())});const U={customerName:{presence:{message:"^必填！"}},customerTel:{presence:{message:"^必填！"}},customerEmail:{email:{email:!0,message:"^請輸入有效的電子郵件地址！"},presence:{message:"^必填！"}},customerAdd:{presence:{message:"^必填！"}},payment:{presence:{message:"^必填！"}}},j=document.querySelectorAll('input[type="text"],select[name="payment"]');j.forEach(t=>{t.addEventListener("change",function(){const a=document.querySelector(`.${t.name}`);a.innerHTML="";let s=C(q,U);s&&Object.keys(s).forEach(c=>{document.querySelector(`.${c}`).innerHTML=`<p class="d-flex align-items-center text-danger mb-2">
                <span class="material-symbols-outlined me-1">error</span>${s[c]}
              </p>`})})});function H(){n.post(I,h).then(t=>{l.fire("已成功送出預定資料！"),P()})}function P(){$.innerHTML="",x.textContent="購物車目前是空的。",S.textContent="NT$ 0"}
