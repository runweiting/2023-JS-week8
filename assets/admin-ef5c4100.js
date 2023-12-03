import"./bootstrap.min-0cc95113.js";const a={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},c="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",d=`${c}/orders`;let s=[];function n(){axios.get(d,a).then(e=>{s=e.data.orders,l(s)}).catch(e=>{console.log(e)})}function l(e){const r=document.querySelector("#orderItem");if(!r){console.error("找不到 #orderItem 元素");return}let o="";e.forEach(t=>{o+=`
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
        </tr>`}),r.innerHTML=o,document.querySelectorAll(".statusBtn").forEach(t=>{t.addEventListener("click",i)}),document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",h)}),document.querySelectorAll(".btn-warning").forEach(t=>{t.addEventListener("click",g)})}function i(e){e.preventDefault();const r=e.target.dataset.id;axios.put(d,{data:{id:r,paid:!0}},a).then(o=>{console.log(o.data),alert(`訂單編號：${r} 已處理`),u(r,o.data.paid),n()}).catch(o=>{console.log(o)})}function u(e,r){const o=document.querySelector(`.statusBtn[data-id="${e}"]`);o.textContent=r?"已處理":"未處理"}function h(e){const r=`${d}/${e.target.dataset.id}`;axios.delete(r,a).then(o=>{alert(`訂單編號：${e.target.dataset.id} 已刪除`),n(),console.log(o.data)}).catch(o=>{alert("請稍後再試"),console.log(o)})}function g(e){axios.delete(d,a).then(r=>{console.log(r.data),alert("成功刪除全部訂單"),n()}).catch(r=>{console.log(r)})}n();
