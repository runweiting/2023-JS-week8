import{a as s}from"./validate-b1489a64.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},p="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${p}/orders`;let d=[];function h(){s.get(u,i).then(e=>{d=e.data.orders,m(d)}).catch(e=>{console.log(e)})}h();function m(e){const o=document.querySelector("#orderItem");if(!o){console.error("找不到 #orderItem 元素");return}let r="";e.forEach(t=>{r+=`
        <tr>
        <td>${t.id}</td>
        <td>
            <p>${t.user.name}</p>
            <p>${t.user.tel}</p>
        </td>
        <td>${t.user.address}</td>
        <td>${t.user.email}</td>
        <td>
            <p>${t.products.map(n=>n.title).join("<br>")}</p>
        </td>
        <td>
            <p>${t.products.map(n=>n.quantity).join("<br>")}</p>
        </td>
        <td>${t.quantity}</td>
        <td>${new Date(t.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${t.id}">${t.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${t.id}" value="刪除">
        </td>
        </tr>`}),o.innerHTML=r,document.querySelectorAll(".statusBtn").forEach(t=>{t.addEventListener("click",f)}),document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",A)}),document.querySelectorAll(".btn-warning").forEach(t=>{t.addEventListener("click",v)}),$(),B()}function f(e){e.preventDefault();const o=e.target.dataset.id;s.put(u,{data:{id:o,paid:!0}},i).then(r=>{console.log(r.data),alert(`訂單編號：${o} 已處理`),y(o,r.data.paid),h()}).catch(r=>{console.log(r)})}function y(e,o){const r=document.querySelector(`.statusBtn[data-id="${e}"]`);r.textContent=o?"已處理":"未處理"}function A(e){const o=`${u}/${e.target.dataset.id}`;s.delete(o,i).then(r=>{alert(`訂單編號：${e.target.dataset.id} 已刪除`),h(),console.log(r.data)}).catch(r=>{alert("請稍後再試"),console.log(r)})}function v(e){s.delete(u,i).then(o=>{console.log(o.data),alert("成功刪除全部訂單"),h()}).catch(o=>{console.log(o)})}function $(){let e={};d.forEach(l=>{l.products.forEach(a=>{e[a.category]==null?e[a.category]=1:e[a.category]++})});let o=Object.entries(e).map(([l,a])=>[l,a]).sort((l,a)=>a[1]-l[1]);console.log(o);const r=Math.max(...Object.values(e));let c=o.map(([l,a])=>a===r?"#5434A7":a>Math.floor(r/2)?"#9D7FEA":"#DACBFF");console.log(c),c3.generate({bindto:".chartAll",data:{columns:o,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:c},size:{height:350}})}function B(){let e={};d.forEach(a=>{a.products.forEach(t=>{const{title:n,quantity:g}=t;console.log(t),console.log(t.quantity),e[n]===void 0?e[n]=g:e[n]+=g})}),console.log(e);let o=Object.entries(e).map(([a,t])=>[a,t]).sort((a,t)=>t[1]-a[1]);console.log(o);let r=o.slice(0,3),c=o.slice(3).reduce((a,[,t])=>a+t,0);c>0&&r.push(["其他",c]),console.log(r);let l=r.map(([a,t],n)=>n===0?"#301E5F":n===1?"#5434A7":n===2?"#9D7FEA":"#DACBFF");console.log(l),c3.generate({bindto:".chartItem",data:{columns:r,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:l},size:{height:350}})}
