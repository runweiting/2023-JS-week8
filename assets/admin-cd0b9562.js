import{a as s}from"./validate-b1489a64.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},g="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${g}/orders`;let l=[];function h(){s.get(u,i).then(e=>{l=e.data.orders,m(l),console.log(l)}).catch(e=>{console.log(e)})}h();function m(e){const r=document.querySelector("#orderItem");if(!r){console.error("找不到 #orderItem 元素");return}let a="";e.forEach(t=>{a+=`
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
        </tr>`}),r.innerHTML=a,document.querySelectorAll(".statusBtn").forEach(t=>{t.addEventListener("click",f)}),document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",A)}),document.querySelectorAll(".btn-warning").forEach(t=>{t.addEventListener("click",v)}),$(),B()}function f(e){e.preventDefault();const r=e.target.dataset.id;s.put(u,{data:{id:r,paid:!0}},i).then(a=>{console.log(a.data),alert(`訂單編號：${r} 已處理`),y(r,a.data.paid),h()}).catch(a=>{console.log(a)})}function y(e,r){const a=document.querySelector(`.statusBtn[data-id="${e}"]`);a.textContent=r?"已處理":"未處理"}function A(e){const r=`${u}/${e.target.dataset.id}`;s.delete(r,i).then(a=>{alert(`訂單編號：${e.target.dataset.id} 已刪除`),h(),console.log(a.data)}).catch(a=>{alert("請稍後再試"),console.log(a)})}function v(e){s.delete(u,i).then(r=>{console.log(r.data),alert("成功刪除全部訂單"),h()}).catch(r=>{console.log(r)})}function $(){let e={};l.forEach(d=>{d.products.forEach(o=>{e[o.category]==null?e[o.category]=1:e[o.category]++})});let r=Object.entries(e).map(([d,o])=>[d,o]).sort((d,o)=>o[1]-d[1]);const a=Math.max(...Object.values(e));let c=r.map(([d,o])=>o===a?"#5434A7":o>Math.floor(a/2)?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartAll",data:{columns:r,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:c},size:{height:350}})}function B(){let e={};l.forEach(o=>{o.products.forEach(t=>{const{title:n,quantity:p}=t;e[n]===void 0?e[n]=p:e[n]+=p})});let r=Object.entries(e).map(([o,t])=>[o,t]).sort((o,t)=>t[1]-o[1]),a=r.slice(0,3),c=r.slice(3).reduce((o,[,t])=>o+t,0);c>0&&a.push(["其他",c]);let d=a.map(([o,t],n)=>n===0?"#301E5F":n===1?"#5434A7":n===2?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartItem",data:{columns:a,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:d},size:{height:350}})}
