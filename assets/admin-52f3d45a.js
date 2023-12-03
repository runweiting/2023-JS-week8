import{a}from"./validate-5e4093e9.js";const d={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},l="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",n=`${l}/orders`;let c=[];function s(){a.get(n,d).then(e=>{c=e.data.orders,i(c)}).catch(e=>{console.log(e)})}function i(e){const r=document.querySelector("#orderItem");if(!r){console.error("找不到 #orderItem 元素");return}let o="";e.forEach(t=>{o+=`
        <tr class="text-nowrap">
        <td>${t.id}</td>
        <td>
            <p>${t.user.name}</p>
            <p>${t.user.tel}</p>
        </td>
        <td>${t.user.address}</td>
        <td>${t.user.email}</td>
        <td>
            <p>${t.products[0].title}</p>
        </td>
        <td>${new Date(t.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${t.id}">${t.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${t.id}" value="刪除">
        </td>
        </tr>`}),r.innerHTML=o,document.querySelectorAll(".statusBtn").forEach(t=>{t.addEventListener("click",u)}),document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",g)}),document.querySelectorAll(".btn-warning").forEach(t=>{t.addEventListener("click",p)})}function u(e){e.preventDefault();const r=e.target.dataset.id;a.put(n,{data:{id:r,paid:!0}},d).then(o=>{console.log(o.data),alert(`訂單編號：${r} 已處理`),h(r,o.data.paid),s()}).catch(o=>{console.log(o)})}function h(e,r){const o=document.querySelector(`.statusBtn[data-id="${e}"]`);o.textContent=r?"已處理":"未處理"}function g(e){const r=`${n}/${e.target.dataset.id}`;a.delete(r,d).then(o=>{alert(`訂單編號：${e.target.dataset.id} 已刪除`),s(),console.log(o.data)}).catch(o=>{alert("請稍後再試"),console.log(o)})}function p(e){a.delete(n,d).then(r=>{console.log(r.data),alert("成功刪除全部訂單"),s()}).catch(r=>{console.log(r)})}s();
