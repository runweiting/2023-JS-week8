import"./bootstrap.min-0cc95113.js";const h="https://livejs-api.hexschool.io/api/livejs/v1/customer/runweiting",v=`${h}/products`,s=`${h}/carts`;let d=[],i=[],g=[];function u(){axios.get(v).then(e=>{i=e.data.products,y(),console.log(e.data)}).catch(e=>{console.log(e)})}u();function n(){axios.get(s).then(e=>{g=e.data.carts;let a=e.data.total;x(g,a),console.log(e.data)}).catch(e=>{console.log(e)})}n();function y(e="全部商品"){d=e==="全部商品"?i:i.filter(t=>t.category===e);const a=document.querySelector(".searchResult");a.textContent=d.length?`本次搜尋共${d.length}筆資料`:"查無此關鍵字資料";const l=document.querySelector(".productList");let c="";d.forEach(t=>{c+=`
        <li class="col-3 h-100 position-relative">
            <span class="bg-dark text-white fs-5 px-6 py-2 position-absolute" style="top: 12px;right: 8px;">新品</span>
            <img src="${t.images}" class="card-img-top" alt="產品圖片-${t.title}">
            <input type="button" value="加入購物車" class="bg-dark fs-5 text-white addCartItemBtn w-100 py-2" data-id="${t.id}" data-title="${t.title}">
            <div class="card-body">
            <h5 class="card-title fs-5 py-2">${t.title}</h5>
            <p class="card-text fs-5"><del>${t.origin_price}</del></p>
            <p class="card-text fs-3">${t.price}</p>
            <input type="hidden" class="quantityInput" value="1">
            </div>
        </li>`}),l.innerHTML=c,document.querySelector("#categorySearch").addEventListener("change",t=>{y(t.target.value)}),document.querySelectorAll(".addCartItemBtn").forEach(t=>{t.addEventListener("click",p=>{const f=p.target.dataset.id,m=p.target.dataset.title;$(f,m)})})}function x(e,a){const l=document.querySelector("#cartItem"),c=document.querySelector("#cartFinalTotal");let o="";e.forEach(t=>{o+=`
        <tr class="text-nowrap fs-5">
        <td class="d-flex align-items-center py-5">
          <div class="overflow-hidden" style="height: 80px;">
            <img src="${t.product.images}" class="me-4" alt="產品圖片-${t.product.title}" style="width: 80px">
          </div>
          <p>${t.product.title}</p>
        </td>
        <td class="py-5">${t.product.price}</td>
        <td class="py-5">${t.quantity}</td>
        <td class="py-5">${t.product.price*t.quantity}</td>
        <td class="py-5">
          <a href="#" class="removeBtn d-flex justify-content-center align-items-center text-decoration-none" data-id="${t.id}" data-title="${t.product.title}">
            <span class="material-symbols-outlined text-dark" style="font-size: 24px;">
              close
            </span>
          </a>
        </td>
      </tr>`}),l.innerHTML=o,c.textContent=`NT$ ${a.toLocaleString("en-US")}`,document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",q)})}function $(e,a){const l={data:{productId:e,quantity:1}};axios.get(s).then(c=>{const r=c.data.carts.find(t=>t.product.id===e);r?axios.patch(s,{data:{id:r.id,quantity:r.quantity+1}}).then(t=>{alert(`${r.product.title}，數量 +1！`),n(),console.log(t.data)}).catch(t=>{alert("請稍後再試"),console.log(t)}):axios.post(s,l).then(t=>{alert(`${a}，已成功加入購物車！`),n(),console.log(t.data.carts)}).catch(t=>{alert("請稍後再試"),console.log(t)}),console.log(c.data)}).catch(c=>{console.log(c)})}function q(e){e.preventDefault();const a=e.currentTarget.dataset.id,l=e.currentTarget.dataset.title,c=`${s}/${a}`;axios.delete(c).then(o=>{alert(`商品品項：${l}，已成功刪除。`),u(),n(),console.log(o.data)}).catch(o=>{alert("請稍後再試"),console.log(o)})}const I=document.querySelector(".removeAllBtn");I.addEventListener("click",L);function L(e){e.preventDefault(),axios.delete(s).then(a=>{alert("全部品項已成功刪除。"),u(),n(),console.log(a.data)}).catch(a=>{alert("請稍後再試"),console.log(a)})}
